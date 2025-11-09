import dayjs, { Dayjs } from "dayjs";

/**
 * 解析任意日期為 Dayjs 物件
 * 用於內部計算和鏈式操作
 */
export function parse(date: string | number | Date): Dayjs {
  return dayjs(date);
}

/**
 * 解析 Unix timestamp (秒) 為 Date 物件
 * 主要用於 JWT exp → cookie expires 等原生 API
 */
export function parseUnix(timestamp: number): Date {
  return dayjs.unix(timestamp).toDate();
}

/**
 * 獲取當前時間
 */
export function now(): Dayjs {
  return dayjs();
}

/**
 * 將任意日期轉換為原生 Date 物件
 */
export function toDate(date: string | number | Date | Dayjs): Date {
  return dayjs(date).toDate();
}

/**
 * 格式化日期
 * @param date 日期
 * @param fmt 格式，預設 'YYYY-MM-DD HH:mm:ss'
 */
export function format(
  date: string | number | Date | Dayjs,
  fmt = "YYYY-MM-DD HH:mm:ss"
): string {
  return date ? dayjs(date).format(fmt) : "";
}

/**
 * 格式化為中文日期
 */
export function formatZh(date: string | number | Date | Dayjs): string {
  return dayjs(date).format("YYYY年MM月DD日 HH:mm");
}

/**
 * 日期加減
 */
export function add(
  date: string | number | Date | Dayjs,
  value: number,
  unit: dayjs.ManipulateType
): Dayjs {
  return dayjs(date).add(value, unit);
}

/**
 * 計算兩個日期的差值
 * @param unit 單位，預設 'day'
 */
export function diff(
  start: string | number | Date | Dayjs,
  end: string | number | Date | Dayjs,
  unit: dayjs.UnitType = "day"
): number {
  return dayjs(end).diff(dayjs(start), unit);
}

/**
 * 判斷日期是否早於另一個日期
 */
export function isBefore(
  date: string | number | Date | Dayjs,
  other: string | number | Date | Dayjs
): boolean {
  return dayjs(date).isBefore(other);
}

/**
 * 判斷 JWT 是否過期
 * @param exp JWT exp 欄位（秒級 timestamp）
 */
export function isExpired(exp: number): boolean {
  return exp <= dayjs().unix();
}
