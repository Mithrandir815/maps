// UIスタイルの定数を定義 - 緑テーマ
export const styles = {
  // ボタンスタイル
  button: {
    base: "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    primary:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md hover:shadow-lg",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-md hover:shadow-lg",
  },

  // 入力フィールドスタイル
  input: {
    base: "w-full px-3 py-2 border rounded-md transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500",
    normal:
      "border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white",
    error:
      "border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:bg-white",
  },

  // レイアウトスタイル
  container: {
    modal:
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
    card: "bg-white rounded-lg shadow-xl border border-gray-200",
    form: "space-y-4",
    gradient: "bg-gradient-to-br from-green-50 to-emerald-100",
  },

  // テキストスタイル
  text: {
    title: "text-3xl font-bold text-green-800 drop-shadow-sm",
    subtitle: "text-xl font-semibold text-green-700",
    heading: "text-lg font-semibold text-gray-800",
    label: "block text-sm font-medium text-gray-700 mb-1",
    error: "text-red-600 text-sm p-2 bg-red-50 border border-red-200 rounded",
    link: "text-green-600 hover:text-green-800 text-sm transition-colors duration-200 underline",
    muted: "text-gray-600 text-sm",
    accent: "text-green-600 font-medium",
  },
} as const;
