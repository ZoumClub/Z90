import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  user: {
    id: string;
    role: string;
  };
}

export const AUTH_TOKEN_KEY = 'auth_token';

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function removeAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isTokenValid(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function hasAdminAccess(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token) as DecodedToken;
    return decoded.user.role === 'admin';
  } catch {
    return false;
  }
}