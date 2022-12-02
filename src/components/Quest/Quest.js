import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, Stack } from "@mui/material";
import { useHistory, logQuest } from "context/HistoryContext";
import { createQuest, readQuest, updateQuest } from "backend/tables/quest";

const subfonctionsQuest = [
  { label: 'Créer une quête', value: 'createQuest' },
  { label: 'Liste des quêtes', value: 'readQuest' },
  { label: 'Clore une quête', value: 'updateQuest' },
];

let inProgressQuests = [];

export default function Quest(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [subfonctionsQuestSelected, setSubfonctionsQuestSelected] = useState("");
  const [readQuestSelected, setReadQuestSelected] = useState("");
  const [hiddenReadQuest, setHiddenReadQuest] = useState(true);
  const [updateQuestSelected, setUpdateQuestSelected] = useState("");
  const [hiddenUpdateQuest, setHiddenUpdateQuest] = useState(true);

  const changeSubfonctionsQuest = (event, inputValue) => {
    setSubfonctionsQuestSelected(inputValue);

    if (inputValue === 'readQuest' || inputValue === 'Liste des quêtes') {
      setHiddenReadQuest(false);
      setHiddenUpdateQuest(true);
    } else if (inputValue === 'updateQuest' || inputValue === 'Clore une quête') {
      inProgressQuests = [];
      
      for (let i = 0 ; i < props.data.quests.length ; i++) {
        if (props.data.quests[i].questDone === false) {
          inProgressQuests.push({
            "label": props.data.quests[i].questProblem,
            "value": props.data.quests[i].questProblem
          });
        }
      }
      
      setHiddenReadQuest(true);
      setHiddenUpdateQuest(false);
    } else {
      setHiddenReadQuest(true);
      setHiddenUpdateQuest(true);
    }
  };

  const changeReadQuest = (event, inputValue) => {
    if (event.currentTarget.value === "done") {
      setReadQuestSelected(true);
    } else {
      setReadQuestSelected(false);
    }
  };

  const changeUpdateQuest = (event, inputValue) => {
    setUpdateQuestSelected(inputValue);
  };

  const clickLaunch = () => {
    if (subfonctionsQuestSelected === 'createQuest' || subfonctionsQuestSelected === 'Créer une quête') {
      let questResponse = createQuest();

      let quest = [{
        "questProblem": questResponse.questProblem,
        "questResultant": questResponse.questResultant,
        "questSource": questResponse.questSource,
        "questDone": false
      }];

      let quests = props.data.quests;
      quests.push(quest[0]);

      firebase.updateDocument("helpers", props.idHelper, {
        "quests": quests
      });

      props.data.quests = quests;

      setHistory(h => ([...h, logQuest(questResponse.questProblem + " (" + questResponse.questResultant + ") - " + questResponse.questSource)]));
    } else if (subfonctionsQuestSelected === 'readQuest' || subfonctionsQuestSelected === 'Liste des quêtes') {
      let questResponse = readQuest(props.data.quests, readQuestSelected);

      if (questResponse.quests.length === 0) {
        setHistory(h => ([...h, logQuest("Il n'y a pas de quêtes.")]));
      } else {
        for (let i = 0; i < questResponse.quests.length; i++) {
          setHistory(h => ([...h, logQuest(questResponse.quests[i].questProblem + " (" + questResponse.quests[i].questResultant + ") - " + questResponse.quests[i].questSource)]));
        }
      }
    } else if (subfonctionsQuestSelected === 'updateQuest' || subfonctionsQuestSelected === 'Clore une quête') {
      let questResponse = updateQuest(props.data.quests, updateQuestSelected);

      firebase.updateDocument("helpers", props.idHelper, {
        "quests": questResponse.questsData
      });

      props.data.quests = questResponse.questsData;

      setHistory(h => ([...h, logQuest('La quête "' + updateQuestSelected + '" est terminée.')]));
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
          id="combo-box-quest"
          options={subfonctionsQuest}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsQuest}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a subfonction"/>}
        />

        {!hiddenReadQuest ? <FormControl>
          <RadioGroup
            name="radio-buttons-group-read-quest"
            onChange={changeReadQuest}>
            <FormControlLabel value="inProgress" control={<Radio />} label="En cours" />
            <FormControlLabel value="done" control={<Radio />} label="Terminées" />
          </RadioGroup>
        </FormControl> : null}

        {!hiddenUpdateQuest ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-quest-update"
          options={inProgressQuests}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeUpdateQuest}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose a Quest"/>}
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
