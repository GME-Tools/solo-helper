import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Autocomplete, TextField, Button, AppBar, Toolbar, FormControl, RadioGroup, FormControlLabel, Radio, Modal, Box } from "@mui/material";
import { useHistory, logMeaning, logRandomEvent, logTheme } from "context/HistoryContext";
import { useFirebase } from "context/FirebaseContext";
import eventCheck from "backend/mythic/eventCheck";
import actionRoll from "backend/mythic/actionRoll";
import descriptionRoll from "backend/mythic/descriptionRoll";
import { themeCreation, themeList, themeRandom } from "backend/mythic/adventureCrafter";
import RollsButton from 'components/RollsButton/RollsButton';
import Fate from 'components/Fate/Fate';
import Loot from 'components/Loot/Loot';
import Character from 'components/Character/Character';
import Plot from 'components/Plot/Plot';
import PlotPoint from 'components/PlotPoint/PlotPoint';

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
  const [hiddenPlot, setHiddenPlot] = useState(true);
  const [hiddenPlotPoint, setHiddenPlotPoint] = useState(true);
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
      setHiddenPlotPoint(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Fate") {
      handleOpenModal();
      
      setHiddenCharacter(true);
      setHiddenFate(false);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Fantasy Loot") {
      handleOpenModal();
      
      setHiddenCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(false);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Plot") {
      handleOpenModal();
      
      setHiddenCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(false);
      setHiddenPlotPoint(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Plot Points") {
      handleOpenModal();
      
      setHiddenCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(false);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else if (inputValue === "Theme") {
      setHiddenCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenTheme(false);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    } else {
      setHiddenCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenTheme(true);
      setHiddenCreationTheme(true);
      setHiddenManualCreationTheme(true);
    }
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

      {!hiddenPlot ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-plot-label"
          aria-describedby="modal-plot-description"
        >
          <Box sx={style}>
            <Plot plotsList={data.plotsList} currentPlot={data.currentPlot} idHelper={id} /> 
          </Box>
        </Modal>
      : null}

      {!hiddenPlotPoint ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-plotPoint-label"
          aria-describedby="modal-plotPoint-description"
        >
          <Box sx={style}>
            <PlotPoint plotPoints={data.plotPoints} charactersList={data.charactersList} plotsList={data.plotsList} currentPlot={data.currentPlot} themes={data.themes} archivedCharacters={data.archivedCharacters} idHelper={id} /> 
          </Box>
        </Modal>
      : null}

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
