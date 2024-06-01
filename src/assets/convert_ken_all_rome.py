#!/usr/bin/env python3
# usage: python3 convert_ken_all_rome.py KEN_ALL_ROME.CSV > municipalities.json
# KEN_ALL_ROME.CSVは郵便番号データダウンロードサービスの[住所の郵便番号（ローマ字・zip形式）](https://www.post.japanpost.jp/zipcode/dl/roman-zip.html)からダウンロードしたファイル
import argparse
import csv
import sys
import os


def main():
    parser: argparse.ArgumentParser = argparse.ArgumentParser(
        description="Creation of JSON information from KEN_ALL_ROME.CSV to municipalities"
    )
    parser.add_argument(
        "file",
        type=str,
        help="KEN_ALL_ROME.CSV",
    )

    args = parser.parse_args()

    if os.path.exists(args.file):
        pass
    else:
        print("File not found: " + args.file, file=sys.stderr)

    # CSVから必要な列だけ抽出し、カンマ区切りのファイルに変換
    # 必要な列は以下の通り
    # 列番号は0から始まる
    # 列番号: 意味
    #      1: 都道府県名
    #      2: 郡市区町村名
    #      4: 都道府県名(ローマ字)
    #      5: 郡市区町村名(ローマ字)
    municipalities = []
    previous: dict = {
        "prefecture": "",
        "municipality": "",
        "prefecture_rome": "",
        "municipality_rome": "",
    }
    with open(args.file, "r", encoding="shift_jis") as f:
        csvreader = csv.reader(f)
        for row in csvreader:
            csv_data: dict = {
                "prefecture": row[1],
                "municipality": row[2],
                "prefecture_rome": row[4],
                "municipality_rome": row[5],
            }

            # データには町域名が含まれているが今回は市町村名のみを取得するため、市区町村が重複するデータは除外する
            # データは連続しているので、重複は前の行(前回登録した行)と比較することで判定できる
            if (
                (previous["prefecture"] == csv_data["prefecture"])
                and (previous["municipality"] == csv_data["municipality"])
                and (previous["prefecture_rome"] == csv_data["prefecture_rome"])
                and (previous["municipality_rome"] == csv_data["municipality_rome"])
            ):
                # 重複がある場合はスキップ
                continue

            # 前回登録した行を更新
            previous["prefecture"] = csv_data["prefecture"]
            previous["municipality"] = csv_data["municipality"]
            previous["prefecture_rome"] = csv_data["prefecture_rome"]
            previous["municipality_rome"] = csv_data["municipality_rome"]

            prefecture: dict = {
                "name": csv_data["prefecture"][0:-1],
                "suffix": csv_data["prefecture"][-1],
                "rome": csv_data["prefecture_rome"].split(" ")[0],
                "rome_suffix": csv_data["prefecture_rome"].split(" ")[-1],
            }

            # 北海道の場合は特別処理
            # 北海道のローマ字はHOKKAIDOだが、M県など表現するツールの仕様上HOKKAI DOとなる
            if prefecture["rome"] == "HOKKAIDO":
                prefecture["rome"] = "HOKKAI"
                prefecture["rome_suffix"] = "DO"

            municipality: dict = {
                "name": get_municipality(csv_data["municipality"])[0:-1],
                "suffix": get_municipality(csv_data["municipality"])[-1],
                "rome": get_municipality_rome(
                    csv_data["municipality"], csv_data["municipality_rome"]
                ).split(" ")[0],
                "rome_suffix": get_municipality_rome(
                    csv_data["municipality"], csv_data["municipality_rome"]
                ).split(" ")[-1],
            }

            ward: dict = {
                "name": "",
                "suffix": "",
                "rome": "",
                "rome_suffix": "",
            }

            district: dict = {
                "name": "",
                "suffix": "",
                "rome": "",
                "rome_suffix": "",
            }

            # 郡を取得
            if is_district(csv_data["municipality"]):
                district["name"] = get_district(csv_data["municipality"])[0:-1]
                district["suffix"] = "郡"
                district["rome"] = get_district_rome(
                    csv_data["municipality_rome"]
                ).split(" ")[0]
                district["rome_suffix"] = get_district_rome(
                    csv_data["municipality_rome"]
                ).split(" ")[-1]
            elif is_ward(csv_data["municipality"]):
                ward["name"] = get_ward(csv_data["municipality"])[0:-1]
                ward["suffix"] = "区"
                ward["rome"] = get_ward_rome(csv_data["municipality_rome"]).split(" ")[
                    0
                ]
                ward["rome_suffix"] = get_ward_rome(
                    csv_data["municipality_rome"]
                ).split(" ")[-1]
            elif is_island(csv_data["municipality"]):
                # 既にget_municipality()関数で島を除いた市町村名を取得しているため、何もしない
                pass
            else:
                # その他の場合は市町村名のみを取得しているため、何もしない
                pass

            municipalities.append(
                {
                    "prefecture": prefecture,
                    "district": district,
                    "municipality": municipality,
                    "ward": ward,
                }
            )

    # JSON出力
    print("{")
    print(""""municipalities": [""")
    for i, m in enumerate(municipalities):
        print(
            f"""        {{
            "prefecture": {{
                "name": "{m['prefecture']['name']}",
                "suffix": "{m['prefecture']['suffix']}",
                "rome": "{m['prefecture']['rome']}",
                "rome_suffix": "{m['prefecture']['rome_suffix']}"
            }},
            "district": {{
                "name": "{m['district']['name']}",
                "suffix": "{m['district']['suffix']}",
                "rome": "{m['district']['rome']}",
                "rome_suffix": "{m['district']['rome_suffix']}"
            }},
            "municipality": {{
                "name": "{m['municipality']['name']}",
                "suffix": "{m['municipality']['suffix']}",
                "rome": "{m['municipality']['rome']}",
                "rome_suffix": "{m['municipality']['rome_suffix']}"
            }},
            "ward": {{
                "name": "{m['ward']['name']}",
                "suffix": "{m['ward']['suffix']}",
                "rome": "{m['ward']['rome']}",
                "rome_suffix": "{m['ward']['rome_suffix']}"
            }}"""
        )

        # JSONの書式より、最後の要素の場合はカンマを付けない
        if i == len(municipalities) - 1:
            print("        }")
        else:
            print("        },")

    print("    ]")
    print("}")


