import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, Button, Stack, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useHistory, logTheme } from "context/HistoryContext";
import { themeCreation, themeList, themeRandom } from "backend/mythic/adventureCrafter";

const subfonctionsThemes = [
  { label: 'Création des thèmes', value: 'creation' },
  { label: 'Liste des thèmes', value: 'list' },
  { label: 'Sélectionner aléatoirement un thème', value: 'random' }
];

const themes = [
  { label: 'ACTION', id: 1 },
  { label: 'TENSION', id: 2 },
  { label: 'MYSTÈRE', id: 3 },
  { label: 'SOCIAL', id: 4 },
  { label: 'PERSONNEL', id: 5 }
];

export default function Theme(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [subfonctionsThemesSelected, setSubfonctionsThemesSelected] = useState(""); 
  const [creationThemesSelected, setCreationThemesSelected] = useState("");
  const [hiddenCreationTheme, setHiddenCreationTheme] = useState(true);
  const [manualCreationThemesSelected1, setManualCreationThemesSelected1] = useState("");
  const [manualCreationThemesSelected2, setManualCreationThemesSelected2] = useState("");
  const [manualCreationThemesSelected3, setManualCreationThemesSelected3] = useState("");
  const [manualCreationThemesSelected4, setManualCreationThemesSelected4] = useState("");
  const [manualCreationThemesSelected5, setManualCreationThemesSelected5] = useState("");
  const [hiddenManualCreationTheme, setHiddenManualCreationTheme] = useState(true);

  const changeSubfonctionsThemes = (event, inputValue) => {
    setSubfonctionsThemesSelected(inputValue);

    if (inputValue === "creation" || inputValue === "Création des thèmes") {
      setHiddenCreationTheme(false);
    } else {
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    }
  };

  const changeThemes = (event, inputValue) => {
    setCreationThemesSelected(inputValue);

    if (inputValue === "manual") {
      setHiddenManualCreationTheme(false);
    } else {
      setHiddenManualCreationTheme(true);
    }
  };

  const changeCreationThemes1 = (event, inputValue) => {
    setManualCreationThemesSelected1(inputValue);
  };
  
  const changeCreationThemes2 = (event, inputValue) => {
    setManualCreationThemesSelected2(inputValue);
  };

  const changeCreationThemes3 = (event, inputValue) => {
    setManualCreationThemesSelected3(inputValue);
  };

  const changeCreationThemes4 = (event, inputValue) => {
    setManualCreationThemesSelected4(inputValue);
  };

  const changeCreationThemes5 = (event, inputValue) => {
    setManualCreationThemesSelected5(inputValue);
  };

  const clickLaunch = () => {
    if (subfonctionsThemesSelected === "creation" || subfonctionsThemesSelected === "Création des thèmes") {
      let themeResponse;
      
      if (creationThemesSelected === "random") {
        themeResponse = themeCreation(props.themes, []);
      } else {
        let manualThemes = [manualCreationThemesSelected1, manualCreationThemesSelected2, manualCreationThemesSelected3, manualCreationThemesSelected4, manualCreationThemesSelected5];

        themeResponse = themeCreation(props.themes, manualThemes);
      }

      firebase.updateDocument("helpers", props.idHelper, {
        "themes": themeResponse.themes
      /* }).then(doc => {
        setData(doc.data()); */
      });

      let responseText = "";

      for (let i = 0 ; i < themeResponse.themes.length ; i++) {
        responseText = responseText + (i + 1) + "- " + themeResponse.themes[i].name;

        if (i < themeResponse.themes.length - 1) {
          responseText = responseText + "\n";
        }
      }

      setHistory(h => ([...h, logTheme(responseText)]));
    } else if (subfonctionsThemesSelected === "list" || subfonctionsThemesSelected === "Liste des thèmes") {
      let themeResponse = themeList(props.themes);

      if (themeResponse.isExisted === true) {
        let responseText = "";

        for (let i = 0 ; i < themeResponse.themes.length ; i++) {
          responseText = responseText + (i + 1) + "- " + themeResponse.themes[i].name;

          if (i < themeResponse.themes.length - 1) {
            responseText = responseText + "\n";
          }
        }

        setHistory(h => ([...h, logTheme(responseText)]));
      } else {
        setHistory(h => ([...h, logTheme("La liste des thèmes n'a pas encore été créée pour cette campagne.")]));
      }
    } else if (subfonctionsThemesSelected === "random" || subfonctionsThemesSelected === "Sélectionner aléatoirement un thème") {
      let themeResponse = themeRandom(props.themes);

      if (themeResponse.isExisted === true) {
        setHistory(h => ([...h, logTheme(themeResponse.themeName + " (" + themeResponse.themeDescription + ")")]));
      } else {
        setHistory(h => ([...h, logTheme("La liste des thèmes n'a pas encore été créée pour cette campagne")]));
      }
    }
  }
  
  return (
    <React.Fragment>
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >

        <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-themes"
          options={subfonctionsThemes}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsThemes}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a subfonction"/>}
        />
  
        {!hiddenCreationTheme ? <FormControl>
          <RadioGroup
            name="radio-buttons-group-themes"
            onChange={changeThemes}>
            <FormControlLabel value="random" control={<Radio />} label="Aléatoire" />
            <FormControlLabel value="manual" control={<Radio />} label="Manuel" />
          </RadioGroup>
        </FormControl> : null}
  
        {!hiddenManualCreationTheme ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-creation-themes-1"
          options={themes}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeCreationThemes1}
          renderInput={(params) =>
          <TextField {...params}
            label="Premier thème"/>}
        /> : null}
  
        {!hiddenManualCreationTheme ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-creation-themes-2"
          options={themes}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeCreationThemes2}
          renderInput={(params) =>
          <TextField {...params}
            label="Deuxième thème"/>}
        /> : null}
  
        {!hiddenManualCreationTheme ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-creation-themes-3"
          options={themes}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeCreationThemes3}
          renderInput={(params) =>
          <TextField {...params}
            label="Troisième thème"/>}
        /> : null}
  
        {!hiddenManualCreationTheme ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-creation-themes-4"
          options={themes}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeCreationThemes4}
          renderInput={(params) =>
          <TextField {...params}
            label="Quatrième thème"/>}
        /> : null}
  
        {!hiddenManualCreationTheme ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-creation-themes-5"
          options={themes}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeCreationThemes5}
          renderInput={(params) =>
          <TextField {...params}
            label="Cinquième thème"/>}
        /> : null}
        
        <Button
          variant="contained"
          onClick={clickLaunch}
        >Launch
        </Button>
      </Stack>
    </React.Fragment>
  )
}
