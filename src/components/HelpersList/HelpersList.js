import { useFirebase } from "context/FirebaseContext";
import { useEffect, useState } from "react";
import { Button, Card, Container, Typography } from "@mui/material"
import { List, ListItem, ListItemText } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

export default function HelpersList() {
  const firebase = useFirebase();
  const [helpers, setHelpers] = useState([]);

  useEffect(() => {
    firebase.getCurrentUser().then(doc => {
      if (doc.data().hasOwnProperty('helpers')) {
        setHelpers(doc.data().helpers);
      }
      else {
        setHelpers([]);
      }
    })
    .catch(err => {
      firebase.setCurrentUserData({helpers: []})
    });
  }, [firebase]);
  
  const handleNew = () => {
    const uid = uuidv4();
    const data = [...helpers, uid]
    setHelpers(data);
    firebase.setCurrentUserData({helpers: data})
    alert('Nouveau Helper : https://solo-helper.web.app/'+uid+'/'+firebase.authUser().uid);
  }

  return (
    <Container>
      <Typography variant="h5">Solo Helpers</Typography>
      <Button onClick={handleNew}>Nouveau</Button>
      <Card>
        <List>
        {
          helpers.map(elem => (
            <ListItem key={elem}>
              <ListItemText>{elem}</ListItemText>
            </ListItem>
          ))
        }
        </List>
      </Card>
    </Container>
  )
}
