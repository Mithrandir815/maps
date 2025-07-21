# Maps App with Prisma & MySQL

Google Maps API を使用したルート検索アプリケーションです。Prisma と MySQL を使用してデータを永続化します。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. MySQL データベースの準備

MySQL サーバーが起動していることを確認し、データベースを作成してください：

```sql
CREATE DATABASE maps_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 環境変数の設定

`.env.local` ファイルで以下の環境変数を設定してください：

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Database
DATABASE_URL="mysql://username:password@localhost:3306/maps_db"
```

**DATABASE_URL の形式:**

- `username`: MySQL のユーザー名
- `password`: MySQL のパスワード
- `localhost:3306`: MySQL サーバーのホストとポート
- `maps_db`: データベース名

### 4. データベースのマイグレーション

```bash
# データベーススキーマをプッシュ
npm run db:push

# または、マイグレーションファイルを作成して実行
npm run db:migrate
```

### 5. Prisma クライアントの生成

```bash
npm run db:generate
```

## 開発サーバーの起動

```bash
npm run dev
```

## Prisma コマンド

```bash
# Prisma クライアントを生成
npm run db:generate

# データベースにスキーマをプッシュ
npm run db:push

# マイグレーションを作成・実行
npm run db:migrate

# Prisma Studio でデータベースを管理
npm run db:studio
```

## 機能

### 🗺️ ルート検索

- 出発地と目的地を入力してルート検索
- Google Maps 上にルートを表示
- 検索履歴の自動保存

### 📊 データベース機能

- **ルート検索履歴**: 過去の検索結果を保存
- **お気に入り場所**: よく使う場所を保存

### 🔧 API エンドポイント

#### ルート履歴

- `GET /api/routes` - ルート検索履歴を取得
- `POST /api/routes` - ルート検索履歴を保存

#### お気に入り場所

- `GET /api/favorites` - お気に入り場所を取得
- `POST /api/favorites` - お気に入り場所を保存

## データベーススキーマ

### RouteHistory (ルート検索履歴)

- `id`: 主キー
- `origin`: 出発地
- `destination`: 目的地
- `distance`: 距離
- `duration`: 所要時間
- `createdAt`: 作成日時
- `updatedAt`: 更新日時

### FavoritePlace (お気に入り場所)

- `id`: 主キー
- `name`: 場所名
- `address`: 住所
- `latitude`: 緯度
- `longitude`: 経度
- `userId`: ユーザー ID (オプション)
- `createdAt`: 作成日時
- `updatedAt`: 更新日時

## トラブルシューティング

### データベース接続エラー

1. MySQL サーバーが起動していることを確認
2. `.env.local`の`DATABASE_URL`が正しいことを確認
3. データベースが存在することを確認

### Google Maps が表示されない

1. `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`が設定されていることを確認
2. Google Cloud Platform で Maps JavaScript API が有効になっていることを確認
