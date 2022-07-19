import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";

export default function Helper() {
  const { id, token } = useParams();

  return (
    <Container>
      <Typography variant="body1">id = {id}, token = {token}</Typography>
    </Container>
  )
}