def is_district(prefecture: str) -> bool:
    """
    与えられた郡市町村から、郡に該当するかどうかを判定する

    Parameters
    ----------
    prefecture : str
        郡市区町村名

    Returns
    -------
    bool
        郡に該当する場合はTrue、それ以外はFalse

    >>> is_district("八頭郡　智頭町")
    True
    >>> is_district("札幌市　中央区")
    False
    >>> is_district("大和郡山市")
    False
    """

    if "郡　" in prefecture:
        return True
    else:
        return False


def get_district(prefecture: str) -> str:
    """
    与えられた郡市区町村から、郡名を取得する

    Parameters
    ----------
    prefecture : str
        郡市区町村名

    Returns
    -------
    str
        郡名

    >>> get_district("八頭郡　智頭町")
    '八頭郡'
    >>> get_district("札幌市　中央区")
    ''
    >>> get_district("大和郡山市")
    ''
    """

    if "郡　" in prefecture:
        return prefecture.split("　")[0]
    else:
        return ""


def get_district_rome(prefecture_rome: str) -> str:
    """
    与えられた郡市区町村から、ローマ字読み郡名を取得する
    引数には必ず郡が含まれる郡市区町村名を渡すこと

    Parameters
    ----------
    prefecture_rome : str
        ローマ字の郡市区町村名

    Returns
    -------
    str
        郡名

    >>> get_district_rome("KAGA GUN KIBICHUO CHO")
    'KAGA GUN'
    """

    return prefecture_rome.split(" ")[0] + " " + prefecture_rome.split(" ")[1]


def is_ward(prefecture: str) -> bool:
    """
    与えられた郡市区町村から、行政区に該当するかどうかを判定する
    この区は、特別区(東京の区)を除く区を指す

    Parameters
    ----------
    prefecture : str
        郡市区町村名

    Returns
    -------
    bool
        市に該当する場合はTrue、それ以外はFalse

    >>> is_ward("神戸市　垂水区")
    True
    >>> is_ward("犬上郡　多賀町")
    False
    >>> is_ward("江戸川区")
    False
    """

    if "市　" in prefecture:
        return True
    else:
        return False


def get_ward(prefecture: str) -> str:
    """
    与えられた郡市区町村から、行政区名を取得する
    この区は、特別区(東京の区)を除く区を指す

    Parameters
    ----------
    prefecture : str
        郡市区町村名

    Returns
    -------
    str
        行政区名

    >>> get_ward("神戸市　垂水区")
    '垂水区'
    >>> get_ward("犬上郡　多賀町")
    ''
    >>> get_ward("江戸川区")
    ''
    """

    if "市　" in prefecture:
        return prefecture.split("　")[1]
    else:
        return ""


