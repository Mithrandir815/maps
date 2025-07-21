"use client";

import { useState } from "react";
import clsx from "clsx";
import { styles } from "@/styles/common";

interface AddPlaceModalProps {
  location: { lat: number; lng: number };
  onSave: (place: { name: string; address: string; latitude: number; longitude: number }) => void;
  onClose: () => void;
}

export default function AddPlaceModal({ location, onSave, onClose }: AddPlaceModalProps) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    
    // 住所が空の場合は座標を使用
    const finalAddress = address.trim() || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
    
    await onSave({
      name: name.trim(),
      address: finalAddress,
      latitude: location.lat,
      longitude: location.lng,
    });
    
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={clsx(styles.container.card, "w-full max-w-md p-6 m-4 border-green-200")}>
        <h2 className={clsx(styles.text.subtitle, "mb-4")}>📍 お気に入り場所を追加</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={styles.text.label}>
              場所名 *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={clsx(styles.input.base, styles.input.normal)}
              placeholder="例: 自宅、会社、お気に入りのカフェ"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address" className={styles.text.label}>
              住所（オプション）
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={clsx(styles.input.base, styles.input.normal)}
              placeholder="住所を入力（空白の場合は座標を使用）"
            />
          </div>
          
          <div className={styles.text.muted}>
            <p>座標: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={clsx(styles.button.base, styles.button.secondary)}
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={clsx(styles.button.base, styles.button.primary)}
              disabled={isLoading || !name.trim()}
            >
              {isLoading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
