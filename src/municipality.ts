import prefectures from "./assets/prefectures.json";
import municipalities from "./assets/municipalities.json";

export function getPrefectureInitials() {
  const initials: Set<string> = new Set();

  for (const prefecture of prefectures.prefectures) {
    initials.add(prefecture.rome.slice(0, 1));
  }

  const sortedInitials = Array.from(initials).sort();

  return sortedInitials;
}

export function getPrefecturesByInitial(initial: string) {
  const prefecturesByInitial: string[] = [];

  for (const prefecture of prefectures.prefectures) {
    if (prefecture.rome.slice(0, 1) === initial) {
      prefecturesByInitial.push(prefecture.name);
    }
  }

  return prefecturesByInitial;
}

export function getMunicipalityInitials(prefectureInitial: string) {
  const initials: Set<string> = new Set();

  for (const municipality of municipalities.municipalities) {
    if (
      municipality.prefecture.rome.slice(0, 1).toUpperCase() ===
      prefectureInitial.toUpperCase()
    ) {
      initials.add(municipality.municipality.rome.slice(0, 1).toUpperCase());
    }
  }

  const sortedInitials = Array.from(initials).sort();

  return sortedInitials;
}

export function getMunicipalitiesByInitial(
  prefectureInitial: string,
  municipalityInitial: string,
) {
  const municipalitiesByInitial = [];

  let previewPrefecture: {
    prefecture_name: string;
    municipality_name: string;
  } = {
    prefecture_name: "",
    municipality_name: "",
  };

  for (const municipality of municipalities.municipalities) {
    if (
      municipality.prefecture.rome.slice(0, 1).toUpperCase() ===
        prefectureInitial.toUpperCase() &&
      municipality.municipality.rome.slice(0, 1).toUpperCase() ===
        municipalityInitial.toUpperCase()
    ) {
      const municipality_infomation = {
        prefecture_name: municipality.prefecture.name,
        prefecture_suffix: municipality.prefecture.suffix,
        prefecture_rome: municipality.prefecture.rome,
        prefecture_rome_suffix: municipality.prefecture.rome_suffix,
        municipality_name: municipality.municipality.name,
        municipality_suffix: municipality.municipality.suffix,
        municipality_rome: municipality.municipality.rome,
        municipality_rome_suffix: municipality.municipality.rome_suffix,
      };

      if (
        municipality.prefecture.rome === previewPrefecture.prefecture_name &&
        municipality.municipality.rome === previewPrefecture.municipality_name
      ) {
        continue;
      } else {
        municipalitiesByInitial.push(municipality_infomation);
        previewPrefecture = {
          prefecture_name: municipality.prefecture.rome,
          municipality_name: municipality.municipality.rome,
        };
      }
    }
  }

  return municipalitiesByInitial;
}
