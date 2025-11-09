import { jwtDecode } from "jwt-decode";

/**
 * JWT Payload 基礎型別
 */
export interface JwtPayload {
  account?: string; // 帳號
  exp?: number; // 過期時間（Unix timestamp，秒）
  iat?: number; // 發行時間（Unix timestamp，秒）
  id?: string; // 使用者 ID
  identity?: string; // 身份
  ip?: string; // IP 位址
  user_id?: string; // 使用者 ID
}

/**
 * 解析 JWT Token
 * @param token - JWT Token 字串
 * @returns 解析後的 payload
 * @throws 如果 token 無效會拋出錯誤
 */
export function parseJwt<T = JwtPayload>(token: string): T {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid JWT token: token must be a non-empty string");
  }

  try {
    return jwtDecode<T>(token);
  } catch (error) {
    throw new Error(
      `Invalid JWT token: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * 檢查 JWT Token 是否已過期
 * @param token - JWT Token 字串
 * @param bufferSeconds - 提前多少秒判定為過期（預設 0 秒，不可為負數）
 * @returns true 表示已過期，false 表示未過期
 */
export function isJwtExpired(
  token: string,
  bufferSeconds: number = 0
): boolean {
  if (bufferSeconds < 0) {
    throw new Error("bufferSeconds must be a non-negative number");
  }

  try {
    const decoded = parseJwt<JwtPayload>(token);

    // 如果沒有 exp 欄位，視為永不過期
    if (!decoded.exp) {
      return false;
    }

    // JWT 的 exp 是以秒為單位的 Unix timestamp
    // JavaScript 的 Date.now() 是以毫秒為單位
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp < currentTime + bufferSeconds;
  } catch {
    // 如果無法解析，視為已過期
    return true;
  }
}

/**
 * 從 JWT Token 中取得指定欄位的值
 * @param token - JWT Token 字串
 * @param key - 欄位名稱
 * @returns 欄位值，如果不存在則返回 undefined
 */
export function getJwtValue<T = unknown>(
  token: string,
  key: string
): T | undefined {
  try {
    const decoded = parseJwt<Record<string, unknown>>(token);
    return decoded[key] as T | undefined;
  } catch {
    return undefined;
  }
}

/**
 * 取得 JWT Token 的剩餘有效時間（秒）
 * @param token - JWT Token 字串
 * @returns 剩餘秒數，如果已過期則返回 0，如果沒有過期時間則返回 Infinity
 */
export function getJwtRemainingTime(token: string): number {
  try {
    const decoded = parseJwt<JwtPayload>(token);

    if (!decoded.exp) {
      return Infinity;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = decoded.exp - currentTime;

    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}

/**
 * 檢查 JWT Token 是否有效（格式正確且未過期）
 * @param token - JWT Token 字串
 * @param bufferSeconds - 提前多少秒判定為過期（預設 0 秒，不可為負數）
 * @returns true 表示有效，false 表示無效
 */
export function isJwtValid(token: string, bufferSeconds: number = 0): boolean {
  if (!token) {
    return false;
  }

  if (bufferSeconds < 0) {
    throw new Error("bufferSeconds must be a non-negative number");
  }

  try {
    const decoded = parseJwt<JwtPayload>(token);

    // 如果沒有 exp，視為有效
    if (!decoded.exp) {
      return true;
    }

    // 檢查是否過期
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp >= currentTime + bufferSeconds;
  } catch {
    return false;
  }
}

/**
 * 取得 JWT Token 的完整資訊
 * @param token - JWT Token 字串
 * @returns Token 的詳細資訊，如果無效則返回 null
 */
export function getJwtInfo(token: string): {
  payload: JwtPayload;
  isExpired: boolean;
  remainingTime: number;
  isValid: boolean;
} | null {
  try {
    const payload = parseJwt<JwtPayload>(token);

    // 只解析一次，手動計算其他值
    const hasExpiry = !!payload.exp;
    let isExpired = false;
    let remainingTime = Infinity;

    if (hasExpiry) {
      const currentTime = Math.floor(Date.now() / 1000);
      remainingTime = payload.exp! - currentTime;
      isExpired = remainingTime <= 0;

      if (remainingTime < 0) {
        remainingTime = 0;
      }
    }

    return {
      payload,
      isExpired,
      remainingTime,
      isValid: !isExpired,
    };
  } catch {
    return null;
  }
}
