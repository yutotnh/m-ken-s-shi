import municipalities from "./assets/municipalities.json";

/**
 * 都道府県のソートされた頭文字のセット(大文字)を取得する
 *
 * @remarks 都道府県の頭文字はよっぽどのことがない限り変わらないため、以下のセットを返す
 * - A, C, E, F, G, H, I, K, M, N, O, S, T, W, Y
 *
 * @returns Set<string> - 都道府県の頭文字のセット(大文字)
 */
export function getPrefectureInitials() {
  const initials: Set<string> = new Set([
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
  ]);

  return initials;
}

/**
 * 都道府県の頭文字からソートされた市区町村の頭文字のセット(大文字)を取得する
 *
 * @remarks 引数のprefectureInitialは大文字・小文字は区別せず、複数文字の場合は先頭の文字を使用する
 *
 * @param prefectureInitial - 都道府県の頭文字
 * @returns 市区町村の頭文字のセット(大文字)
 */
export function getMunicipalityInitials(prefectureInitial: string) {
  const initials: Set<string> = new Set();

  // prefectureInitialが複数文字の場合は先頭の文字を使用する
  prefectureInitial = prefectureInitial.slice(0, 1);

  for (const municipality of municipalities.municipalities) {
    if (
      municipality.prefecture.rome.slice(0, 1).toUpperCase() ===
      prefectureInitial.toUpperCase()
    ) {
      initials.add(municipality.municipality.rome.slice(0, 1).toUpperCase());
    }
  }

  const sortedInitials = new Set(Array.from(initials).sort());

  return sortedInitials;
}

export interface Municipality {
  prefecture: {
    name: string;
    suffix: string;
    rome: string;
    rome_suffix: string;
  };
  municipality: {
    name: string;
    suffix: string;
    rome: string;
    rome_suffix: string;
  };
}

/**
 * 都道府県の頭文字と市区町村の頭文字に一致する市区町村の情報を取得する
 *
 * @remarks 引数のprefectureInitialとmunicipalityInitialは大文字・小文字は区別せず、複数文字の場合は先頭の文字を使用する
 *
 * @param prefectureInitial 都道府県の頭文字
 * @param municipalityInitial 市区町村の頭文字
 * @returns 都道府県の頭文字と市区町村の頭文字に一致する市区町村の情報
 */
export function getMunicipalitiesByInitial(
  prefectureInitial: string,
  municipalityInitial: string,
) {
  const municipalitiesByInitial: Municipality[] = [];

  // prefectureInitialとmunicipalityInitialが複数文字の場合は先頭の文字を使用する
  prefectureInitial = prefectureInitial.slice(0, 1);
  municipalityInitial = municipalityInitial.slice(0, 1);

  for (const municipality of municipalities.municipalities) {
    if (
      municipality.prefecture.rome.slice(0, 1).toUpperCase() ===
        prefectureInitial.toUpperCase() &&
      municipality.municipality.rome.slice(0, 1).toUpperCase() ===
        municipalityInitial.toUpperCase()
    ) {
      const municipality_information = {
        prefecture: municipality.prefecture,
        municipality: municipality.municipality,
      };

      municipalitiesByInitial.push(municipality_information);
    }
  }

  const uniqueMunicipalitiesByInitial = new Set(
    municipalitiesByInitial.filter(
      (municipality, index, self) =>
        self.findIndex(
          (m) =>
            m.prefecture.rome === municipality.prefecture.rome &&
            m.municipality.rome === municipality.municipality.rome,
        ) === index,
    ),
  );

  return uniqueMunicipalitiesByInitial;
}
