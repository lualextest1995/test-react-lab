import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookies";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Alert from "@/utils/alert";
import { toBase64, fromBase64 } from "@/utils/base64";
import storage from "@/utils/storage";

export default function Welcome() {
  const { user, login, setPermissions } = useAuth();
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [encodedText, setEncodedText] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [storageKey, setStorageKey] = useState("myData");
  const [storageValue, setStorageValue] = useState("");
  const [storedData, setStoredData] = useState<string>("");

  const fakeUser = {
    id: "user",
    name: "測試用戶",
  };

  const fakePermissions = [
    {
      name: "用戶管理",
      page: [
        { grant: ["list"], name: "用戶列表", path: "/dashboard/player" },
        {
          grant: ["list"],
          name: "認證申請",
          path: "/dashboard/player/verifyApply",
        },
      ],
    },
    {
      name: "競賽管理",
      page: [
        { grant: ["list"], name: "競賽清單", path: "/dashboard/contest" },
        {
          grant: ["list"],
          name: "申訴清單",
          path: "/dashboard/contest/:contest_id/disputed",
        },
      ],
    },
    {
      name: "報表管理",
      page: [
        { grant: ["list"], name: "帳變紀錄", path: "/dashboard/passbook" },
      ],
    },
  ];

  function simulateLogin(): Promise<{
    user: typeof fakeUser;
    permissions: typeof fakePermissions;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: fakeUser, permissions: fakePermissions });
      }, 1000);
    });
  }

  // 模擬 API 請求
  const fetchData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { data: [1, 2, 3, 4, 5], total: 5 };
  };

  // Base64 範例函式
  const base64Examples = {
    // 編碼文字
    encodeText: () => {
      try {
        const result = toBase64(inputText);
        setEncodedText(result);
        Alert.success("編碼成功！");
      } catch (error) {
        Alert.error(error instanceof Error ? error.message : "編碼失敗");
      }
    },

    // 解碼文字
    decodeText: () => {
      try {
        const result = fromBase64(encodedText);
        setDecodedText(result);
        Alert.success("解碼成功！");
      } catch (error) {
        Alert.error(error instanceof Error ? error.message : "解碼失敗");
      }
    },

    // 快速範例：編碼中文
    quickEncodeChinese: () => {
      const text = "你好，世界！";
      setInputText(text);
      try {
        const result = toBase64(text);
        setEncodedText(result);
        Alert.success(`已編碼：${text}`);
      } catch (error) {
        Alert.error("編碼失敗");
      }
    },

    // 快速範例：編碼 JSON
    quickEncodeJSON: () => {
      const jsonObj = {
        name: "測試用戶",
        role: "admin",
        timestamp: Date.now(),
      };
      const text = JSON.stringify(jsonObj, null, 2);
      setInputText(text);
      try {
        const result = toBase64(text);
        setEncodedText(result);
        Alert.success("已編碼 JSON 物件");
      } catch (error) {
        Alert.error("編碼失敗");
      }
    },

    // 清空所有欄位
    clearAll: () => {
      setInputText("");
      setEncodedText("");
      setDecodedText("");
      Alert.info("已清空所有欄位");
    },
  };

  // Storage 範例函式
  const storageExamples = {
    // 儲存到 localStorage
    saveToLocal: () => {
      try {
        const data = { name: storageValue, timestamp: Date.now() };
        storage.local(storageKey, data);
        Alert.success(`已儲存到 localStorage: ${storageKey}`);
        storageExamples.loadFromLocal();
      } catch (error) {
        Alert.error("儲存失敗");
      }
    },

    // 從 localStorage 讀取
    loadFromLocal: () => {
      try {
        const data = storage.local<{ name: string; timestamp: number }>(
          storageKey
        );
        if (data) {
          setStoredData(JSON.stringify(data, null, 2));
          Alert.success("成功讀取資料");
        } else {
          setStoredData("沒有資料");
          Alert.info("localStorage 中沒有此資料");
        }
      } catch (error) {
        Alert.error("讀取失敗");
      }
    },

    // 刪除 localStorage 資料
    deleteFromLocal: () => {
      storage.local(storageKey, null);
      Alert.success(`已刪除 localStorage: ${storageKey}`);
      setStoredData("");
    },

    // 儲存到 sessionStorage
    saveToSession: () => {
      try {
        const data = { value: storageValue, created: new Date().toISOString() };
        storage.session(storageKey, data);
        Alert.success(`已儲存到 sessionStorage: ${storageKey}`);
        storageExamples.loadFromSession();
      } catch (error) {
        Alert.error("儲存失敗");
      }
    },

    // 從 sessionStorage 讀取
    loadFromSession: () => {
      try {
        const data = storage.session<{ value: string; created: string }>(
          storageKey
        );
        if (data) {
          setStoredData(JSON.stringify(data, null, 2));
          Alert.success("成功讀取 sessionStorage");
        } else {
          setStoredData("沒有資料");
          Alert.info("sessionStorage 中沒有此資料");
        }
      } catch (error) {
        Alert.error("讀取失敗");
      }
    },

    // 儲存用戶偏好設定範例
    saveUserPreferences: () => {
      const preferences = {
        theme: "dark",
        language: "zh-TW",
        notifications: true,
        fontSize: 16,
      };
      storage.local("userPreferences", preferences);
      setStoredData(JSON.stringify(preferences, null, 2));
      Alert.success("已儲存用戶偏好設定");
    },

    // 儲存購物車範例
    saveShoppingCart: () => {
      const cart = [
        { id: 1, name: "商品 A", price: 299, quantity: 2 },
        { id: 2, name: "商品 B", price: 199, quantity: 1 },
      ];
      storage.local("shoppingCart", cart);
      setStoredData(JSON.stringify(cart, null, 2));
      Alert.success("已儲存購物車資料");
    },

    // 清空所有 localStorage
    clearAllLocal: () => {
      Alert.confirm({
        message: "確定要清空所有 localStorage 資料嗎？此操作無法復原。",
        confirmText: "清空",
        cancelText: "取消",
        onConfirm: () => {
          storage.clearLocal();
          setStoredData("");
          Alert.success("已清空所有 localStorage 資料");
        },
      });
    },

    // 清空所有 sessionStorage
    clearAllSession: () => {
      Alert.confirm({
        message: "確定要清空所有 sessionStorage 資料嗎？",
        confirmText: "清空",
        cancelText: "取消",
        onConfirm: () => {
          storage.clearSession();
          setStoredData("");
          Alert.success("已清空所有 sessionStorage 資料");
        },
      });
    },

    // 清空所有示範欄位
    clearAll: () => {
      setStorageKey("myData");
      setStorageValue("");
      setStoredData("");
      Alert.info("已清空所有欄位");
    },
  };

  // Alert 範例函式
  const examples = {
    // 範例 1: 基本訊息提示
    basicSuccess: () => {
      Alert.success("操作成功！");
    },
    basicError: () => {
      Alert.error("發生錯誤，請稍後再試");
    },
    basicInfo: () => {
      Alert.info("系統將於 5 分鐘後維護");
    },

    // 範例 2: 自訂配置
    customConfig: () => {
      Alert.success("儲存成功", {
        duration: 5000,
        position: "top-right",
      });
    },

    // 範例 3: 帶操作按鈕的提示
    withAction: () => {
      Alert.withAction(
        "檔案已刪除",
        "復原",
        () => {
          Alert.info("已復原檔案");
        },
        { duration: 5000 }
      );
    },

    // 範例 4: Promise 狀態處理
    promiseExample: () => {
      Alert.promise(fetchData(), {
        loading: "載入中...",
        success: (data) => `成功載入 ${data.total} 筆資料`,
        error: "載入失敗",
      });
    },

    // 範例 5: 確認對話框（雙按鈕）
    confirmDouble: () => {
      Alert.confirm({
        message: "確定要刪除這筆資料嗎？此操作無法復原。",
        confirmText: "刪除",
        cancelText: "取消",
        onConfirm: () => {
          Alert.success("已刪除");
        },
        onCancel: () => {
          Alert.info("已取消");
        },
      });
    },

    // 範例 6: 確認對話框（單按鈕）
    confirmSingle: () => {
      Alert.confirm({
        message: "請先完成必填欄位",
        confirmText: "知道了",
        onConfirm: () => {
          Alert.info("已確認");
        },
      });
    },

    // 範例 7: 自訂內容
    customContent: () => {
      Alert.custom(
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div>
            <div className="font-semibold">{user?.name || "訪客"}</div>
            <div className="text-sm text-muted-foreground">傳送了一則訊息</div>
          </div>
        </div>,
        { duration: 4000 }
      );
    },
  };

  useEffect(() => {
    // 如果已經登入就不要重複執行
    if (user) return;

    const token = getCookie("token");
    if (token && token === "TestToken") {
      simulateLogin().then(({ user, permissions }) => {
        login(user);
        setPermissions(permissions);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在首次掛載時執行

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">歡迎 {user?.name}</h1>
        <p className="text-muted-foreground">{t("hello")}</p>
      </div>

      {/* 導航按鈕 */}
      <div className="flex gap-3">
        <Button asChild>
          <Link to="/dashboard/player">去用戶列表</Link>
        </Button>
        <Button asChild>
          <Link to="/dashboard/contest">去競賽管理</Link>
        </Button>
      </div>

      {/* Storage 範例區域 */}
      <div className="space-y-6 rounded-lg border p-6">
        <h2 className="text-2xl font-semibold">Storage 工具範例</h2>

        {/* 快速範例按鈕 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">快速範例</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={storageExamples.saveUserPreferences}
              variant="outline"
            >
              儲存用戶偏好設定
            </Button>
            <Button
              onClick={storageExamples.saveShoppingCart}
              variant="outline"
            >
              儲存購物車資料
            </Button>
            <Button onClick={storageExamples.clearAll} variant="secondary">
              清空欄位
            </Button>
          </div>
        </div>

        {/* 清空所有 Storage */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">清空所有資料</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={storageExamples.clearAllLocal}
              variant="destructive"
            >
              清空所有 localStorage
            </Button>
            <Button
              onClick={storageExamples.clearAllSession}
              variant="destructive"
            >
              清空所有 sessionStorage
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            ⚠️ 這會清空瀏覽器中所有該網域的 storage 資料，請謹慎使用
          </p>
        </div>

        {/* 自訂鍵值操作 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">自訂鍵值操作</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                鍵名 (Key)
              </label>
              <input
                type="text"
                value={storageKey}
                onChange={(e) => setStorageKey(e.target.value)}
                placeholder="例如: myData"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                值 (Value)
              </label>
              <input
                type="text"
                value={storageValue}
                onChange={(e) => setStorageValue(e.target.value)}
                placeholder="輸入要儲存的值"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={storageExamples.saveToLocal}
              disabled={!storageKey || !storageValue}
            >
              儲存到 localStorage
            </Button>
            <Button
              onClick={storageExamples.loadFromLocal}
              variant="secondary"
              disabled={!storageKey}
            >
              讀取 localStorage
            </Button>
            <Button
              onClick={storageExamples.deleteFromLocal}
              variant="destructive"
              disabled={!storageKey}
            >
              刪除 localStorage
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={storageExamples.saveToSession}
              variant="outline"
              disabled={!storageKey || !storageValue}
            >
              儲存到 sessionStorage
            </Button>
            <Button
              onClick={storageExamples.loadFromSession}
              variant="outline"
              disabled={!storageKey}
            >
              讀取 sessionStorage
            </Button>
          </div>
        </div>

        {/* 顯示儲存的資料 */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            儲存的資料 (JSON 格式)
          </label>
          <textarea
            value={storedData}
            readOnly
            placeholder="讀取的資料會顯示在這裡..."
            className="min-h-32 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground"
          />
        </div>

        {/* 使用說明 */}
        <div className="rounded-md bg-muted p-4 text-sm">
          <h4 className="mb-2 font-semibold">使用說明：</h4>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>localStorage: 資料永久保存，除非手動刪除</li>
            <li>sessionStorage: 資料在分頁關閉後自動清除</li>
            <li>支援自動 JSON 序列化/反序列化</li>
            <li>支援 TypeScript 型別推斷</li>
          </ul>
        </div>
      </div>

      {/* Base64 範例區域 */}
      <div className="space-y-6 rounded-lg border p-6">
        <h2 className="text-2xl font-semibold">Base64 編碼/解碼工具</h2>

        {/* 快速範例按鈕 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">快速範例</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={base64Examples.quickEncodeChinese}
              variant="outline"
            >
              編碼中文文字
            </Button>
            <Button onClick={base64Examples.quickEncodeJSON} variant="outline">
              編碼 JSON 物件
            </Button>
            <Button onClick={base64Examples.clearAll} variant="destructive">
              清空所有欄位
            </Button>
          </div>
        </div>

        {/* 輸入區域 */}
        <div className="space-y-3">
          <div>
            <label className="mb-2 block text-sm font-medium">原始文字</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="輸入要編碼的文字..."
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <div className="mt-2">
              <Button onClick={base64Examples.encodeText} disabled={!inputText}>
                編碼為 Base64
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Base64 編碼結果
            </label>
            <textarea
              value={encodedText}
              onChange={(e) => setEncodedText(e.target.value)}
              placeholder="Base64 編碼結果會顯示在這裡..."
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
            />
            <div className="mt-2">
              <Button
                onClick={base64Examples.decodeText}
                disabled={!encodedText}
              >
                解碼 Base64
              </Button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">解碼結果</label>
            <textarea
              value={decodedText}
              readOnly
              placeholder="解碼結果會顯示在這裡..."
              className="min-h-24 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Alert 範例區域 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Alert 元件範例</h2>

        {/* 基本訊息提示 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">1. 基本訊息提示</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={examples.basicSuccess} variant="default">
              成功訊息
            </Button>
            <Button onClick={examples.basicError} variant="destructive">
              錯誤訊息
            </Button>
            <Button onClick={examples.basicInfo} variant="secondary">
              資訊訊息
            </Button>
          </div>
        </div>

        {/* 自訂配置 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">2. 自訂配置（右上角，5 秒）</h3>
          <Button onClick={examples.customConfig}>顯示自訂配置</Button>
        </div>

        {/* 帶操作按鈕 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">3. 帶操作按鈕</h3>
          <Button onClick={examples.withAction} variant="outline">
            刪除檔案（可復原）
          </Button>
        </div>

        {/* Promise 狀態 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">4. Promise 狀態處理</h3>
          <Button onClick={examples.promiseExample}>
            載入資料（模擬 2 秒）
          </Button>
        </div>

        {/* 確認對話框 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">5. 確認對話框</h3>
          <div className="flex gap-2">
            <Button onClick={examples.confirmDouble} variant="destructive">
              刪除確認（雙按鈕）
            </Button>
            <Button onClick={examples.confirmSingle} variant="secondary">
              提示確認（單按鈕）
            </Button>
          </div>
        </div>

        {/* 自訂內容 */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">6. 自訂內容</h3>
          <Button onClick={examples.customContent} variant="outline">
            顯示自訂訊息
          </Button>
        </div>
      </div>
    </div>
  );
}
