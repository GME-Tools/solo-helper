import React, { useState } from "react";
import { Autocomplete, TextField, Button, Stack, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useHistory, logStatistic } from "context/HistoryContext";
import statisticCheck from "backend/mythic/statisticCheck";

const statisticOptions = [
  { label: 'Faible', value: 'Faible' },
  { label: 'Moyen', value: 'Moyen' },
  { label: 'Fort', value: 'Fort' },
  { label: 'Principal', value: 'Principal' }
];

export default function Statistic(props) {
  const [, setHistory] = useHistory();
  const [subfonctionsStrengthStatisticSelected, setSubfonctionsStrengthStatisticSelected] = useState("");
  const [subfonctionsImportantStatisticSelected, setSubfonctionsImportantStatisticSelected] = useState("");

  const changeSubfonctionsStrengthStatistic = (event, inputValue) => {
    setSubfonctionsStrengthStatisticSelected(inputValue);
  };

  const changeSubfonctionsImportantStatistic = (event, inputValue) => {
    setSubfonctionsImportantStatisticSelected(inputValue);
  }

  const clickLaunch = () => {
    let statisticResponse = statisticCheck(subfonctionsStrengthStatisticSelected, subfonctionsImportantStatisticSelected);

    setHistory(h => ([...h, logStatistic(statisticResponse.statisticCheckName + " (" + statisticResponse.statisticCheckDescription + ")")]));
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
          id="combo-box-statistic"
          options={statisticOptions}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsImportantStatistic}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a Statistic"/>}
        />

        <FormControl>
          <RadioGroup
            name="radio-buttons-group-statistic"
            onChange={changeSubfonctionsStrengthStatistic}>
            <FormControlLabel value="important" control={<Radio />} label="Important" />
            <FormControlLabel value="notImportant" control={<Radio />} label="Pas Important" />
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
