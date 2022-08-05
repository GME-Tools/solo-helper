import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Autocomplete, TextField, Button, AppBar, Toolbar, IconButton, Menu, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import { useHistory, logDieRoll, logMeaning, logRandomEvent, logFate, logLoot, logCharacter } from "context/HistoryContext";
import { useFirebase } from "context/FirebaseContext";
import eventCheck from "backend/mythic/eventCheck";
import fateCheck from "backend/mythic/fateCheck";
import actionRoll from "backend/mythic/actionRoll";
import descriptionRoll from "backend/mythic/descriptionRoll";
import fantasyLootGenerator from "backend/tables/fantasyLootGenerator";
import { characterRandom, characterList } from "backend/mythic/adventureCrafter";

const options = [
  'd4',
  'd6', 
  'd8', 
  'd10', 
  'd12', 
  'd20', 
  'd100', 
  'Custom'
];

const odds = [
  'Impossible',
  'Certainement pas',
  'Très improbable',
  'Improbable',
  '50/50 ou Pas sûr',
  'Probable',
  'Très probable',
  'Chose sûre',
  'Comme ça doit être'
];

const ITEM_HEIGHT = 48;

const functions = [
  { label: 'Action', id: 1 },
  { label: 'Character', id: 2 },
  { label: 'Description', id: 3 },
  { label: 'Event', id: 4 },
  { label: 'Fantasy Loot', id: 5 },
  { label: 'Fate', id: 6 }
];

const bodies = [
  { label: 'Humanoïde non-aventurier sans sac, poches ...', value: 'no'}, 
  { label: 'Humanoïde non-aventurier avec un sac, des poches ...', value: 'nw'},
  { label: 'Humanoïde aventurier sans sac, poches ...', value: 'ao'},
  { label: 'Humanoïde aventurier avec un sac, des poches ...', value: 'aw'},
  { label: 'Animaux sauvages', value: 'wa'},
  { label: 'Loot', value: 'lo'},
];

const subfonctionsCharacters = [
  // { label: 'Ajouter un personnage', value: 'add' },
  // { label: 'Information sur un personnage', value: 'information' },
  { label: 'Liste de personnages', value: 'list' },
  // { label: 'Modifier un personnage', value: 'update' },
  { label: 'Sélectionner aléatoirement un personnage', value: 'random' },
  // { label: "Supprimer un personnage", value: 'delete' }
];