def get_ward_rome(prefecture_rome: str) -> str:
    """
    与えられた郡市区町村から、ローマ字読み行政区名を取得する
    引数には必ず行政区が含まれる郡市区町村名を渡すこと

    Parameters
    ----------
    prefecture_rome : str
        ローマ字の郡市区町村名

    Returns
    -------
    str
        行政区名

    >>> get_ward_rome("SENDAI SHI WAKABAYASHI KU")
    'WAKABAYASHI KU'
    """

    return prefecture_rome.split(" ")[2] + " " + prefecture_rome.split(" ")[3]


def is_island(prefecture) -> bool:
    """
    与えられた郡市町村から、島に該当するかどうかを判定する

    Parameters
    ----------
    prefecture : str
        郡市区町村名

    Returns
    -------
    bool
        島に該当する場合はTrue、それ以外はFalse

    >>> is_island("八丈島　八丈町")
    True
    >>> is_island("熊本市　東区")
    False
    >>> is_island("糸島市")
    False
    """

    if "島　" in prefecture:
        return True
    else:
        return False


def get_municipality(prefecture: str) -> str:
    """
    与えられた郡市区町村から、市町村名を取得する
    区は、行政区は含まず、特別区(東京の区)のことを指す

    Parameters
    ----------
    prefecture : str
        郡市区町村名

    Returns
    -------
    str
        市町村名

    >>> get_municipality("熊本市　東区")
    '熊本市'
    >>> get_municipality("飯石郡　飯南町")
    '飯南町'
    >>> get_municipality("三宅島　三宅村")
    '三宅村'
    >>> get_municipality("葛飾区")
    '葛飾区'
    >>> get_municipality("あきる野市")
    'あきる野市'
    """

    if "　" in prefecture:
        if "島　" in prefecture:
            return prefecture.split("　")[1]
        if "市　" in prefecture:
            return prefecture.split("　")[0]
        if "郡　" in prefecture:
            return prefecture.split("　")[1]

    return prefecture


def get_municipality_rome(prefecture, prefecture_rome: str) -> str:
    """
    与えられた郡市区町村から、ローマ字読み市町村名を取得する
    引数には必ず市町村が含まれる郡市区町村名を渡すこと

    Parameters
    ----------
    prefecture_rome : str
        ローマ字の郡市区町村名

    Returns
    -------
    str
        市町村名

    >>> get_municipality_rome("八丈島　八丈町","HACHIJOJIMA HACHIJO MACHI")
    'HACHIJO MACHI'
    >>> get_municipality_rome("仙台市　若林区","SENDAI SHI WAKABAYASHI KU")
    'SENDAI SHI'
    >>> get_municipality_rome("柴田郡　大河原町","SHIBATA GUN OGAWARA MACHI")
    'OGAWARA MACHI'
    >>> get_municipality_rome("多賀城市","TAGAJO SHI")
    'TAGAJO SHI'
    >>> get_municipality_rome("西八代郡　市川三郷町","NISHIYATSUSHIRO GUN ICHIKAWAMISATO")
    'ICHIKAWAMISATO CHO'
    """

    if "　" in prefecture:
        if "島　" in prefecture:
            return prefecture_rome.split(" ")[1] + " " + prefecture_rome.split(" ")[2]
        if "市　" in prefecture:
            return prefecture_rome.split(" ")[0] + " " + prefecture_rome.split(" ")[1]
        if "郡　" in prefecture:
            # 例外処理
            # KEN_ALL_ROME.CSVの下記制限により、「西八代郡　市川三郷町」の場合、ローマ字読みが「NISHIYATSUSHIRO GUN ICHIKAWAMISATO」になる
            # "全角となっている町域名および市区町村名部分の文字数が17文字を超える場合、また半角となっているローマ字部分の文字数が35文字を超える場合は、超えた部分の収録は行っておりません。"
            # Webサイト: https://www.post.japanpost.jp/zipcode/dl/readme_ro.html
            # この場合、郡名が「NISHIYATSUSHIRO GUN」、市町村名が「ICHIKAWAMISATO CHO」になる
            if prefecture_rome == "NISHIYATSUSHIRO GUN ICHIKAWAMISATO":
                prefecture_rome = "NISHIYATSUSHIRO GUN ICHIKAWAMISATO CHO"

            return prefecture_rome.split(" ")[2] + " " + prefecture_rome.split(" ")[3]

    return prefecture_rome


if __name__ == "__main__":
    import doctest

    # 滅多に動作させることがないので、実行時に先にテストを実行する
    doctest.testmod()

    main()
