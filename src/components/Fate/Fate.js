import React, { useState } from "react";
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, Stack } from "@mui/material";
import { useHistory, logFate } from "context/HistoryContext";
import fateCheck from "backend/mythic/fateCheck";
import eventCheck from "backend/mythic/eventCheck";

const odds = [
  { label: 'Impossible', value: 'IM' },
  { label: 'Certainement pas', value: 'NW' },
  { label: 'Très improbable', value: 'VU' },
  { label: 'Improbable', value: 'UL' },
  { label: '50/50 ou Pas sûr', value: 'NS' },
  { label: 'Probable', value: 'LI' },
  { label: 'Très probable', value: 'VL' },
  { label: 'Chose sûre', value: 'ST' },
  { label: 'Comme ça doit être', value: 'HB' }
];

export default function Fate(props) {
  const [, setHistory] = useHistory();
  const [oddSelected, setOddSelected] = useState("");
  const [yesOrNoSelected, setYesOrNoSelected] = useState("");
  
  const changeOdds = (event, inputValue) => {
    setOddSelected(inputValue);
  };

  const changeYesNo = (event, inputValue) => {
    setYesOrNoSelected(inputValue);
  };

  const clickLaunch = () => {
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
    
    let fateResponse = fateCheck(props.chaosFactor, odd, yesOrNoSelected);

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
      
      setHistory(h => ([...h, logFate(odd, props.chaosFactor, yesno + "Evénement aléatoire\n" + eventResponse.eventFocusName + " (" + eventResponse.eventFocusDescription + ")\n\n" + eventResponse.eventAction + " / " + eventResponse.eventSubject)]));
    } else {
      setHistory(h => ([...h, logFate(odd, props.chaosFactor, yesno)]));
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
          id="combo-box-odds"
          options={odds}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeOdds}
          renderInput={(params) =>
            <TextField {...params}
            label="Choose an Odd"/>}
        />
        
        <FormControl>
          <RadioGroup
            name="radio-buttons-group-yesorno"
            onChange={changeYesNo}>
            <FormControlLabel value="Yes" control={<Radio />} label="Oui" />
            <FormControlLabel value="No" control={<Radio />} label="Non" />
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
