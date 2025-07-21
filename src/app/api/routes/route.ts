import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ルート検索履歴を取得
export async function GET() {
  try {
    const routes = await prisma.routeHistory.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // 最新10件を取得
    });

    return NextResponse.json({ routes });
  } catch (error) {
    console.error("ルート履歴取得エラー:", error);
    return NextResponse.json(
      { error: "ルート履歴の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// ルート検索履歴を保存
export async function POST(request: NextRequest) {
  try {
    const { origin, destination, distance, duration } = await request.json();

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "出発地と目的地は必須です" },
        { status: 400 }
      );
    }

    const route = await prisma.routeHistory.create({
      data: {
        origin,
        destination,
        distance,
        duration,
      },
    });

    return NextResponse.json({ route }, { status: 201 });
  } catch (error) {
    console.error("ルート履歴保存エラー:", error);
    return NextResponse.json(
      { error: "ルート履歴の保存に失敗しました" },
      { status: 500 }
    );
  }
}
