export default async function loggingMiddleware(
  { request }: { request: Request },
  next: () => Promise<unknown>
) {
  const url = new URL(request.url);

  console.warn(`[Logging Middleware] Request URL: ${url.pathname}`);

  // 繼續執行下一個 middleware 或 loader
  await next();
}
