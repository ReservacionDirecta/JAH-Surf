// Firebase compatibility shim removed for local-only mode.

export const db = null;
export const auth = null;
export const googleProvider = null;

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error("Firestore was removed for local mode:", error, operationType, path);
  throw new Error("Firestore is not available in local-only mode");
}

export function testConnection() {
  console.warn('No remote database connection in local-only mode.');
}
