import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as municipality from "./municipality";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Container from "@mui/material/Container";

export default function Main() {
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
      <Typography variant="h1" align="center">
        M県S市
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {"都道府県・市区町村データ: "}
        <a href="https://www.post.japanpost.jp/zipcode/dl/roman-zip.html">
          日本郵便 KEN_ALL_ROME.CSV (2023年6月現在版)
        </a>
      </Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", m: 2 }}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="select-prefecture-initial-label">
              都道府県
            </InputLabel>
            <Select
              labelId="select-prefecture-initial-label"
              id="select-prefecture-initial"
              value={prefectureInitial}
              label="都道府県"
              onChange={handlePrefectureInitialChange}
            >
              {Array.from(municipality.getPrefectureInitials()).map(
                (initial: string, index: number) => (
                  <MenuItem key={index} value={initial}>
                    {initial}
                  </MenuItem>
                ),
              )}
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
              {Array.from(
                municipality.getMunicipalityInitials(prefectureInitial),
              ).map((initial: string, index: number) => (
                <MenuItem key={index} value={initial}>
                  {initial}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {(!prefectureInitial || !municipalityInitial) && (
          <Typography component="div" sx={{ marginTop: 2 }}>
            都道府県と市区町村を選択してください
          </Typography>
        )}
        {prefectureInitial && municipalityInitial && (
          <>
            <Typography component="div" sx={{ marginTop: 2 }}>
              検索結果
            </Typography>
            <List>
              {Array.from(
                municipality.getMunicipalitiesByInitial(
                  prefectureInitial,
                  municipalityInitial,
                ),
              ).map(
                (municipality: municipality.Municipality, index: number) => (
                  <ListItem key={index}>
                    {municipality.prefecture.name +
                      municipality.prefecture.suffix +
                      " " +
                      municipality.municipality.name +
                      municipality.municipality.suffix +
                      " (" +
                      municipality.prefecture?.rome +
                      " " +
                      municipality.prefecture?.rome_suffix +
                      " " +
                      municipality.municipality?.rome +
                      " " +
                      municipality.municipality?.rome_suffix +
                      ")"}
                  </ListItem>
                ),
              )}
            </List>
          </>
        )}
      </Box>
      <Container maxWidth="sm" component="footer" sx={{ mt: 6 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {"© 2024 "}
          {
            <a
              href="https://github.com/yutotnh"
              target="_blank"
              rel="noopener noreferrer"
            >
              yutotnh
            </a>
          }
          {" | "}
          {
            <a href="https://github.com/yutotnh/m-ken-s-shi">
              ソースコード(GitHub)
            </a>
          }
        </Typography>
      </Container>
    </>
  );
}
