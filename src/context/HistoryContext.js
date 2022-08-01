import { createContext, useContext, useState } from 'react';
import { Typography } from "@mui/material";

export const logDieRoll = (command, result) => ({
  emoji: <span style={{lineHeight: 1}}>🎲</span>,
  command: command,
  result: result
});

export const logMeaning = (type, result) => ({
  emoji: <span style={{lineHeight: 1}}>📋</span>,
  command: "Table " + type,
  result: result
});

export const logRandomEvent = result => ({
  emoji: <span style={{lineHeight: 1}}>↩️</span>,
  command: "Evénement aléatoire",
  result: result
});

export const logFate = (odd,cf,yesno, result) => ({
  emoji: <span style={{lineHeight: 1}}>🔮</span>,
  command: "Oracle ("+odd+', CF'+ cf + ')',
  result: result
});

export const logLoot = (result) => ({
  emoji: <span style={{lineHeight: 1}}>💰</span>,
  command: "Loot",
  result: result
});

export const logCharacter = (result) => ({
  emoji: <span style={{lineHeight: 1}}>🧑</span>,
  command: "Personnage",
  result: result
});

const data = [
  {
    emoji: <span style={{lineHeight: 1}}>🎲</span>,
    command: "1d100",
    result: <div><Typography>74</Typography></div>
  },
  {
    emoji: <span style={{lineHeight: 1}}>🔮</span>,
    command: "Fate Check (50/50, CF5, positive)",
    result: <div><Typography>Yes, Random Event"</Typography><Typography>NPC Positive, Consume Terror</Typography></div>
  }
]

const HistoryContext = createContext();
export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(data);
  return <HistoryContext.Provider value={[history,setHistory]}>{children}</HistoryContext.Provider>;
}
export const useHistory = () => useContext(HistoryContext);