import { useMemo } from "react";
import { useTabContext } from "@/hooks/useTabContext";

export default function TransactionRecords() {
  const {
    tabs,
    activeTabId,
    openTab,
    closeTab,
    switchTab,
    closeAll,
    closeOthers,
  } = useTabContext();

  const serializedState = useMemo(
    () =>
      JSON.stringify(
        {
          activeTabId,
          tabs,
        },
        null,
        2
      ),
    [activeTabId, tabs]
  );

  const methodOverview = useMemo(
    () => [
      {
        name: "openTab",
        signature: "(tab: Tab) => void",
        available: typeof openTab === "function",
        description: "開啟或聚焦指定的標籤頁",
      },
      {
        name: "closeTab",
        signature: "(id: string) => void",
        available: typeof closeTab === "function",
        description: "關閉對應 ID 的標籤頁",
      },
      {
        name: "switchTab",
        signature: "(id: string) => void",
        available: typeof switchTab === "function",
        description: "切換至指定 ID 的標籤頁",
      },
      {
        name: "closeOthers",
        signature: "(keepId: string) => void",
        available: typeof closeOthers === "function",
        description: "保留指定標籤並關閉其他標籤",
      },
      {
        name: "closeAll",
        signature: "() => void",
        available: typeof closeAll === "function",
        description: "關閉所有標籤並清空狀態",
      },
    ],
    [closeAll, closeOthers, closeTab, openTab, switchTab]
  );

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 p-8">
      <div className="max-w-3xl w-full border rounded-lg p-8 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
        <h1 className="text-4xl font-bold text-amber-700 mb-4">
          TransactionRecords
        </h1>

        <div className="bg-white rounded-lg p-6 mb-6 shadow space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Tab Context 狀態
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              以下內容會即時反映當前開啟的所有標籤與啟用中的標籤 ID。
            </p>
            <div className="rounded-lg bg-slate-900/90 text-green-100 text-sm p-4 font-mono overflow-x-auto">
              <pre>{serializedState}</pre>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              Tab Context 方法
            </h2>
            <p className="text-sm text-slate-500 mb-3">
              所有對外暴露的方法都在此列出，可搭配瀏覽器主控台直接呼叫以手動操作
              Tab 狀態。
            </p>
            <ul className="space-y-2">
              {methodOverview.map((method) => (
                <li
                  key={method.name}
                  className="rounded border border-amber-100 bg-amber-50 px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <p className="font-semibold text-amber-700">
                        {method.name}
                        <span className="ml-2 text-xs text-amber-500">
                          {method.signature}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {method.description}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        method.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {method.available ? "可使用" : "不可使用"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">
              開啟中的標籤一覽
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tabs.length > 0 ? (
                tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`rounded-lg border p-4 ${
                      tab.id === activeTabId
                        ? "border-amber-400 bg-amber-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      {tab.title || tab.id}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      路徑：{tab.path}
                    </p>
                    <p className="text-xs text-slate-500">
                      ID：{tab.id}
                      {tab.id === activeTabId && (
                        <span className="ml-2 text-amber-600 font-medium">
                          (Active)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      可關閉：{tab.closable !== false ? "是" : "否"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">目前尚未開啟任何標籤。</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
