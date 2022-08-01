import React from "react";
import useStyles from './Display_css';
import { Chip, Typography } from "@mui/material"; 
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from "context/HistoryContext";


export default function Display() {
    const classes = useStyles();
    const [history, ] = useHistory();

    return (
        <div className={classes.displaycontainer}>
            { history.map(item => (
                <Chip
                    key={uuidv4()}
                    className={classes.displaychip}
                    avatar={item.emoji}
                    label={
                        <div>
                            <Typography className={classes.displaytitle} variant="body1">{item.command}</Typography>
                            {item.result}
                        </div>
                    }
                />
            ))}
        </div>
    )
}

