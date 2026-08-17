const TOKEN_KEY = 'stephen_auth_token';
const EMAIL_KEY = 'stephen_auth_email';

export interface AuthSessionData {
  email: string;
  token: string;
  expiresAt: string;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

export function setSession(data: AuthSessionData): void {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(EMAIL_KEY, data.email);
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

class ApiError extends Error {
  status?: number;
  detail?: string;
}

function isNetworkError(err: any): boolean {
  if (!err) return false;
  if (err instanceof TypeError) return true;
  const msg = String(err?.message || err || '').toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('network error') ||
    msg.includes('cannot connect') ||
    msg.includes('load failed')
  );
}

export function getAuthErrorMessage(err: any): string {
  if (isNetworkError(err)) return 'Network Error: Cannot connect to backend server';
  if (err?.status === 401) return 'Invalid email or password.';
  if (err?.status === 409) return 'An account with this email already exists.';
  if (typeof err?.detail === 'string' && err.detail) return err.detail;
  return 'An authentication error occurred. Please try again.';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  } catch (err) {
    const e = new ApiError((err as Error)?.message || 'Network Error');
    e.name = 'NetworkError';
    throw e;
  }

  if (!res.ok) {
    let detail: string | undefined;
    try {
      const body = await res.json();
      detail = body?.detail;
    } catch {
      // Non-JSON error body; ignore.
    }
    const e = new ApiError(detail || `Request failed with status ${res.status}`);
    e.status = res.status;
    e.detail = detail;
    throw e;
  }

  return res.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<AuthSessionData> {
  const data = await request<AuthSessionData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setSession(data);
  return data;
}

export async function signup(email: string, password: string): Promise<AuthSessionData> {
  const data = await request<AuthSessionData>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setSession(data);
  return data;
}

export async function logout(): Promise<void> {
  const token = getStoredToken();
  try {
    if (token) {
      await request('/api/auth/logout?token=' + encodeURIComponent(token), { method: 'POST' });
    }
  } finally {
    clearSession();
  }
}

export async function getSession(): Promise<string | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const data = await request<{ email: string }>('/api/auth/session?token=' + encodeURIComponent(token));
    return data.email;
  } catch (err) {
    if (err?.status === 401) {
      clearSession();
      return null;
    }
    throw err;
  }
}