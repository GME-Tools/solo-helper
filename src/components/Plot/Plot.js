import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, Stack } from "@mui/material";
import { useHistory, logPlot } from "context/HistoryContext";
import { plotRandom, plotList, plotOccurrences, plotAdd, plotUpdate, plotDelete } from "backend/mythic/adventureCrafter";

const subfonctionsPlots = [
  { label: 'Ajouter une occurrence et / ou une intrigue', value: 'add' },
  { label: "Liste d'intrigues", value: 'list' },
  { label: 'Modifier une intrigue', value: 'update' },
  { label: "Occurrences d'une intrigue", value: 'occurrence' },
  { label: 'Sélectionner aléatoirement une intrigue', value: 'random' },
  { label: "Supprimer une occurrence et / ou une intrigue", value: 'delete' }
];

let existingPlots = [];

export default function Plot(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [subfonctionsPlotsSelected, setSubfonctionsPlotsSelected] = useState(""); 
  const [subfonctionsAddPlotsSelected, setSubfonctionsAddPlotsSelected] = useState("");
  const [hiddenAddPlot, setHiddenAddPlot] = useState(true);
  const [subfonctionsAddExistingPlotsSelected, setSubfonctionsAddExistingPlotsSelected] = useState("");
  const [hiddenAddExistingPlot, setHiddenAddExistingPlot] = useState(true);
  const [subfonctionsAddNewPlotsSelected, setSubfonctionsAddNewPlotsSelected] = useState("");
  const [hiddenAddNewPlot, setHiddenAddNewPlot] = useState(true);
  const [subfonctionsOccurrencePlotsSelected, setSubfonctionsOccurrencePlotsSelected] = useState(""); 
  const [hiddenOccurrencePlot, setHiddenOccurrencePlot] = useState(true);
  const [subfonctionsUpdatePlotsSelected, setSubfonctionsUpdatePlotsSelected] = useState("");
  const [hiddenUpdatePlot, setHiddenUpdatePlot] = useState(true);
  const [subfonctionsUpdateNamePlotsSelected, setSubfonctionsUpdateNamePlotsSelected] = useState("");
  const [hiddenUpdateNamePlot, setHiddenUpdateNamePlot] = useState(true);
  const [subfonctionsDeletePlotsSelected, setSubfonctionsDeletePlotsSelected] = useState("");
  const [hiddenDeletePlot, setHiddenDeletePlot] = useState(true);

  const changeSubfonctionsPlots = (event, inputValue) => {
    setSubfonctionsPlotsSelected(inputValue);

    existingPlots = [];

    if (inputValue === 'add' || inputValue === 'Ajouter une occurrence et / ou une intrigue') {
      setHiddenAddPlot(false);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
    } else if (inputValue === 'occurrence' || inputValue === "Occurrences d'une intrigue") {
      const uniquePlots = [...new Set(props.data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        if (uniquePlots[i] !== "Nouvelle intrigue" && uniquePlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingPlots.push({
            "label": uniquePlots[i],
            "value": uniquePlots[i]
          });
        }
      }

      setHiddenOccurrencePlot(false);
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
    } else if (inputValue === "update" || inputValue === "Modifier une intrigue") {
      const uniquePlots = [...new Set(props.data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        if (uniquePlots[i] !== "Nouvelle intrigue" && uniquePlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingPlots.push({
            "label": uniquePlots[i],
            "value": uniquePlots[i]
          });
        }
      }
      
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(false);
      setHiddenUpdateNamePlot(false);
      setHiddenDeletePlot(true);
    } else if (inputValue === 'delete' || inputValue === "Supprimer une occurrence et / ou une intrigue") {
      const uniquePlots = [...new Set(props.data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        if (uniquePlots[i] !== "Nouvelle intrigue" && uniquePlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingPlots.push({
            "label": uniquePlots[i],
            "value": uniquePlots[i]
          });
        }
      }
      
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(false);
    } else {
      setHiddenAddPlot(true);
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(true);
      setHiddenOccurrencePlot(true);
      setHiddenUpdatePlot(true);
      setHiddenUpdateNamePlot(true);
      setHiddenDeletePlot(true);
    }
  };

  const changeSubfonctionsAddPlots = (event, inputValue) => {
    setSubfonctionsAddPlotsSelected(inputValue);

    if (inputValue === "existing") {
      const uniquePlots = [...new Set(props.data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniquePlots.length ; i++) {
        if (uniquePlots[i] !== "Nouvelle intrigue" && uniquePlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingPlots.push({
            "label": uniquePlots[i],
            "value": uniquePlots[i]
          });
        }
      }

      setHiddenAddExistingPlot(false);
      setHiddenAddNewPlot(true);
    } else {
      setHiddenAddExistingPlot(true);
      setHiddenAddNewPlot(false);
    }
  };

  const changeSubfonctionsAddExistingPlots = (event, inputValue) => {
    setSubfonctionsAddExistingPlotsSelected(inputValue);
  };

  const changeSubfonctionsAddNewPlots = (event) => {
    setSubfonctionsAddNewPlotsSelected(event.currentTarget.value);
  };

  const changeSubfonctionsOccurrencePlots = (event, inputValue) => {
    setSubfonctionsOccurrencePlotsSelected(inputValue);
  };

  const changeSubfonctionsUpdatePlots = (event, inputValue) => {
    setSubfonctionsUpdatePlotsSelected(inputValue);

    setHiddenUpdateNamePlot(false);
  };

  const changeSubfonctionsUpdateNamePlots = (event, inputValue) => {
    setSubfonctionsUpdateNamePlotsSelected(event.currentTarget.value);
  };

  const changeSubfonctionsDeletePlots = (event, inputValue) => {
    setSubfonctionsDeletePlotsSelected(inputValue);
  };

  const clickLaunch = () => {
    if (subfonctionsPlotsSelected === "add" || subfonctionsPlotsSelected === "Ajouter une occurrence et / ou une intrigue") {
      if (subfonctionsAddPlotsSelected === "existing") {
        let plotResponse = plotAdd(props.data.plotsList, subfonctionsAddExistingPlotsSelected);

        if (plotResponse.full === false) {
          firebase.updateDocument("helpers", props.idHelper, {
            "plotsList": plotResponse.plotsList
          });

          props.data.plotsList = plotResponse.plotsList;

          setHistory(h => ([...h, logPlot("Une occurrence de l'intrigue " + subfonctionsAddExistingPlotsSelected + " a été ajoutée à la liste des intrigues")]));
        } else {
          setHistory(h => ([...h, logPlot("Il y a déjà trois occurrences de cette intrigue dans la liste des intrigues")]));
        }
      } else {
        let plotResponse = plotAdd(props.data.plotsList, subfonctionsAddNewPlotsSelected);

        if (plotResponse.full === false) {
          firebase.updateDocument("helpers", props.idHelper, {
            "plotsList": plotResponse.plotsList
          });

          props.data.plotsList = plotResponse.plotsList;

          setHistory(h => ([...h, logPlot("L'intrigue " + subfonctionsAddNewPlotsSelected + " a été ajoutée à la liste des intrigues")]));
        } else {
          setHistory(h => ([...h, logPlot("Il y a déjà trois occurrences de cette intrigue dans la liste des intrigues")]));
        }
      }
    } else if (subfonctionsPlotsSelected === "list" || subfonctionsPlotsSelected === "Liste d'intrigues") {
      let plotResponse = plotList(props.data.plotsList);

      let responseText = "";

      for (let i = 0 ; i < plotResponse.names.length ; i++) {
        responseText = responseText + (i + 1) + "- " + plotResponse.names[i];

        if (i < plotResponse.names.length - 1) {
          responseText = responseText + "\n";
        }
      }

      setHistory(h => ([...h, logPlot(responseText)]));
    } else if (subfonctionsPlotsSelected === "random" || subfonctionsPlotsSelected === "Sélectionner aléatoirement une intrigue") {
      let plotResponse = plotRandom(props.data.plotsList, false, false, props.data.currentPlot);

      setHistory(h => ([...h, logPlot(plotResponse.name)]));
    } else if (subfonctionsPlotsSelected === 'occurrence' || subfonctionsPlotsSelected === "Occurrences d'une intrigue") {
      let plotResponse = plotOccurrences(props.data.plotsList, subfonctionsOccurrencePlotsSelected);

      setHistory(h => ([...h, logPlot("L'intrigue " + subfonctionsOccurrencePlotsSelected + " apparaît " + plotResponse.numberOf + " fois dans la liste des intrigues")]));
    } else if (subfonctionsPlotsSelected === 'update' || subfonctionsPlotsSelected === 'Modifier une intrigue') {
      let plotResponse = plotUpdate(props.data.plotsList, subfonctionsUpdatePlotsSelected, subfonctionsUpdateNamePlotsSelected);

      firebase.updateDocument("helpers", props.idHelper, {
        "plotsList": plotResponse.plotsList
      });

      props.data.plotsList = plotResponse.plotsList;

      setHistory(h => ([...h, logPlot("L'intrigue " + subfonctionsUpdateNamePlotsSelected + " a été mise à jour")]));
    } else if (subfonctionsPlotsSelected === 'delete' || subfonctionsPlotsSelected === "Supprimer une occurrence et / ou une intrigue") {
      let plotResponse = plotDelete(props.data.plotsList, subfonctionsDeletePlotsSelected);

      firebase.updateDocument("helpers", props.idHelper, {
        "plotsList": plotResponse.plotsList
      });

      props.data.plotsList = plotResponse.plotsList;

      if (plotResponse.empty === false) {
        setHistory(h => ([...h, logPlot("Une occurrence de l'intrigue " + subfonctionsDeletePlotsSelected + " a été supprimée de la liste d'intrigues")]));
      } else {
        setHistory(h => ([...h, logPlot("La dernière occurrence de l'intrigue " + subfonctionsDeletePlotsSelected + " a été supprimée de la liste d'intrigues")]));
      }
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
          id="combo-box-plots"
          options={subfonctionsPlots}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsPlots}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a subfonction"/>}
        />
  
        {!hiddenAddPlot ? <FormControl>
          <RadioGroup
            name="radio-buttons-group-add-plot"
            onChange={changeSubfonctionsAddPlots}>
            <FormControlLabel value="existing" control={<Radio />} label="Intrigue existante" />
            <FormControlLabel value="new" control={<Radio />} label="Nouvelle intrigue" />
          </RadioGroup>
        </FormControl> : null}
  
        {!hiddenAddExistingPlot ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-occurrence-add-existing-plotd"
          options={existingPlots}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsAddExistingPlots}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a plot"/>}
        /> : null}
  
        {!hiddenAddNewPlot ? <TextField
          id="outlined-add-new-plot"
          label="Write a plot"
          variant="outlined"
          onChange={changeSubfonctionsAddNewPlots} /> : null}
  
        {!hiddenOccurrencePlot ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-occurrence-plots"
          options={existingPlots}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsOccurrencePlots}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a plot"/>}
        /> : null}
  
        {!hiddenUpdatePlot ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-update-plots"
          options={existingPlots}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsUpdatePlots}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a plot"/>}
        /> : null}
  
        {!hiddenUpdateNamePlot ? <TextField
          id="outlined-update-plot"
          label={subfonctionsUpdatePlotsSelected}
          variant="outlined"
          onChange={changeSubfonctionsUpdateNamePlots} /> : null}
  
        {!hiddenDeletePlot ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-occurrence-delete-plots"
          options={existingPlots}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsDeletePlots}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a plot"/>}
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
