import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useFirebase } from "context/FirebaseContext";

export default function Helper() {
  const firebase = useFirebase();
  const { id, token } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState({})

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
  
  return (
    <Container>
      <FormControl fullWidth>
        <InputLabel id="functions-label">Functions</InputLabel>
        <Select
    labelId="functions-label"
    id="functions"
    // value={function}
    label="Functions"
    // onChange={handleChange}
  >
          <MenuItem
            // value={Fate} 
            >Fate</MenuItem>
          <MenuItem
            // value={Event}
            >Event</MenuItem>
        </Select>
      </FormControl>
    </Container>
  )
}
