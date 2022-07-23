import { useState, useEffect, MouseEvent } from "react";
import { useParams } from "react-router-dom";
import { Container, Autocomplete, TextField, Button, AppBar, Toolbar, IconButton, Menu, MenuItem } from "@mui/material";
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

const ITEM_HEIGHT = 48;

/* function onClickFunctions(event) {
    console.log("test");
} */

export default function Helper() {
  const firebase = useFirebase();
  const axios = require('axios').default;
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState({})
  const [tfValue, setTFValue] = useState("");
  const [functionSelected, setFunctionSelected] = useState("");
  const functions = [
  { label: 'Fate', id: 1 },
  { label: 'Event', id: 2 },
];
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
      setTFValue("1d4 => " + random)
    } else if (index === 1) {
      let random = Math.floor(Math.random() * 6 + 1);
      setTFValue("1d6 => " + random)
    } else if (index === 2) {
      let random = Math.floor(Math.random() * 8 + 1);
      setTFValue("1d8 => " + random)
    } else if (index === 3) {
      let random = Math.floor(Math.random() * 10 + 1);
      setTFValue("1d10 => " + random)
    } else if (index === 4) {
      let random = Math.floor(Math.random() * 12 + 1);
      setTFValue("1d12 => " + random)
    } else if (index === 5) {
      let random = Math.floor(Math.random() * 20 + 1);
      setTFValue("1d20 => " + random)
    } else if (index === 6) {
      let random = Math.floor(Math.random() * 100 + 1);
      setTFValue("1d100 => " + random)
    }
  }; 

  useEffect(() => {
    firebase.getDocument("helpers",id).then(doc => setData(doc.data()));
    if (token) {
      firebase.getDocument("users",token).then(doc => {
        setIsAuth(doc.data().helpers.includes(id));
      })
    }
    else {
      setIsAuth(false);
    }
  }, [firebase,id,token])

  console.log(data);
  console.log(isAuth);
  
  return (
    <Container>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            id="positioned-button"
            aria-label="menu"
            aria-controls={open ? 'positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ mr: 2 }}
            onClick={handleClick}
            >
            <CasinoIcon />
          </IconButton>
          <Menu
            id="positioned-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
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
            onInputChange={(event, inputValue) => // setTFValue(inputValue);
              setFunctionSelected(inputValue)}
            sx={{ width: 300 }}
            renderInput={(params) =>
              <TextField {...params} // label="Functions"
              />}
          />
        </Toolbar>
      </AppBar>

      <Button
        variant="contained"
        onClick={()=>
          { let random = Math.floor(Math.random() * 20 + 1);
            if(functionSelected === "Fate") {
            if (random > 10) {
              setTFValue("Oui (" + random + ")")
            } else {
              setTFValue("Non (" + random + ")")
            }
          } else {
            axios({
              method: 'get',
              url: 'https://GMEEngine.labonneauberge.repl.co/event'
            })
            .then(function (response) {
              setTFValue(response.data.eventFocusName + " (" + response.data.eventFocusDescription + ")\n\n" + response.data.eventAction + " / " + response.data.eventSubject);
            });
          }}}
        //onClick={onClickFunctions}
        >Dice
      </Button>

      <TextField
        multiline
        margin="normal"
        id="outlined-functions"
        variant="outlined"
        value={tfValue}
        onChange={(newValue) => setTFValue(newValue.target.value)}
        InputProps={{
          readOnly: true,
        }} />
    </Container>
  )
}
