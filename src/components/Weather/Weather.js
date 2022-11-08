import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, Stack } from "@mui/material";
import { useHistory, logWeather } from "context/HistoryContext";
import { seasonSet, seasonRead, weatherRandom, weatherRead } from "backend/tables/weather";
const weatherData = require('../../data/weather');

const subfonctionsWeather = [
  { label: 'Connaître la météo', value: 'readWeather' },
  { label: 'Connaître la saison', value: 'readSeason' },
  { label: 'Générer / Créer la météo', value: 'createWeather' },
  { label: 'Générer / Créer la saison', value: 'createSeason' }
];

let seasonWeathers = [];

const seasons = [
  { label: 'Hiver', value: 'Hiver' },
  { label: 'Printemps', value: 'Printemps' },
  { label: 'Eté', value: 'Eté' },
  { label: 'Automne', value: 'Automne' },
];

export default function Weather(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [subfonctionsWeatherSelected, setSubfonctionsWeatherSelected] = useState("");
  const [updateSeasonSelected, setUpdateSeasonSelected] = useState("");
  const [hiddenUpdateSeason, setHiddenUpdateSeason] = useState(true);
  const [hiddenUpdateManualSeason, setHiddenUpdateManualSeason] = useState(true);
  const [updateWeatherSelected, setUpdateWeatherSelected] = useState("");
  const [hiddenUpdateWeather, setHiddenUpdateWeather] = useState(true);
  const [hiddenUpdateManualWeather, setHiddenUpdateManualWeather] = useState(true);

  const changeSubfonctionsWeather = (event, inputValue) => {
    setSubfonctionsWeatherSelected(inputValue);

    if (inputValue === 'createSeason' || inputValue === 'Générer / Créer la saison') {
      setHiddenUpdateSeason(false);
      setHiddenUpdateManualSeason(true);
      setHiddenUpdateWeather(true);
      setHiddenUpdateManualWeather(true);
    } else if (inputValue === 'createWeather' || inputValue === 'Générer / Créer la météo') {
      setHiddenUpdateSeason(true);
      setHiddenUpdateManualSeason(true);
      setHiddenUpdateWeather(false);
      setHiddenUpdateManualWeather(true);
    } else {
      setHiddenUpdateSeason(true);
      setHiddenUpdateManualSeason(true);
      setHiddenUpdateWeather(true);
      setHiddenUpdateManualWeather(true);
    }
  };

  const changeUpdateSeason = (event, inputValue) => {
    if (event.currentTarget.value === "auto") {
      setUpdateSeasonSelected(inputValue);
      setHiddenUpdateManualSeason(true);
    } else {
      setHiddenUpdateManualSeason(false);
    }
  };

  const changeUpdateManualSeason = (event, inputValue) => {
    setUpdateSeasonSelected(inputValue);
  };

  const changeUpdateWeather = (event, inputValue) => {
    if (event.currentTarget.value === "auto") {
      setUpdateWeatherSelected(inputValue);
      setHiddenUpdateManualWeather(true);
    } else {
      for (let i = 1 ; i <= Object.keys(weatherData.weather).length ; i++) {
        seasonWeathers.push({
          "label": weatherData.weather[i][props.data.season],
          "value": weatherData.weather[i][props.data.season]
        });
      }
      
      setHiddenUpdateManualWeather(false);
    }
  };

  const changeUpdateManualWeather = (event, inputValue) => {
    setUpdateWeatherSelected(inputValue);
  };

  const clickLaunch = () => {
    if (subfonctionsWeatherSelected === 'createSeason' || subfonctionsWeatherSelected === 'Générer / Créer la saison') {
      let weatherResponse = seasonSet(updateSeasonSelected);

      firebase.updateDocument("helpers", props.idHelper, {
        "season": weatherResponse.season
      });

      props.data.season = weatherResponse.season;
        
      setHistory(h => ([...h, logWeather("La saison actuelle est : " + weatherResponse.season)]));
    } else if (subfonctionsWeatherSelected === 'readSeason' || subfonctionsWeatherSelected === 'Connaître la saison') {
      let weatherResponse = seasonRead(props.data.season);
        
      setHistory(h => ([...h, logWeather("La saison actuelle est : " + weatherResponse.season)]));
    } else if (subfonctionsWeatherSelected === 'createWeather' || subfonctionsWeatherSelected === 'Générer / Créer la météo') {
      let weatherResponse = weatherRandom(updateWeatherSelected, props.data.season, "");

      firebase.updateDocument("helpers", props.idHelper, {
        "weather": weatherResponse.weather
      });

      props.data.weather = weatherResponse.weather;
        
      setHistory(h => ([...h, logWeather("La météo actuelle est : " + weatherResponse.weather)]));
    } else if (subfonctionsWeatherSelected === 'readWeather' || subfonctionsWeatherSelected === 'Connaître la météo') {
      let weatherResponse = weatherRead(props.data.season, props.data.weather);
        
      setHistory(h => ([...h, logWeather("La météo actuelle est : " + weatherResponse.weather)]));
    }

    props.updateData(props.data);
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
          id="combo-box-weather"
          options={subfonctionsWeather}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsWeather}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a subfonction"/>}
        />

        {!hiddenUpdateSeason ? <FormControl>
          <RadioGroup
            name="radio-buttons-group-update-season"
            onChange={changeUpdateSeason}>
            <FormControlLabel value="auto" control={<Radio />} label="Automatique" />
            <FormControlLabel value="manual" control={<Radio />} label="Manuel" />
          </RadioGroup>
        </FormControl> : null}

        {!hiddenUpdateManualSeason ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-season-update-manual"
          options={seasons}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeUpdateManualSeason}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a season"/>}
        /> : null}

        {!hiddenUpdateWeather ? <FormControl>
          <RadioGroup
            name="radio-buttons-group-update-weather"
            onChange={changeUpdateWeather}>
            <FormControlLabel value="auto" control={<Radio />} label="Automatique" />
            <FormControlLabel value="manual" control={<Radio />} label="Manuel" />
          </RadioGroup>
        </FormControl> : null}

        {!hiddenUpdateManualWeather ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-weather-update-manual"
          options={seasonWeathers}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeUpdateManualWeather}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a Weather"/>}
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
