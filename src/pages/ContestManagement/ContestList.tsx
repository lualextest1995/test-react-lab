import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function ContestList() {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [favorite, setFavorite] = useState(false);
  return (
    <div>
      <h1>ContestList</h1>
      <div className="bg-white rounded-lg p-6 mb-6 shadow space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">
            页面便签（切换标签后应继续保留）
          </p>
          <Input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="记录一些内容试试看..."
          />
          {note && (
            <p className="mt-2 text-sm text-slate-600">
              当前字数：{note.length}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(event) => setFavorite(event.target.checked)}
          />
          标记为常用页面
        </label>
      </div>
      <Button
        onClick={() =>
          navigate("/dashboard/player/verifyApply", {
            state: {
              username: "testuser",
              email: "testuser@example.com",
              age: 30,
            },
          })
        }
      >
        去認證申請
      </Button>
      <Button
        onClick={() =>
          navigate("/dashboard/player/verifyApply", {
            state: {
              username: "fakeuser",
              email: "fakeuser@example.com",
              age: 18,
            },
          })
        }
      >
        去認證申請
      </Button>
    </div>
  );
}
