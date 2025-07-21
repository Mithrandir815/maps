# 🔒 セキュリティガイド

## 🚨 重要な注意事項

このプロジェクトには機密情報が含まれているため、以下のセキュリティガイドラインに従ってください。

## 📁 プライベートファイル

以下のファイルは**絶対にGitにコミットしないでください**：

### 🔐 環境変数ファイル
- `.env.local`
- `.env.development.local` 
- `.env.test.local`
- `.env.production.local`
- `.env` (すべての .env ファイル)

### 🗄️ データベース関連
- `/prisma/migrations/` (マイグレーションファイル)
- `*.db`, `*.sqlite`, `*.sqlite3` (データベースファイル)
- データベースのバックアップファイル

### 🔑 APIキーとクレデンシャル
- Google Maps API キー
- JWTシークレット
- データベース接続情報
- サービスアカウントキー

## 🛡️ セットアップ手順

### 1. 環境変数の設定
```bash
# .env.example をコピーして設定
cp .env.example .env.local

# .env.local を編集して実際の値を設定
```

### 2. 必要なAPI キーの取得

#### Google Maps API
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクト作成または既存プロジェクト選択
3. Maps JavaScript API を有効化
4. APIキーを作成
5. `.env.local` の `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` に設定

#### JWTシークレット
```bash
# 安全なランダム文字列を生成
openssl rand -base64 32
```

### 3. データベースの設定
```bash
# MySQL の起動
brew services start mysql

# データベースの作成
mysql -u root -p
CREATE DATABASE maps_db;

# Prisma マイグレーション実行
npx prisma migrate dev
```

## 🚫 GitHub Copilot 除外設定

`.copilotignore` ファイルにより、以下のファイルはCopilotの学習対象から除外されます：

- 環境変数ファイル
- データベース設定
- 認証関連ファイル
- APIキー
- プライベートドキュメント

## ✅ Gitの安全な使用

### コミット前のチェックリスト
- [ ] `.env*` ファイルが含まれていないか確認
- [ ] APIキーが含まれていないか確認
- [ ] データベースファイルが含まれていないか確認
- [ ] 個人情報が含まれていないか確認

### 安全なコミットコマンド
```bash
# 変更ファイルの確認
git status

# 特定ファイルのみ追加（全追加は避ける）
git add src/components/
git add src/app/
git add package.json

# .env ファイルが含まれていないことを再確認
git status

# コミット
git commit -m "機能: 緑テーマのUI実装"

# プッシュ
git push origin main
```

## 🚨 万が一の対処法

### 機密情報をコミットしてしまった場合
```bash
# 直前のコミットから削除
git reset --soft HEAD~1
git reset HEAD .env.local
git commit -m "機密情報を除外してコミット"

# 既にプッシュしてしまった場合
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .env.local' \
--prune-empty --tag-name-filter cat -- --all

# 強制プッシュ（注意：チーム開発では避ける）
git push origin --force --all
```

## 📞 サポート

セキュリティに関する質問や問題がある場合は、プロジェクト管理者に連絡してください。

---

**重要**: このガイドラインを必ず守り、機密情報の漏洩を防いでください。🔒
