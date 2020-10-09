import React, { useState } from 'react'

import { Grid, Card, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles({

    root: {
        backgroundColor: '#dedede',
        height: '100%',
        padding: '5px',
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    card: {
        display: 'flex',
        alignItems: 'center',
        color: 'red',
        padding: '10px',
        justifyContent: 'space-between'
    },
    textCard: {
        padding: '10px',
        color: 'blue'
    }

});


const RealDashboard = () => {

    const classes = useStyles()


    const [cantidadProductos, setCantidadProductos] = useState(0)
    const [productosFaltantes, setProductosFaltantes] = useState(0)



    return <>

        <Grid container direction='column' >
            <Grid container item xs={12}>

                <Grid item xs={12} sm={6} md={3}>
                    <Card className={classes.root}>

                        <div className={classes.card}>
                            <h2>{cantidadProductos}</h2>
                            <ImportantDevicesIcon />
                        </div>
                        <div className={classes.textCard} >

                            <p>Cantidad de Productos en Stock</p>
                            <Button variant='contained' color='primary' onClick={() => { setCantidadProductos(cantidadProductos + 1) }}>+++</Button>

                        </div>

                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card className={classes.root}>

                        <div className={classes.card}>
                            <h2>{productosFaltantes}</h2>
                            <WarningIcon />
                        </div>
                        <div className={classes.textCard} >

                            <p>Productos Faltantes</p>
                            <Button variant='contained' color='primary' onClick={() => { setProductosFaltantes(productosFaltantes + 1) }}>+++</Button>

                        </div>

                    </Card>
                </Grid>
            </Grid>

        </Grid>
    </>
}

export default RealDashboard