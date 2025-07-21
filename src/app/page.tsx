"use client";

import { useState } from "react";
import Header from "@/components/Header";
import RouteSearchForm from "@/components/RouteSearchForm";
import MapComponent from "@/components/MapComponent";
import AuthForm from "@/components/AuthForm";
import FavoritePlaces from "@/components/FavoritePlaces";
import AddPlaceModal from "@/components/AddPlaceModal";
import { useRouteSearch } from "@/hooks/useRouteSearch";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [addPlaceLocation, setAddPlaceLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { user } = useAuth();
  
  const {
    directionsResponse,
    isSearching,
    searchError,
    searchRoute,
    clearRoute,
  } = useRouteSearch();

  const handleSelectPlace = (place: { name: string; lat: number; lng: number }) => {
    setSelectedPlace({
      lat: place.lat,
      lng: place.lng,
      name: place.name,
    });
  };

  const handleMapClick = (location: { lat: number; lng: number }) => {
    if (user) {
      setAddPlaceLocation(location);
    }
  };

  const handleSavePlace = async (place: { name: string; address: string; latitude: number; longitude: number }) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(place),
      });

      if (response.ok) {
        // お気に入り場所が保存されたら、リフレッシュトリガーを更新
        setRefreshTrigger(prev => prev + 1);
      } else {
        alert('お気に入り場所の保存に失敗しました');
      }
    } catch (error) {
      console.error('お気に入り場所の保存エラー:', error);
      alert('エラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-7xl">
          {/* ヘッダー部分 */}
          <Header onShowAuth={() => setShowAuthForm(true)} />

          <div className="flex flex-col xl:flex-row gap-8 w-full">
            <div className="flex flex-col gap-6 flex-1">
              {/* ルート検索フォーム */}
              <RouteSearchForm
                onSearch={searchRoute}
                isSearching={isSearching}
                searchError={searchError}
                onClear={clearRoute}
              />

              {/* お気に入り場所 */}
              <FavoritePlaces 
                onSelectPlace={handleSelectPlace}
                refreshTrigger={refreshTrigger}
              />
              
              {/* 地図操作の説明 */}
              {user && (
                <div className="text-sm text-green-700 p-3 bg-green-100 rounded-lg border border-green-200">
                  💡 地図をクリックしてお気に入り場所を追加できます
                </div>
              )}
            </div>

            {/* Google Map */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-xl p-4 border border-green-200">
                <h2 className="text-lg font-semibold mb-4 text-green-800">🗺️ マップ</h2>
                <MapComponent 
                  directionsResponse={directionsResponse} 
                  selectedPlace={selectedPlace}
                  onMapClick={handleMapClick}
                />
              </div>
            </div>
          </div>
        </main>
        
        {/* 認証フォームモーダル */}
        {showAuthForm && (
          <AuthForm onClose={() => setShowAuthForm(false)} />
        )}
        
        {/* 場所追加モーダル */}
        {addPlaceLocation && (
          <AddPlaceModal
            location={addPlaceLocation}
            onSave={handleSavePlace}
            onClose={() => setAddPlaceLocation(null)}
          />
        )}
      </div>
    </div>
  );
}
