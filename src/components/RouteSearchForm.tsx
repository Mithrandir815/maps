"use client";

import { useState } from "react";
import clsx from "clsx";
import { styles } from "@/styles/common";

interface RouteSearchFormProps {
  onSearch: (origin: string, destination: string) => void;
  isSearching: boolean;
  searchError: string | null;
  onClear: () => void;
}

export default function RouteSearchForm({
  onSearch,
  isSearching,
  searchError,
  onClear,
}: RouteSearchFormProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(origin, destination);
  };

  const handleClear = () => {
    setOrigin("");
    setDestination("");
    onClear();
  };

  return (
    <div
      className={clsx(
        styles.container.card,
        "w-full max-w-md p-6 border-green-200"
      )}
    >
      <h2 className={clsx(styles.text.heading, "mb-4")}>🚗 ルート検索</h2>

      <form onSubmit={handleSubmit} className={styles.container.form}>
        <div>
          <label className={styles.text.label}>出発地</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="例: 東京駅"
            className={clsx(styles.input.base, styles.input.normal)}
          />
        </div>

        <div>
          <label className={styles.text.label}>目的地</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="例: 新宿駅"
            className={clsx(styles.input.base, styles.input.normal)}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSearching || !origin || !destination}
            className={clsx(
              styles.button.base,
              styles.button.primary,
              "flex-1",
              (isSearching || !origin || !destination) && styles.button.disabled
            )}
          >
            {isSearching ? "検索中..." : "ルート検索"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            className={clsx(styles.button.base, styles.button.secondary)}
          >
            クリア
          </button>
        </div>

        {searchError && <div className={styles.text.error}>{searchError}</div>}
      </form>
    </div>
  );
}
