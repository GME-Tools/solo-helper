import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';
import { useHistory, logDieRoll } from "context/HistoryContext";

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

export default function RollsButton() {
  const [, setHistory] = useHistory();
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
  
  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}
