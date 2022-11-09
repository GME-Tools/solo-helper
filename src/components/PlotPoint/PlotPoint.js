import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, Button, Stack } from "@mui/material";
import { useHistory, logPlotPoints } from "context/HistoryContext";
import { plotPoints, plotPointsRead, plotPointsUpdate } from "backend/mythic/adventureCrafter";

const subfonctionsPlotPoints = [
  { label: 'Génération des Plot Points', value: 'generation' },
  { label: 'Liste des Plot Points', value: 'list' },
  { label: 'Modifier un Plot Point', value: 'update' }
];

let existingPlotPoints = [];
let existingNeedsPlotPoints = [];
let existingNamePlotPoints = [];

export default function Plot(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [subfonctionsPlotPointsSelected, setSubfonctionsPlotPointsSelected] = useState("");
  const [subfonctionsUpdatePlotPointsSelected, setSubfonctionsUpdatePlotPointsSelected] = useState("");
  const [hiddenUpdatePlotPoints, setHiddenUpdatePlotPoints] = useState(true);
  const [subfonctionsUpdateNeedsPlotPointsSelected, setSubfonctionsUpdateNeedsPlotPointsSelected] = useState("");
  const [hiddenUpdateNeedsPlotPoints, setHiddenUpdateNeedsPlotPoints] = useState(true);
  const [subfonctionsUpdateNamePlotPointsSelected, setSubfonctionsUpdateNamePlotPointsSelected] = useState("");
  const [hiddenUpdateNamePlotPoints, setHiddenUpdateNamePlotPoints] = useState(true);

  const changeSubfonctionsPlotPoints = (event, inputValue) => {
    setSubfonctionsPlotPointsSelected(inputValue);

    existingPlotPoints = [];
    
    if (inputValue === "update" || inputValue === "Modifier un Plot Point") {
      const uniquePlotPoints = [...new Set(props.data.plotPoints.map(item => item.name))];

      for (let i = 0 ; i < uniquePlotPoints.length ; i++) {
        if (props.data.plotPoints[i].needs[0].name !== "Non") {
          existingPlotPoints.push({
            "label": uniquePlotPoints[i],
            "value": uniquePlotPoints[i]
          });
        }
      }
      
      setHiddenUpdatePlotPoints(false);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
    } else {
      setHiddenUpdatePlotPoints(true);
      setHiddenUpdateNeedsPlotPoints(true);
      setHiddenUpdateNamePlotPoints(true);
    }
  };

  const changeSubfonctionsUpdatePlotPoints = (event, inputValue) => {
    setSubfonctionsUpdatePlotPointsSelected(inputValue);

    existingNeedsPlotPoints = [];

    let uniqueNeedsPlotPoints = [];
    
    for (let i = 0 ; i < props.data.plotPoints.find(item => item.name === inputValue).needs.length ; i++) {
      uniqueNeedsPlotPoints.push(props.data.plotPoints.find(item => item.name === inputValue).needs[i]);
    }

    for (let i = 0 ; i < uniqueNeedsPlotPoints.length ; i++) {
      existingNeedsPlotPoints.push({
        "label": uniqueNeedsPlotPoints[i].name,
        "value": uniqueNeedsPlotPoints[i].name
      });
    }

    setHiddenUpdateNeedsPlotPoints(false);
    setHiddenUpdateNamePlotPoints(true);
  };

  const changeSubfonctionsUpdateNeedsPlotPoints = (event, inputValue) => {
    setSubfonctionsUpdateNeedsPlotPointsSelected(inputValue);

    existingNamePlotPoints = [];

    let uniqueCharactersPlots = [];

    if (props.data.plotPoints.find(item => item.name === subfonctionsUpdatePlotPointsSelected).needs.find(item => item.name === inputValue).type === "Personnage") {
      uniqueCharactersPlots = [...new Set(props.data.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharactersPlots.length ; i++) {
        if (uniqueCharactersPlots[i] !== "Nouveau personnage" && uniqueCharactersPlots[i] !== "Choisissez le personnage le plus logique") {
          existingNamePlotPoints.push({
            "label": uniqueCharactersPlots[i],
            "value": uniqueCharactersPlots[i]
          });
        }
      }
    } else if (props.data.plotPoints.find(item => item.name === subfonctionsUpdatePlotPointsSelected).needs.find(item => item.name === inputValue).type === "Intrigue") {
      uniqueCharactersPlots = [...new Set(props.data.plotsList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharactersPlots.length ; i++) {
        if (uniqueCharactersPlots[i] !== "Nouvelle intrigue" && uniqueCharactersPlots[i] !== "Choisissez l'intrigue la plus logique") {
          existingNamePlotPoints.push({
            "label": uniqueCharactersPlots[i],
            "value": uniqueCharactersPlots[i]
          });
        }
      }
    }

    setHiddenUpdateNamePlotPoints(false);
  };

  const changeSubfonctionsUpdateNamePlotPoints = (event, inputValue) => {
    setSubfonctionsUpdateNamePlotPointsSelected(inputValue);
  };

  const clickLaunch = () => {
    if (subfonctionsPlotPointsSelected === "generation" || subfonctionsPlotPointsSelected === "Génération des Plot Points") {
      let plotPointsResponse = plotPoints(props.data.plotPoints, props.data.charactersList, props.data.plotsList, props.data.currentPlot, props.data.themes, props.data.archivedCharacters);
      let responseText = "";

      firebase.updateDocument("helpers", props.idHelper, {
        "plotPoints": plotPointsResponse.plotPointsList.plotPoints,
        "charactersList": plotPointsResponse.plotPointsList.charactersList,
        "plotsList":  plotPointsResponse.plotPointsList.plotsList,
        "currentPlot":  plotPointsResponse.plotPointsList.currentPlot,
        "archivedCharacters":  plotPointsResponse.plotPointsList.archivedCharacters
      });

      props.data.plotPoints = plotPointsResponse.plotPointsList.plotPoints;
      props.data.charactersList = plotPointsResponse.plotPointsList.charactersList;
      props.data.plotsList = plotPointsResponse.plotPointsList.plotsList;
      props.data.currentPlot = plotPointsResponse.plotPointsList.currentPlot;
      props.data.archivedCharacters = plotPointsResponse.plotPointsList.archivedCharacters;

      for (let i = 0 ; i < plotPointsResponse.plotPointsList.plotPoints.length ; i++) {
        responseText = responseText + (i + 1) + "- " + plotPointsResponse.plotPointsList.plotPoints[i].name;

        if (i < plotPointsResponse.plotPointsList.plotPoints.length - 1) {
          responseText = responseText + "\n";
        }
      }

      setHistory(h => ([...h, logPlotPoints(responseText)]));
    } else if (subfonctionsPlotPointsSelected === "list" || subfonctionsPlotPointsSelected === "Liste des Plot Points") {
      let plotPointsResponse = plotPointsRead(props.data.plotPoints);
      let responseText = "";
      let needsText = "";

      for (let i = 0 ; i < plotPointsResponse.name.length ; i++) {
        needsText = "";
        
        for (let j = 0 ; j < plotPointsResponse.needs[i].length ; j++) {
          if (plotPointsResponse.needs[i][j].name !== "Non") {
            needsText = needsText + plotPointsResponse.needs[i][j].name;

            if (j < plotPointsResponse.needs[i].length - 1) {
              needsText = needsText + " / ";
            }
          }
        }

        if (needsText === "") {
          responseText = responseText + (i + 1) + "- " + plotPointsResponse.name[i] + " (" + plotPointsResponse.description[i] + ")";
        } else {
          responseText = responseText + (i + 1) + "- " + plotPointsResponse.name[i] + " (" + plotPointsResponse.description[i] + ") - " + needsText;
        }

        if (i < plotPointsResponse.name.length - 1) {
          responseText = responseText + "\n";
        }
      }
      
      setHistory(h => ([...h, logPlotPoints(responseText)]));
    } else if (subfonctionsPlotPointsSelected === "update" || subfonctionsPlotPointsSelected === "Modifier un Plot Point") {
      let plotPointsResponse = plotPointsUpdate(props.data.plotPoints, subfonctionsUpdatePlotPointsSelected, subfonctionsUpdateNeedsPlotPointsSelected, subfonctionsUpdateNamePlotPointsSelected);

      firebase.updateDocument("helpers", props.idHelper, {
        "plotPoints": plotPointsResponse.plotPoints
      });

      props.data.plotPoints = plotPointsResponse.plotPoints;

      setHistory(h => ([...h, logPlotPoints(subfonctionsUpdateNeedsPlotPointsSelected + " a été remplacé par " + subfonctionsUpdateNamePlotPointsSelected)]));
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
          id="combo-box-plotPoints"
          options={subfonctionsPlotPoints}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsPlotPoints}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a subfonction"/>}
        />
    
        {!hiddenUpdatePlotPoints ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-update-plotPoints"
          options={existingPlotPoints}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsUpdatePlotPoints}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a plot point"/>}
        /> : null}
        
        {!hiddenUpdateNeedsPlotPoints ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-update-plotPoints-needs"
          options={existingNeedsPlotPoints}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsUpdateNeedsPlotPoints}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a need"/>}
        /> : null}
    
        {!hiddenUpdateNamePlotPoints ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-update-plotPoints-name"
          options={existingNamePlotPoints}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsUpdateNamePlotPoints}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a name"/>}
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
