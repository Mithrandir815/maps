// className管理の様々な方法の例

import clsx from "clsx";

// 1. 基本的なclsxの使用
const Example1 = ({
  isActive,
  isDisabled,
}: {
  isActive: boolean;
  isDisabled: boolean;
}) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded", // 基本スタイル
        isActive && "bg-blue-500 text-white", // 条件付きスタイル
        isDisabled && "opacity-50 cursor-not-allowed", // 複数条件
        !isActive && !isDisabled && "bg-gray-200 hover:bg-gray-300" // 複合条件
      )}
    >
      Button
    </button>
  );
};

// 2. オブジェクト形式での条件付きクラス
const Example2 = ({ status }: { status: "loading" | "success" | "error" }) => {
  return (
    <div
      className={clsx({
        "bg-blue-100 text-blue-800": status === "loading",
        "bg-green-100 text-green-800": status === "success",
        "bg-red-100 text-red-800": status === "error",
        "px-4 py-2 rounded-md": true, // 常に適用
      })}
    >
      Status: {status}
    </div>
  );
};

// 3. CSS-in-JS風のスタイル関数
const createButtonStyles = (
  variant: "primary" | "secondary",
  size: "sm" | "md" | "lg"
) => {
  const baseStyles = "font-medium rounded-md focus:outline-none focus:ring-2";

  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return clsx(baseStyles, variants[variant], sizes[size]);
};

const Example3 = () => {
  return (
    <div className="space-x-2">
      <button className={createButtonStyles("primary", "sm")}>
        Small Primary
      </button>
      <button className={createButtonStyles("secondary", "md")}>
        Medium Secondary
      </button>
      <button className={createButtonStyles("primary", "lg")}>
        Large Primary
      </button>
    </div>
  );
};

// 4. Tailwind CSS Variants (styled-components風)
const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <button
      className={clsx(
        // 基本スタイル
        "font-medium rounded-md focus:outline-none focus:ring-2 transition-colors duration-200",

        // バリアント
        {
          "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500":
            variant === "primary",
          "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500":
            variant === "secondary",
          "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500":
            variant === "danger",
        },

        // サイズ
        {
          "px-2 py-1 text-sm": size === "sm",
          "px-4 py-2": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },

        // 無効化
        disabled && "opacity-50 cursor-not-allowed",

        // カスタムクラス
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Example1, Example2, Example3, Button };
