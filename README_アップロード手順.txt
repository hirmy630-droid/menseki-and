このZIPには以下が入っています。
- index.html（iPhoneホーム画面PWAのタッチずれ対策版）
- manifest.json
- sw.js

注意
- icon-180.png / icon-192.png / icon-512.png は今回の会話では受け取っていないため、このZIPには入っていません。
- 既存の同名アイコンをGitHub Pages上に残したまま、この3ファイルだけ上書きしてください。

安全な更新手順
1. GitHub Pages の既存 index.html / manifest.json / sw.js をこのZIPの中身で書き換え
2. 既存の icon-180.png / icon-192.png / icon-512.png は削除しない
3. iPhone側で古いホーム画面アイコンがある場合はいったん削除
4. Safariでページを開き直してからホーム画面に再追加
