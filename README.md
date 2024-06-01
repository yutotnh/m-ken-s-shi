# M県S市

都道府県と市区町村のアルファベットを入力して、都道府県と市区町村の名前を出力するWebページのソースコードです。

市町村の情報は2023年6月現在のものです。

## 市区町村のJSONデータ(municipalities.json)の作成方法

以下のコマンドを実行してください。

2024年6月2日に生成できた方法です。

KEN_ALL_ROME.CSVは、[郵便番号データダウンロード/住所の郵便番号（ローマ字・zip形式）](https://www.post.japanpost.jp/zipcode/dl/roman-zip.html)からダウンロードしてください。

```bash
cd src/assets
wget https://www.post.japanpost.jp/zipcode/dl/roman/KEN_ALL_ROME.zip
unzip KEN_ALL_ROME.zip
./convert_ken_all_rome.sh KEN_ALL_ROME.CSV >municipalities.json
rm KEN_ALL_ROME.CSV KEN_ALL_ROME.zip
```
