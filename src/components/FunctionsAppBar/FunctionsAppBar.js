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
import { themeCreation, themeList, characterRandom, plotRandom, characterList, plotList, characterOccurrences, plotOccurrences, characterAdd, plotAdd, characterUpdate } from "backend/mythic/adventureCrafter";

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
  { label: 'Ajouter un personnage', value: 'add' },
  // { label: 'Information sur un personnage', value: 'information' },
  { label: 'Liste de personnages', value: 'list' },
  { label: 'Modifier un personnage', value: 'update' },
  { label: "Occurrences d'un personnage", value: 'occurrence' },
  { label: 'Sélectionner aléatoirement un personnage', value: 'random' },
  // { label: "Supprimer un personnage", value: 'delete' }
];

let existingCharacters = [];
let updatePlayer = false;

const subfonctionsPlots = [
  { label: 'Ajouter une intrigue', value: 'add' },
  // { label: 'Information sur une intrigue', value: 'information' },
  { label: "Liste d'intrigues", value: 'list' },
  // { label: 'Modifier une intrigue', value: 'update' },
  { label: "Occurrences d'une intrigue", value: 'occurrence' },
  { label: 'Sélectionner aléatoirement une intrigue', value: 'random' },
  // { label: "Supprimer une intrigue", value: 'delete' }
];

let existingPlots = [];

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
  const [subfonctionsAddCharactersSelected, setSubfonctionsAddCharactersSelected] = useState("");
  const [hiddenAddCharacter, setHiddenAddCharacter] = useState(true);
  const [subfonctionsAddExistingCharactersSelected, setSubfonctionsAddExistingCharactersSelected] = useState("");
  const [hiddenAddExistingCharacter, setHiddenAddExistingCharacter] = useState(true);
  const [subfonctionsAddNewNameCharactersSelected, setSubfonctionsAddNewNameCharactersSelected] = useState("");
