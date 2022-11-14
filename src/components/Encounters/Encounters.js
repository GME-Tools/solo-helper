import React, { useState } from "react";
import { Autocomplete, TextField, Button, Stack } from "@mui/material";
import { useHistory, logEncounters } from "context/HistoryContext";
import { wildernessEncounters, urbanEncounters } from "backend/tables/encounters";

let density = [
  { label: 'Faible', value: 'Faible' },
  { label: 'Moyenne', value: 'Moyenne' },
  { label: 'Elevée', value: 'Elevée' }
];

let dayNight = [
  { label: 'Jour', value: 'Jour' },
  { label: 'Nuit', value: 'Nuit' }
];

let settlement = [
  { label: 'Campement', value: 'Campement' },
  { label: 'Hameau', value: 'Hameau' },
  { label: 'Village', value: 'Village' },
  { label: 'Commune', value: 'Commune' },
  { label: 'Ville', value: 'Ville' },
  { label: 'Métropole', value: 'Métropole' },
];

let subFonctions = [
  { label: 'Rencontres Urbaines', value: 'urbanEncounters' },
  { label: 'Rencontres dans la Nature', value: 'wildernessEncounters' },
];

export default function Encounters(props) {
  const [, setHistory] = useHistory();
  const [subFonctionSelected, setSubFonctionSelected] = useState("");
  const [densitySelected, setDensitySelected] = useState("");
  const [hiddenDensity, setHiddenDensity] = useState(true);
  const [dayNightSelected, setDayNightSelected] = useState("");
  const [hiddenDayNight, setHiddenDayNight] = useState(true);
  const [settlementSelected, setSettlementSelected] = useState("");
  const [hiddenSettlement, setHiddenSettlement] = useState(true);

  const changeSubFonctions = (event, inputValue) => {
    setSubFonctionSelected(inputValue);

    if (inputValue === "Rencontres Urbaines" || inputValue === "urbanEncounters") {
      setHiddenDensity(true);
      setHiddenDayNight(false);
      setHiddenSettlement(false);
    } else if (inputValue === "Rencontres dans la Nature" || inputValue === "wildernessEncounters") {
      setHiddenDensity(false);
      setHiddenDayNight(false);
      setHiddenSettlement(true);
    } else {
      setHiddenDensity(true);
      setHiddenDayNight(true);
      setHiddenSettlement(true);
    }
  };
  
  const changeDensity = (event, inputValue) => {
    setDensitySelected(inputValue);
  };

  const changeDayNight = (event, inputValue) => {
    if (inputValue === "Jour") {
      setDayNightSelected("day");
    } else if (inputValue === "Nuit") {
      setDayNightSelected("night");
    }
  };

  const changeSettlement = (event, inputValue) => {
    setSettlementSelected(inputValue);
  };

  const clickLaunch = () => {
    if (subFonctionSelected === "Rencontres Urbaines" || subFonctionSelected === "urbanEncounters") {
      let encountersResponse = urbanEncounters(settlementSelected, dayNightSelected);

      setHistory(h => ([...h, logEncounters(encountersResponse.encountersName.length)]));
  
      for (let i = 0 ; i < encountersResponse.encountersName.length ; i++) {
        setHistory(h => ([...h, logEncounters(encountersResponse.encountersName[i])]));
      }
    } else if (subFonctionSelected === "Rencontres dans la Nature" || subFonctionSelected === "wildernessEncounters") {
      let encountersResponse = wildernessEncounters(densitySelected, dayNightSelected);

      setHistory(h => ([...h, logEncounters(encountersResponse.encountersName.length)]));
  
      for (let i = 0 ; i < encountersResponse.encountersName.length ; i++) {
        setHistory(h => ([...h, logEncounters(encountersResponse.encountersName[i])]));
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
          id="combo-box-subfonctions"
          options={subFonctions}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubFonctions}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a Subfonction"/>}
        />
        
        {!hiddenDayNight ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-dayNight"
          options={dayNight}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeDayNight}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose Day or Night"/>}
        /> : null}

        {!hiddenSettlement ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-settlement"
          options={settlement}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSettlement}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a Settlement"/>}
        /> : null}
        
        {!hiddenDensity ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-density"
          options={density}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeDensity}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a Density"/>}
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
