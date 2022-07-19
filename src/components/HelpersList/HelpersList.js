import { useFirebase } from "context/FirebaseContext";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";

export default function HelpersList() {
  const firebase = useFirebase();
  const [helpers, setHelpers] = useState(null);

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
      firebase.setCurrentUserData([])
    });
  }, [firebase]);


  return (
    <div className="container">
        <h4>Solo Helpers</h4>
        <List>
        {
          helpers.map((key,idx) => (
            <ListItem>
              <ListItemText></ListItemText>
            </ListItem>
          ))
        }
        </List>
    </div>
  )
}
