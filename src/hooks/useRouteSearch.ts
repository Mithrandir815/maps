import { useState, useCallback } from "react";

interface UseRouteSearchReturn {
  directionsResponse: google.maps.DirectionsResult | null;
  isSearching: boolean;
  searchError: string | null;
  searchRoute: (origin: string, destination: string) => void;
  clearRoute: () => void;
}

export function useRouteSearch(): UseRouteSearchReturn {
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // ルート検索を実行する関数
  const searchRoute = useCallback((origin: string, destination: string) => {
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
          
          // ルート情報をデータベースに保存（ログイン済みの場合）
          saveRouteToDatabase(origin, destination, result);
        } else {
          setSearchError(`ルート検索エラー: ${status}`);
          console.error("ルート検索エラー:", status, result);
        }
      }
    );
  }, []);

  // ルートをクリアする関数
  const clearRoute = useCallback(() => {
    setDirectionsResponse(null);
    setSearchError(null);
  }, []);

  // ルート履歴をデータベースに保存する関数
  const saveRouteToDatabase = async (
    origin: string,
    destination: string,
    result: google.maps.DirectionsResult
  ) => {
    try {
      const route = result.routes[0];
      const leg = route.legs[0];
      
      await fetch('/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin,
          destination,
          distance: leg.distance?.text || '',
          duration: leg.duration?.text || '',
        }),
      });
    } catch (error) {
      console.error('ルート履歴の保存エラー:', error);
      // エラーが発生してもルート検索は続行
    }
  };

  return {
    directionsResponse,
    isSearching,
    searchError,
    searchRoute,
    clearRoute,
  };
}
