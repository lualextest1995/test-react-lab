import Button from "@/components/Button";
import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function VerificationRequests() {
  const location = useLocation();
  const [form, setForm] = useState({
    username: "",
    email: "",
    age: "",
  });
  const isInit = useRef(false);

  useEffect(() => {
    if (location.state) {
      const newForm = {
        username: location.state.username || "",
        email: location.state.email || "",
        age: location.state.age || "",
      };
      setForm(newForm);
      searchHandler(newForm);
      return;
    }
    if (!isInit.current) {
      searchHandler(form);
    }
  }, []);

  function searchHandler(newForm: typeof form) {
    isInit.current = true;
    console.log("Form Data:", newForm);
    // 執行搜尋邏輯...
  }

  return (
    <div>
      <h1>VerificationRequests</h1>
      <div className="bg-white rounded-lg p-6 mb-6 shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Age</label>
          <input
            type="number"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <Button onClick={() => searchHandler(form)}>Submit</Button>
      </div>
    </div>
  );
}