export default function Helper() {
  const firebase = useFirebase();
  const [, setHistory] = useHistory();
  const axios = require('axios').default;
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState({})
  const [functionSelected, setFunctionSelected] = useState("");
  const [oddSelected, setOddSelected] = useState("");
  const [yesOrNoSelected, setYesOrNoSelected] = useState("");
  const [hiddenFate, setHiddenFate] = useState(true);
  const [bodiesSelected, setBodiesSelected] = useState("");
  const [placesSelected, setPlacesSelected] = useState("");
  const [hiddenLoot, setHiddenLoot] = useState(true);
  const [subfonctionsCharactersSelected, setSubfonctionsCharactersSelected] = useState(""); 
  const [hiddenCharacter, setHiddenCharacter] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickDices = (event, index) => {
    setAnchorEl(null);

    if (index === 0) {
      let random = Math.floor(Math.random() * 4 + 1);
      setHistory(h => ([...h, logDieRoll("1d4",random)]));
    } else if (index === 1) {
      let random = Math.floor(Math.random() * 6 + 1);
      setHistory(h => ([...h, logDieRoll("1d6",random)]));
    } else if (index === 2) {
      let random = Math.floor(Math.random() * 8 + 1);
      setHistory(h => ([...h, logDieRoll("1d8",random)]));
    } else if (index === 3) {
      let random = Math.floor(Math.random() * 10 + 1);
      setHistory(h => ([...h, logDieRoll("1d10",random)]));
    } else if (index === 4) {
      let random = Math.floor(Math.random() * 12 + 1);
      setHistory(h => ([...h, logDieRoll("1d12",random)]));
    } else if (index === 5) {
      let random = Math.floor(Math.random() * 20 + 1);
      setHistory(h => ([...h, logDieRoll("1d20",random)]));
    } else if (index === 6) {
      let random = Math.floor(Math.random() * 100 + 1);
      setHistory(h => ([...h, logDieRoll("1d100",random)]));
    }
  };

  const changeFunctions = (event, inputValue) => {
    setFunctionSelected(inputValue);
              
    if (inputValue === "Character") {
      setHiddenCharacter(false);
      setHiddenFate(true);
      setHiddenLoot(true);
    } else if (inputValue === "Fate") {
      setHiddenCharacter(true);
      setHiddenFate(false);
      setHiddenLoot(true);
    } else if (inputValue === "Fantasy Loot") {
      setHiddenCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(false);
    } else {
      setHiddenCharacter(true);
      setHiddenFate(true);
      setHiddenLoot(true);
    }
  };

  const changeOdds = (event, inputValue) => {
    setOddSelected(inputValue);
  };

  const changeYesNo = (event, inputValue) => {
    setYesOrNoSelected(inputValue);
  };
  
  const changeBodies = (event, inputValue) => {
    setBodiesSelected(inputValue);
  };

  const changePlaces = (event, inputValue) => {
    setPlacesSelected(inputValue);
  };

  const changeSubfonctionsCharacters = (event, inputValue) => {
    setSubfonctionsCharactersSelected(inputValue);
  };

  const clickDice = () => {
    if (functionSelected === "Action") {
      let actionResponse = actionRoll();
      
      setHistory(h => ([...h, logMeaning("Action", actionResponse.action + " / " + actionResponse.subject)]));
    } else if (functionSelected === "Character") {
      if (subfonctionsCharactersSelected === "list" || subfonctionsCharactersSelected === "Liste de personnages") {
        let characterResponse = characterList(data);

        let responseText = "";

        for (let i = 0 ; i < characterResponse.names.length ; i++) {
          responseText = responseText + (i + 1) + "- " + characterResponse.names[i];

          if (i < characterResponse.names.length - 1) {
            responseText = responseText + "\n";
          }
        }

        setHistory(h => ([...h, logCharacter(responseText)]));
      } else if (subfonctionsCharactersSelected === "random" || subfonctionsCharactersSelected === "Sélectionner aléatoirement un personnage") {
        let characterResponse = characterRandom(data);

        setHistory(h => ([...h, logCharacter(characterResponse.name)]));
      }
    } else if (functionSelected === "Description") {
      let descriptionResponse = descriptionRoll();

      setHistory(h => ([...h, logMeaning("Description", descriptionResponse.description1 + " / " + descriptionResponse.description2)]));
    } else if (functionSelected === "Event") {
      let eventResponse = eventCheck();

      setHistory(h => ([...h, logRandomEvent(eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ")\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
    } else if (functionSelected === "Fantasy Loot") {
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

      let fantasyLootResponse = fantasyLootGenerator(body, placesSelected);

      let fantasyLootData = data.inventory;

      for (let i = 0 ; i < fantasyLootResponse.number ; i++) {
        fantasyLootData.push({
          "lootItem": fantasyLootResponse.items[i],
          "lootCategory": fantasyLootResponse.categories[i]
        });
      }

      firebase.updateDocument("helpers", id, {
        "inventory": fantasyLootData
      });

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
    } else if (functionSelected === "Fate") {
      let odd = "";

      if (oddSelected === "Impossible") {
        odd = "IM";
      } else if (oddSelected === "Certainement pas") {
        odd = "NW";
      } else if (oddSelected === "Très improbable") {
        odd = "VU";
      } else if (oddSelected === "Improbable") {
        odd = "UL";
      } else if (oddSelected === "50/50 ou Pas sûr") {
        odd = "NS";
      } else if (oddSelected === "Probable") {
        odd = "LI";
      } else if (oddSelected === "Très probable") {
        odd = "VL";
      } else if (oddSelected === "Chose sûre") {
        odd = "ST";
      } else if (oddSelected === "Comme ça doit être") {
        odd = "HB";
      }
      
      let fateResponse = fateCheck(data.chaosFactor, odd, yesOrNoSelected);

      let yesno = "";
        
      if (fateResponse.isYes === true) {
        yesno = "OUI";
      } else {
        yesno = "NON"
      }

      if (fateResponse.isExceptional === true) {
        yesno = yesno + " EXCEPTIONNEL"
      }

      if (fateResponse.randomEvent === true) {
        let eventResponse = eventCheck();
        
        setHistory(h => ([...h, logFate(odd, data.chaosFactor, yesno + "Evénement aléatoire\n" + eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ")\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
      } else {
        setHistory(h => ([...h, logFate(odd, data.chaosFactor, yesno)]));
      }
    }
  };

  useEffect(() => {    
    firebase.getDocument("helpers", id).then(doc => {
      setData(doc.data());
    });
    
    if (token) {
      firebase.getDocument("users", token).then(doc => {
        setIsAuth(doc.data().helpers.includes(id));
      })
    } else {
      setIsAuth(false);
    }
  }, [firebase,id,token,axios])

  console.log(data);
  console.log(isAuth);
  
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            id="dices-button"
            aria-label="menu"
            aria-controls={open ? 'dices-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ mr: 2 }}
            onClick={handleClick}
            >
            <CasinoIcon />
          </IconButton>
          <Menu
            id="dices-menu"
            MenuListProps={{
              'aria-labelledby': 'dices-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
              },
            }}
          >
            {options.map((option, index) => (
              <MenuItem key={option} selected={option === 'd20'} onClick={(event) => handleClickDices(event, index)}>
                {option}
              </MenuItem>
            ))}
          </Menu>
          <Autocomplete
            autoComplete
            autoSelect
            disablePortal
            id="combo-box-functions"
            options={functions}
            getOptionLabel={(option) => option.label}
            onInputChange={changeFunctions}
            sx={{ width: 300 }}
            renderInput={(params) =>
              <TextField {...params}
                label="Choose a Function"/>}
          />
        </Toolbar>
      </AppBar>

      {!hiddenFate ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-odds"
        options={odds}
        defaultValue="Odds"
        sx={{ width: 300 }}
        onInputChange={changeOdds}
        renderInput={(params) =>
          <TextField {...params}
          label="Choose an Odd"/>}
      /> : null}

      {!hiddenFate ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-yesorno"
          onChange={changeYesNo}>
          <FormControlLabel value="Yes" control={<Radio />} label="Oui" />
          <FormControlLabel value="No" control={<Radio />} label="Non" />
        </RadioGroup>
      </FormControl> : null}

      {!hiddenLoot ? <Autocomplete
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
      /> : null}

      {!hiddenLoot ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-places"
          onChange={changePlaces}>
          <FormControlLabel value="valueCommon" control={<Radio />} label="Commun" />
          <FormControlLabel value="valueMilitary" control={<Radio />} label="Militaire" />
          <FormControlLabel value="valueDungeon" control={<Radio />} label="Donjon" />
        </RadioGroup>
      </FormControl> : null}

      {!hiddenCharacter ? <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-characters"
        options={subfonctionsCharacters}
        getOptionLabel={(option) => option.label}
        sx={{ width: 300 }}
        onInputChange={changeSubfonctionsCharacters}
        renderInput={(params) =>
        <TextField {...params}
          label="Choose a subfonction"/>}
      /> : null}

      <Button
        variant="contained"
        onClick={clickDice}
      >Dice
      </Button>
    </React.Fragment>
  )
}
