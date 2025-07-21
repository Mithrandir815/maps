"use client";

import { useState } from "react";
import Header from "@/components/Header";
import RouteSearchForm from "@/components/RouteSearchForm";
import MapComponent from "@/components/MapComponent";
import AuthForm from "@/components/AuthForm";
import { useRouteSearch } from "@/hooks/useRouteSearch";

export default function Home() {
  const [showAuthForm, setShowAuthForm] = useState(false);

  const {
    directionsResponse,
    isSearching,
    searchError,
    searchRoute,
    clearRoute,
  } = useRouteSearch();

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* ヘッダー部分 */}
        <Header onShowAuth={() => setShowAuthForm(true)} />

        {/* ルート検索フォーム */}
        <RouteSearchForm
          onSearch={searchRoute}
          isSearching={isSearching}
          searchError={searchError}
          onClear={clearRoute}
        />

        {/* Google Map */}
        <MapComponent directionsResponse={directionsResponse} />
      </main>

      {/* 認証フォームモーダル */}
      {showAuthForm && <AuthForm onClose={() => setShowAuthForm(false)} />}
    </div>
  );
}
