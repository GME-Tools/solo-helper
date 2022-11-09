import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Autocomplete, TextField, Button, AppBar, Toolbar, Modal, Box } from "@mui/material";
import { useHistory, logMeaning, logRandomEvent } from "context/HistoryContext";
import { useFirebase } from "context/FirebaseContext";
import eventCheck from "backend/mythic/eventCheck";
import actionRoll from "backend/mythic/actionRoll";
import descriptionRoll from "backend/mythic/descriptionRoll";
import RollsButton from 'components/RollsButton/RollsButton';
import Fate from 'components/Fate/Fate';
import Loot from 'components/Loot/Loot';
import Character from 'components/Character/Character';
import Plot from 'components/Plot/Plot';
import PlotPoint from 'components/PlotPoint/PlotPoint';
import Theme from 'components/Theme/Theme';
import Behavior from 'components/Behavior/Behavior';
import detailCheck from 'backend/mythic/detailCheck';
import Statistic from 'components/Statistic/Statistic';
import Creature from 'components/Creature/Creature';
import Weather from 'components/Weather/Weather';
import Camping from 'components/Camping/Camping';

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
  { label: 'Behavior', id: 2 },
  { label: 'Camping', id: 3 },
  { label: 'Character', id: 4 },
  { label: 'Creature', id: 5 },
  { label: 'Description', id: 6 },
  { label: 'Detail', id: 7 },
  { label: 'Event', id: 8 },
  { label: 'Fantasy Loot', id: 9 },
  { label: 'Fate', id: 10 },
  { label: 'Plot', id: 11 },
  { label: 'Plot Points', id: 12 },
  { label: 'Statistic', id: 13 },
  { label: 'Theme', id: 14 },
  { label: 'Weather', id: 15 }
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
  const [hiddenTheme, setHiddenTheme] = useState(true);
  const [hiddenBehavior, setHiddenBehavior] = useState(true);
  const [hiddenStatistic, setHiddenStatistic] = useState(true);
  const [hiddenCreature, setHiddenCreature] = useState(true);
  const [hiddenWeather, setHiddenWeather] = useState(true);
  const [hiddenCamping, setHiddenCamping] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const changeFunctions = (event, inputValue) => {
    setFunctionSelected(inputValue);
              
    if (inputValue === "Behavior") {
      handleOpenModal();

      setHiddenBehavior(false);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Camping") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(false);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Character") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(false);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Creature") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(false);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Fate") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(false);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Fantasy Loot") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(false);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Plot") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(false);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Plot Points") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(false);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Statistic") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(false);
      setHiddenTheme(true);
      setHiddenWeather(true);
    } else if (inputValue === "Theme") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(false);
      setHiddenWeather(true);
    } else if (inputValue === "Weather") {
      handleOpenModal();

      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(false);
    } else {
      setHiddenBehavior(true);
      setHiddenCamping(true);
      setHiddenCharacter(true);
      setHiddenCreature(true);
      setHiddenFate(true);
      setHiddenLoot(true);
      setHiddenPlot(true);
      setHiddenPlotPoint(true);
      setHiddenStatistic(true);
      setHiddenTheme(true);
      setHiddenWeather(true);
    }
  };

  const updateData = data => {
    setData(data);
  }
  
  const clickLaunch = () => {
    if (functionSelected === "Action") {
      let actionResponse = actionRoll();
      
      setHistory(h => ([...h, logMeaning("Action", actionResponse.action + " / " + actionResponse.subject)]));
    } else if (functionSelected === "Description") {
      let descriptionResponse = descriptionRoll();

      setHistory(h => ([...h, logMeaning("Description", descriptionResponse.description1 + " / " + descriptionResponse.description2)]));
    } else if (functionSelected === "Detail") {
      let detailResponse = detailCheck(data.chaosFactor, data.charactersList, data.plotsList, data.currentPlot);

      setHistory(h => ([...h, logMeaning("Detail", detailResponse.detailName + " (" + detailResponse.detailDescription + ") - " + detailResponse.detailNeed)]));
    } else if (functionSelected === "Event") {
      let eventResponse = eventCheck(data.charactersList, data.plotsList, data.currentPlot);

      if (eventResponse.eventFocusNeed === "Non") {
        setHistory(h => ([...h, logRandomEvent(eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ")\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
      } else {
        setHistory(h => ([...h, logRandomEvent(eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ") - " + eventResponse.eventFocusNeed + "\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
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
            <Fate data={data} updateData={updateData} /> 
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
            <Loot idHelper={id} data={data} updateData={updateData} /> 
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
            <Character idHelper={id} data={data} updateData={updateData} /> 
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
            <Plot idHelper={id} data={data} updateData={updateData} /> 
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
            <PlotPoint idHelper={id} data={data} updateData={updateData} /> 
          </Box>
        </Modal>
      : null}

      {!hiddenTheme ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-theme-label"
          aria-describedby="modal-theme-description"
        >
          <Box sx={style}>
            <Theme idHelper={id} data={data} updateData={updateData} /> 
          </Box>
        </Modal>
      : null}

      {!hiddenBehavior ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-behavior-label"
          aria-describedby="modal-behavior-description"
        >
          <Box sx={style}>
            <Behavior idHelper={id} data={data} updateData={updateData} />
          </Box>
        </Modal>
      : null}

      {!hiddenStatistic ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-statistic-label"
          aria-describedby="modal-statistic-description"
        >
          <Box sx={style}>
            <Statistic data={data} updateData={updateData} />
          </Box>
        </Modal>
      : null}

      {!hiddenCreature ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-creature-label"
          aria-describedby="modal-creature-description"
        >
          <Box sx={style}>
            <Creature data={data} updateData={updateData} />
          </Box>
        </Modal>
      : null}

      {!hiddenWeather ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-weather-label"
          aria-describedby="modal-weather-description"
        >
          <Box sx={style}>
            <Weather idHelper={id} data={data} updateData={updateData} />
          </Box>
        </Modal>
      : null}

      {!hiddenCamping ?
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-camping-label"
          aria-describedby="modal-camping-description"
        >
          <Box sx={style}>
            <Camping idHelper={id} data={data} updateData={updateData} />
          </Box>
        </Modal>
      : null}

      <Button
        variant="contained"
        onClick={clickLaunch}
      >Launch
      </Button>
    </React.Fragment>
  )
}
