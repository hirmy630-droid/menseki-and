このZIPには以下が入っています。
- index.html（タッチずれ対策維持 + 作図更新後の縮小しすぎ修正版）
- manifest.json
- sw.js
- icon-180.png
- icon-192.png
- icon-512.png

今回の修正
- タッチ位置の処理は変更していません
- fitView() の余白設定だけを見直し
- 5.4インチ縦画面で小さくなりすぎた問題を修正
- キャッシュ更新のため manifest / sw.js の版を更新

更新手順
1. GitHub Pages にこのZIPの中身を上書き
2. iPhone の古いホーム画面アイコンを削除
3. Safari でページを開き直す
4. ホーム画面に再追加
