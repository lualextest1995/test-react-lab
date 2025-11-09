/**
 * localStorage/sessionStorage 工具
 *
 * 使用:
 *   storage.local('user', { name: 'John' })  // 存到 localStorage
 *   storage.local<User>('user')              // 從 localStorage 讀取
 *   storage.local('user', null)              // 從 localStorage 刪除
 *   storage.session('token', 'abc')          // 存到 sessionStorage
 */

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

/**
 * 統一的 storage 操作函數
 * @param key - 鍵名
 * @param value - 值(不傳=讀取, null=刪除, 其他=寫入)
 * @returns 寫入時返回值本身, 讀取時返回值或 null
 */
const createStorage =
  (storage: Storage) =>
  <T extends JSONValue>(key: string, value?: T | null): T | null => {
    try {
      // 寫入或刪除
      if (value !== undefined) {
        if (value === null) {
          storage.removeItem(key);
        } else {
          storage.setItem(key, JSON.stringify(value));
        }
        return value;
      }

      // 讀取
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  };

export const local = createStorage(localStorage);
export const session = createStorage(sessionStorage);
export const clearLocal = () => localStorage.clear();
export const clearSession = () => sessionStorage.clear();

const storage = { local, session, clearLocal, clearSession };

export default storage;
