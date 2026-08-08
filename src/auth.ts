// Local authentication system (replacement for Firebase)
// Uses JWT tokens stored in localStorage

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}



const API_BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export async function register(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): AuthUser | null {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}



export async function verifyToken(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const data = await response.json();
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error('Token verification failed:', error);
    logout();
    return null;
  }
}

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const isAbsoluteUrl = /^https?:\/\//i.test(url);
  const requestUrl = isAbsoluteUrl ? url : `${API_BASE}${url}`;
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  return fetch(requestUrl, { ...options, headers });
}
