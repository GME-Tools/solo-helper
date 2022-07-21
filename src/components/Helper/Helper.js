import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Autocomplete, TextField, Button } from "@mui/material";
import { useFirebase } from "context/FirebaseContext";

/* function onClickFunctions(event) {
    console.log("test");
} */

export default function Helper() {
  const firebase = useFirebase();
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState({})
  const [tfValue, setTFValue] = useState("");
  const [functionSelected, setFunctionSelected] = useState("");
  const functions = [
  { label: 'Fate', id: 1 },
  { label: 'Event', id: 2 },
];

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
      <Autocomplete
        autoComplete
        autoSelect
        disablePortal
        id="combo-box-functions"
        options={functions}
        onInputChange={(event, inputValue) => // setTFValue(inputValue);
        setFunctionSelected(inputValue)}
        sx={{ width: 300 }}
        renderInput={(params) => 
      <TextField {...params} label="Functions" />}
/>

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
            setTFValue("Event pas encore intégré")
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
