# UI 组件开发指南

## 组件目录结构

### 简单组件

```
Button/
├── Button.tsx   # 组件本体 + Props 类型
└── index.ts     # 导出
```

### 复杂组件

```
Modal/
├── Modal.tsx        # 组件本体
├── Modal.types.ts   # Props / 事件类型
├── Modal.utils.ts   # 内部工具函数（可选）
└── index.ts         # 统一导出
```

## 组件模板

### Button.tsx

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮内容 */
  children: ReactNode;
  /** 按钮变体 */
  variant?: "primary" | "secondary" | "ghost";
  /** 按钮尺寸 */
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  // 内部子组件抽离为独立方法
  const _buildContent = () => <span>{children}</span>;

  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {_buildContent()}
    </button>
  );
}
```

### index.ts

```ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button";
```

## 引用方式

```tsx
import { Button } from "@/shared/components/ui/Button";
```

## 规范要点

1. Props 类型用 `interface` 定义，必要字段不加 `?`
2. 继承原生元素属性时用 `extends ButtonHTMLAttributes<HTMLButtonElement>`
3. 组件内部子元素抽离为 `_buildXxx` 方法，不嵌套在 JSX 里
4. 不硬编码颜色，用主题变量或 tailwind 类
5. 每个组件必须有 `index.ts` 统一导出
