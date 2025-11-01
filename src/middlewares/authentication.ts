import { getCookie } from "@/utils/cookies";
import { redirect } from "react-router";

export default async function authenticationMiddleware(
  { request }: { request: Request },
  next: () => Promise<unknown>
) {
  const url = new URL(request.url);
  const isAuthenticated = getCookie("token") === "TestToken";

  if (!isAuthenticated && url.pathname !== "/login") {
    throw redirect("/login");
  }

  if (isAuthenticated && url.pathname === "/login") {
    throw redirect("/");
  }

  // 繼續執行下一個 middleware 或 loader
  await next();
}
