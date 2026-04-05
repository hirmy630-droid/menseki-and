【iPhone専用アップロード一式】
このZIPの中身を、GitHub Pages の公開フォルダにそのまま上書きアップロードしてください。
今回は最新の「面積計算.html」をベースに、iPhoneホーム画面用のPWA構成を追記した版です。

【入っているもの】
- index.html
- manifest.json
- manifest.webmanifest（互換用）
- sw.js
- apple-touch-icon.png
- apple-touch-icon-180-20260405-iphone3.png

【今回の変更】
1. 最新の「面積計算.html」の内容を index.html に反映
2. iPhone向け meta / apple-touch-icon / manifest 参照を追記
3. Service Worker 登録処理を追記
4. iPhone専用の manifest.json / manifest.webmanifest を更新
5. sw.js のキャッシュ名を更新して、古い版が残りにくい状態に変更

【重要】
- GitHub には ZIPの中身を全部同じ階層へ上書きしてください。
- iPhone はホーム画面アイコンとWebアプリ表示を強くキャッシュします。
  反映が遅い場合は、ホーム画面のアプリを一度削除して、Safari から再度「ホーム画面に追加」してください。
- この HTML は https://cdn.tailwindcss.com を使っています。
  初回オンライン読み込み後は Service Worker がキャッシュしますが、完全オフライン前提の安定性はローカル同梱版より弱いです。
