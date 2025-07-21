"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import { styles } from "@/styles/common";

interface FavoritePlace {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

interface FavoritePlacesProps {
  onSelectPlace: (place: { name: string; lat: number; lng: number }) => void;
  refreshTrigger?: number; // 外部からのリフレッシュトリガー
}

export default function FavoritePlaces({ onSelectPlace, refreshTrigger }: FavoritePlacesProps) {
  const [places, setPlaces] = useState<FavoritePlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavoritePlaces();
    }
  }, [user, refreshTrigger]);

  const fetchFavoritePlaces = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setPlaces(data.places);
      } else {
        setError('お気に入り場所の取得に失敗しました');
      }
    } catch (err) {
      console.error('お気に入り場所の取得エラー:', err);
      setError('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const deleteFavoritePlace = async (placeId: number) => {
    try {
      const response = await fetch(`/api/favorites?id=${placeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFavoritePlaces(); // 再取得
      } else {
        setError('お気に入り場所の削除に失敗しました');
      }
    } catch (err) {
      console.error('お気に入り場所の削除エラー:', err);
      setError('エラーが発生しました');
    }
  };

  if (!user) {
    return (
      <div className={clsx(styles.container.card, "w-full max-w-md p-6 border-green-200")}>
        <h3 className={clsx(styles.text.heading, "mb-2")}>⭐ お気に入り場所</h3>
        <p className={styles.text.muted}>
          お気に入り場所を保存するにはログインしてください
        </p>
      </div>
    );
  }

  return (
    <div className={clsx(styles.container.card, "w-full max-w-md p-6 border-green-200")}>
      <h3 className={clsx(styles.text.heading, "mb-4")}>⭐ お気に入り場所</h3>
      
      {error && (
        <div className={styles.text.error}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <span className={styles.text.muted}>読み込み中...</span>
        </div>
      ) : places.length === 0 ? (
        <p className={styles.text.muted}>
          まだお気に入り場所がありません
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {places.map((place) => (
            <div
              key={place.id}
              className="p-3 border border-green-200 rounded-md hover:bg-green-50 transition-colors bg-white shadow-sm"
            >
              <div 
                className="cursor-pointer"
                onClick={() => onSelectPlace({
                  name: place.name,
                  lat: place.latitude,
                  lng: place.longitude,
                })}
              >
                <div className="font-medium text-sm text-gray-800 flex items-center gap-1">
                  📍 {place.name}
                </div>
                <div className="text-xs text-gray-600">{place.address}</div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`「${place.name}」を削除しますか？`)) {
                      deleteFavoritePlace(place.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded px-2 py-1 text-xs transition-colors"
                >
                  🗑️ 削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
