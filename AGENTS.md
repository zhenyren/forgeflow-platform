# AGENTS.md - 本项目 AI 协作规范

> 本文件是 AI 协作的必读规范，所有开发任务必须遵循以下约定。

## 目录

- [0. AI 开发须知](#0-ai-开发须知)
- [1. 技术栈](#1-技术栈)
- [2. 目录架构](#2-目录架构)
  - [2.1 总体结构（features / shared）](#21-总体结构features--shared)
  - [2.2 单个 feature 的内部结构](#22-单个-feature-的内部结构)
- [3. 组件规范](#3-组件规范)
  - [3.1 存放位置](#31-存放位置)
  - [3.2 编写约定](#32-编写约定)
  - [3.3 组件目录结构](#33-组件目录结构)
- [4. 命名规范](#4-命名规范)
- [5. 资源管理规范](#5-资源管理规范)
  - [5.1 存放位置](#51-存放位置)
  - [5.2 常量维护](#52-常量维护)
  - [5.3 使用规范](#53-使用规范)
- [6. 工作流约束](#6-工作流约束)

---

## 0. AI 开发须知

开始任何任务前，必须遵循以下原则：

1. **先读规范** —— 动手前完整阅读本文件，确保理解所有约定
2. **先列清单** —— 修改/创建文件前，先列出文件清单和改动点，等用户确认
3. **先读代码** —— 修改已有文件前，必须先读取该文件了解现状
4. **最小改动** —— 只改需要改的，不做无关的重构或美化
5. **不确定就问** —— 需求不明确时主动提问，不要自行假设
6. **不擅自创建** —— 不创建用户没要求的文件、组件、依赖
7. **不改依赖版本** —— 不修改 package.json 中的依赖版本，除非明确要求
8. **验证结果** —— 代码改动后运行构建/类型检查确认无报错

---

## 1. 技术栈

| 类别 | 选型                                              |
| ---- | ------------------------------------------------- |
| 框架 | React 19 + TypeScript                             |
| 构建 | Vite 6                                            |
| 端口 | 51730                                             |
| 路由 | react-router-dom 7                                |
| 3D   | three.js + @react-three/fiber + @react-three/drei |
| 样式 | Tailwind CSS                                      |
| 图标 | lucide-react（优先）                              |

### 常用脚本

| 命令                 | 说明                                               |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | 启动 Vite 开发服务器                               |
| `npm run build`      | 类型检查 + 构建生产版本                            |
| `npm run preview`    | 预览生产构建                                       |
| `npm run lint`       | 运行 ESLint 检查                                   |
| `npm run gen:assets` | ⚠️ 生成资源常量，详见 [5.2 常量维护](#52-常量维护) |

---

## 2. 目录架构

### 2.1 总体结构（features / shared）

```
src/
├── features/          # 业务功能模块，每个模块独立自治
│   ├── viewer/        # 3D 产品视图
│   ├── structure/     # 产品结构树
│   ├── parameter/     # 参数编辑面板
│   ├── ai-chat/       # AI 对话与修改预览
│   ├── model-select/  # 模块选择
│   └── version/       # 版本展示
├── shared/            # 跨模块复用的通用能力
│   ├── components/    # 通用业务组件
│   │   └── ui/        # 纯 UI 基础组件（Button、Input、Modal...）
│   ├── hooks/         # 通用 hooks
│   ├── lib/           # 工具函数、类型定义
│   └── styles/        # 全局样式
├── router/            # 路由配置（统一管理所有路由）
├── assets/            # 资源常量（脚本自动生成，禁止手动修改）
└── main.tsx           # 应用入口
```

**规则：**

- 业务代码必须放进对应的 `features/<模块名>/`，禁止直接丢在 `src/` 根下
- 只有被 2 个以上 feature 复用的东西才放进 `shared/`，否则留在 feature 内部
- 每个 feature 内部自治，不跨目录引用其他 feature 的内部文件

### 2.2 单个 feature 的内部结构

```
features/<feature-name>/
├── pages/        # 页面级组件（路由入口），组合 views 和 components
├── views/        # 视图块，页面内的大块区域，处理布局
├── components/   # 可复用的展示组件
├── hooks/        # 自定义 hooks，承担 ViewModel 职责
├── state/        # 模块状态管理（store、context）
├── api/          # 模块接口请求
├── types/        # 模块类型定义
├── utils/        # 模块工具函数
├── constants/    # 模块常量
└── index.ts      # 对外导出入口（只导出需要暴露的内容）
```

**分层说明：**

| 目录          | 职责                                                                                                                    | 粒度 | 必须           | 示例                    |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- | ---- | -------------- | ----------------------- |
| `pages/`      | **路由入口 + 编排**：一个 page 对应一个路由，组装 views 和 components，处理页面级状态、数据获取、权限，不写具体展示逻辑 | 最大 | 有路由时       | `ProductViewerPage.tsx` |
| `views/`      | **业务区域**：页面内的大块区域，负责一个完整业务区块的展示和交互，可包含多个 components，处理该区域局部状态             | 中   | 复杂页面时     | `ModelViewport.tsx`     |
| `components/` | **展示单元**：最小可复用组件，纯展示不含业务逻辑，可被多个 views 复用                                                   | 最小 | ✅             | `TreeNode.tsx`          |
| `hooks/`      | 自定义 hooks，承担 ViewModel 职责                                                                                       | -    | 需要时         | `useModelLoader.ts`     |
| `state/`      | 模块状态管理（store、context）                                                                                          | -    | 有跨组件状态时 | `viewerStore.ts`        |
| `api/`        | 模块接口请求                                                                                                            | -    | 需要请求时     | `viewerApi.ts`          |
| `types/`      | 模块类型定义                                                                                                            | -    | ✅             | `viewer.types.ts`       |
| `utils/`      | 模块工具函数                                                                                                            | -    | 需要时         | `format.ts`             |
| `constants/`  | 模块常量                                                                                                                | -    | 需要时         | `config.ts`             |
| `index.ts`    | 对外导出入口                                                                                                            | -    | ✅             | -                       |

**简单判断：**

- 能独立成一个路由页面的 → `pages/`
- 是页面里的一个功能区块 → `views/`
- 只是一个可复用的 UI 元素 → `components/`

**约定：**

- React 中用自定义 hooks 承担 ViewModel 职责，不单独建 `vm/` 目录
- 简单 feature 只需 `components/` + `types/` + `index.ts`，按需创建其他目录
- 外部引用必须走 `index.ts`：`import { X } from "@/features/viewer"`，禁止直接引用内部文件
- feature 之间不互相 import，跨模块通信走 props / 全局状态 / shared 层

---

## 3. 组件规范

### 3.1 存放位置

| 类型                         | 位置                             |
| ---------------------------- | -------------------------------- |
| feature 内部组件             | `features/<feature>/components/` |
| 跨 feature 复用的业务组件    | `shared/components/`             |
| 纯 UI 基础组件（无业务逻辑） | `shared/components/ui/`          |

### 3.2 编写约定

- 文件名用 PascalCase：`ProductCard.tsx`
- 一个文件一个默认导出组件
- 组件内部子组件抽离为独立方法（`_buildXxx`），禁止直接嵌套在父组件 JSX 内
- 禁止硬编码颜色值，必须使用主题色变量或统一颜色常量
- 偏好简洁无多余边框的视觉风格
- 操作入口默认隐藏，仅在 hover 对应 item 时显示
- 弹窗组件使用固定外框尺寸，内容超出时内部滚动，禁止动态变换大小
- 交互需支持分层动效、状态反馈、平滑过渡，同时遵循 `prefers-reduced-motion` 无障碍规范
- 不使用系统原生选择器 UI，使用符合项目风格的自定义选择器组件

### 3.3 组件目录结构

**简单组件：**

```
shared/components/ui/Button/
├── Button.tsx   # 组件本体 + Props 类型
└── index.ts     # 统一导出
```

**复杂组件：**

```
shared/components/ui/Modal/
├── Modal.tsx        # 组件本体
├── Modal.types.ts   # Props / 事件类型定义
├── Modal.utils.ts   # 组件内部工具函数（可选）
└── index.ts         # 统一导出
```

**约定：**

- 每个组件必须有 `index.ts` 对外导出，外部通过 `@/shared/components/ui/Button` 引用
- Props 类型简单时直接写在组件文件里，复杂时拆到 `*.types.ts`
- 组件文件内只放组件逻辑，不混放无关工具函数
- 不创建测试文件和 stories 文件（除非明确要求）
- 简单组件不写文档，复杂组件按需在目录下放 `README.md` 说明用法

---

## 4. 命名规范

### 4.1 通用规则

| 类型         | 规则                   | 示例                                  |
| ------------ | ---------------------- | ------------------------------------- |
| 组件文件     | PascalCase             | `ProductCard.tsx`                     |
| 非组件文件   | camelCase              | `useAuth.ts`、`formatDate.ts`         |
| 组件名       | PascalCase             | `function ProductCard() {}`           |
| 变量/函数    | camelCase              | `const userName = ""`                 |
| 常量         | UPPER_SNAKE_CASE       | `const MAX_COUNT = 100`               |
| Hook         | `use` 前缀 + camelCase | `useAuth`、`useModelLoader`           |
| 类型/接口    | PascalCase             | `interface ButtonProps {}`            |
| 类型别名字段 | camelCase              | `interface User { userName: string }` |
| CSS 类名     | kebab-case             | `.btn-primary`                        |

### 4.2 类型命名

- **接口不加 `I` 前缀**，统一用 PascalCase
- API 层数据用 `DTO` 后缀，业务模型不加后缀

```ts
// ✅ 推荐
interface ButtonProps {}
interface UserDTO {} // API 返回的原始数据
interface User {} // 业务层模型

// ❌ 不推荐
interface IButtonProps {}
interface IUser {}
```

### 4.3 组件命名

- **不加统一前缀**，通过导入路径区分来源
- 重名时在导入处重命名

```ts
// 通用组件
import { Button } from "@/shared/components/ui/Button";

// feature 内部组件
import { Button } from "@/features/viewer/components/Button";

// 重名时重命名导入
import { Button as UiButton } from "@/shared/components/ui/Button";
```

---

## 5. 资源管理规范

### 5.1 存放位置

所有资源统一放 `public/assets/` 下，按 feature 划分子目录：

```
public/
└── assets/
    ├── viewer/        # viewer 模块资源
    │   ├── images/
    │   ├── models/
    │   └── icons/
    ├── structure/     # structure 模块资源
    └── shared/        # 公共资源
        ├── images/
        ├── icons/
        └── fonts/
```

### 5.2 常量维护

> ⚠️ **重要：`src/assets/index.ts` 由脚本自动生成，绝对禁止手动修改或手动维护资源路径。**

**资源增删改流程：**

1. 把资源文件放进 `public/assets/<feature>/<类型>/` 对应目录
2. 运行 `npm run gen:assets`
3. 脚本会自动扫描并更新 `src/assets/index.ts`
4. 代码中通过 `AppAssets.<feature>.<类型>.<文件名>` 引用

**禁止行为：**

- ❌ 禁止手动编辑 `src/assets/index.ts`
- ❌ 禁止在代码中硬编码资源路径（如 `"/assets/viewer/model.glb"`）
- ❌ 禁止手动维护资源路径映射对象

**生成规则：** 按目录层级生成嵌套对象，文件名（去扩展名）作为 key

```ts
// src/assets/index.ts —— 自动生成，禁止手动修改
export const AppAssets = {
  viewer: {
    model: "/assets/viewer/models/model.glb",
  },
  shared: {
    logo: "/assets/shared/images/logo.png",
  },
} as const;
```

### 5.3 使用规范

| 资源类型 | 存放位置                          | 引用方式                                     |
| -------- | --------------------------------- | -------------------------------------------- |
| 字体     | `public/assets/shared/fonts/`     | `@font-face` 声明，不使用在线字体            |
| 图标     | `public/assets/shared/icons/`     | 优先用 `lucide-react`；SVG 用 `currentColor` |
| 图片     | `public/assets/<feature>/images/` | webp/jpg（照片）、svg/png（插画）            |
| 3D 模型  | `public/assets/<feature>/models/` | 统一 `.glb` 格式                             |

**统一原则：**

- 所有资源必须通过 `AppAssets` 常量引用，禁止硬编码资源路径
- 引用类型保持一致：需要 URL 的地方给 URL 字符串，不混用 symbol/组件

---

## 6. 工作流约束

- 动手前先列出要创建/修改的文件清单，等我确认再写
- 每次只做一件事，小步提交
- 不确定时问我，不要猜
- 不创建我没要求的文件
- 不自动生成示例代码/假数据/占位组件（除非明确要求）
