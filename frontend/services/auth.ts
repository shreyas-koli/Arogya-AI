/**
 * Arogya AI — Authentication and Session Service
 *
 * Module 7: Security, Identity & File Handling.
 * Handles client-side JWT token storage, login/logout operations,
 * session retrieval, and automated Authorization header injection.
 */

export interface UserSummary {
  id: string;
  email: string;
  full_name: string | null;
  role: "administrator" | "doctor_reviewer" | "researcher" | "clinician" | string;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserSummary;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export class AuthApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, status: number = 0, code: string = "AUTH_ERROR", details?: unknown) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const TOKEN_STORAGE_KEY = "arogya_ai_token";
const USER_STORAGE_KEY = "arogya_ai_user";

let inMemoryToken: string | null = null;
let inMemoryUser: UserSummary | null = null;

export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return "http://127.0.0.1:8000/api/v1";
}

export function getStoredToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      return window.localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  }
  return null;
}

export function setStoredToken(token: string): void {
  inMemoryToken = token;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // Ignore localStorage write failures (e.g. private browsing quota)
    }
  }
}

export function clearStoredToken(): void {
  inMemoryToken = null;
  inMemoryUser = null;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}

export function getStoredUser(): UserSummary | null {
  if (inMemoryUser) return inMemoryUser;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = window.localStorage.getItem(USER_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

export function setStoredUser(user: UserSummary): void {
  inMemoryUser = user;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // Ignore
    }
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = getStoredToken();
  if (token && token.trim().length > 0) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * Authenticate with the FastAPI backend using username/password.
 */
export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const base = getApiBaseUrl();
  const url = `${base}/auth/login`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Network error";
    throw new AuthApiError(`Failed to reach authentication service: ${msg}`, 0, "NETWORK_ERROR");
  }

  if (!response.ok) {
    let errorCode = `HTTP_${response.status}`;
    let errorMessage = "Authentication failed";
    try {
      const data = await response.json();
      if (data?.error?.message) {
        errorMessage = data.error.message;
        errorCode = data.error.code || errorCode;
      } else if (data?.detail) {
        errorMessage = data.detail;
      }
    } catch {
      // Non-json response
    }
    throw new AuthApiError(errorMessage, response.status, errorCode);
  }

  const tokenData = (await response.json()) as TokenResponse;
  setStoredToken(tokenData.access_token);
  setStoredUser(tokenData.user);
  return tokenData;
}

/**
 * Terminate active session and invalidate client credentials.
 */
export async function logout(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    const base = getApiBaseUrl();
    const url = `${base}/auth/logout`;
    try {
      await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...getAuthHeader(),
        },
      });
    } catch {
      // Proceed with client-side cleanup regardless
    }
  }
  clearStoredToken();
}

/**
 * Fetch currently authenticated user from backend.
 */
export async function getCurrentUser(): Promise<UserSummary | null> {
  const token = getStoredToken();
  if (!token) return null;

  const base = getApiBaseUrl();
  const url = `${base}/auth/me`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearStoredToken();
      }
      return null;
    }

    const user = (await response.json()) as UserSummary;
    setStoredUser(user);
    return user;
  } catch {
    return getStoredUser();
  }
}
