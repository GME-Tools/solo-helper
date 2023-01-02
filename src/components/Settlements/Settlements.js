import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, Button, Stack } from "@mui/material";
import { useHistory, logSettlements } from "context/HistoryContext";
import { unmarkedSettlements, readSettlements } from "backend/tables/settlements";

const subfonctionsSettlement = [
  { label: 'Créer un établissement', value: 'unmarkedSettlements' },
  { label: 'Liste des établissements', value: 'readSettlements' }
];

const densityPopulation = [
  { label: 'Faible', value: 'Faible' },
  { label: 'Moyenne', value: 'Moyenne' },
  { label: 'Elevée', value: 'Elevée' }, 
];

export default function Settlements(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [subfonctionsSettlementSelected, setSubfonctionsSettlementSelected] = useState("");
  const [densityPopulationSelected, setDensityPopulationSelected] = useState("");
  const [hiddenDensityPopulation, setHiddenDensityPopulation] = useState(true);

const changeSubfonctionsSettlement = (event, inputValue) => {
    setSubfonctionsSettlementSelected(inputValue);

    if (inputValue === 'unmarkedSettlements' || inputValue === 'Créer un établissement') {
      setHiddenDensityPopulation(false);
    } else {
      setHiddenDensityPopulation(true);
    }
  };

  const changeDensityPopulation = (event, inputValue) => {
    setDensityPopulationSelected(inputValue);
  };

  const clickLaunch = () => {
    if (subfonctionsSettlementSelected === 'unmarkedSettlements' || subfonctionsSettlementSelected === 'Créer un établissement') {
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
    } else if (subfonctionsSettlementSelected === 'readSettlements' || subfonctionsSettlementSelected === 'Liste des établissements') {
      let settlementsResponse = readSettlements(props.data.settlements);

      if (settlementsResponse.settlements.length === 0) {
        setHistory(h => ([...h, logSettlements("Il n'y a pas d'établissements.")]));
      } else {
        for (let i = 0; i < settlementsResponse.settlements.length; i++) {
          setHistory(h => ([...h, logSettlements(settlementsResponse.settlements[i].settlementsName + " (" + settlementsResponse.settlements[i].settlementsType + " / Population : " + settlementsResponse.settlements[i].settlementsPopulation + ")")]));
        }
      }
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
          options={subfonctionsSettlement}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsSettlement}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a subfonction"/>}
        />
        
        {!hiddenDensityPopulation ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-settlements-density"
          options={densityPopulation}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeDensityPopulation}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a density"/>}
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
