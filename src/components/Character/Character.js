import React, { useState } from "react";
import { useFirebase } from "context/FirebaseContext";
import { Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Button, Stack } from "@mui/material";
import { useHistory, logCharacter } from "context/HistoryContext";
import { characterRandom, characterList, characterOccurrences, characterAdd, characterUpdate, characterDelete, characterInformation, characterCreation } from "backend/mythic/adventureCrafter";

let existingCharacters = [];
let updatePlayer = false;

const subfonctionsCharacters = [
  { label: 'Ajouter une occurrence et / ou un personnage', value: 'add' },
  { label: 'Créer un nouveau personnage', value: 'creation' },
  { label: 'Informations sur un personnage', value: 'information' },
  { label: 'Liste de personnages', value: 'list' },
  { label: 'Modifier un personnage', value: 'update' },
  { label: "Occurrences d'un personnage", value: 'occurrence' },
  { label: 'Sélectionner aléatoirement un personnage', value: 'random' },
  { label: "Supprimer une occurrence et / ou un personnage", value: 'delete' }
];

export default function Character(props) {
  const [, setHistory] = useHistory();
  const firebase = useFirebase();
  const [subfonctionsCharactersSelected, setSubfonctionsCharactersSelected] = useState("");
  const [subfonctionsAddCharactersSelected, setSubfonctionsAddCharactersSelected] = useState("");
  const [hiddenAddCharacter, setHiddenAddCharacter] = useState(true);
  const [subfonctionsAddExistingCharactersSelected, setSubfonctionsAddExistingCharactersSelected] = useState("");
  const [hiddenAddExistingCharacter, setHiddenAddExistingCharacter] = useState(true);
  const [subfonctionsAddNewNameCharactersSelected, setSubfonctionsAddNewNameCharactersSelected] = useState("");
const [subfonctionsAddNewPlayerCharactersSelected, setSubfonctionsAddNewPlayerCharactersSelected] = useState("");
  const [hiddenAddNewCharacter, setHiddenAddNewCharacter] = useState(true);
  const [subfonctionsOccurrenceCharactersSelected, setSubfonctionsOccurrenceCharactersSelected] = useState(""); 
  const [hiddenOccurrenceCharacter, setHiddenOccurrenceCharacter] = useState(true);
  const [subfonctionsUpdateCharactersSelected, setSubfonctionsUpdateCharactersSelected] = useState("");
  const [hiddenUpdateCharacter, setHiddenUpdateCharacter] = useState(true);
  const [subfonctionsUpdateNameCharactersSelected, setSubfonctionsUpdateNameCharactersSelected] = useState("");
  const [hiddenUpdateNameCharacter, setHiddenUpdateNameCharacter] = useState(true);
  const [subfonctionsUpdatePlayerCharactersSelected, setSubfonctionsUpdatePlayerCharactersSelected] = useState("");
  const [hiddenUpdatePlayerCharacter, setHiddenUpdatePlayerCharacter] = useState(true);
  const [subfonctionsDeleteCharactersSelected, setSubfonctionsDeleteCharactersSelected] = useState("");
  const [hiddenDeleteCharacter, setHiddenDeleteCharacter] = useState(true);
  const [subfonctionsInformationCharactersSelected, setSubfonctionsInformationCharactersSelected] = useState("");
  const [hiddenInformationCharacter, setHiddenInformationCharacter] = useState(true);

  const changeSubfonctionsCharacters = (event, inputValue) => {
    setSubfonctionsCharactersSelected(inputValue);

    existingCharacters = [];

    if (inputValue === 'add' || inputValue === 'Ajouter une occurrence et / ou un personnage') {
      setHiddenAddCharacter(false);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
    } else if (inputValue === 'occurrence' || inputValue === "Occurrences d'un personnage") {
      const uniqueCharacters = [...new Set(props.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }

      setHiddenOccurrenceCharacter(false);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
    } else if (inputValue === 'update' || inputValue === "Modifier un personnage") {
      const uniqueCharacters = [...new Set(props.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }

      setHiddenOccurrenceCharacter(true);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenUpdateCharacter(false);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
    } else if (inputValue === 'delete' || inputValue === "Supprimer une occurrence et / ou un personnage") {
      const uniqueCharacters = [...new Set(props.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }
      
      setHiddenDeleteCharacter(false);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenInformationCharacter(true);
    } else if (inputValue === 'information' || inputValue === "Informations sur un personnage") {
      const uniqueCharacters = [...new Set(props.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }
      
      setHiddenInformationCharacter(false);
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
    } else {
      setHiddenAddCharacter(true);
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(true);
      setHiddenOccurrenceCharacter(true);
      setHiddenUpdateCharacter(true);
      setHiddenUpdateNameCharacter(true);
      setHiddenUpdatePlayerCharacter(true);
      setHiddenDeleteCharacter(true);
      setHiddenInformationCharacter(true);
    }
  };

  const changeSubfonctionsAddCharacters = (event, inputValue) => {
    setSubfonctionsAddCharactersSelected(inputValue);

    if (inputValue === "existing") {
      const uniqueCharacters = [...new Set(props.charactersList.map(item => item.name))];

      for (let i = 0 ; i < uniqueCharacters.length ; i++) {
        if (uniqueCharacters[i] !== "Nouveau personnage" && uniqueCharacters[i] !== "Choisissez le personnage le plus logique") {
          existingCharacters.push({
            "label": uniqueCharacters[i],
            "value": uniqueCharacters[i]
          });
        }
      }

      setHiddenAddExistingCharacter(false);
      setHiddenAddNewCharacter(true);
    } else {
      setHiddenAddExistingCharacter(true);
      setHiddenAddNewCharacter(false);
    }
  };

  const changeSubfonctionsAddExistingCharacters = (event, inputValue) => {
    setSubfonctionsAddExistingCharactersSelected(inputValue);
  };

  const changeSubfonctionsAddNewNameCharacters = (event) => {
    setSubfonctionsAddNewNameCharactersSelected(event.currentTarget.value);
  };

  const changeSubfonctionsAddNewPlayerCharacters = (event, inputValue) => {
    setSubfonctionsAddNewPlayerCharactersSelected(inputValue);
  };

  const changeSubfonctionsOccurrenceCharacters = (event, inputValue) => {
    setSubfonctionsOccurrenceCharactersSelected(inputValue);
  };

  const changeSubfonctionsUpdateCharacters = (event, inputValue) => {
    setSubfonctionsUpdateCharactersSelected(inputValue);

    if (props.charactersList.find(character => character.name === inputValue)) {
      for (let i = 0 ; i < props.charactersList.length ; i++) {
        if (props.charactersList[i].name === inputValue) {
          if (props.charactersList[i].player === false) {
            updatePlayer = "npc";
          } else {
            updatePlayer = "player";
          }

          changeSubfonctionsUpdatePlayerCharacters(event, updatePlayer);
          
          break;
        }
      }
    }

    setHiddenUpdateNameCharacter(false);
    setHiddenUpdatePlayerCharacter(false);
  };

  const changeSubfonctionsUpdateNameCharacters = (event, inputValue) => {
    setSubfonctionsUpdateNameCharactersSelected(event.currentTarget.value);
  };

  const changeSubfonctionsUpdatePlayerCharacters = (event, inputValue) => {
    if (inputValue !== undefined) {
      setSubfonctionsUpdatePlayerCharactersSelected(inputValue);
    } else {
      setSubfonctionsUpdatePlayerCharactersSelected(event.currentTarget.value);
    }
  };

  const changeSubfonctionsDeleteCharacters = (event, inputValue) => {
    setSubfonctionsDeleteCharactersSelected(inputValue);
  }

  const changeSubfonctionsInformationCharacters = (event, inputValue) => {
    setSubfonctionsInformationCharactersSelected(inputValue);
  }

  const clickCharacter = () => {
    if (subfonctionsCharactersSelected === "add" || subfonctionsCharactersSelected === "Ajouter une occurrence et / ou un personnage") {
      if (subfonctionsAddCharactersSelected === "existing") {
        let characterResponse = characterAdd(props.charactersList, subfonctionsAddExistingCharactersSelected);

        if (characterResponse.full === false) {
          firebase.updateDocument("helpers", props.idHelper, {
            "charactersList": characterResponse.charactersList
          /* }).then(doc => {
            setData(doc.data()); */
          });

          setHistory(h => ([...h, logCharacter("Une occurrence du personnage " + subfonctionsAddExistingCharactersSelected + " a été ajoutée à la liste de personnages")]));
        } else {
          setHistory(h => ([...h, logCharacter("Il y a déjà trois occurrences de ce personnage dans la liste des personnages")]));
        }
      } else {
        let isPlayer = false;

        if (subfonctionsAddNewPlayerCharactersSelected === "player") {
          isPlayer = true;
        }
        
        let characterResponse = characterAdd(props.charactersList, subfonctionsAddNewNameCharactersSelected, isPlayer);

        if (characterResponse.full === false) {
          firebase.updateDocument("helpers", props.idHelper, {
            "charactersList": characterResponse.charactersList
          /* }).then(doc => {
            setData(doc.data()); */
          });

          setHistory(h => ([...h, logCharacter("Le personnage " + subfonctionsAddNewNameCharactersSelected + " a été ajouté à la liste de personnages")]));
        } else {
          setHistory(h => ([...h, logCharacter("Il y a déjà trois occurrences de ce personnage dans la liste des personnages")]));
        }
      }
    } else if (subfonctionsCharactersSelected === "creation" || subfonctionsCharactersSelected === "Créer un nouveau personnage") {
      let characterIdentityText = "";
      let characterDescriptorsText = "";
      
      let characterResponse = characterCreation(props.charactersList, [], "", 0, "");

      firebase.updateDocument("helpers", props.idHelper, {
        "charactersList": characterResponse.charactersList
      /* }).then(doc => {
        setData(doc.data()); */
      });

      for (let i = 0 ; i < characterResponse.characterIdentity.length ; i++) {
        characterIdentityText = characterIdentityText + characterResponse.characterIdentity[i];

        if (i < characterResponse.characterIdentity.length - 1) {
          characterIdentityText = characterIdentityText + " / ";
        }
      }

      for (let i = 0 ; i < characterResponse.characterDescriptors.length ; i++) {
        characterDescriptorsText = characterDescriptorsText + characterResponse.characterDescriptors[i];

        if (i < characterResponse.characterDescriptors.length - 1) {
          characterDescriptorsText = characterDescriptorsText + " / ";
        }
      }

      setHistory(h => ([...h, logCharacter("Le personnage " + characterResponse.characterName + " a été créé avec les caractéristiques suivantes (" + characterResponse.characterSpecialTrait.characterSpecialTraitName + " - " + characterIdentityText + " - " + characterDescriptorsText + ")")]));
    } else if (subfonctionsCharactersSelected === "list" || subfonctionsCharactersSelected === "Liste de personnages") {
      let characterResponse = characterList(props.charactersList);

      let responseText = "";

      for (let i = 0 ; i < characterResponse.names.length ; i++) {
        responseText = responseText + (i + 1) + "- " + characterResponse.names[i];

        if (i < characterResponse.names.length - 1) {
          responseText = responseText + "\n";
        }
      }

      setHistory(h => ([...h, logCharacter(responseText)]));
    } else if (subfonctionsCharactersSelected === "random" || subfonctionsCharactersSelected === "Sélectionner aléatoirement un personnage") {
      let characterResponse = characterRandom(props.charactersList);

      setHistory(h => ([...h, logCharacter(characterResponse.name)]));
    } else if (subfonctionsCharactersSelected === 'occurrence' || subfonctionsCharactersSelected === "Occurrences d'un personnage") {
      let characterResponse = characterOccurrences(props.charactersList, subfonctionsOccurrenceCharactersSelected);

      setHistory(h => ([...h, logCharacter("Le personnage " + subfonctionsOccurrenceCharactersSelected + " apparaît " + characterResponse.numberOf + " fois dans la liste des personnages")]));
    } else if (subfonctionsCharactersSelected === "update" || subfonctionsCharactersSelected === "Modifier un personnage") {
      let isPlayer = false;

      if (subfonctionsUpdatePlayerCharactersSelected === "player") {
        isPlayer = true;
      }
      
      let characterResponse = characterUpdate(props.charactersList, subfonctionsUpdateCharactersSelected, subfonctionsUpdateNameCharactersSelected, isPlayer);

      firebase.updateDocument("helpers", props.idHelper, {
        "charactersList": characterResponse.charactersList
      /* }).then(doc => {
        setData(doc.data()); */
      });

      setHistory(h => ([...h, logCharacter("Le personnage " + subfonctionsUpdateNameCharactersSelected + " a été mis à jour")]));
    } else if (subfonctionsCharactersSelected === 'delete' || subfonctionsCharactersSelected === "Supprimer une occurrence et / ou un personnage") {
      let characterResponse = characterDelete(props.charactersList, props.archivedCharacters, subfonctionsDeleteCharactersSelected);

      firebase.updateDocument("helpers", props.idHelper, {
        "charactersList": characterResponse.charactersList,
        "archivedCharacters": characterResponse.archivedCharacters
      /* }).then(doc => {
        setData(doc.data()); */
      });

      if (characterResponse.empty === false) {
        setHistory(h => ([...h, logCharacter("Une occurrence du personnage " + subfonctionsDeleteCharactersSelected + " a été supprimée de la liste de personnages")]));
      } else {
        setHistory(h => ([...h, logCharacter("La dernière occurrence du personnage " + subfonctionsDeleteCharactersSelected + " a été supprimée de la liste de personnages et le personnage est maintenant archivé")]));
      }
    } else if (subfonctionsCharactersSelected === 'information' || subfonctionsCharactersSelected === "Informations sur un personnage") {
      let player = "";
      
      let characterResponse = characterInformation(props.charactersList, subfonctionsInformationCharactersSelected);

      if (characterResponse.player === true) {
        player = "Joueur";
      } else {
        player = "PNJ";
      }

      setHistory(h => ([...h, logCharacter("Nom : " + characterResponse.name + " (" + player + ") / Pièces d'or : " + characterResponse.piecesOr + " / Mode de déplacement : " + characterResponse.travel.travelMode)]));
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
          id="combo-box-characters"
          options={subfonctionsCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsCharacters}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a subfonction"/>}
        />
  
        {!hiddenAddCharacter ? <FormControl>
          <RadioGroup
            name="radio-buttons-group-add-character"
            onChange={changeSubfonctionsAddCharacters}>
            <FormControlLabel value="existing" control={<Radio />} label="Personnage existant" />
            <FormControlLabel value="new" control={<Radio />} label="Nouveau personnage" />
          </RadioGroup>
        </FormControl> : null}
  
        {!hiddenAddExistingCharacter ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-occurrence-add-existing-characters"
          options={existingCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsAddExistingCharacters}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a character"/>}
        /> : null}
  
        {!hiddenAddNewCharacter ? <TextField
          id="outlined-add-new-character"
          label="Write a name"
          variant="outlined"
          onChange={changeSubfonctionsAddNewNameCharacters} /> : null}
  
        {!hiddenAddNewCharacter ? <FormControl>
          <RadioGroup
            name="radio-buttons-group-add-new-character"
            onChange={changeSubfonctionsAddNewPlayerCharacters}>
            <FormControlLabel value="player" control={<Radio />} label="Joueur" />
            <FormControlLabel value="npc" control={<Radio />} label="PNJ" />
          </RadioGroup>
        </FormControl> : null}
  
        {!hiddenOccurrenceCharacter ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-occurrence-characters"
          options={existingCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsOccurrenceCharacters}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a character"/>}
        /> : null}
  
        {!hiddenUpdateCharacter ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-update-characters"
          options={existingCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsUpdateCharacters}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a character"/>}
        /> : null}
  
        {!hiddenUpdateNameCharacter ? <TextField
          id="outlined-update-character"
          label={subfonctionsUpdateCharactersSelected}
          variant="outlined"
          onChange={changeSubfonctionsUpdateNameCharacters} /> : null}
  
        {!hiddenUpdatePlayerCharacter ? <FormControl>
          <RadioGroup
            name="radio-buttons-group-update-character"
            value={subfonctionsUpdatePlayerCharactersSelected}
            onChange={changeSubfonctionsUpdatePlayerCharacters}>
            <FormControlLabel value="player" control={<Radio />} label="Joueur" />
            <FormControlLabel value="npc" control={<Radio />} label="PNJ" />
          </RadioGroup>
        </FormControl> : null}
  
        {!hiddenDeleteCharacter ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-delete-characters"
          options={existingCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsDeleteCharacters}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a character"/>}
        /> : null}
  
        {!hiddenInformationCharacter ? <Autocomplete
          autoComplete
          autoSelect
          disablePortal
          id="combo-box-information-characters"
          options={existingCharacters}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          onInputChange={changeSubfonctionsInformationCharacters}
          renderInput={(params) =>
          <TextField {...params}
            label="Choose a character"/>}
        /> : null}
  
        <Button
          variant="contained"
          onClick={clickCharacter}
        >Character
        </Button>
      </Stack>
    </React.Fragment>
  )
}
