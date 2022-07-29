import { useState, useEffect, MouseEvent } from "react";
import { useParams } from "react-router-dom";
import { Container, Autocomplete, TextField, Button, AppBar, Toolbar, IconButton, Menu, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
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
  { label: 'Event', id: 2 },
  { label: 'Fate', id: 3 }
];

export default function Helper() {
  const firebase = useFirebase();
  const axios = require('axios').default;
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState({})
  const [tfValue, setTFValue] = useState("");
  const [functionSelected, setFunctionSelected] = useState("");
  const [oddSelected, setOddSelected] = useState("");
  const [yesOrNoSelected, setYesOrNoSelected] = useState("");
  const [hidden, setHidden] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickDices = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setAnchorEl(null);

    if (index === 0) {
      let random = Math.floor(Math.random() * 4 + 1);
      setTFValue("1d4 => " + random);
    } else if (index === 1) {
      let random = Math.floor(Math.random() * 6 + 1);
      setTFValue("1d6 => " + random);
    } else if (index === 2) {
      let random = Math.floor(Math.random() * 8 + 1);
      setTFValue("1d8 => " + random);
    } else if (index === 3) {
      let random = Math.floor(Math.random() * 10 + 1);
      setTFValue("1d10 => " + random);
    } else if (index === 4) {
      let random = Math.floor(Math.random() * 12 + 1);
      setTFValue("1d12 => " + random);
    } else if (index === 5) {
      let random = Math.floor(Math.random() * 20 + 1);
      setTFValue("1d20 => " + random);
    } else if (index === 6) {
      let random = Math.floor(Math.random() * 100 + 1);
      setTFValue("1d100 => " + random);
    }
  };
  const changeFunctions = (event: MouseEvent<HTMLElement>, inputValue: String) => {
    setFunctionSelected(inputValue);
              
    if (inputValue === "Fate") {
      setHidden(false);
    } else {
      setHidden(true);
    }
  };
  const changeOdds = (event: MouseEvent<HTMLElement>, inputValue: String) => {
    setOddSelected(inputValue);
  };
  const changeYesNo = (event: MouseEvent<HTMLElement>, inputValue: String) => {
    setYesOrNoSelected(inputValue);
  };
  const changeTextField = (newValue: String) => {
    setTFValue(newValue.target.value);
  };
  const clickDice = () => {
    let odd = "";

    if (functionSelected === "Action") {
      axios({
        method: 'get',
        url: 'https://GMEEngine.labonneauberge.repl.co/action'
      })
      .then(function (response) {
        setTFValue(response.data.action + " / " + response.data.subject);
      });
    } else if (functionSelected === "Event") {
      axios({
        method: 'get',
        url: 'https://GMEEngine.labonneauberge.repl.co/event'
      })
      .then(function (response) {
        setTFValue(response.data.eventFocusName + " (" + response.data.eventFocusDescription + ")\n\n" + response.data.eventAction + " / " + response.data.eventSubject);
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
        setTFValue(response.data.dice[0] + " + " + response.data.dice[1] + " + " + response.data.mods[0] + " + " + response.data.mods[1] + " => " + yesno);
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
    <Container>
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

      {!hidden ? <Autocomplete
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

      {!hidden ? <FormControl>
        <RadioGroup
          name="radio-buttons-group-yesorno"
          onChange={changeYesNo}>
          <FormControlLabel value="Yes" control={<Radio />} label="Oui" />
          <FormControlLabel value="No" control={<Radio />} label="Non" />
        </RadioGroup>
      </FormControl> : null}

      <Button
        variant="contained"
        onClick={clickDice}
      >Dice
      </Button>

      <TextField
        multiline
        margin="normal"
        id="outlined-functions"
        variant="outlined"
        value={tfValue}
        onChange={changeTextField}
        InputProps={{
          readOnly: true,
        }} />
    </Container>
  )
}
