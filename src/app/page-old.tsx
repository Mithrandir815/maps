"use client";

import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";

const containerStyle = {
  width: "600px", // 固定幅に変更
  height: "400px",
  border: "2px solid #ccc", // デバッグ用の境界線
};

const center = {
  lat: 35.6895,
  lng: 139.6917, // 東京駅の緯度経度
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const { user, logout } = useAuth();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // ルート検索を実行する関数
  const searchRoute = useCallback(() => {
    if (!origin || !destination) {
      setSearchError("出発地と目的地の両方を入力してください");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      },
      (result, status) => {
        setIsSearching(false);
        if (status === "OK" && result) {
          setDirectionsResponse(result);
          console.log("ルート検索成功:", result);
        } else {
          setSearchError(`ルート検索エラー: ${status}`);
          console.error("ルート検索エラー:", status, result);
        }
      }
    );
  }, [origin, destination]);

  // ルートをクリアする関数
  const clearRoute = useCallback(() => {
    setDirectionsResponse(null);
    setOrigin("");
    setDestination("");
    setSearchError(null);
  }, []);

  // APIキーの確認
  if (!apiKey) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8">
        <main className="flex flex-col gap-4 row-start-2 items-center">
          <div className="text-red-500 p-4 border border-red-300 rounded">
            エラー: Google Maps API キーが設定されていません。
            <br />
            .env.local ファイルに NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            を設定してください。
          </div>
        </main>
      </div>
    );
  }

  console.log("Google Maps API Key:", apiKey ? "設定済み" : "未設定");

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* ヘッダー部分 */}
        <div className="w-full max-w-4xl flex justify-between items-center">
          <h1 className="text-2xl font-bold">Google Maps ルート検索</h1>

          {/* ユーザー認証エリア */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700">
                  こんにちは、{user.name || user.email}さん
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthForm(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ログイン / 登録
              </button>
            )}
          </div>
        </div>

        {/* ルート検索フォーム */}
        <div className="w-full max-w-md space-y-4 p-4 border border-gray-300 rounded-lg bg-white shadow-md">
          <h2 className="text-lg font-semibold">ルート検索</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出発地
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="例: 東京駅"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              目的地
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="例: 新宿駅"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={searchRoute}
              disabled={isSearching || !origin || !destination}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSearching ? "検索中..." : "ルート検索"}
            </button>

            <button
              onClick={clearRoute}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              クリア
            </button>
          </div>

          {searchError && (
            <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
              {searchError}
            </div>
          )}
        </div>

        {loadError && (
          <div className="text-red-500 p-4 border border-red-300 rounded">
            マップのロードエラー: {loadError}
          </div>
        )}

        {!isLoaded && !loadError && (
          <div className="text-blue-500 p-4">Google Maps を読み込み中...</div>
        )}

        <LoadScript
          googleMapsApiKey={apiKey}
          onLoad={() => {
            console.log("Google Maps スクリプトがロードされました");
            setIsLoaded(true);
          }}
          onError={(error) => {
            console.error("Google Maps ロードエラー:", error);
            setLoadError("Google Maps の読み込みに失敗しました");
          }}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={(map) => {
              console.log("マップがロードされました:", map);
            }}
          >
            {/* ルートを表示 */}
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  polylineOptions: {
                    strokeColor: "#FF0000",
                    strokeWeight: 5,
                    strokeOpacity: 0.8,
                  },
                }}
              />
            )}
          </GoogleMap>
        </LoadScript>
      </main>

      {/* 認証フォームモーダル */}
      {showAuthForm && <AuthForm onClose={() => setShowAuthForm(false)} />}
    </div>
  );
}
