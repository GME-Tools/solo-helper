import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, Stack } from "@mui/material";
import { useHistory, logLoot } from "context/HistoryContext";
import fantasyLootGenerator from "backend/tables/fantasyLootGenerator";

const bodies = [
  { label: 'Humanoïde non-aventurier sans sac, poches ...', value: 'no'}, 
  { label: 'Humanoïde non-aventurier avec un sac, des poches ...', value: 'nw'},
  { label: 'Humanoïde aventurier sans sac, poches ...', value: 'ao'},
  { label: 'Humanoïde aventurier avec un sac, des poches ...', value: 'aw'},
  { label: 'Animaux sauvages', value: 'wa'},
  { label: 'Loot', value: 'lo'}
];

export default function Loot(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [bodiesSelected, setBodiesSelected] = useState("");
  const [placesSelected, setPlacesSelected] = useState("");

  const changeBodies = (event, inputValue) => {
    setBodiesSelected(inputValue);
  };

  const changePlaces = (event, inputValue) => {
    setPlacesSelected(inputValue);
  };

  const clickLaunch = () => {
    let body = "";

    if (bodiesSelected === "Humanoïde non-aventurier sans sac, poches ...") {
      body = "no";
    } else if (bodiesSelected === "Humanoïde non-aventurier avec un sac, des poches ...") {
      body = "nw";
    } else if (bodiesSelected === "Humanoïde aventurier sans sac, poches ...") {
      body = "ao";
    } else if (bodiesSelected === "Humanoïde aventurier avec un sac, des poches ...") {
      body = "aw";
    } else if (bodiesSelected === "Animaux sauvages") {
      body = "wa";
    } else if (bodiesSelected === "Loot") {
      body = "lo";
    }

    let fantasyLootResponse = fantasyLootGenerator(props.data.inventory, body, placesSelected);

    firebase.updateDocument("helpers", props.idHelper, {
      "inventory": fantasyLootResponse.inventory
    });
    
    props.data.inventory = fantasyLootResponse.inventory;

    let responseText = "";

    if (fantasyLootResponse.number === 0) {
      setHistory(h => ([...h, logLoot("Vous n'avez rien looté")]));
    } else {
      for (let i = 0 ; i < fantasyLootResponse.number ; i++) {
        responseText = responseText + fantasyLootResponse.categories[i] + " => " + fantasyLootResponse.items[i];

        if (i < fantasyLootResponse.number - 1) {
          responseText = responseText + "\n\n";
        }
      }
      
      setHistory(h => ([...h, logLoot(responseText)]));
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
          id="combo-box-bodies"
          options={bodies}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeBodies}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a Body"/>}
        />
        
        <FormControl>
          <RadioGroup
            name="radio-buttons-group-places"
            onChange={changePlaces}>
            <FormControlLabel value="valueCommon" control={<Radio />} label="Commun" />
            <FormControlLabel value="valueMilitary" control={<Radio />} label="Militaire" />
            <FormControlLabel value="valueDungeon" control={<Radio />} label="Donjon" />
          </RadioGroup>
        </FormControl>
  
        <Button
          variant="contained"
          onClick={clickLaunch}
        >Launch
        </Button>
      </Stack>
    </React.Fragment>
  )
}
