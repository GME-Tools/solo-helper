import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
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
  
  return (
    <Container>
      <Typography variant="body1">id = {id}, token = {token}</Typography>
      <Typography variant="body1">
        {isAuth ? "Peut modifier" : "Lecture Seule"}
      </Typography>
    </Container>
  )
}
