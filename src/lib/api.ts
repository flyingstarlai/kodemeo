import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

let _authApi: AxiosInstance | null = null;
let _studentApi: AxiosInstance | null = null;

export function getBaseApiClient(): AxiosInstance {
  return axios.create({
    baseURL: `${API_URL}`,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Base client for authentication endpoints (/auth)
 */
export function getAuthApiClient(): AxiosInstance {
  if (!_authApi) {
    _authApi = axios.create({
      baseURL: `${API_URL}/auth`,
      headers: { "Content-Type": "application/json" },
    });
  }
  return _authApi;
}

/**
 * API client for dashboard endpoints (/api/dashboard)
 */
export function getStudentApiClient(): AxiosInstance {
  if (!_studentApi) {
    _studentApi = axios.create({
      baseURL: `${API_URL}/api/student`,
      headers: { "Content-Type": "application/json" },
    });
  }
  return _studentApi;
}
export function withAuthConfig(
  config?: AxiosRequestConfig,
): AxiosRequestConfig {
  const token = localStorage.getItem("token");
  return {
    ...config,
    headers: {
      ...config?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}
