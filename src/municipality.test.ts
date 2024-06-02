import * as municipalities from "./municipality";
import { expect, it } from "vitest";

it("getPrefectureInitials", () => {
  const initials = municipalities.getPrefectureInitials();
  expect(initials).toEqual(
    new Set([
      "A",
      "C",
      "E",
      "F",
      "G",
      "H",
      "I",
      "K",
      "M",
      "N",
      "O",
      "S",
      "T",
      "W",
      "Y",
    ]),
  );
});

it("getMunicipalityInitials", () => {
  // 和歌山県
  const wInitials = municipalities.getMunicipalityInitials("W");
  expect(wInitials).toEqual(
    new Set(["A", "G", "H", "I", "K", "M", "N", "S", "T", "W", "Y"]),
  );

  // 福島県・福井県・福岡県
  const fInitials = municipalities.getMunicipalityInitials("F");
  expect(fInitials).toEqual(
    new Set([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "H",
      "I",
      "K",
      "M",
      "N",
      "O",
      "S",
      "T",
      "U",
      "W",
      "Y",
    ]),
  );

  // 東京都・鳥取県・富山県・徳島県・栃木県
  const tInitials = municipalities.getMunicipalityInitials("T");
  expect(tInitials).toEqual(
    new Set([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "H",
      "I",
      "K",
      "M",
      "N",
      "O",
      "S",
      "T",
      "U",
      "W",
      "Y",
    ]),
  );

  // 小文字の場合に検索結果が変わらないことを確認
  const lowerInitials = municipalities.getMunicipalityInitials("w");
  expect(lowerInitials).toEqual(wInitials);

  // 複数文字の場合に先頭の文字が使用されることを確認
  const multiInitials = municipalities.getMunicipalityInitials("Wakayama");
  expect(multiInitials).toEqual(wInitials);
});

it("getMunicipalitiesByInitial", () => {
  const hCInitials = municipalities.getMunicipalitiesByInitial("H", "C");
  expect(hCInitials).toEqual(
    new Set([
      {
        prefecture: {
          name: "北海",
          suffix: "道",
          rome: "Hokkai",
          rome_suffix: "Do",
        },
        municipality: {
          name: "千歳",
          suffix: "市",
          rome: "Chitose",
          rome_suffix: "Shi",
        },
      },
      {
        prefecture: {
          name: "北海",
          suffix: "道",
          rome: "Hokkai",
          rome_suffix: "Do",
        },
        municipality: {
          name: "秩父別",
          suffix: "町",
          rome: "Chippubetsu",
          rome_suffix: "Cho",
        },
      },
    ]),
  );

  const tBInitial = municipalities.getMunicipalitiesByInitial("T", "B");
  expect(tBInitial).toEqual(
    new Set([
      {
        prefecture: {
          name: "東京",
          suffix: "都",
          rome: "Tokyo",
          rome_suffix: "To",
        },
        municipality: {
          name: "文京",
          suffix: "区",
          rome: "Bunkyo",
          rome_suffix: "Ku",
        },
      },
    ]),
  );

  // 以下の条件で同時に検索
  // - 都道府県、市区町村の頭文字が大文字
  // - 都道府県、市区町村の文字列が複数文字
  // - 返ってくる結果が複数の県にまたがる
  const lowerInitials = municipalities.getMunicipalitiesByInitial(
    "none",
    "gigant",
  );
  expect(lowerInitials).toEqual(
    new Set([
      {
        prefecture: {
          name: "新潟",
          suffix: "県",
          rome: "Niigata",
          rome_suffix: "Ken",
        },
        municipality: {
          name: "五泉",
          suffix: "市",
          rome: "Gosen",
          rome_suffix: "Shi",
        },
      },
      {
        prefecture: {
          name: "奈良",
          suffix: "県",
          rome: "Nara",
          rome_suffix: "Ken",
        },
        municipality: {
          name: "五條",
          suffix: "市",
          rome: "Gojo",
          rome_suffix: "Shi",
        },
      },
      {
        prefecture: {
          name: "奈良",
          suffix: "県",
          rome: "Nara",
          rome_suffix: "Ken",
        },
        municipality: {
          name: "御所",
          suffix: "市",
          rome: "Gose",
          rome_suffix: "Shi",
        },
      },
      {
        prefecture: {
          name: "長崎",
          suffix: "県",
          rome: "Nagasaki",
          rome_suffix: "Ken",
        },
        municipality: {
          name: "五島",
          suffix: "市",
          rome: "Goto",
          rome_suffix: "Shi",
        },
      },
    ]),
  );
});
