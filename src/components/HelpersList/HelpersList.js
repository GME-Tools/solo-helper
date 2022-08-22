import { useFirebase } from "context/FirebaseContext";
import { useEffect, useState } from "react";
import { Button, Card, Container, IconButton, Snackbar, Typography } from "@mui/material"
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';

export default function HelpersList() {
  const baseUrl = `${process.env.REACT_APP_HOSTING_URL}`;
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
    firebase.setDocument("helpers", uid, {
      archivedCharacters: [],
      campaignID: uid,
      chaosFactor: 4,
      charactersList: [
        { "value": [1,4],
          "name": "Nouveau personnage" },
        { "value": [5,8],
          "name": "Nouveau personnage" },
        { "value": [9,12],
          "name": "Nouveau personnage" },
        { "value": [13,16],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [17,20],
          "name": "Nouveau personnage" },
        { "value": [21,24],
          "name": "Nouveau personnage" },
        { "value": [25,28],
          "name": "Nouveau personnage" },
        { "value": [29,32],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [33,36],
          "name": "Nouveau personnage" },
        { "value": [37,40],
          "name": "Nouveau personnage" },
        { "value": [41,44],
          "name": "Nouveau personnage" },
        { "value": [45,48],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [49,52],
          "name": "Nouveau personnage" },
        { "value": [53,56],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [57,60],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [61,64],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [65,68],
          "name": "Nouveau personnage" },
        { "value": [69,72],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [73,76],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [77,80],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [81,84],
          "name": "Nouveau personnage" },
        { "value": [85,88],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [89,92],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [93,96],
          "name": "Choisissez le personnage le plus logique" },
        { "value": [97,100],
          "name": "Nouveau personnage" }
      ],
      currentPlot: "",
      inventory: [],
      plotsList: [
        { "value": [1,4],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [5,8],
          "name": "Nouvelle intrigue" },
        { "value": [9,12],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [13,16],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [17,20],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [21,24],
          "name": "Nouvelle intrigue" },
        { "value": [25,28],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [29,32],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [33,36],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [37,40],
          "name": "Nouvelle intrigue" },
        { "value": [41,44],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [45,48],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [49,52],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [53,56],
          "name": "Nouvelle intrigue" },
        { "value": [57,60],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [61,64],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [65,68],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [69,72],
          "name": "Nouvelle intrigue" },
        { "value": [73,76],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [77,80],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [81,84],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [85,88],
          "name": "Nouvelle intrigue" },
        { "value": [89,92],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [93,96],
          "name": "Choisissez l'intrigue la plus logique" },
        { "value": [97,100],
          "name": "Choisissez l'intrigue la plus logique" }
      ],
      plotPoints:[],
      theme: "",
      themes: []
    });
    setNewUuid(uid);
  }

  const handleClickList = elem => {
    navigator.clipboard.writeText(baseUrl+"/"+elem+'/'+firebase.authUser().uid)
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
            <Typography variant="body1"><b>Edition :</b> {baseUrl}/{newUuid}/{firebase.authUser().uid}</Typography>
            <Typography variant="body1"><b>Lecture seule :</b> {baseUrl}/{newUuid}</Typography>
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
