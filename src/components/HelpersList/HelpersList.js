import { useFirebase } from "context/FirebaseContext";
import { useEffect, useState } from "react";
import { Button, Card, Container, IconButton, Snackbar, Typography } from "@mui/material"
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

export default function HelpersList() {
  const firebase = useFirebase();
  const [helpers, setHelpers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [newUuid, setNewUuid] = useState("");

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

  useEffect(() => {
    if (newUuid !== "") {
      setOpen(true);
    }
  },[newUuid])

  const handleClose = () => setOpen(false);

  const handleNew = () => {
    const uid = uuidv4();
    const data = [...helpers, uid]
    setHelpers(data);
    firebase.setCurrentUserData({helpers: data});
    firebase.setDocument("helpers",uid,{});
    setNewUuid(uid);
  }

  const handleClickList = elem => {
    navigator.clipboard.writeText("https://solo-helper.web.app/"+elem+'/'+firebase.authUser().uid)
    setOpenSnack(true);
  }

  const handleDelete = elem => {
    const data = helpers.filter(helper => helper !== elem);
    setHelpers(data)
    firebase.setCurrentUserData({helpers: data});
    firebase.deleteDocument("helpers",elem);
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h5">Solo Helpers</Typography>
      <Button onClick={handleNew}>Nouveau</Button>
      <Card>
        <List>
        {
          helpers.map(elem => (
            <ListItem key={elem}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(elem)}>
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton onClick={() => handleClickList(elem)} dense>
                <ListItemText>{elem}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))
        }
        </List>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{"Nouveau Solo Helper"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1"><b>Edition :</b> https://solo-helper.web.app/{newUuid}/{firebase.authUser().uid}</Typography>
            <Typography variant="body1"><b>Lecture seule :</b> https://solo-helper.web.app/{newUuid}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>OK</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnack}
        autoHideDuration={5000}
        onClose={()=>setOpenSnack(false)}
        message="Lien copié"
      />
    </Container>
  )
}
