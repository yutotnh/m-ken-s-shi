import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as municipality from "./municipality";

export default function BasicSelect() {
  const [prefectureInitial, setPrefectureInitial] = React.useState("");
  const [municipalityInitial, setMunicipalityInitial] = React.useState("");

  const handleMunicipalityInitialChange = (event: SelectChangeEvent) => {
    setMunicipalityInitial(event.target.value as string);
  };

  const handlePrefectureInitialChange = (event: SelectChangeEvent) => {
    setPrefectureInitial(event.target.value as string);
    setMunicipalityInitial(""); // Reset municipality selection when prefecture changes
  };

  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="select-prefecture-initial-label">都道府県</InputLabel>
          <Select
            labelId="select-prefecture-initial-label"
            id="select-prefecture-initial"
            value={prefectureInitial}
            label="都道府県"
            onChange={handlePrefectureInitialChange}
          >
            {municipality.getPrefectureInitials().map((initial, index) => (
              <MenuItem key={index} value={initial}>
                {initial}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="select-municipality-initial-label">
            市区町村
          </InputLabel>
          <Select
            labelId="select-municipality-initial-label"
            id="select-municipality-initial"
            value={municipalityInitial}
            label="市区町村"
            onChange={handleMunicipalityInitialChange}
            disabled={!prefectureInitial} // Disable municipality selection until prefecture is selected
          >
            {municipality
              .getMunicipalityInitials(prefectureInitial)
              .map((initial, index) => (
                <MenuItem key={index} value={initial}>
                  {initial}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <p>検索結果</p>
      {municipality
        .getMunicipalitiesByInitial(prefectureInitial, municipalityInitial)
        .map((municipality, index) => (
          <div key={index}>
            {municipality.prefecture_name +
              municipality.prefecture_suffix +
              " " +
              municipality.municipality_name +
              municipality.municipality_suffix}
          </div>
        ))}{" "}
    </>
  );
}
