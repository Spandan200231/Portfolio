const TOKEN_KEY = "portfolio_admin_token";

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // Check if token is expired (basic JWT check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch (error) {
    // If token is malformed, remove it
    removeAuthToken();
    return false;
  }
}

export async function verifyAuth(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch("/api/auth/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      removeAuthToken();
      return false;
    }

    return true;
  } catch (error) {
    removeAuthToken();
    return false;
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Utility to make authenticated API requests
export async function authenticatedRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, remove token and redirect to login
  if (response.status === 401) {
    removeAuthToken();
    if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin") {
      window.location.href = "/admin";
    }
  }

  return response;
}
