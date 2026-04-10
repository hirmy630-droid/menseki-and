このZIPには以下が入っています。
- index.html（タッチずれ対策 + 5.4インチ縦画面の作図更新はみ出し対策版）
- manifest.json
- sw.js
- icon-180.png
- icon-192.png
- icon-512.png

今回の修正
- 作図更新ボタン押下後の自動フィットを修正
- 高解像度iPhoneでの内部解像度基準の拡大しすぎを修正
- 小型iPhone縦画面で上下余白を増やして、表示がはみ出しにくいように調整
- キャッシュ更新用に manifest / sw.js の版も更新

更新手順
1. GitHub Pages にこのZIPの中身を上書き
2. iPhoneの古いホーム画面アイコンを削除
3. Safariでページを開き直す
4. ホーム画面に再追加
