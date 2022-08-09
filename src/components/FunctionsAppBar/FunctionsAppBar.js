import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Autocomplete, TextField, Button, AppBar, Toolbar, IconButton, Menu, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import { useHistory, logDieRoll, logMeaning, logRandomEvent, logFate, logLoot, logCharacter, logPlot, logTheme } from "context/HistoryContext";
import { useFirebase } from "context/FirebaseContext";
import eventCheck from "backend/mythic/eventCheck";
import fateCheck from "backend/mythic/fateCheck";
import actionRoll from "backend/mythic/actionRoll";
import descriptionRoll from "backend/mythic/descriptionRoll";
import fantasyLootGenerator from "backend/tables/fantasyLootGenerator";
import { themeCreation, themeList, characterRandom, plotRandom, characterList, plotList, characterOccurrences, plotOccurrences } from "backend/mythic/adventureCrafter";

const options = [
  'd4',
  'd6', 
  'd8', 
  'd10', 
  'd12', 
  'd20', 
  'd100', 
  'Custom'
];

const odds = [
  'Impossible',
  'Certainement pas',
  'Très improbable',
  'Improbable',
  '50/50 ou Pas sûr',
  'Probable',
  'Très probable',
  'Chose sûre',
  'Comme ça doit être'
];

const ITEM_HEIGHT = 48;

const functions = [
  { label: 'Action', id: 1 },
  { label: 'Character', id: 2 },
  { label: 'Description', id: 3 },
  { label: 'Event', id: 4 },
  { label: 'Fantasy Loot', id: 5 },
  { label: 'Fate', id: 6 },
  { label: 'Plot', id: 7 },
  { label: 'Theme', id: 8 }
];

const bodies = [
  { label: 'Humanoïde non-aventurier sans sac, poches ...', value: 'no'}, 
  { label: 'Humanoïde non-aventurier avec un sac, des poches ...', value: 'nw'},
  { label: 'Humanoïde aventurier sans sac, poches ...', value: 'ao'},
  { label: 'Humanoïde aventurier avec un sac, des poches ...', value: 'aw'},
  { label: 'Animaux sauvages', value: 'wa'},
  { label: 'Loot', value: 'lo'},
];

const subfonctionsCharacters = [
  // { label: 'Ajouter un personnage', value: 'add' },
  // { label: 'Information sur un personnage', value: 'information' },
  { label: 'Liste de personnages', value: 'list' },
  // { label: 'Modifier un personnage', value: 'update' },
  { label: "Occurrences d'un personnage", value: 'occurrence' },
  { label: 'Sélectionner aléatoirement un personnage', value: 'random' },
  // { label: "Supprimer un personnage", value: 'delete' }
];

let subfonctionsOccurrenceCharacters = [];

const subfonctionsPlots = [
  // { label: 'Ajouter une intrigue', value: 'add' },
  // { label: 'Information sur une intrigue', value: 'information' },
  { label: "Liste d'intrigues", value: 'list' },
  // { label: 'Modifier une intrigue', value: 'update' },
  { label: "Occurrences d'une intrigue", value: 'occurrence' },
  { label: 'Sélectionner aléatoirement une intrigue', value: 'random' },
  // { label: "Supprimer une intrigue", value: 'delete' }
];

let subfonctionsOccurrencePlots = [];

const subfonctionsThemes = [
  { label: 'Création des thèmes', value: 'creation' },
  { label: 'Liste des thèmes', value: 'list' }
];

const themes = [
  { label: 'ACTION', id: 1 },
  { label: 'TENSION', id: 2 },
  { label: 'MYSTÈRE', id: 3 },
  { label: 'SOCIAL', id: 4 },
  { label: 'PERSONNEL', id: 5 },
];

