/**
 * 將字符串編碼為 Base64
 * @param str 要編碼的字符串
 * @returns Base64 編碼的字符串
 * @throws Error 當編碼失敗時
 */
export function toBase64(str: string): string {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const binaryString = Array.from(data, (byte) =>
      String.fromCharCode(byte)
    ).join("");
    return btoa(binaryString);
  } catch (error) {
    throw new Error(
      `Base64 編碼失敗: ${error instanceof Error ? error.message : "未知錯誤"}`
    );
  }
}

/**
 * 將 Base64 字符串解碼為普通字符串
 * @param base64 Base64 編碼的字符串
 * @returns 解碼後的字符串
 * @throws Error 當解碼失敗時
 */
export function fromBase64(base64: string): string {
  try {
    const binaryString = atob(base64);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch (error) {
    throw new Error(
      `Base64 解碼失敗: ${error instanceof Error ? error.message : "未知錯誤"}`
    );
  }
}
