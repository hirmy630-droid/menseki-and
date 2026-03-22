# Android用アップロード一式

このフォルダをそのまま GitHub リポジトリのルートに置けば、Android の Chrome から「ホーム画面に追加」で全画面起動できる構成です。

## 含まれるファイル
- `index.html` : 元アプリに PWA 設定を追加した本体
- `manifest.webmanifest` : Android ショートカット用設定
- `sw.js` : オフラインキャッシュ用 Service Worker
- `icon-192.png` / `icon-512.png` : 通常アイコン
- `icon-maskable-192.png` / `icon-maskable-512.png` : Android 向け maskable アイコン

## GitHub Pages 公開手順
1. GitHub で新しいリポジトリを作成
2. このフォルダ内のファイルを全部アップロード
3. `Settings` → `Pages`
4. `Build and deployment` を `Deploy from a branch`
5. Branch は `main`、Folder は `/ (root)` を選択して保存
6. 公開 URL が出たら Android の Chrome で開く
7. Chrome メニュー → `ホーム画面に追加`
8. 追加後はホーム画面アイコンから起動する

## 重要
- GitHub にアップしただけでは Android 全画面にはなりません。**GitHub Pages で HTTPS 公開**が必須です。
- Android で全画面表示になるのは、**Chrome から「ホーム画面に追加」した起動**です。通常のブラウザタブ起動では上部バーが残ります。
- 最初の一回はオンラインで開いて Service Worker を登録してください。
- Tailwind CDN を使っているため、完全オフライン保証まではしていません。オフラインを本気で安定させるなら CSS をローカル化する書き換えが必要です。
