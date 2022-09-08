import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, Button, Stack } from "@mui/material";
import { useHistory, logBehavior } from "context/HistoryContext";
import { behaviorDescriptors } from "backend/mythic/behaviorCheck";

const subfonctionsBehavior = [
  { label: 'Mettre à jour le bonus des descripteurs activés', value: 'activatedDescriptors' }
];

let existingCharacters = [];

let activatedDescriptors = [
  { label: '-6', value: '-6' },
  { label: '-4', value: '-4' },
  { label: '-2', value: '-2' },
  { label: '0', value: '0' },
  { label: '2', value: '2' },
  { label: '4', value: '4' },
  { label: '6', value: '6' },
];

export default function Behavior(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [subfonctionsBehaviorSelected, setSubfonctionsBehaviorSelected] = useState("");
  const [subfonctionsBehaviorActivatedDescriptorsCharactersSelected, setSubfonctionsBehaviorActivatedDescriptorsCharactersSelected] = useState("");
  const [hiddenBehaviorActivatedDescriptorsCharacters, setHiddenBehaviorActivatedDescriptorsCharacters] = useState(true);
  const [subfonctionsBehaviorActivatedDescriptorsNumbersSelected, setSubfonctionsBehaviorActivatedDescriptorsNumbersSelected] = useState("");
  const [hiddenBehaviorActivatedDescriptorsNumbers, setHiddenBehaviorActivatedDescriptorsNumbers] = useState(true);

  const changeSubfonctionsBehavior = (event, inputValue) => {
    setSubfonctionsBehaviorSelected(inputValue);

    if (inputValue === 'activatedDescriptors' || inputValue === 'Mettre à jour le bonus des descripteurs activés') {
      const uniqueCharacters = [...new Set(props.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }
      
      setHiddenBehaviorActivatedDescriptorsCharacters(false);
      setHiddenBehaviorActivatedDescriptorsNumbers(true);
    } else {
      setHiddenBehaviorActivatedDescriptorsCharacters(true);
      setHiddenBehaviorActivatedDescriptorsNumbers(true);
    }
  };

  const changeSubfonctionsActivatedDescriptorsCharacters = (event, inputValue) => {
    setSubfonctionsBehaviorActivatedDescriptorsCharactersSelected(inputValue);

    setHiddenBehaviorActivatedDescriptorsNumbers(false);
  }

  const changeSubfonctionsActivatedDescriptorsNumbers = (event, inputValue) => {
    setSubfonctionsBehaviorActivatedDescriptorsNumbersSelected(inputValue);
  }

  const clickLaunch = () => {
    if (subfonctionsBehaviorSelected === "activatedDescriptors" || subfonctionsBehaviorSelected === "Mettre à jour le bonus des descripteurs activés") {
      let behaviorResponse = behaviorDescriptors(props.charactersList, subfonctionsBehaviorActivatedDescriptorsCharactersSelected, subfonctionsBehaviorActivatedDescriptorsNumbersSelected);

      firebase.updateDocument("helpers", props.idHelper, {
        "charactersList": behaviorResponse.charactersList
      /* }).then(doc => {
          setData(doc.data()); */
      });

      setHistory(h => ([...h, logBehavior("Le bonus des descripteurs activés pour " + subfonctionsBehaviorActivatedDescriptorsCharactersSelected + " est maintenant de " + subfonctionsBehaviorActivatedDescriptorsNumbersSelected)]));
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
          id="combo-box-behavior"
          options={subfonctionsBehavior}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsBehavior}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a subfonction"/>}
        />

        {!hiddenBehaviorActivatedDescriptorsCharacters ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-behavior-activatedDescriptors-characters"
          options={existingCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsActivatedDescriptorsCharacters}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a character"/>}
        /> : null}

        {!hiddenBehaviorActivatedDescriptorsNumbers ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-behavior-activatedDescriptors-numbers"
          options={activatedDescriptors}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsActivatedDescriptorsNumbers}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a number"/>}
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
