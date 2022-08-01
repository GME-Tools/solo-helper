import { Container } from "@mui/material";
import { HistoryProvider } from "context/HistoryContext";
import FunctionAppBar from "components/FunctionsAppBar/FunctionsAppBar";
import Display from 'components/Display/Display';

export default function Helper() {
  return (
    <HistoryProvider>
      <Container>
        <FunctionAppBar />
        <Display />
      </Container>
    </HistoryProvider>
  )
}
