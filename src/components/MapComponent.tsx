"use client";

import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { useState, useEffect, useRef } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
  border: "2px solid #10b981",
  borderRadius: "8px",
};

const defaultCenter = {
  lat: 35.6895,
  lng: 139.6917, // 東京駅の緯度経度
};

interface MapComponentProps {
  directionsResponse: google.maps.DirectionsResult | null;
  selectedPlace?: { lat: number; lng: number; name: string } | null;
  onMapClick?: (location: { lat: number; lng: number }) => void;
}

export default function MapComponent({ directionsResponse, selectedPlace, onMapClick }: MapComponentProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // 選択された場所が変更されたときに地図の中心を移動
  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      const newCenter = { lat: selectedPlace.lat, lng: selectedPlace.lng };
      setMapCenter(newCenter);
      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(15);
    }
  }, [selectedPlace]);

  // APIキーの確認
  if (!apiKey) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8">
        <main className="flex flex-col gap-4 row-start-2 items-center">
          <div className="text-red-500 p-4 border border-red-300 rounded">
            エラー: Google Maps API キーが設定されていません。
            <br />
            .env.local ファイルに NEXT_PUBLIC_GOOGLE_MAPS_API_KEY を設定してください。
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          center={mapCenter}
          zoom={10}
          onLoad={(map) => {
            console.log("マップがロードされました:", map);
            mapRef.current = map;
          }}
          onClick={(event) => {
            if (event.latLng && onMapClick) {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();
              onMapClick({ lat, lng });
            }
          }}
        >
          {/* 選択された場所にマーカーを表示 */}
          {selectedPlace && (
            <Marker
              position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
              title={selectedPlace.name}
            />
          )}
          
          {/* ルートを表示 */}
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                polylineOptions: {
                  strokeColor: "#059669",
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                },
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
