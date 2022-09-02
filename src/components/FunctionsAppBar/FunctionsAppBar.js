import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Autocomplete, TextField, Button, AppBar, Toolbar, FormControl, RadioGroup, FormControlLabel, Radio, Modal, Box } from "@mui/material";
import { useHistory, logMeaning, logRandomEvent, logPlot, logPlotPoints, logTheme } from "context/HistoryContext";
import { useFirebase } from "context/FirebaseContext";
import eventCheck from "backend/mythic/eventCheck";
import actionRoll from "backend/mythic/actionRoll";
import descriptionRoll from "backend/mythic/descriptionRoll";
import { themeCreation, themeList, plotRandom, plotList, plotOccurrences, plotAdd, plotUpdate, plotDelete, themeRandom, plotPoints, plotPointsRead, plotPointsUpdate } from "backend/mythic/adventureCrafter";
import RollsButton from 'components/RollsButton/RollsButton';
import Fate from 'components/Fate/Fate';
import Loot from 'components/Loot/Loot';
import Character from 'components/Character/Character';

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
  const [hiddenCharacter, setHiddenCharacter] = useState(true);
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
      handleOpenModal();
      
      setHiddenCharacter(false);
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

      {!hiddenCharacter ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-character-label"
          aria-describedby="modal-character-description"
        >
          <Box sx={style}>
            <Character charactersList={data.charactersList} archivedCharacters={data.archivedCharacters} idHelper={id} /> 
          </Box>
        </Modal>
      : null}

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
