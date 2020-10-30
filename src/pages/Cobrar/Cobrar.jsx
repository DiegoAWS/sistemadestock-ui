import React from 'react'
//, { useState, useEffect }

import { makeStyles, Grid } from "@material-ui/core"
//, Card, TextField, Typography, IconButton, Button, Divider


//#region JSS
const useStyle = makeStyles(() => ({
    root: {

    },
}))
//#endregion

const Cobrar = () => {
    const classes = useStyle()




    return (
        <>
            <Grid container spacing={1} className={classes.root}>
                <Grid item xs={12} container spacing={1}>
                    Hola
                </Grid>
            </Grid>
        </>
    )
}

export default Cobrar
