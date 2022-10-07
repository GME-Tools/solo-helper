import React, { useState } from "react";
import { Autocomplete, TextField, Button, Stack, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useHistory, logCreature } from "context/HistoryContext";
import creatureCrafter from "backend/mythic/creatureCrafter";

const creatureNumberOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
];

export default function Creature(props) {
  const [, setHistory] = useHistory();
  const [subfonctionsCreatureNumberSelected, setSubfonctionsCreatureNumberSelected] = useState("");
  const [hiddenCreaturesNumbers, setHiddenCreaturesNumbers] = useState(true);
  const [subfonctionsCreatureAutoManual, setSubfonctionsCreatureAutoManual] = useState("");

  const changeCreaturesAutoManual = (event, inputValue) => {
    setSubfonctionsCreatureAutoManual(inputValue);

    if (inputValue === "manual") {
      setHiddenCreaturesNumbers(false);
    } else {
      setHiddenCreaturesNumbers(true);
    }
  };

  const changeSubfonctionsCreatureNumber = (event, inputValue) => {
    setSubfonctionsCreatureNumberSelected(inputValue);
  };

  const clickLaunch = () => {
    let specialClassification = "";
    let specialClassifications = [];
    let description = "";
    let descriptions = [];
    let ability = "";
    let abilities = [];
    let number = 0;

    if (subfonctionsCreatureAutoManual === "random") {
      number = 0;
    } else {
      number = subfonctionsCreatureNumberSelected;
    }

    let creatureResponse = creatureCrafter(props.data, number);

    for (let i = 0 ; i < creatureResponse.creatures.length ; i++) {
      if (creatureResponse.creatures[i].specialClassification.length > 0) {
        specialClassification = "";
        
        for (let j = 0 ; j < creatureResponse.creatures[i].specialClassification.length ; j++) {
          specialClassification = specialClassification + creatureResponse.creatures[i].specialClassification[j];

          if (j < creatureResponse.creatures[i].specialClassification.length - 1) {
            specialClassification = specialClassification + " / ";
          }
        }
  
        specialClassifications.push(specialClassification);
      } else {
        specialClassification = "";
        
        specialClassifications.push(specialClassification);
      }
    }

    for (let i = 0 ; i < creatureResponse.creatures.length ; i++) {
      description = "";
      
      for (let j = 0 ; j < creatureResponse.creatures[i].description.length ; j++) {
        description = description + creatureResponse.creatures[i].description[j];

        if (j < creatureResponse.creatures[i].description.length - 1) {
          description = description + " / ";
        }
      }

      descriptions.push(description);
    }

    for (let i = 0 ; i < creatureResponse.creatures.length ; i++) {
      if (creatureResponse.creatures[i].abilities.length > 0) {
        ability = "";
        
        for (let j = 0 ; j < creatureResponse.creatures[i].abilities.length ; j++) {
          ability = ability + creatureResponse.creatures[i].abilities[j].name;

          if (creatureResponse.creatures[i].abilities[j].subDescription.length > 0) {
            for (let k = 0 ; k < creatureResponse.creatures[i].abilities[j].subDescription.length ; k++){
              ability = ability + " (" + creatureResponse.creatures[i].abilities[j].subDescription[k] + ")";
            }
          }

          if (j < creatureResponse.creatures[i].abilities.length - 1) {
            ability = ability + " / ";
          }
        }
  
        abilities.push(ability);
      } else {
        ability = "";
        
        abilities.push(ability);
      }
    }

    for (let i = 0 ; i < creatureResponse.creatures.length ; i++) {
      setHistory(h => ([...h, logCreature("Classe : " + creatureResponse.creatures[i].classification.name + " (Taille : " + creatureResponse.creatures[i].size + " ; Descriptions : " + descriptions[i] + ")")]));

      setHistory(h => ([...h, logCreature("Caractéristiques spéciales : " + specialClassifications[i])]));

      if (abilities[i] !== "") {
        setHistory(h => ([...h, logCreature("Compétences : " + abilities[i])]));
      }

      setHistory(h => ([...h, logCreature("Santé : " + creatureResponse.creatures[i].skills.health.dice + " (" + creatureResponse.creatures[i].skills.health.healthModifier + ") / Vitesse : " + creatureResponse.creatures[i].skills.speed.dice + " (" + creatureResponse.creatures[i].skills.speed.speedModifier + ") / Défense : " + creatureResponse.creatures[i].skills.defense.dice + " (" + creatureResponse.creatures[i].skills.defense.defenseModifier + ") / Attaque : " + creatureResponse.creatures[i].skills.offense.dice + " (" + creatureResponse.creatures[i].skills.offense.offenseModifier + ")")]));
    }
  }
  
  return (
    <React.Fragment>
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >

        <FormControl>
          <RadioGroup
            name="radio-buttons-group-creatures"
            onChange={changeCreaturesAutoManual}>
            <FormControlLabel value="random" control={<Radio />} label="Aléatoire" />
            <FormControlLabel value="manual" control={<Radio />} label="Manuel" />
          </RadioGroup>
        </FormControl>
        
        { !hiddenCreaturesNumbers ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-creature-number"
          options={creatureNumberOptions}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsCreatureNumber}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a Number"/>}
        /> : null }
        
        <Button
          variant="contained"
          onClick={clickLaunch}
        >Launch
        </Button>
      </Stack>
    </React.Fragment>
  )
}
