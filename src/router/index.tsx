import { createBrowserRouter } from "react-router-dom";

/**
 * 路由配置
 * 各 feature 开发完成后，从 @/features/<feature> 引入页面组件
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <div className="p-8 text-text-muted">ForgeFlow Platform</div>,
  },
  // 接入 feature 路由示例：
  // { path: "/viewer", lazy: () => import("@/features/viewer") },
]);
