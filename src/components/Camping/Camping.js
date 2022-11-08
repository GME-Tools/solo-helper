import React, { useState } from "react";
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, Stack } from "@mui/material";
import { useHistory, logFate } from "context/HistoryContext";
import setCamping from "backend/tables/camping";

export default function Camping(props) {
  const [, setHistory] = useHistory();
  const [terrainSelected, setTerrainSelected] = useState("");
  
  const changeTerrains = (event, inputValue) => {
    setTerrainSelected(inputValue);
  };

  const clickLaunch = () => {
    let campingResponse = setCamping(props.weather, terrainSelected);
      
    setHistory(h => ([...h, logCamping("Evénement aléatoire\n" + eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ")\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
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
          id="combo-box-terrains"
          options={odds}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeOdds}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose an Odd"/>}
        />
  
        <Button
          variant="contained"
          onClick={clickLaunch}
        >Launch
        </Button>
      </Stack>
    </React.Fragment>
  )
}
