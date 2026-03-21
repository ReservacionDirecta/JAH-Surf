// @ts-nocheck
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Busboy from "busboy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface StoredUser extends AuthUser {
  password: string; // hashed
  createdAt: string;
}

// Ensure environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@jahsurfperu.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';
const JWT_EXPIRY = '7d';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3001);

  // Allow larger payloads for admin content updates (e.g., base64 image fallbacks).
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Ensure /store exists (for local dev, Railway should have it mounted)
  const STORE_PATH = process.env.STORE_PATH || "/store";
  if (!fs.existsSync(STORE_PATH)) {
    try {
      fs.mkdirSync(STORE_PATH, { recursive: true });
      console.log(`Created directory: ${STORE_PATH}`);
    } catch (err) {
      console.error(`Could not create ${STORE_PATH}, using local fallback: ${err}`);
    }
  }

  // Utility: Hash password
  function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex');
  }

  // Utility: Get users file path
  function getUsersPath(): string {
    return path.join(STORE_PATH, 'users.json');
  }

  // Utility: Load users
  function loadUsers(): StoredUser[] {
    const usersPath = getUsersPath();
    if (!fs.existsSync(usersPath)) {
      return [];
    }
    try {
      const data = fs.readFileSync(usersPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error loading users:', err);
      return [];
    }
  }

  // Utility: Save users
  function saveUsers(users: StoredUser[]): void {
    const usersPath = getUsersPath();
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  }

  // Bootstrap default admin user
  function ensureDefaultAdminUser(): void {
    const users = loadUsers();
    const adminExists = users.some(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());

    if (!adminExists) {
      users.push({
        id: crypto.randomUUID(),
        email: ADMIN_EMAIL,
        password: hashPassword(ADMIN_PASSWORD),
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      saveUsers(users);
      console.log(`[AUTH] Admin local creado: ${ADMIN_EMAIL}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[AUTH] Password admin local: ${ADMIN_PASSWORD}`);
      }
    }
  }

  ensureDefaultAdminUser();

  // Middleware: Verify JWT
  function verifyJWT(token: string): AuthUser | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      return decoded;
    } catch {
      return null;
    }
  }

  // Middleware: Authenticate
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = verifyJWT(token);
      if (user) {
        (req as any).user = user;
      }
    }
    next();
  });

  // Auth Routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const users = loadUsers();
    const user = users.find(u => u.email === email);

    if (!user || user.password !== hashPassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const users = loadUsers();
    if (users.some(u => u.email === email)) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      password: hashPassword(password),
      role: email === ADMIN_EMAIL ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  });

  app.get('/api/auth/verify', (req, res) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.json({ user });
  });

  app.post('/api/auth/logout', (req, res) => {
    // Logout is client-side (token removal)
    res.json({ success: true });
  });

  // API Route to store data (protected)
  app.post("/api/store", (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { key, data, append = false } = req.body;
    if (!key || data === undefined) {
      return res.status(400).json({ error: "Key and data are required" });
    }

    const filePath = path.join(STORE_PATH, `${key}.json`);
    try {
      if (append) {
        let existingData: any = [];
        if (fs.existsSync(filePath)) {
          const raw = fs.readFileSync(filePath, "utf-8");
          existingData = raw ? JSON.parse(raw) : [];
        }

        if (!Array.isArray(existingData)) {
          return res.status(400).json({ error: "Existing data is not appendable" });
        }

        existingData.push(data);
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
        return res.json({ success: true, message: `Appended data to ${key}.json`, data: existingData });
      }

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return res.json({ success: true, message: `Data stored at ${key}.json` });
    } catch (err) {
      console.error(`Error writing to ${filePath}:`, err);
      return res.status(500).json({ error: "Failed to store data locally" });
    }
  });

  // API Route to retrieve data
  app.get("/api/store/:key", (req, res) => {
    const { key } = req.params;
    const filePath = path.join(STORE_PATH, `${key}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Data not found" });
    }

    try {
      const data = fs.readFileSync(filePath, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      console.error(`Error reading from ${filePath}:`, err);
      res.status(500).json({ error: "Failed to retrieve data" });
    }
  });

  // API Route to list all stored keys
  app.get("/api/store", (req, res) => {
    try {
      if (!fs.existsSync(STORE_PATH)) {
        return res.json([]);
      }
      const files = fs.readdirSync(STORE_PATH);
      const keys = files.filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""));
      res.json(keys);
    } catch (err) {
      console.error(`Error listing files in ${STORE_PATH}:`, err);
      res.status(500).json({ error: "Failed to list stored data" });
    }
  });

  // Ensure /store/images directory exists
  const IMAGES_PATH = path.join(STORE_PATH, 'images');
  if (!fs.existsSync(IMAGES_PATH)) {
    try {
      fs.mkdirSync(IMAGES_PATH, { recursive: true });
      console.log(`Created directory: ${IMAGES_PATH}`);
    } catch (err) {
      console.error(`Could not create ${IMAGES_PATH}:`, err);
    }
  }

  // API Route to upload images (protected)
  app.post("/api/upload", (req, res) => {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden" });
    }

    let bb;
    try {
      bb = Busboy({ headers: req.headers, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
    } catch (err) {
      console.error('Busboy init error:', err);
      return res.status(400).json({ error: "Invalid multipart request" });
    }

    let uploadedFile: { fieldname: string; data: Buffer; mimetype: string; filename: string } | null = null;
    let uploadRejected = false;
    let responseSent = false;

    const sendOnce = (status: number, payload: any) => {
      if (responseSent) return;
      responseSent = true;
      res.status(status).json(payload);
    };

    bb.on('file', (fieldname, file, info) => {
      const chunks: Buffer[] = [];

      // Validate MIME type
      if (!info.mimetype.startsWith('image/')) {
        uploadRejected = true;
        file.resume();
        return;
      }

      file.on('data', data => chunks.push(data as Buffer));
      file.on('limit', () => {
        uploadRejected = true;
      });
      file.on('end', () => {
        if (uploadRejected) return;
        uploadedFile = {
          fieldname,
          data: Buffer.concat(chunks),
          mimetype: info.mimetype,
          filename: info.filename
        };
      });

      file.on('error', (err) => {
        console.error('File stream error:', err);
      });
    });

    bb.on('close', async () => {
      if (uploadRejected) {
        return sendOnce(400, { error: "Invalid image or file too large (max 5MB)" });
      }

      if (!uploadedFile) {
        return sendOnce(400, { error: "No image file provided" });
      }

      try {
        // Generate unique filename
        const ext = path.extname(uploadedFile.filename) || '.jpg';
        const finalFileName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext.toLowerCase()}`;
        const filePath = path.join(IMAGES_PATH, finalFileName);

        fs.writeFileSync(filePath, uploadedFile.data);
        const imageUrl = `/api/images/${finalFileName}`;

        console.log(`[UPLOAD] Image saved: ${imageUrl}`);
        sendOnce(200, { success: true, url: imageUrl });
      } catch (err) {
        console.error('Image save error:', err);
        sendOnce(500, { error: "Failed to store image" });
      }
    });

    bb.on('error', (err) => {
      console.error('Busboy error:', err);
      sendOnce(400, { error: "Upload error" });
    });

    req.pipe(bb);
  });

  // Serve uploaded images
  app.use('/api/images', express.static(IMAGES_PATH, {
    maxAge: '7d',
    etag: false,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
    }
  }));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          port: Number(process.env.HMR_PORT || 24679),
        },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
