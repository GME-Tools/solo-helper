import { makeStyles } from "@mui/styles";

export default makeStyles(theme => ({
    displaycontainer: {
        height: "100%",
        width: "100%",
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px"
    },

    displaychip: {
        height: "100%",
        textAlign: "left",
        padding: "5px"
    },
    displaytitle: {
        fontWeight: "800"
    },
    reactEmoji: {
        lineHeight: 1
    }
}));