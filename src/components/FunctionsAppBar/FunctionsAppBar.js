import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Autocomplete, TextField, Button, AppBar, Toolbar, FormControl, RadioGroup, FormControlLabel, Radio, Modal, Box } from "@mui/material";
import { useHistory, logMeaning, logRandomEvent, logCharacter, logPlot, logPlotPoints, logTheme } from "context/HistoryContext";
import { useFirebase } from "context/FirebaseContext";
import eventCheck from "backend/mythic/eventCheck";
import actionRoll from "backend/mythic/actionRoll";
import descriptionRoll from "backend/mythic/descriptionRoll";
import { themeCreation, themeList, characterRandom, plotRandom, characterList, plotList, characterOccurrences, plotOccurrences, characterAdd, plotAdd, characterUpdate, plotUpdate, characterDelete, plotDelete, themeRandom, characterInformation, plotPoints, plotPointsRead, plotPointsUpdate, characterCreation } from "backend/mythic/adventureCrafter";
import RollsButton from 'components/RollsButton/RollsButton';
import Fate from 'components/Fate/Fate';
import Loot from 'components/Loot/Loot';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const functions = [
  { label: 'Action', id: 1 },
  { label: 'Character', id: 2 },
  { label: 'Description', id: 3 },
  { label: 'Event', id: 4 },
  { label: 'Fantasy Loot', id: 5 },
  { label: 'Fate', id: 6 },
  { label: 'Plot', id: 7 },
  { label: 'Plot Points', id: 8 },
  { label: 'Theme', id: 9 }
];

const subfonctionsCharacters = [
  { label: 'Ajouter une occurrence et / ou un personnage', value: 'add' },
  { label: 'Créer un nouveau personnage', value: 'creation' },
  { label: 'Informations sur un personnage', value: 'information' },
  { label: 'Liste de personnages', value: 'list' },
  { label: 'Modifier un personnage', value: 'update' },
  { label: "Occurrences d'un personnage", value: 'occurrence' },
  { label: 'Sélectionner aléatoirement un personnage', value: 'random' },
  { label: "Supprimer une occurrence et / ou un personnage", value: 'delete' }
];

let existingCharacters = [];
let updatePlayer = false;

const subfonctionsPlots = [
  { label: 'Ajouter une occurrence et / ou une intrigue', value: 'add' },
  { label: "Liste d'intrigues", value: 'list' },
  { label: 'Modifier une intrigue', value: 'update' },
  { label: "Occurrences d'une intrigue", value: 'occurrence' },
  { label: 'Sélectionner aléatoirement une intrigue', value: 'random' },
  { label: "Supprimer une occurrence et / ou une intrigue", value: 'delete' }
];

let existingPlots = [];

const subfonctionsPlotPoints = [
  { label: 'Génération des Plot Points', value: 'generation' },
  { label: 'Liste des Plot Points', value: 'list' },
  { label: 'Modifier un Plot Point', value: 'update' }
];

let existingPlotPoints = [];
let existingNeedsPlotPoints = [];
let existingNamePlotPoints = [];

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

