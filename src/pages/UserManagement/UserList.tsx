import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import awaitTo from "@/utils/awaitTo";
import { useQueryEffect } from "@/hooks/useQueryEffect";

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export default function UserList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    filterName: "",
    page: 1,
    limit: 10,
  });
  const [committedFilters, setCommittedFilters] = useState({
    filterName: "",
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    console.log("🔍 執行查詢:", committedFilters);
    const [err, res] = await awaitTo(
      axios.get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
        params: {
          _page: committedFilters.page,
          _limit: committedFilters.limit,
        },
      })
    );
    setLoading(false);

    if (err) {
      console.error("獲取文章列表失敗:", err);
      return;
    }

    setPosts(res.data);

    // 從 response header 取得總筆數
    const totalCount = res.headers["x-total-count"];
    if (totalCount) {
      setTotal(Number(totalCount));
    }
  };

  // 頁面進入時預載資料,page/limit 變化時重新查詢
  const refresh = useQueryEffect(
    () => {
      console.log("載入文章列表資料", committedFilters);
      fetchPosts();
    },
    [committedFilters.page, committedFilters.limit, committedFilters.filterName],
    {
      stateKeys: "filterName",
      onStateInit: (values) => {
        console.log("📥 UserList 接收到 router state:", values);
        if (values.filterName) {
          console.log("🎯 從其他頁面跳轉過來,參數:", values.filterName);
          const newFilters = { ...formData, filterName: values.filterName as string };
          setFormData(newFilters);
          setCommittedFilters(newFilters);
        }
      },
    }
  );

  const totalPages = Math.ceil(total / committedFilters.limit);

  const handlePrevPage = () => {
    if (committedFilters.page > 1) {
      refresh(() => setCommittedFilters({ ...committedFilters, page: committedFilters.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (committedFilters.page < totalPages) {
      refresh(() => setCommittedFilters({ ...committedFilters, page: committedFilters.page + 1 }));
    }
  };

  const handleLimitChange = (newLimit: number) => {
    refresh(
      () => setCommittedFilters({ ...committedFilters, limit: newLimit, page: 1 }),
      () => setFormData({ ...formData, limit: newLimit, page: 1 })
    );
  };

  const goToVerificationRequests = () => {
    navigate("/dashboard/player/verifyApply", {
      state: {
        username: "測試用戶",
        email: "test@example.com",
        age: "25",
      },
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <div className="flex gap-3 items-center">
          <Button onClick={goToVerificationRequests} variant="outline">
            跳轉到認證申請 (帶參數)
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">每頁顯示：</span>
            <select
              value={committedFilters.limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value={10}>10 筆</option>
              <option value={20}>20 筆</option>
              <option value={50}>50 筆</option>
              <option value={100}>100 筆</option>
            </select>
          </div>
          <Button onClick={() => refresh()} disabled={loading}>
            {loading ? "載入中..." : "重新載入"}
          </Button>
        </div>
      </div>

      {/* 顯示接收到的參數 */}
      {committedFilters.filterName && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            🎯 接收到參數: <strong>{committedFilters.filterName}</strong>
          </p>
        </div>
      )}

      {loading && posts.length === 0 ? (
        <div className="text-center py-12 text-slate-500">載入中...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  用戶 ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  標題
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  內容
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {post.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {post.userId}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {post.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-md truncate">
                    {post.body}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {posts.length === 0 && !loading && (
            <div className="text-center py-12 text-slate-500">暫無數據</div>
          )}
        </div>
      )}

      {/* 分頁控制 */}
      {total > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            顯示第 {(committedFilters.page - 1) * committedFilters.limit + 1} 到{" "}
            {Math.min(committedFilters.page * committedFilters.limit, total)} 筆，共 {total} 筆
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={committedFilters.page === 1 || loading}
            >
              上一頁
            </Button>
            <div className="flex items-center px-4 text-sm text-slate-600">
              第 {committedFilters.page} / {totalPages} 頁
            </div>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={committedFilters.page === totalPages || loading}
            >
              下一頁
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