const [subfonctionsAddNewPlayerCharactersSelected, setSubfonctionsAddNewPlayerCharactersSelected] = useState("");
  const [hiddenAddNewCharacter, setHiddenAddNewCharacter] = useState(true);
  const [subfonctionsOccurrenceCharactersSelected, setSubfonctionsOccurrenceCharactersSelected] = useState(""); 
  const [hiddenOccurrenceCharacter, setHiddenOccurrenceCharacter] = useState(true);
  const [subfonctionsUpdateCharactersSelected, setSubfonctionsUpdateCharactersSelected] = useState("");
  const [hiddenUpdateCharacter, setHiddenUpdateCharacter] = useState(true);
  const [subfonctionsUpdateNameCharactersSelected, setSubfonctionsUpdateNameCharactersSelected] = useState("");
  const [hiddenUpdateNameCharacter, setHiddenUpdateNameCharacter] = useState(true);
  const [subfonctionsUpdatePlayerCharactersSelected, setSubfonctionsUpdatePlayerCharactersSelected] = useState("");
  const [hiddenUpdatePlayerCharacter, setHiddenUpdatePlayerCharacter] = useState(true);
   const [subfonctionsPlotsSelected, setSubfonctionsPlotsSelected] = useState(""); 
  const [hiddenPlot, setHiddenPlot] = useState(true);
   const [subfonctionsAddPlotsSelected, setSubfonctionsAddPlotsSelected] = useState("");
  const [hiddenAddPlot, setHiddenAddPlot] = useState(true);
  const [subfonctionsAddExistingPlotsSelected, setSubfonctionsAddExistingPlotsSelected] = useState("");
  const [hiddenAddExistingPlot, setHiddenAddExistingPlot] = useState(true);
  const [subfonctionsAddNewPlotsSelected, setSubfonctionsAddNewPlotsSelected] = useState("");
  const [hiddenAddNewPlot, setHiddenAddNewPlot] = useState(true);
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
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Fate") {
      setHiddenCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenFate(false);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Fantasy Loot") {
      setHiddenCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(false);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Plot") {
      setHiddenCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(false);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Theme") {
      setHiddenCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenTheme(false);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else {
      setHiddenCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
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

    existingCharacters = [];

    if (inputValue === 'add' || inputValue === 'Ajouter un personnage') {
      setHiddenAddCharacter(false);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
    } else if (inputValue === 'occurrence' || inputValue === "Occurrences d'un personnage") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        existingCharacters.push({
          "label": uniqueCharacters[i],
          "value": uniqueCharacters[i]
        });
      }

      setHiddenOccurrenceCharacter(false);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
    } else if (inputValue === 'update' || inputValue === "Modifier un personnage") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        existingCharacters.push({
          "label": uniqueCharacters[i],
          "value": uniqueCharacters[i]
        });
      }

      setHiddenOccurrenceCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenUpdateCharacter(false);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
    } else {
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
    }
  };

  const changeSubfonctionsAddCharacters = (event, inputValue) => {
    setSubfonctionsAddCharactersSelected(inputValue);

    if (inputValue === "existing") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        existingCharacters.push({
          "label": uniqueCharacters[i],
          "value": uniqueCharacters[i]
        });
      }

      setHiddenAddExistingCharacter(false);
      setHiddenAddNewCharacter(true);
    } else {
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(false);
    }
  };

  const changeSubfonctionsAddExistingCharacters = (event, inputValue) => {
    setSubfonctionsAddExistingCharactersSelected(inputValue);
  };

  const changeSubfonctionsAddNewNameCharacters = (event) => {
    setSubfonctionsAddNewNameCharactersSelected(event.currentTarget.value);
  };

  const changeSubfonctionsAddNewPlayerCharacters = (event, inputValue) => {
    setSubfonctionsAddNewPlayerCharactersSelected(inputValue);
  };

  const changeSubfonctionsOccurrenceCharacters = (event, inputValue) => {
    setSubfonctionsOccurrenceCharactersSelected(inputValue);
  };

  const changeSubfonctionsUpdateCharacters = (event, inputValue) => {
    setSubfonctionsUpdateCharactersSelected(inputValue);

    if (data.charactersList.find(character => character.name === inputValue)) {
      for (let i = 0 ; i < data.charactersList.length ; i++) {
        if (data.charactersList[i].name === inputValue) {
          if (data.charactersList[i].player === false) {
            updatePlayer = "npc";
          } else {
            updatePlayer = "player";
          }

          changeSubfonctionsUpdatePlayerCharacters(event, updatePlayer);
          
          break;
        }
      }
    }

    setHiddenUpdateNameCharacter(false);
    setHiddenUpdatePlayerCharacter(false);
  };

  const changeSubfonctionsUpdateNameCharacters = (event, inputValue) => {
    setSubfonctionsUpdateNameCharactersSelected(event.currentTarget.value);
  };

  const changeSubfonctionsUpdatePlayerCharacters = (event, inputValue) => {
    if (inputValue !== undefined) {
      setSubfonctionsUpdatePlayerCharactersSelected(inputValue);
    } else {
      setSubfonctionsUpdatePlayerCharactersSelected(event.currentTarget.value);
    }
  };

  const changeSubfonctionsPlots = (event, inputValue) => {
    setSubfonctionsPlotsSelected(inputValue);

    existingPlots = [];

    if (inputValue === 'add' || inputValue === 'Ajouter une intrigue') {
      setHiddenAddPlot(false);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
    } else if (inputValue === 'occurrence' || inputValue === "Occurrences d'une intrigue") {
      const uniquePlots = [...new Set(data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        existingPlots.push({
          "label": uniquePlots[i],
          "value": uniquePlots[i]
        });
      }

      setHiddenOccurrencePlot(false);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
    } else {
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
    }
  };

  const changeSubfonctionsAddPlots = (event, inputValue) => {
    setSubfonctionsAddPlotsSelected(inputValue);

    if (inputValue === "existing") {
      const uniquePlots = [...new Set(data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        existingPlots.push({
          "label": uniquePlots[i],
          "value": uniquePlots[i]
        });
      }

      setHiddenAddExistingPlot(false);
      setHiddenAddNewPlot(true);
    } else {
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(false);
    }
  };

  const changeSubfonctionsAddExistingPlots = (event, inputValue) => {
    setSubfonctionsAddExistingPlotsSelected(inputValue);
  };

  const changeSubfonctionsAddNewPlots = (event) => {
    setSubfonctionsAddNewPlotsSelected(event.currentTarget.value);
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
      if (subfonctionsCharactersSelected === "add" || subfonctionsCharactersSelected === "Ajouter un personnage") {
        if (subfonctionsAddCharactersSelected === "existing") {
          let characterResponse = characterAdd(data.charactersList, subfonctionsAddExistingCharactersSelected);

          if (characterResponse.full === false) {
            firebase.updateDocument("helpers", id, {
              "charactersList": characterResponse.charactersList
            }).then(doc => {
              setData(doc.data());
            });

            setHistory(h => ([...h, logCharacter("Une occurrence du personnage " + subfonctionsAddExistingCharactersSelected + " a été ajoutée à la liste de personnages")]));
          } else {
            setHistory(h => ([...h, logCharacter("Il y a déjà trois occurrences de ce personnage dans la liste des personnages")]));
          }
        } else {
          let isPlayer = false;

          if (subfonctionsAddNewPlayerCharactersSelected === "player") {
            isPlayer = true;
          }
          
          let characterResponse = characterAdd(data.charactersList, subfonctionsAddNewNameCharactersSelected, isPlayer);

          if (characterResponse.full === false) {
            firebase.updateDocument("helpers", id, {
              "charactersList": characterResponse.charactersList
            }).then(doc => {
              setData(doc.data());
            });

            setHistory(h => ([...h, logCharacter("Le personnage " + subfonctionsAddNewNameCharactersSelected + " a été ajouté à la liste de personnages")]));
          } else {
            setHistory(h => ([...h, logCharacter("Il y a déjà trois occurrences de ce personnage dans la liste des personnages")]));
          }
        }
      } else if (subfonctionsCharactersSelected === "list" || subfonctionsCharactersSelected === "Liste de personnages") {
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
      } else if (subfonctionsCharactersSelected === "update" || subfonctionsCharactersSelected === "Modifier un personnage") {
        let isPlayer = false;

        if (subfonctionsUpdatePlayerCharactersSelected === "player") {
          isPlayer = true;
        }
        
        let characterResponse = characterUpdate(data.charactersList, subfonctionsUpdateCharactersSelected, subfonctionsUpdateNameCharactersSelected, isPlayer);

        firebase.updateDocument("helpers", id, {
          "charactersList": characterResponse.charactersList
        }).then(doc => {
          setData(doc.data());
        });

        setHistory(h => ([...h, logCharacter("Le personnage " + subfonctionsUpdateNameCharactersSelected + " a été mis à jour")]));
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
      if (subfonctionsPlotsSelected === "add" || subfonctionsPlotsSelected === "Ajouter une intrigue") {
        if (subfonctionsAddPlotsSelected === "existing") {
          let plotResponse = plotAdd(data.plotsList, subfonctionsAddExistingPlotsSelected);

          if (plotResponse.full === false) {
            firebase.updateDocument("helpers", id, {
              "plotsList": plotResponse.plotsList
            }).then(doc => {
              setData(doc.data());
            });

            setHistory(h => ([...h, logPlot("Une occurrence de l'intrigue " + subfonctionsAddExistingPlotsSelected + " a été ajoutée à la liste des intrigues")]));
          } else {
            setHistory(h => ([...h, logPlot("Il y a déjà trois occurrences de cette intrigue dans la liste des intrigues")]));
          }
        } else {
          let plotResponse = plotAdd(data.plotsList, subfonctionsAddNewPlotsSelected);

          if (plotResponse.full === false) {
            firebase.updateDocument("helpers", id, {
              "plotsList": plotResponse.plotsList
            }).then(doc => {
              setData(doc.data());
            });

            setHistory(h => ([...h, logPlot("L'intrigue " + subfonctionsAddNewPlotsSelected + " a été ajoutée à la liste des intrigues")]));
          } else {
            setHistory(h => ([...h, logPlot("Il y a déjà trois occurrences de cette intrigue dans la liste des intrigues")]));
          }
        }
      } else if (subfonctionsPlotsSelected === "list" || subfonctionsPlotsSelected === "Liste d'intrigues") {
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

      {!hiddenAddCharacter ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-add-character"
          onChange={changeSubfonctionsAddCharacters}>
          <FormControlLabel value="existing" control={<Radio />} label="Personnage existant" />
          <FormControlLabel value="new" control={<Radio />} label="Nouveau personnage" />
        </RadioGroup>
      </FormControl> : null}

      {!hiddenAddExistingCharacter ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-occurrence-add-existing-characters"
        options={existingCharacters}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsAddExistingCharacters}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a character"/>}
      /> : null}

      {!hiddenAddNewCharacter ? <TextField
        id="outlined-add-new-character"
        label="Write a name"
        variant="outlined"
        onChange={changeSubfonctionsAddNewNameCharacters} /> : null}

      {!hiddenAddNewCharacter ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-add-new-character"
          onChange={changeSubfonctionsAddNewPlayerCharacters}>
          <FormControlLabel value="player" control={<Radio />} label="Joueur" />
          <FormControlLabel value="npc" control={<Radio />} label="PNJ" />
        </RadioGroup>
      </FormControl> : null}

      {!hiddenOccurrenceCharacter ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-occurrence-characters"
        options={existingCharacters}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsOccurrenceCharacters}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a character"/>}
      /> : null}

      {!hiddenUpdateCharacter ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-update-characters"
        options={existingCharacters}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsUpdateCharacters}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a character"/>}
      /> : null}

      {!hiddenUpdateNameCharacter ? <TextField
        id="outlined-update-character"
        label={subfonctionsUpdateCharactersSelected}
        variant="outlined"
        onChange={changeSubfonctionsUpdateNameCharacters} /> : null}

      {!hiddenUpdatePlayerCharacter ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-update-character"
          value={subfonctionsUpdatePlayerCharactersSelected}
          onChange={changeSubfonctionsUpdatePlayerCharacters}>
          <FormControlLabel value="player" control={<Radio />} label="Joueur" />
          <FormControlLabel value="npc" control={<Radio />} label="PNJ" />
        </RadioGroup>
      </FormControl> : null}

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

      {!hiddenAddPlot ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-add-plot"
          onChange={changeSubfonctionsAddPlots}>
          <FormControlLabel value="existing" control={<Radio />} label="Intrigue existante" />
          <FormControlLabel value="new" control={<Radio />} label="Nouvelle intrigue" />
        </RadioGroup>
      </FormControl> : null}

      {!hiddenAddExistingPlot ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-occurrence-add-existing-plotd"
        options={existingPlots}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsAddExistingPlots}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a plot"/>}
      /> : null}

      {!hiddenAddNewPlot ? <TextField
        id="outlined-add-new-plot"
        label="Write a plot"
        variant="outlined"
        onChange={changeSubfonctionsAddNewPlots} /> : null}

      {!hiddenOccurrencePlot ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-occurrence-plots"
        options={existingPlots}
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