export default function FunctionAppBar() {
  const firebase = useFirebase();
  const [, setHistory] = useHistory();
  const axios = require('axios').default;
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState({})
  const [functionSelected, setFunctionSelected] = useState("");
  const [hiddenFate, setHiddenFate] = useState(true);
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
  const [subfonctionsDeleteCharactersSelected, setSubfonctionsDeleteCharactersSelected] = useState("");
  const [hiddenDeleteCharacter, setHiddenDeleteCharacter] = useState(true);
  const [subfonctionsInformationCharactersSelected, setSubfonctionsInformationCharactersSelected] = useState("");
  const [hiddenInformationCharacter, setHiddenInformationCharacter] = useState(true);
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
  const [subfonctionsUpdatePlotsSelected, setSubfonctionsUpdatePlotsSelected] = useState("");
  const [hiddenUpdatePlot, setHiddenUpdatePlot] = useState(true);
  const [subfonctionsUpdateNamePlotsSelected, setSubfonctionsUpdateNamePlotsSelected] = useState("");
  const [hiddenUpdateNamePlot, setHiddenUpdateNamePlot] = useState(true);
  const [subfonctionsDeletePlotsSelected, setSubfonctionsDeletePlotsSelected] = useState("");
  const [hiddenDeletePlot, setHiddenDeletePlot] = useState(true);
  const [subfonctionsPlotPointsSelected, setSubfonctionsPlotPointsSelected] = useState(""); 
  const [hiddenPlotPoint, setHiddenPlotPoint] = useState(true);
  const [subfonctionsUpdatePlotPointsSelected, setSubfonctionsUpdatePlotPointsSelected] = useState("");
  const [hiddenUpdatePlotPoints, setHiddenUpdatePlotPoints] = useState(true);
  const [subfonctionsUpdateNeedsPlotPointsSelected, setSubfonctionsUpdateNeedsPlotPointsSelected] = useState("");
  const [hiddenUpdateNeedsPlotPoints, setHiddenUpdateNeedsPlotPoints] = useState(true);
  const [subfonctionsUpdateNamePlotPointsSelected, setSubfonctionsUpdateNamePlotPointsSelected] = useState("");
  const [hiddenUpdateNamePlotPoints, setHiddenUpdateNamePlotPoints] = useState(true);
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
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
      setHiddenPlotPoint(true);
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Fate") {
      handleOpenModal();
      
      setHiddenCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
      setHiddenFate(false);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
      setHiddenPlotPoint(true);
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Fantasy Loot") {
      handleOpenModal();
      
      setHiddenCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(false);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
      setHiddenPlotPoint(true);
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
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
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(false);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
      setHiddenPlotPoint(true);
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Plot Points") {
      setHiddenCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
      setHiddenPlotPoint(false);
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
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
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
      setHiddenPlotPoint(true);
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
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
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
      setHiddenPlotPoint(true);
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    }
  };

  const changeSubfonctionsCharacters = (event, inputValue) => {
    setSubfonctionsCharactersSelected(inputValue);

    existingCharacters = [];

    if (inputValue === 'add' || inputValue === 'Ajouter une occurrence et / ou un personnage') {
      setHiddenAddCharacter(false);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
    } else if (inputValue === 'occurrence' || inputValue === "Occurrences d'un personnage") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }

      setHiddenOccurrenceCharacter(false);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
    } else if (inputValue === 'update' || inputValue === "Modifier un personnage") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }

      setHiddenOccurrenceCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenUpdateCharacter(false);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
    } else if (inputValue === 'delete' || inputValue === "Supprimer une occurrence et / ou un personnage") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }
      
      setHiddenDeleteCharacter(false);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenInformationCharacter(true);
    } else if (inputValue === 'information' || inputValue === "Informations sur un personnage") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }
      
      setHiddenInformationCharacter(false);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
    } else {
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
    }
  };

  const changeSubfonctionsAddCharacters = (event, inputValue) => {
    setSubfonctionsAddCharactersSelected(inputValue);

    if (inputValue === "existing") {
      const uniqueCharacters = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
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

  const changeSubfonctionsDeleteCharacters = (event, inputValue) => {
    setSubfonctionsDeleteCharactersSelected(inputValue);
  }

  const changeSubfonctionsInformationCharacters = (event, inputValue) => {
    setSubfonctionsInformationCharactersSelected(inputValue);
  }

  const changeSubfonctionsPlots = (event, inputValue) => {
    setSubfonctionsPlotsSelected(inputValue);

    existingPlots = [];

    if (inputValue === 'add' || inputValue === 'Ajouter une occurrence et / ou une intrigue') {
      setHiddenAddPlot(false);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
    } else if (inputValue === 'occurrence' || inputValue === "Occurrences d'une intrigue") {
      const uniquePlots = [...new Set(data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        if (uniquePlots[i] !== "Nouvelle intrigue" && uniquePlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingPlots.push({
            "label": uniquePlots[i],
            "value": uniquePlots[i]
          });
        }
      }

      setHiddenOccurrencePlot(false);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
    } else if (inputValue === "update" || inputValue === "Modifier une intrigue") {
      const uniquePlots = [...new Set(data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        if (uniquePlots[i] !== "Nouvelle intrigue" && uniquePlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingPlots.push({
            "label": uniquePlots[i],
            "value": uniquePlots[i]
          });
        }
      }
      
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(false);
      setHiddenUpdateNamePlot(false);
      setHiddenDeletePlot(true);
    } else if (inputValue === 'delete' || inputValue === "Supprimer une occurrence et / ou une intrigue") {
      const uniquePlots = [...new Set(data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        if (uniquePlots[i] !== "Nouvelle intrigue" && uniquePlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingPlots.push({
            "label": uniquePlots[i],
            "value": uniquePlots[i]
          });
        }
      }
      
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(false);
    } else {
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
    }
  };

  const changeSubfonctionsAddPlots = (event, inputValue) => {
    setSubfonctionsAddPlotsSelected(inputValue);

    if (inputValue === "existing") {
      const uniquePlots = [...new Set(data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        if (uniquePlots[i] !== "Nouvelle intrigue" && uniquePlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingPlots.push({
            "label": uniquePlots[i],
            "value": uniquePlots[i]
          });
        }
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

  const changeSubfonctionsUpdatePlots = (event, inputValue) => {
    setSubfonctionsUpdatePlotsSelected(inputValue);

    setHiddenUpdateNamePlot(false);
  };

  const changeSubfonctionsUpdateNamePlots = (event, inputValue) => {
    setSubfonctionsUpdateNamePlotsSelected(event.currentTarget.value);
  };

  const changeSubfonctionsDeletePlots = (event, inputValue) => {
    setSubfonctionsDeletePlotsSelected(inputValue);
  };

  const changeSubfonctionsPlotPoints = (event, inputValue) => {
    setSubfonctionsPlotPointsSelected(inputValue);

    existingPlotPoints = [];
    
    if (inputValue === "update" || inputValue === "Modifier un Plot Point") {
      const uniquePlotPoints = [...new Set(data.plotPoints.map(item => item.name))];

      for (let i = 0 ; i < uniquePlotPoints.length ; i++) {
        if (data.plotPoints[i].needs[0].name !== "Non") {
          existingPlotPoints.push({
            "label": uniquePlotPoints[i],
            "value": uniquePlotPoints[i]
          });
        }
      }
      
      setHiddenUpdatePlotPoints(false);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
    } else {
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
    }
  };

  const changeSubfonctionsUpdatePlotPoints = (event, inputValue) => {
    setSubfonctionsUpdatePlotPointsSelected(inputValue);

    existingNeedsPlotPoints = [];

    let uniqueNeedsPlotPoints = [];
    
    for (let i = 0 ; i < data.plotPoints.find(item => item.name === inputValue).needs.length ; i++) {
      uniqueNeedsPlotPoints.push(data.plotPoints.find(item => item.name === inputValue).needs[i]);
    }

    for (let i = 0 ; i < uniqueNeedsPlotPoints.length ; i++) {
      existingNeedsPlotPoints.push({
        "label": uniqueNeedsPlotPoints[i].name,
        "value": uniqueNeedsPlotPoints[i].name
      });
    }

    setHiddenUpdateNeedsPlotPoints(false);
    setHiddenUpdateNamePlotPoints(true);
  };

  const changeSubfonctionsUpdateNeedsPlotPoints = (event, inputValue) => {
    setSubfonctionsUpdateNeedsPlotPointsSelected(inputValue);

    existingNamePlotPoints = [];

    let uniqueCharactersPlots = [];

    if (data.plotPoints.find(item => item.name === subfonctionsUpdatePlotPointsSelected).needs.find(item => item.name === inputValue).type === "Personnage") {
      uniqueCharactersPlots = [...new Set(data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharactersPlots.length ; i++) {
        if (uniqueCharactersPlots[i] !== "Nouveau personnage" && uniqueCharactersPlots[i] !== "Choisissez le personnage le plus logique") {
          existingNamePlotPoints.push({
            "label": uniqueCharactersPlots[i],
            "value": uniqueCharactersPlots[i]
          });
        }
      }
    } else if (data.plotPoints.find(item => item.name === subfonctionsUpdatePlotPointsSelected).needs.find(item => item.name === inputValue).type === "Intrigue") {
      uniqueCharactersPlots = [...new Set(data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharactersPlots.length ; i++) {
        if (uniqueCharactersPlots[i] !== "Nouvelle intrigue" && uniqueCharactersPlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingNamePlotPoints.push({
            "label": uniqueCharactersPlots[i],
            "value": uniqueCharactersPlots[i]
          });
        }
      }
    }

    setHiddenUpdateNamePlotPoints(false);
  };

  const changeSubfonctionsUpdateNamePlotPoints = (event, inputValue) => {
    setSubfonctionsUpdateNamePlotPointsSelected(inputValue);
  };

  const changeSubfonctionsThemes = (event, inputValue) => {
    setSubfonctionsThemesSelected(inputValue);

    if (inputValue === "creation" || inputValue === "Création des thèmes") {
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
      if (subfonctionsCharactersSelected === "add" || subfonctionsCharactersSelected === "Ajouter une occurrence et / ou un personnage") {
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
      } else if (subfonctionsCharactersSelected === "creation" || subfonctionsCharactersSelected === "Créer un nouveau personnage") {
        let characterIdentityText = "";
        let characterDescriptorsText = "";
        
        let characterResponse = characterCreation(data.charactersList, [], "", 0, "");

        firebase.updateDocument("helpers", id, {
          "charactersList": characterResponse.charactersList
        }).then(doc => {
          setData(doc.data());
        });

        for (let i = 0 ; i < characterResponse.characterIdentity.length ; i++) {
          characterIdentityText = characterIdentityText + characterResponse.characterIdentity[i];

          if (i < characterResponse.characterIdentity.length - 1) {
            characterIdentityText = characterIdentityText + " / ";
          }
        }

        for (let i = 0 ; i < characterResponse.characterDescriptors.length ; i++) {
          characterDescriptorsText = characterDescriptorsText + characterResponse.characterDescriptors[i];

          if (i < characterResponse.characterDescriptors.length - 1) {
            characterDescriptorsText = characterDescriptorsText + " / ";
          }
        }

        setHistory(h => ([...h, logCharacter("Le personnage " + characterResponse.characterName + " a été créé avec les caractéristiques suivantes (" + characterResponse.characterSpecialTrait.characterSpecialTraitName + " - " + characterIdentityText + " - " + characterDescriptorsText + ")")]));
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
      } else if (subfonctionsCharactersSelected === 'delete' || subfonctionsCharactersSelected === "Supprimer une occurrence et / ou un personnage") {
        let characterResponse = characterDelete(data.charactersList, data.archivedCharacters, subfonctionsDeleteCharactersSelected);

        firebase.updateDocument("helpers", id, {
          "charactersList": characterResponse.charactersList,
          "archivedCharacters": characterResponse.archivedCharacters
        }).then(doc => {
          setData(doc.data());
        });

        if (characterResponse.empty === false) {
          setHistory(h => ([...h, logCharacter("Une occurrence du personnage " + subfonctionsDeleteCharactersSelected + " a été supprimée de la liste de personnages")]));
        } else {
          setHistory(h => ([...h, logCharacter("La dernière occurrence du personnage " + subfonctionsDeleteCharactersSelected + " a été supprimée de la liste de personnages et le personnage est maintenant archivé")]));
        }
      } else if (subfonctionsCharactersSelected === 'information' || subfonctionsCharactersSelected === "Informations sur un personnage") {
        let player = "";
        
        let characterResponse = characterInformation(data.charactersList, subfonctionsInformationCharactersSelected);

        if (characterResponse.player === true) {
          player = "Joueur";
        } else {
          player = "PNJ";
        }

        setHistory(h => ([...h, logCharacter("Nom : " + characterResponse.name + " (" + player + ") / Pièces d'or : " + characterResponse.piecesOr + " / Mode de déplacement : " + characterResponse.travel.travelMode)]));
      }
    } else if (functionSelected === "Description") {
      let descriptionResponse = descriptionRoll();

      setHistory(h => ([...h, logMeaning("Description", descriptionResponse.description1 + " / " + descriptionResponse.description2)]));
    } else if (functionSelected === "Event") {
      let eventResponse = eventCheck();

      setHistory(h => ([...h, logRandomEvent(eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ")\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
    } else if (functionSelected === "Plot") {
      if (subfonctionsPlotsSelected === "add" || subfonctionsPlotsSelected === "Ajouter une occurrence et / ou une intrigue") {
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
      } else if (subfonctionsPlotsSelected === 'update' || subfonctionsPlotsSelected === 'Modifier une intrigue') {
        let plotResponse = plotUpdate(data.plotsList, subfonctionsUpdatePlotsSelected, subfonctionsUpdateNamePlotsSelected);

        firebase.updateDocument("helpers", id, {
          "plotsList": plotResponse.plotsList
        }).then(doc => {
          setData(doc.data());
        });

        setHistory(h => ([...h, logPlot("L'intrigue " + subfonctionsUpdateNamePlotsSelected + " a été mise à jour")]));
      } else if (subfonctionsPlotsSelected === 'delete' || subfonctionsPlotsSelected === "Supprimer une occurrence et / ou une intrigue") {
        let plotResponse = plotDelete(data.plotsList, subfonctionsDeletePlotsSelected);

        firebase.updateDocument("helpers", id, {
          "plotsList": plotResponse.plotsList
        }).then(doc => {
          setData(doc.data());
        });

        if (plotResponse.empty === false) {
          setHistory(h => ([...h, logPlot("Une occurrence de l'intrigue " + subfonctionsDeletePlotsSelected + " a été supprimée de la liste d'intrigues")]));
        } else {
          setHistory(h => ([...h, logPlot("La dernière occurrence de l'intrigue " + subfonctionsDeletePlotsSelected + " a été supprimée de la liste d'intrigues")]));
        }
      }
    } else if (functionSelected === "Plot Points") {
      if (subfonctionsPlotPointsSelected === "generation" || subfonctionsPlotPointsSelected === "Génération des Plot Points") {
        let plotPointsResponse = plotPoints(data.plotPoints, data.charactersList, data.plotsList, data.currentPlot, data.themes, data.archivedCharacters);
        let responseText = "";

        firebase.updateDocument("helpers", id, {
          "plotPoints": plotPointsResponse.plotPointsList.plotPoints,
          "charactersList": plotPointsResponse.plotPointsList.charactersList,
          "plotsList":  plotPointsResponse.plotPointsList.plotsList,
          "currentPlot":  plotPointsResponse.plotPointsList.currentPlot,
          "archivedCharacters":  plotPointsResponse.plotPointsList.archivedCharacters
        }).then(doc => { 
          setData(doc.data());
        });

        for (let i = 0 ; i < plotPointsResponse.plotPointsList.plotPoints.length ; i++) {
          responseText = responseText + (i + 1) + "- " + plotPointsResponse.plotPointsList.plotPoints[i].name;

          if (i < plotPointsResponse.plotPointsList.plotPoints.length - 1) {
            responseText = responseText + "\n";
          }
        }

        setHistory(h => ([...h, logPlotPoints(responseText)]));
      } else if (subfonctionsPlotPointsSelected === "list" || subfonctionsPlotPointsSelected === "Liste des Plot Points") {
        let plotPointsResponse = plotPointsRead(data.plotPoints);
        let responseText = "";
        let needsText = "";

        for (let i = 0 ; i < plotPointsResponse.name.length ; i++) {
          needsText = "";
          
          for (let j = 0 ; j < plotPointsResponse.needs[i].length ; j++) {
            if (plotPointsResponse.needs[i][j].name !== "Non") {
              needsText = needsText + plotPointsResponse.needs[i][j].name;

              if (j < plotPointsResponse.needs[i].length - 1) {
                needsText = needsText + " / ";
              }
            }
          }

          if (needsText === "") {
            responseText = responseText + (i + 1) + "- " + plotPointsResponse.name[i] + " (" + plotPointsResponse.description[i] + ")";
          } else {
            responseText = responseText + (i + 1) + "- " + plotPointsResponse.name[i] + " (" + plotPointsResponse.description[i] + ") - " + needsText;
          }

          if (i < plotPointsResponse.name.length - 1) {
            responseText = responseText + "\n";
          }
        }
        
        setHistory(h => ([...h, logPlotPoints(responseText)]));
      } else if (subfonctionsPlotPointsSelected === "update" || subfonctionsPlotPointsSelected === "Modifier un Plot Point") {
        let plotPointsResponse = plotPointsUpdate(data.plotPoints, subfonctionsUpdatePlotPointsSelected, subfonctionsUpdateNeedsPlotPointsSelected, subfonctionsUpdateNamePlotPointsSelected);

        firebase.updateDocument("helpers", id, {
          "plotPoints": plotPointsResponse.plotPoints
        }).then(doc => {
          setData(doc.data());
        });

        setHistory(h => ([...h, logPlotPoints(subfonctionsUpdateNeedsPlotPointsSelected + " a été remplacé par " + subfonctionsUpdateNamePlotPointsSelected)]));
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
        let themeResponse = themeList(data);

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
        let themeResponse = themeRandom(data.themes);

        if (themeResponse.isExisted === true) {
          setHistory(h => ([...h, logTheme(themeResponse.themeName + " (" + themeResponse.themeDescription + ")")]));
        } else {
          setHistory(h => ([...h, logTheme("La liste des thèmes n'a pas encore été créée pour cette campagne")]));
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
          <RollsButton />
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

      {!hiddenFate ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-fate-label"
          aria-describedby="modal-fate-description"
        >
          <Box sx={style}>
            <Fate chaosFactor={data.chaosFactor} /> 
          </Box>
        </Modal>
      : null}

      {!hiddenLoot ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-loot-label"
          aria-describedby="modal-loot-description"
        >
          <Box sx={style}>
            <Loot inventory={data.inventory} idHelper={id} /> 
          </Box>
        </Modal>
      : null}

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

      {!hiddenDeleteCharacter ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-delete-characters"
        options={existingCharacters}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsDeleteCharacters}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a character"/>}
      /> : null}

      {!hiddenInformationCharacter ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-information-characters"
        options={existingCharacters}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsInformationCharacters}
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

      {!hiddenUpdatePlot ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-update-plots"
        options={existingPlots}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsUpdatePlots}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a plot"/>}
      /> : null}

      {!hiddenUpdateNamePlot ? <TextField
        id="outlined-update-plot"
        label={subfonctionsUpdatePlotsSelected}
        variant="outlined"
        onChange={changeSubfonctionsUpdateNamePlots} /> : null}

      {!hiddenDeletePlot ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-occurrence-delete-plots"
        options={existingPlots}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsDeletePlots}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a plot"/>}
      /> : null}

      {!hiddenPlotPoint ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-plotPoints"
        options={subfonctionsPlotPoints}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsPlotPoints}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a subfonction"/>}
      /> : null}

      {!hiddenUpdatePlotPoints ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-update-plotPoints"
        options={existingPlotPoints}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsUpdatePlotPoints}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a plot point"/>}
      /> : null}
      
      {!hiddenUpdateNeedsPlotPoints ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-update-plotPoints-needs"
        options={existingNeedsPlotPoints}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsUpdateNeedsPlotPoints}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a need"/>}
      /> : null}

      {!hiddenUpdateNamePlotPoints ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-update-plotPoints-name"
        options={existingNamePlotPoints}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsUpdateNamePlotPoints}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a name"/>}
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
