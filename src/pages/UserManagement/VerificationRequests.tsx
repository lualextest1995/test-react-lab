import Button from "@/components/Button";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryEffect } from "@/hooks/useQueryEffect";

export default function VerificationRequests() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: "",
  });
  const [committedFilters, setCommittedFilters] = useState({
    username: "",
    email: "",
    age: "",
  });
  const [results, setResults] = useState<string[]>([]);

  // 使用 useQueryEffect 處理查詢和 router state 初始化
  const refresh = useQueryEffect(
    () => {
      console.log("🔍 執行搜尋:", committedFilters);
      // 模擬 API 查詢
      const mockResults = [
        `查詢結果 - Username: ${committedFilters.username || "無"}`,
        `查詢結果 - Email: ${committedFilters.email || "無"}`,
        `查詢結果 - Age: ${committedFilters.age || "無"}`,
      ];
      setResults(mockResults);
    },
    [committedFilters.username, committedFilters.email, committedFilters.age],
    {
      stateKeys: ["username", "email", "age"],
      onStateInit: (values) => {
        console.log("📥 接收到 router state:", values);
        const newFilters = { ...formData, ...values };
        setFormData(newFilters);
        setCommittedFilters(newFilters);
      },
    }
  );

  function handleSearch() {
    console.log("🔄 手動搜尋", formData);
    refresh(() => setCommittedFilters(formData));
  }

  function goToUserList() {
    navigate("/dashboard/player", {
      state: { filterName: "來自 VerificationRequests 的測試" },
    });
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">認證申請</h1>
        <Button onClick={goToUserList}>跳轉到用戶列表</Button>
      </div>

      <div className="bg-white rounded-lg p-6 mb-6 shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <Button onClick={handleSearch}>搜尋</Button>
      </div>

      {/* 查詢結果顯示 */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">查詢結果</h2>
        <div className="space-y-2">
          {results.map((result, index) => (
            <div key={index} className="p-3 bg-slate-50 rounded">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
