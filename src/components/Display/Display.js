import React from "react";
import useStyles from './Display_css';
import { Chip, Typography } from "@mui/material"; 
import { v4 as uuidv4 } from 'uuid';

const data = [
    {
        command: "1d100",
        result: "74"
    },
    {
        command: "Fate Check (50/50, CF5, positive)",
        result: "Yes, Random Event"
    },
    {
        commend: "Random Event",
        result: "NPC Positive, Consume Terror"
    }
]

export default function Display() {
    const classes = useStyles();

    return (
        <div className={classes.displaycontainer}>
            { data.map(item => (
                <React.Fragment key={uuidv4()}>
                    <Typography variant="body1">{item.command}</Typography>
                    <Chip label={item.result}/>
                </React.Fragment>
            ))}
        </div>
    )
}

