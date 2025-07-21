import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAuth } from "@/lib/auth";

// お気に入り場所を取得
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const places = await prisma.favoritePlace.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ places });
  } catch (error) {
    console.error("お気に入り場所取得エラー:", error);
    return NextResponse.json(
      { error: "お気に入り場所の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// お気に入り場所を保存
export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const { name, address, latitude, longitude } = await request.json();

    if (!name || !address || !latitude || !longitude) {
      return NextResponse.json(
        { error: "必要な情報が不足しています" },
        { status: 400 }
      );
    }

    const place = await prisma.favoritePlace.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        userId: user.userId,
      },
    });

    return NextResponse.json({ place }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "認証が必要です") {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    console.error("お気に入り場所保存エラー:", error);
    return NextResponse.json(
      { error: "お気に入り場所の保存に失敗しました" },
      { status: 500 }
    );
  }
}

// お気に入り場所を削除
export async function DELETE(request: NextRequest) {
  try {
    const user = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("id");

    if (!placeId) {
      return NextResponse.json({ error: "場所IDが必要です" }, { status: 400 });
    }

    // ユーザーが所有する場所のみ削除可能
    const place = await prisma.favoritePlace.findFirst({
      where: {
        id: parseInt(placeId),
        userId: user.userId,
      },
    });

    if (!place) {
      return NextResponse.json(
        { error: "場所が見つかりません" },
        { status: 404 }
      );
    }

    await prisma.favoritePlace.delete({
      where: {
        id: parseInt(placeId),
      },
    });

    return NextResponse.json({ message: "削除しました" });
  } catch (error) {
    if (error instanceof Error && error.message === "認証が必要です") {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    console.error("お気に入り場所削除エラー:", error);
    return NextResponse.json(
      { error: "お気に入り場所の削除に失敗しました" },
      { status: 500 }
    );
  }
}
