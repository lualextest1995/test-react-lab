// i18n.ts
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// 初始化配置
i18n
  .use(HttpBackend) // 使用 HttpBackend 來載入翻譯文件
  .use(LanguageDetector) // 使用語言檢測插件
  .use(initReactI18next) // 初始化 React i18next
  .init({
    fallbackLng: "zh-TW", // 如果檢測不到則使用的預設語言
    detection: {
      order: ["querystring", "localStorage"], // 只檢查 localStorage 和 URL 參數，不使用瀏覽器語言
      caches: ["localStorage"], // 緩存語言設定到 localStorage
      lookupLocalStorage: "i18nextLng", // localStorage 中存儲語言設定的鍵
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // 翻譯檔案路徑
    },
    ns: ["translation"], // 使用的 namespaces
    defaultNS: "translation", // 預設 namespace
    interpolation: {
      escapeValue: false, // React 已自帶 XSS 安全處理，不需額外 escape
    },
    debug: import.meta.env.DEV, // 在開發時期可以開啟以查看 debug 信息
  });

export default i18n;
