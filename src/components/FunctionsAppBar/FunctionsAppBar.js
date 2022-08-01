import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Autocomplete, TextField, Button, AppBar, Toolbar, IconButton, Menu, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import { useHistory, logDieRoll, logMeaning, logRandomEvent, logFate, logLoot } from "context/HistoryContext";
import { useFirebase } from "context/FirebaseContext";

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
  { label: 'Description', id: 2 },
  { label: 'Event', id: 3 },
  { label: 'Fate', id: 4 }, 
  { label: 'Loot', id: 5}
];

const bodies = [
  { label: 'Humanoïde non-aventurier sans sac, poches ...', value: 'no'}, 
  { label: 'Humanoïde non-aventurier avec un sac, des poches ...', value: 'nw'},
  { label: 'Humanoïde aventurier sans sac, poches ...', value: 'ao'},
  { label: 'Humanoïde aventurier avec un sac, des poches ...', value: 'aw'},
  { label: 'Animaux sauvages', value: 'wa'},
  { label: 'Loot', value: 'lo'},
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
              
    if (inputValue === "Fate") {
      setHiddenFate(false);
      setHiddenLoot(true);
    } else if (inputValue === "Loot") {
      setHiddenFate(true);
      setHiddenLoot(false);
    } else {
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
  const clickDice = () => {
    let odd = "";

    if (functionSelected === "Action") {
      axios({
        method: 'get',
        url: 'https://GMEEngine.labonneauberge.repl.co/action'
      })
      .then(function (response) {
        setHistory(h => ([...h, logMeaning("Action", response.data.action + " / " + response.data.subject)]));
      });
    } else if (functionSelected === "Description") {
      axios({
        method: 'get',
        url: 'https://GMEEngine.labonneauberge.repl.co/description'
      })
      .then(function (response) {
        setHistory(h => ([...h, logMeaning("Description", response.data.description1 + " / " + response.data.description2)]));
      });
    } else if (functionSelected === "Event") {
      axios({
        method: 'get',
        url: 'https://GMEEngine.labonneauberge.repl.co/event'
      })
      .then(function (response) {
        setHistory(h => ([...h, logRandomEvent(response.data.eventFocusName + " (" + response.data.eventFocusDescription + ")\n\n" + response.data.eventAction + " / " + response.data.eventSubject)]));
      });
    } else if (functionSelected === "Fate") {
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
      
      axios({
        method: 'post',
        url: 'https://GMEEngine.labonneauberge.repl.co/fate',
        data: {
          odd: odd,
          yesorno: yesOrNoSelected,
          campaignID: id
        }
      })
      .then(function (response) {
        let yesno = "";
        
        if (response.data.isYes === true) {
          yesno = "OUI";
        } else {
          yesno = "NON"
        }

        if (response.data.isExceptional === true) {
          yesno = yesno + " Exceptionnel"
        }

        if (response.data.randomEvent === true) {
          axios({
            method: 'get',
            url: 'https://GMEEngine.labonneauberge.repl.co/event'
          })
          .then(function (responseEvent) {
            setHistory(h => ([...h, logFate(odd,4,yesno + "Evénement aléatoire\n" + responseEvent.data.eventFocusName + " (" + responseEvent.data.eventFocusDescription + ")\n\n" + responseEvent.data.eventAction + " / " + responseEvent.data.eventSubject)]));
          });
        } else {
          setHistory(h => ([...h, logFate(odd,4,yesno)]));
        }
      });
    } else if (functionSelected === "Loot") {
      axios({
        method: 'post',
        url: 'https://GMEEngine.labonneauberge.repl.co/fantasyloot',
        data: {
          campaignID: id,
          lootBody: bodiesSelected,
          lootPlace: placesSelected
        }
      })
      .then(function (response) {
        let responseText = "";

        if (response.data.number === 0) {
          setHistory(h => ([...h, logLoot("Vous n'avez rien looté")]));
        } else {
          for (let i = 0 ; i < response.data.number ; i++) {
            responseText = responseText + response.data.categories[i] + " => " + response.data.items[i];
  
            if (i < response.data.number - 1) {
              responseText = responseText + "\n\n";
            }
          }
  
          setHistory(h => ([...h, logLoot(responseText)]));
        }
      });
    }
  };

  useEffect(() => {
    axios({
      method: 'post',
      url: 'https://GMEEngine.labonneauberge.repl.co/campaign/create',
      data: {
        campaignID: id
      }
    })
    firebase.getDocument("helpers",id).then(doc => setData(doc.data()));
    if (token) {
      firebase.getDocument("users",token).then(doc => {
        setIsAuth(doc.data().helpers.includes(id));
      })
    }
    else {
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
            defaultValue="Functions"
            onInputChange={changeFunctions}
            sx={{ width: 300 }}
            renderInput={(params) =>
              <TextField {...params}
              />}
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
        <TextField {...params} />}
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
        defaultValue="Bodies"
        sx={{ width: 300 }}
        onInputChange={changeBodies}
        renderInput={(params) =>
        <TextField {...params} />}
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

      <Button
        variant="contained"
        onClick={clickDice}
      >Dice
      </Button>
    </React.Fragment>
  )
}