export default function Helper() {
  const firebase = useFirebase();
  const [, setHistory] = useHistory();
  const axios = require('axios').default;
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState({})
  const [functionSelected, setFunctionSelected] = useState("");
  const [oddSelected, setOddSelected] = useState("");
  const [yesOrNoSelected, setYesOrNoSelected] = useState("");
  const [hiddenFate, setHiddenFate] = useState(true);
  const [bodiesSelected, setBodiesSelected] = useState("");
  const [placesSelected, setPlacesSelected] = useState("");
  const [hiddenLoot, setHiddenLoot] = useState(true);
  const [subfonctionsCharactersSelected, setSubfonctionsCharactersSelected] = useState(""); 
  const [hiddenCharacter, setHiddenCharacter] = useState(true);
  const [subfonctionsOccurrenceCharactersSelected, setSubfonctionsOccurrenceCharactersSelected] = useState(""); 
  const [hiddenOccurrenceCharacter, setHiddenOccurrenceCharacter] = useState(true);
   const [subfonctionsPlotsSelected, setSubfonctionsPlotsSelected] = useState(""); 
  const [hiddenPlot, setHiddenPlot] = useState(true);
  const [subfonctionsOccurrencePlotsSelected, setSubfonctionsOccurrencePlotsSelected] = useState(""); 
  const [hiddenOccurrencePlot, setHiddenOccurrencePlot] = useState(true);
  const [subfonctionsThemesSelected, setSubfonctionsThemesSelected] = useState(""); 
  const [hiddenTheme, setHiddenTheme] = useState(true);
  const [creationThemesSelected, setCreationThemesSelected] = useState("");
  const [hiddenCreationTheme, setHiddenCreationTheme] = useState(true);
  const [manualCreationThemesSelected1, setManualCreationThemesSelected1] = useState("");
  const [manualCreationThemesSelected2, setManualCreationThemesSelected2] = useState("");
  const [manualCreationThemesSelected3, setManualCreationThemesSelected3] = useState("");
  const [manualCreationThemesSelected4, setManualCreationThemesSelected4] = useState("");
  const [manualCreationThemesSelected5, setManualCreationThemesSelected5] = useState("");
  const [hiddenManualCreationTheme, setHiddenManualCreationTheme] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickDices = (event, index) => {
    setAnchorEl(null);

    if (index === 0) {
      let random = Math.floor(Math.random() * 4 + 1);
      setHistory(h => ([...h, logDieRoll("1d4",random)]));
    } else if (index === 1) {
      let random = Math.floor(Math.random() * 6 + 1);
      setHistory(h => ([...h, logDieRoll("1d6",random)]));
    } else if (index === 2) {
      let random = Math.floor(Math.random() * 8 + 1);
      setHistory(h => ([...h, logDieRoll("1d8",random)]));
    } else if (index === 3) {
      let random = Math.floor(Math.random() * 10 + 1);
      setHistory(h => ([...h, logDieRoll("1d10",random)]));
    } else if (index === 4) {
      let random = Math.floor(Math.random() * 12 + 1);
      setHistory(h => ([...h, logDieRoll("1d12",random)]));
    } else if (index === 5) {
      let random = Math.floor(Math.random() * 20 + 1);
      setHistory(h => ([...h, logDieRoll("1d20",random)]));
    } else if (index === 6) {
      let random = Math.floor(Math.random() * 100 + 1);
      setHistory(h => ([...h, logDieRoll("1d100",random)]));
    }
  };

  const changeFunctions = (event, inputValue) => {
    setFunctionSelected(inputValue);
              
    if (inputValue === "Character") {
      setHiddenCharacter(false);
      setHiddenOccurrenceCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Fate") {
      setHiddenCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenFate(false);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Fantasy Loot") {
      setHiddenCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(false);
      setHiddenPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Plot") {
      setHiddenCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(false);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Theme") {
      setHiddenCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(false);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else {
      setHiddenCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    }
  };

  const changeOdds = (event, inputValue) => {
    setOddSelected(inputValue);
  };

  const changeYesNo = (event, inputValue) => {
    setYesOrNoSelected(inputValue);
  };
  
  const changeBodies = (event, inputValue) => {
    setBodiesSelected(inputValue);
  };

  const changePlaces = (event, inputValue) => {
    setPlacesSelected(inputValue);
  };

  const changeSubfonctionsCharacters = (event, inputValue) => {
    setSubfonctionsCharactersSelected(inputValue);

    if (inputValue === 'occurrence' || inputValue === "Occurrences d'un personnage") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        subfonctionsOccurrenceCharacters.push({
          "label": uniqueCharacters[i],
          "value": uniqueCharacters[i]
        });
      }

      setHiddenOccurrenceCharacter(false);
    } else {
      setHiddenOccurrenceCharacter(true);
    }
  };

  const changeSubfonctionsOccurrenceCharacters = (event, inputValue) => {
    setSubfonctionsOccurrenceCharactersSelected(inputValue);
  };

  const changeSubfonctionsPlots = (event, inputValue) => {
    setSubfonctionsPlotsSelected(inputValue);

    if (inputValue === 'occurrence' || inputValue === "Occurrences d'une intrigue") {
      const uniquePlots = [...new Set(data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        subfonctionsOccurrencePlots.push({
          "label": uniquePlots[i],
          "value": uniquePlots[i]
        });
      }

      setHiddenOccurrencePlot(false);
    } else {
      setHiddenOccurrencePlot(true);
    }
  };

  const changeSubfonctionsOccurrencePlots = (event, inputValue) => {
    setSubfonctionsOccurrencePlotsSelected(inputValue);
  };

  const changeSubfonctionsThemes = (event, inputValue) => {
    setSubfonctionsThemesSelected(inputValue);

    if (inputValue === "Création des thèmes") {
      setHiddenCreationTheme(false);
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
  
  const clickDice = () => {
    if (functionSelected === "Action") {
      let actionResponse = actionRoll();
      
      setHistory(h => ([...h, logMeaning("Action", actionResponse.action + " / " + actionResponse.subject)]));
    } else if (functionSelected === "Character") {
      if (subfonctionsCharactersSelected === "list" || subfonctionsCharactersSelected === "Liste de personnages") {
        let characterResponse = characterList(data);

        let responseText = "";

        for (let i = 0 ; i < characterResponse.names.length ; i++) {
          responseText = responseText + (i + 1) + "- " + characterResponse.names[i];

          if (i < characterResponse.names.length - 1) {
            responseText = responseText + "\n";
          }
        }

        setHistory(h => ([...h, logCharacter(responseText)]));
      } else if (subfonctionsCharactersSelected === "random" || subfonctionsCharactersSelected === "Sélectionner aléatoirement un personnage") {
        let characterResponse = characterRandom(data);

        setHistory(h => ([...h, logCharacter(characterResponse.name)]));
      } else if (subfonctionsCharactersSelected === 'occurrence' || subfonctionsCharactersSelected === "Occurrences d'un personnage") {
        let characterResponse = characterOccurrences(data, subfonctionsOccurrenceCharactersSelected);

        setHistory(h => ([...h, logCharacter("Le personnage " + subfonctionsOccurrenceCharactersSelected + " apparaît " + characterResponse.numberOf + " fois dans la liste des personnages")]));
      }
    } else if (functionSelected === "Description") {
      let descriptionResponse = descriptionRoll();

      setHistory(h => ([...h, logMeaning("Description", descriptionResponse.description1 + " / " + descriptionResponse.description2)]));
    } else if (functionSelected === "Event") {
      let eventResponse = eventCheck();

      setHistory(h => ([...h, logRandomEvent(eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ")\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
    } else if (functionSelected === "Fantasy Loot") {
      let body = "";

      if (bodiesSelected === "Humanoïde non-aventurier sans sac, poches ...") {
        body = "no";
      } else if (bodiesSelected === "Humanoïde non-aventurier avec un sac, des poches ...") {
        body = "nw";
      } else if (bodiesSelected === "Humanoïde aventurier sans sac, poches ...") {
        body = "ao";
      } else if (bodiesSelected === "Humanoïde aventurier avec un sac, des poches ...") {
        body = "aw";
      } else if (bodiesSelected === "Animaux sauvages") {
        body = "wa";
      } else if (bodiesSelected === "Loot") {
        body = "lo";
      }

      let fantasyLootResponse = fantasyLootGenerator(body, placesSelected);

      let fantasyLootData = data.inventory;

      for (let i = 0 ; i < fantasyLootResponse.number ; i++) {
        fantasyLootData.push({
          "lootItem": fantasyLootResponse.items[i],
          "lootCategory": fantasyLootResponse.categories[i]
        });
      }

      firebase.updateDocument("helpers", id, {
        "inventory": fantasyLootData
      }).then(doc => {
        setData(doc.data());
      });

      let responseText = "";

      if (fantasyLootResponse.number === 0) {
        setHistory(h => ([...h, logLoot("Vous n'avez rien looté")]));
      } else {
        for (let i = 0 ; i < fantasyLootResponse.number ; i++) {
          responseText = responseText + fantasyLootResponse.categories[i] + " => " + fantasyLootResponse.items[i];

          if (i < fantasyLootResponse.number - 1) {
            responseText = responseText + "\n\n";
          }
        }
        
        setHistory(h => ([...h, logLoot(responseText)]));
      }
    } else if (functionSelected === "Fate") {
      let odd = "";

      if (oddSelected === "Impossible") {
        odd = "IM";
      } else if (oddSelected === "Certainement pas") {
        odd = "NW";
      } else if (oddSelected === "Très improbable") {
        odd = "VU";
      } else if (oddSelected === "Improbable") {
        odd = "UL";
      } else if (oddSelected === "50/50 ou Pas sûr") {
        odd = "NS";
      } else if (oddSelected === "Probable") {
        odd = "LI";
      } else if (oddSelected === "Très probable") {
        odd = "VL";
      } else if (oddSelected === "Chose sûre") {
        odd = "ST";
      } else if (oddSelected === "Comme ça doit être") {
        odd = "HB";
      }
      
      let fateResponse = fateCheck(data.chaosFactor, odd, yesOrNoSelected);

      let yesno = "";
        
      if (fateResponse.isYes === true) {
        yesno = "OUI";
      } else {
        yesno = "NON"
      }

      if (fateResponse.isExceptional === true) {
        yesno = yesno + " EXCEPTIONNEL"
      }

      if (fateResponse.randomEvent === true) {
        let eventResponse = eventCheck();
        
        setHistory(h => ([...h, logFate(odd, data.chaosFactor, yesno + "Evénement aléatoire\n" + eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ")\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
      } else {
        setHistory(h => ([...h, logFate(odd, data.chaosFactor, yesno)]));
      }
    } else if (functionSelected === "Plot") {
      if (subfonctionsPlotsSelected === "list" || subfonctionsPlotsSelected === "Liste d'intrigues") {
        let plotResponse = plotList(data);

        let responseText = "";

        for (let i = 0 ; i < plotResponse.names.length ; i++) {
          responseText = responseText + (i + 1) + "- " + plotResponse.names[i];

          if (i < plotResponse.names.length - 1) {
            responseText = responseText + "\n";
          }
        }

        setHistory(h => ([...h, logPlot(responseText)]));
      } else if (subfonctionsPlotsSelected === "random" || subfonctionsPlotsSelected === "Sélectionner aléatoirement une intrigue") {
        let plotResponse = plotRandom(data, false);

        setHistory(h => ([...h, logPlot(plotResponse.name)]));
      } else if (subfonctionsPlotsSelected === 'occurrence' || subfonctionsPlotsSelected === "Occurrences d'une intrigue") {
        let plotResponse = plotOccurrences(data, subfonctionsOccurrencePlotsSelected);

        setHistory(h => ([...h, logPlot("L'intrigue " + subfonctionsOccurrencePlotsSelected + " apparaît " + plotResponse.numberOf + " fois dans la liste des intrigues")]));
      }
    } else if (functionSelected === "Theme") {
      if (subfonctionsThemesSelected === "creation" || subfonctionsThemesSelected === "Création des thèmes") {
        let themeResponse;
        
        if (creationThemesSelected === "random") {
          themeResponse = themeCreation(data, []);
        } else {
          let manualThemes = [manualCreationThemesSelected1, manualCreationThemesSelected2, manualCreationThemesSelected3, manualCreationThemesSelected4, manualCreationThemesSelected5];

          themeResponse = themeCreation(data, manualThemes);
        }

        firebase.updateDocument("helpers", id, {
          "themes": themeResponse.themes
        }).then(doc => {
          setData(doc.data());
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
        let themeResponse;

        themeResponse = themeList(data);

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
      }
    }
  };

  useEffect(() => {    
    firebase.getDocument("helpers", id).then(doc => {
      setData(doc.data());
    });
    
    if (token) {
      firebase.getDocument("users", token).then(doc => {
        setIsAuth(doc.data().helpers.includes(id));
      })
    } else {
      setIsAuth(false);
    }
  }, [firebase, id, token, axios])

  console.log(data);
  console.log(isAuth);
  
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            id="dices-button"
            aria-label="menu"
            aria-controls={open ? 'dices-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ mr: 2 }}
            onClick={handleClick}
            >
            <CasinoIcon />
          </IconButton>
          <Menu
            id="dices-menu"
            MenuListProps={{
              'aria-labelledby': 'dices-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
              },
            }}
          >
            {options.map((option, index) => (
              <MenuItem key={option} selected={option === 'd20'} onClick={(event) => handleClickDices(event, index)}>
                {option}
              </MenuItem>
            ))}
          </Menu>
          <Autocomplete
            autoComplete
            autoSelect
            disablePortal
            id="combo-box-functions"
            options={functions}
            getOptionLabel={(option) => option.label}
            onInputChange={changeFunctions}
            sx={{ width: 300 }}
            renderInput={(params) =>
              <TextField {...params}
                label="Choose a Function"/>}
          />
        </Toolbar>
      </AppBar>

      {!hiddenFate ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-odds"
        options={odds}
        defaultValue="Odds"
        sx={{ width: 300 }}
        onInputChange={changeOdds}
        renderInput={(params) =>
          <TextField {...params}
          label="Choose an Odd"/>}
      /> : null}

      {!hiddenFate ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-yesorno"
          onChange={changeYesNo}>
          <FormControlLabel value="Yes" control={<Radio />} label="Oui" />
          <FormControlLabel value="No" control={<Radio />} label="Non" />
        </RadioGroup>
      </FormControl> : null}

      {!hiddenLoot ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-bodies"
        options={bodies}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeBodies}
        renderInput={(params) =>
          <TextField {...params}
          label="Choose a Body"/>}
      /> : null}

      {!hiddenLoot ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-places"
          onChange={changePlaces}>
          <FormControlLabel value="valueCommon" control={<Radio />} label="Commun" />
          <FormControlLabel value="valueMilitary" control={<Radio />} label="Militaire" />
          <FormControlLabel value="valueDungeon" control={<Radio />} label="Donjon" />
        </RadioGroup>
      </FormControl> : null}

      {!hiddenCharacter ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-characters"
        options={subfonctionsCharacters}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsCharacters}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a subfonction"/>}
      /> : null}

      {!hiddenOccurrenceCharacter ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-occurrence-characters"
        options={subfonctionsOccurrenceCharacters}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsOccurrenceCharacters}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a character"/>}
      /> : null}

      {!hiddenPlot ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-plots"
        options={subfonctionsPlots}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsPlots}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a subfonction"/>}
      /> : null}

      {!hiddenOccurrencePlot ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-occurrence-plots"
        options={subfonctionsOccurrencePlots}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsOccurrencePlots}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a plot"/>}
      /> : null}

      {!hiddenTheme ? <Autocomplete
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
      /> : null}

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
        onClick={clickDice}
      >Dice
      </Button>
    </React.Fragment>
  )
}
