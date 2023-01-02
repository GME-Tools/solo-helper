import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, Button, Stack } from "@mui/material";
import { useHistory, logSettlements } from "context/HistoryContext";
import { unmarkedSettlements } from "backend/tables/settlements";

let densityPopulation = [
  { label: 'Faible', value: 'Faible' },
  { label: 'Moyenne', value: 'Moyenne' },
  { label: 'Elevée', value: 'Elevée' }, 
];

export default function Settlements(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [densityPopulationSelected, setDensityPopulationSelected] = useState("");

  const changeDensityPopulation = (event, inputValue) => {
    setDensityPopulationSelected(inputValue);
  };

  const clickLaunch = () => {
    let settlementsResponse = unmarkedSettlements(densityPopulationSelected);

    let settlements = props.data.settlements;

    if (settlementsResponse.settlementsName.length !== 0) {
      for (let i = 0; i < settlementsResponse.settlementsName.length; i++) {
        let settlement = {
          "settlementsName": settlementsResponse.settlementsName[i],
          "settlementsType": settlementsResponse.settlementsType[i],
          "settlementsPopulation": settlementsResponse.settlementsPopulation[i]
        };
  
        settlements.push(settlement);
      }
    }

    firebase.updateDocument("helpers", props.idHelper, {
      "settlements": settlements
    });

    props.data.settlements = settlements;

    if (settlementsResponse.settlementsName.length !== 0) {
      for (let i = 0; i < settlementsResponse.settlementsName.length; i++) {
        setHistory(h => ([...h, logSettlements(settlementsResponse.settlementsName[i] + " (" + settlementsResponse.settlementsType[i] + " / Population : " + settlementsResponse.settlementsPopulation[i] + ")")]));
      }
    } else {
      setHistory(h => ([...h, logSettlements("Vous n'avez pas trouvé d'établissements.")]));
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
          id="combo-box-settlements"
          options={densityPopulation}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeDensityPopulation}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a density"/>}
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
