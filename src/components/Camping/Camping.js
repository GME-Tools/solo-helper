import React, { useState } from "react";
import { Autocomplete, TextField, Button, Stack } from "@mui/material";
import { useHistory, logCamping } from "context/HistoryContext";
import setCamping from "backend/tables/camping";
const campingData = require('../../data/camping');

let terrains = [];

const terrainsGet = () => {
  for (let i = 1 ; i <= Object.keys(campingData.findCamping).length ; i++) {
    terrains.push({
      "label": campingData.findCamping[i].terrain,
      "value": campingData.findCamping[i].terrain
    });
  }
};

terrainsGet();

export default function Camping(props) {
  const [, setHistory] = useHistory();
  const [terrainSelected, setTerrainSelected] = useState("");
  
  const changeTerrain = (event, inputValue) => {
    setTerrainSelected(inputValue);
  };

  const clickLaunch = () => {
    let camping = "";
    let bivouac = "";
    
    let campingResponse = setCamping(props.data.weather, terrainSelected);

    if (campingResponse.findCamping === true) {
      camping = "Vous avez trouvé un endroit où camper";
    } else {
      camping = "Vous n'avez pas trouvé un endroit où camper";
    }

    if (campingResponse.bivouacSuccess === true) {
      bivouac = "Vous avez trouvé les matériaux pour faire un bivouac";
    } else {
      bivouac = "Vous n'avez pas trouvé les matériaux pour faire un bivouac";
    }

    if (campingResponse.disturbanceName !== "") {
      setHistory(h => ([...h, logCamping(camping + " / " + bivouac + " / " + campingResponse.disturbanceName)]));
    } else {
      setHistory(h => ([...h, logCamping(camping + " / " + bivouac)]));
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
          id="combo-box-terrains"
          options={terrains}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeTerrain}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a Terrain"/>}
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
