"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import { styles } from "@/styles/common";

interface AuthFormProps {
  onClose: () => void;
}

export default function AuthForm({ onClose }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAuth();

  // スタイルヘルパー関数
  const getButtonStyle = (variant: "primary" | "secondary" = "primary") => {
    return clsx(
      styles.button.base,
      variant === "primary" ? styles.button.primary : styles.button.secondary,
      loading && styles.button.disabled
    );
  };

  const getInputStyle = (hasError: boolean = false) => {
    return clsx(
      styles.input.base,
      hasError ? styles.input.error : styles.input.normal
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let success = false;

      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          setError("メールアドレスまたはパスワードが正しくありません");
        }
      } else {
        if (!name.trim()) {
          setError("名前を入力してください");
          setLoading(false);
          return;
        }
        success = await register(email, password, name);
        if (!success) {
          setError(
            "登録に失敗しました。既に登録済みのメールアドレスかもしれません"
          );
        }
      }

      if (success) {
        onClose();
      }
    } catch (err) {
      console.error("認証エラー:", err);
      setError("エラーが発生しました。再度お試しください");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container.modal}>
      <div
        className={clsx(
          styles.container.card,
          "p-8 w-full max-w-md mx-4 border-green-200"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={clsx(styles.text.subtitle, "flex items-center gap-2")}>
            {isLogin ? "🔐 ログイン" : "👤 ユーザー登録"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl transition-colors duration-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.container.form}>
          {!isLogin && (
            <div>
              <label className={styles.text.label}>名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={getInputStyle()}
                placeholder="山田太郎"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className={styles.text.label}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={getInputStyle()}
              placeholder="example@example.com"
              required
            />
          </div>

          <div>
            <label className={styles.text.label}>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={getInputStyle()}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {error && <div className={styles.text.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={getButtonStyle("primary")}
          >
            {loading ? "処理中..." : isLogin ? "ログイン" : "アカウント作成"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setEmail("");
              setPassword("");
              setName("");
            }}
            className={styles.text.link}
          >
            {isLogin
              ? "アカウントをお持ちでない方はこちら"
              : "既にアカウントをお持ちの方はこちら"}
          </button>
        </div>
      </div>
    </div>
  );
}
