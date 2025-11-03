import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function UserList() {
  const [seconds, setSeconds] = useState(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, []);
  return (
    <div>
      <h1>UserList</h1>
      <div className="bg-white rounded-lg p-6 mb-6 shadow space-y-4">
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-purple-600">{seconds}s</p>
          <span className="text-sm text-slate-500">
            页面停留时间（切换标签时暂停/恢复）
          </span>
        </div>
        <Button
          variant="secondary"
          onClick={() => setClicks((prev) => prev + 1)}
        >
          点我增加计数（当前：{clicks}）
        </Button>
      </div>
    </div>
  );
}
