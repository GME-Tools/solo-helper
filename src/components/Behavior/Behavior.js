import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, Button, Stack } from "@mui/material";
import { useHistory, logBehavior } from "context/HistoryContext";
import { behaviorDescriptors, behaviorDisposition, behaviorAction } from "backend/mythic/behaviorCheck";

const subfonctionsBehavior = [
  { label: 'Mettre à jour le bonus des descripteurs activés', value: 'activatedDescriptors' },
  { label: "Générer la disposition d'un Personnage", value: 'disposition' },
  { label: "Générer l'action d'un Personnage", value: 'action' }
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
  const [subfonctionsBehaviorDispositionSelected, setSubfonctionsBehaviorDispositionSelected] = useState("");
  const [hiddenBehaviorDisposition, setHiddenBehaviorDisposition] = useState(true);
  const [subfonctionsBehaviorActionSelected, setSubfonctionsBehaviorActionSelected] = useState("");
  const [hiddenBehaviorAction, setHiddenBehaviorAction] = useState(true);

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
      setHiddenBehaviorDisposition(true);
      setHiddenBehaviorAction(true);
    } else if (inputValue === 'disposition' || inputValue === "Générer la disposition d'un Personnage") {
      const uniqueCharacters = [...new Set(props.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }
      
      setHiddenBehaviorActivatedDescriptorsCharacters(true);
      setHiddenBehaviorActivatedDescriptorsNumbers(true);
      setHiddenBehaviorDisposition(false);
      setHiddenBehaviorAction(true);
    } else if (inputValue === 'action' || inputValue === "Générer l'action d'un Personnage") {
      const uniqueCharacters = [...new Set(props.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }
      
      setHiddenBehaviorActivatedDescriptorsCharacters(true);
      setHiddenBehaviorActivatedDescriptorsNumbers(true);
      setHiddenBehaviorDisposition(true);
      setHiddenBehaviorAction(false);
    } else {
      setHiddenBehaviorActivatedDescriptorsCharacters(true);
      setHiddenBehaviorActivatedDescriptorsNumbers(true);
      setHiddenBehaviorDisposition(true);
      setHiddenBehaviorAction(true);
    }
  };

  const changeSubfonctionsActivatedDescriptorsCharacters = (event, inputValue) => {
    setSubfonctionsBehaviorActivatedDescriptorsCharactersSelected(inputValue);

    setHiddenBehaviorActivatedDescriptorsNumbers(false);
  }

  const changeSubfonctionsActivatedDescriptorsNumbers = (event, inputValue) => {
    setSubfonctionsBehaviorActivatedDescriptorsNumbersSelected(inputValue);
  }

  const changeSubfonctionsDisposition = (event, inputValue) => {
    setSubfonctionsBehaviorDispositionSelected(inputValue);
  }

  const changeSubfonctionsAction = (event, inputValue) => {
    setSubfonctionsBehaviorActionSelected(inputValue);
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
    } else if (subfonctionsBehaviorSelected === 'disposition' || subfonctionsBehaviorSelected === "Générer la disposition d'un Personnage") {
      let behaviorResponse = behaviorDisposition(props.charactersList, subfonctionsBehaviorDispositionSelected);

      firebase.updateDocument("helpers", props.idHelper, {
        "charactersList": behaviorResponse.charactersList
      /* }).then(doc => {
          setData(doc.data()); */
      });

      setHistory(h => ([...h, logBehavior(behaviorResponse.dispositionName + " (" + behaviorResponse.dispositionDescription + ")")]));
    } else if (subfonctionsBehaviorSelected === 'action' || subfonctionsBehaviorSelected === "Générer l'action d'un Personnage") {
      let need = "";
      
      let behaviorResponse = behaviorAction(props.charactersList, subfonctionsBehaviorActionSelected, props.plotsList, props.currentPlot);

      firebase.updateDocument("helpers", props.idHelper, {
        "charactersList": behaviorResponse.charactersList
      /* }).then(doc => {
          setData(doc.data()); */
      });

      for (let i = 0 ; i < behaviorResponse.actionNeed.length ; i++) {
        need = need + behaviorResponse.actionNeed[i];

        if (i < behaviorResponse.actionNeed.length - 1) {
          need = need + "\n";
        }
      }

      setHistory(h => ([...h, logBehavior(behaviorResponse.actionName + " (" + behaviorResponse.actionDescription + ") - " + need)]));

      if (behaviorResponse.newDisposition === true) {
        setHistory(h => ([...h, logBehavior("Nouvelle disposition de " + subfonctionsBehaviorActionSelected + " : " + behaviorResponse.dispositionName + " (" + behaviorResponse.dispositionDescription + ")")]));
      }

      if (behaviorResponse.descriptor !== "") {
        setHistory(h => ([...h, logBehavior("Nouveau descripteur pour " + subfonctionsBehaviorActionSelected + " : " + behaviorResponse.descriptor + " (" + behaviorResponse.actionDescriptionDescriptor + ")")]));
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

        {!hiddenBehaviorDisposition ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-behavior-disposition"
          options={existingCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsDisposition}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a character"/>}
        /> : null}

        {!hiddenBehaviorAction ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-behavior-action"
          options={existingCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsAction}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a character"/>}
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
