"use client";

import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import { styles } from "@/styles/common";

interface HeaderProps {
  onShowAuth: () => void;
}

export default function Header({ onShowAuth }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-6xl flex justify-between items-center">
      <div className="flex items-center gap-3">
        <span className="text-4xl">🗺️</span>
        <h1 className={styles.text.title}>
          EcoMaps - ルート検索
        </h1>
      </div>
      
      {/* ユーザー認証エリア */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-green-800 font-medium flex items-center gap-1">
              👋 こんにちは、{user.name || user.email}さん
            </span>
            <button
              onClick={logout}
              className={clsx(
                styles.button.base,
                styles.button.secondary,
                "px-3 py-1 text-sm"
              )}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <button
            onClick={onShowAuth}
            className={clsx(styles.button.base, styles.button.primary)}
          >
            ログイン / 登録
          </button>
        )}
      </div>
    </div>
  );
}
