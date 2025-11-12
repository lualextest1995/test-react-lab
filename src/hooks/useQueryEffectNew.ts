// hooks/useQueryEffect.ts
import { useEffect, useRef, useCallback, type DependencyList } from "react";
import { useLocation } from "react-router";
import { useTabContext } from "./useTabContext";

/**
 * 淺比較兩個依賴數組是否相等
 * 使用 Object.is 進行精確比較
 */
function shallowEqual(deps1: DependencyList, deps2: DependencyList | null): boolean {
  if (deps2 === null) return false;
  if (deps1.length !== deps2.length) return false;

  for (let i = 0; i < deps1.length; i++) {
    if (!Object.is(deps1[i], deps2[i])) {
      return false;
    }
  }

  return true;
}

/**
 * 帶有查詢去重的 useEffect
 * 只在依賴真正改變時執行,支援 Keep Alive 場景
 * 可選支援從 router state 初始化查詢參數
 * 自動檢查當前路由是否在 tabs 中,防止 tab 關閉時觸發請求
 * 返回一個 refresh 函數,接受更新函數並智能判斷是否需要手動刷新
 *
 * @param effect 要執行的副作用
 * @param deps 依賴數組
 * @param options 可選配置
 * @param options.stateKeys 從 location.state 讀取初始參數的 keys (支援單個或多個)
 * @param options.onStateInit 讀取到 state 時的回調,用於初始化狀態,接收包含所有 state 值的物件
 *
 * @example
 * // 基本使用
 * useQueryEffect(() => {
 *   fetchData(filters, pagination);
 * }, [filters, pagination.pageIndex, pagination.pageSize]);
 *
 * @example
 * // 使用 refresh 手動刷新
 * const refresh = useQueryEffect(
 *   () => fetchData(filters, pagination),
 *   [filters, pagination.pageIndex, pagination.pageSize]
 * );
 *
 * function handleSearch() {
 *   refresh(
 *     () => setCommittedFilters(formData),
 *     () => setPagination({ pageIndex: 0, pageSize: pagination.pageSize })
 *   );
 * }
 *
 * @example
 * // 支援 router state 初始化 (單個變數)
 * useQueryEffect(
 *   () => fetchData(committedFilters, pagination),
 *   [committedFilters, pagination.pageIndex, pagination.pageSize],
 *   {
 *     stateKeys: 'playerName',
 *     onStateInit: (values) => {
 *       setFormData({ ...formData, playerName: values.playerName });
 *       setCommittedFilters({ ...formData, playerName: values.playerName });
 *     }
 *   }
 * );
 *
 * @example
 * // 支援 router state 初始化 (多個變數)
 * useQueryEffect(
 *   () => fetchData(committedFilters, pagination),
 *   [committedFilters, pagination.pageIndex, pagination.pageSize],
 *   {
 *     stateKeys: ['playerName', 'contestId'],
 *     onStateInit: (values) => {
 *       const newFilters = { ...formData, ...values };
 *       setFormData(newFilters);
 *       setCommittedFilters(newFilters);
 *     }
 *   }
 * );
 */
export function useQueryEffect<TStateValues extends Record<string, unknown> = Record<string, unknown>>(
  effect: () => void | Promise<void>,
  deps: DependencyList,
  options?: {
    stateKeys?: string | string[];
    onStateInit?: (stateValues: Partial<TStateValues>) => void;
  }
) {
  const location = useLocation();
  const { tabs } = useTabContext();
  const lastDepsRef = useRef<DependencyList | null>(null);
  const effectRef = useRef(effect);
  const lastLocationKeyRef = useRef<string | undefined>(undefined);

  // 保持 effect 引用最新
  useEffect(() => {
    effectRef.current = effect;
  });

  useEffect(() => {
    // 檢查當前路由是否在 tabs 中
    const currentPath = location.pathname;
    const hasTab = tabs.find((tab) => tab.id === currentPath);
    if (!hasTab) return;

    // 如果配置了 stateKeys,檢查 location 是否變化且有新值
    if (options?.stateKeys && options?.onStateInit) {
      // 檢查是否是新的 location (通過 location.key 判斷)
      const isNewLocation = location.key !== lastLocationKeyRef.current;

      if (isNewLocation) {
        const keys = Array.isArray(options.stateKeys) ? options.stateKeys : [options.stateKeys];
        const stateValues: Record<string, unknown> = {};
        let hasValues = false;

        // 收集所有 state 值
        keys.forEach((key) => {
          const value = location.state?.[key];
          if (value !== undefined) {
            stateValues[key] = value;
            hasValues = true;
          }
        });

        // 如果有值,執行初始化
        if (hasValues) {
          lastLocationKeyRef.current = location.key;
          // 清空查詢快照,強制下次執行查詢
          lastDepsRef.current = null;
          options.onStateInit(stateValues as Partial<TStateValues>);
          // 初始化後 return,等狀態更新完再執行查詢
          return;
        }
      }
    }

    // 如果依賴沒變,不執行(Keep alive 回來時會走這裡)
    if (shallowEqual(deps, lastDepsRef.current)) {
      return;
    }

    // 依賴改變了,更新快照並執行
    lastDepsRef.current = [...deps];
    effectRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, location.pathname, location.state, location.key, options, ...deps]);

  /**
   * 智能刷新函數
   * @param updaters - 一個或多個狀態更新函數
   *
   * 工作原理:
   * 1. 執行所有狀態更新函數
   * 2. 保存當前依賴快照
   * 3. 在下一個 tick 檢查依賴是否真的變了
   * 4. 如果沒變,手動執行 effect;如果變了,useEffect 會自動觸發
   */
  const refresh = useCallback((...updaters: Array<() => void>) => {
    const beforeDeps = [...deps];

    // 執行所有狀態更新
    updaters.forEach((updater) => updater());

    // 在下一個 tick 檢查依賴是否變化
    setTimeout(() => {
      // 如果依賴沒變,需要手動刷新
      if (shallowEqual(deps, beforeDeps) && shallowEqual(deps, lastDepsRef.current)) {
        lastDepsRef.current = [...deps]; // 更新快照
        effectRef.current();
      }
      // 如果依賴變了,useEffect 會自動觸發
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);

  return refresh;
}
