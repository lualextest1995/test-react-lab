import Cookies from "js-cookie";

/**
 * Cookie 操作選項
 */
export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export const setCookie = (
  key: string,
  value: string,
  options: CookieOptions = {}
): void => {
  Cookies.set(key, value, options);
};

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(key);
};

export const removeCookie = (
  key: string,
  options: CookieOptions = {}
): void => {
  Cookies.remove(key, options);
};

export const getAllCookies = (): Record<string, string> => {
  return Cookies.get() || {};
};

export const clearAllCookies = (): void => {
  const cookies = getAllCookies();
  Object.keys(cookies).forEach((key) => removeCookie(key));
};

/**
 * 設置 JSON 類型的 cookie
 *
 * @throws {Error} 如果物件無法序列化 (例如: 循環引用)
 *
 * @example
 * setJsonCookie('user', { id: 1, name: 'John' })
 * setJsonCookie('settings', config, { expires: 7 })
 */
export const setJsonCookie = <T>(
  key: string,
  value: T,
  options: CookieOptions = {}
): void => {
  setCookie(key, JSON.stringify(value), options);
};

/**
 * 獲取 JSON 類型的 cookie
 *
 * @returns 解析後的物件,如果 cookie 不存在或解析失敗則返回 null
 *
 * @example
 * const user = getJsonCookie<User>('user')
 * if (user) {
 *   console.log(user.name)
 * }
 */
export const getJsonCookie = <T>(key: string): T | null => {
  const raw = getCookie(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

/**
 * 設置安全 cookie
 *
 * 預設啟用:
 * - secure: true (僅 HTTPS)
 * - sameSite: 'strict' (防止 CSRF)
 * - path: '/' (全站可用)
 *
 * @example
 * setSecureCookie('token', 'abc123', { expires: 1 })
 */
export const setSecureCookie = (
  key: string,
  value: string,
  options: CookieOptions = {}
): void => {
  setCookie(key, value, {
    secure: true,
    sameSite: "strict",
    path: "/",
    ...options,
  });
};
