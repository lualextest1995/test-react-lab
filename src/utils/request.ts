import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { getCookie, removeCookie, setCookie } from "@/utils/cookies";
import { getJwtValue } from "@/utils/jwt";
import { parseUnix } from "@/utils/day";
import Alert from "@/utils/alert";

const TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
} as const;

const BASE_URL = "/api";
const TIMEOUT = 24 * 60 * 60 * 1000;

// ============================================================================
// Token Manager
// ============================================================================
class TokenManager {
  getAccessToken(): string | null {
    return getCookie(TOKEN_KEYS.ACCESS) ?? null;
  }

  getRefreshToken(): string | null {
    return getCookie(TOKEN_KEYS.REFRESH) ?? null;
  }

  isLoggedIn(): boolean {
    const accessToken = this.getAccessToken();
    const ip = getJwtValue<string>(accessToken ?? "", "ip");
    return Boolean(ip);
  }

  setAccessToken(token: string): void {
    setCookie(TOKEN_KEYS.ACCESS, token);
  }

  setRefreshToken(token: string): void {
    const expires = getJwtValue<number>(token, "exp") || 0;
    const expireDate = parseUnix(expires);
    setCookie(TOKEN_KEYS.REFRESH, token, { expires: expireDate });
  }

  clearTokens(): void {
    removeCookie(TOKEN_KEYS.ACCESS);
    removeCookie(TOKEN_KEYS.REFRESH);
  }

  updateTokens(accessToken: string, refreshToken?: string): void {
    this.setAccessToken(accessToken);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  }
}

const tokenManager = new TokenManager();

// ============================================================================
// Request Queue
// ============================================================================
interface QueueTask {
  config: AxiosRequestConfig;
  resolve: (value: AxiosResponse) => void;
  reject: (reason?: Error) => void;
}

class RequestQueue {
  private queue: QueueTask[] = [];

  enqueue(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
      this.queue.push({ config, resolve, reject });
    });
  }

  async resolveAll(instance: AxiosInstance): Promise<void> {
    const tasks = [...this.queue];
    this.clear();

    for (const task of tasks) {
      try {
        const retryConfig = { ...task.config, _isRetry: true };
        const res = await instance(retryConfig);
        task.resolve(res);
      } catch (err) {
        task.reject(err as Error);
      }
    }
  }

  rejectAll(error: Error): void {
    this.queue.forEach((task) => task.reject(error));
    this.clear();
  }

  clear(): void {
    this.queue = [];
  }

  // Debug 工具
  getQueueSize(): number {
    return this.queue.length;
  }

  getQueueInfo(): Array<{ url?: string; method?: string }> {
    return this.queue.map((task) => ({
      url: task.config.url,
      method: task.config.method?.toUpperCase(),
    }));
  }
}

const requestQueue = new RequestQueue();

// ============================================================================
// Token Refresher
// ============================================================================
class TokenRefresher {
  private isRefreshing = false;
  private axiosInstance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.axiosInstance = instance;
  }

  async refresh(): Promise<void> {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;

    try {
      const response = await this.requestRefreshToken();
      const { access_token, refresh_token } = response.data.data;

      tokenManager.updateTokens(access_token, refresh_token);
      await requestQueue.resolveAll(this.axiosInstance);
    } catch (err) {
      await this.handleRefreshError(err as AxiosError);
      requestQueue.rejectAll(err as Error);
      throw err;
    } finally {
      this.isRefreshing = false;
    }
  }

  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  private async requestRefreshToken() {
    const access_token = tokenManager.getAccessToken() || "";
    const refresh_token = tokenManager.getRefreshToken() || "";
    const isLoggedIn = tokenManager.isLoggedIn();

    const url = isLoggedIn
      ? "/authorization/refreshUserToken"
      : "/authorization/initializeToken";

    return axios.request({
      baseURL: BASE_URL,
      url,
      method: "get",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        authorization: `Bearer ${access_token}`,
        "x-refresh-token": `Bearer ${refresh_token}`,
      },
    });
  }

  private async handleRefreshError(error: AxiosError): Promise<void> {
    const traceId = error.response?.headers?.["x-encore-trace-id"] || "N/A";
    tokenManager.clearTokens();
    Alert.error(`登入已失效，請重新登入 (${traceId})`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }
}

// ============================================================================
// Axios Instance
// ============================================================================
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

const tokenRefresher = new TokenRefresher(axiosInstance);

// ============================================================================
// Request Interceptor
// ============================================================================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const isRetry = config._isRetry;

    if (tokenRefresher.isCurrentlyRefreshing() && !isRetry) {
      return Promise.reject({
        config,
        isRefreshingToken: true,
        message: "正在刷新 token",
      });
    }

    const access_token = tokenManager.getAccessToken();
    if (access_token) {
      config.headers.authorization = `Bearer ${access_token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ============================================================================
// Response Interceptor
// ============================================================================
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const config = error.config;
    if (!config) {
      return Promise.reject(error);
    }

    if (error.isRefreshingToken) {
      return requestQueue.enqueue(config);
    }

    if (error.response?.status === 401) {
      // 如果是重試的請求再次收到 401，直接拋出錯誤，不再重試
      if (config._isRetry) {
        return Promise.reject(error);
      }

      if (!tokenManager.isLoggedIn()) {
        tokenManager.clearTokens();
        requestQueue.rejectAll(new Error("請先登入以獲取完整權限"));
        Alert.error("請先登入以獲取完整權限");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }

      const queuePromise = requestQueue.enqueue(config);

      if (!tokenRefresher.isCurrentlyRefreshing()) {
        try {
          await tokenRefresher.refresh();
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return queuePromise;
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// 導出
// ============================================================================
const request = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.request(config);
};

const refreshToken = async (): Promise<void> => {
  return tokenRefresher.refresh();
};

export default request;
export { tokenManager, refreshToken, requestQueue, tokenRefresher };
