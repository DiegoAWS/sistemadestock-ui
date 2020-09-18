import React, { useState } from 'react'
import { Grid, makeStyles, TextField, InputAdornment, Button, Hidden } from '@material-ui/core'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import { getRequest, postRequest } from '../../API/apiFunctions'


const useStyle = makeStyles( ( theme ) => ( {

    AjustePrecios: {
        backgroundColor: '#e8e8e8',
        borderRadius: '10px'

    },

    Container: {
        margin: '0 10px'
    }


} ) )



const Ajustes = props =>
{

    const classes = useStyle()

    const [ pMinorista, setPMinorista ] = useState( 106.25 )
    const [ p3cuotas, setP3cuotas ] = useState( 112.50 )
    const [ p6cuotas, setP6cuotas ] = useState( 130 )
    const [ p12cuotas, setP12cuotas ] = useState( 150 )

    const parseNumber = entr => entr.replace( /[^0-9\.]/, '' )

    const guardarInfo = e =>
    {

    }

    return (

        <Grid container spacing={ 5 } classes={ { root: classes.Container } }>
            <Grid item container direction='column' xs={ 6 } md={ 4 } classes={ { root: classes.AjustePrecios } }>
                <Grid item container justify='space-between'>
                    <Grid item xs={ 6 } >
                        <h4>Ajustes de Precios %</h4>
                    </Grid>
                    <Grid item xs={ 6 } style={ { display: 'flex', justifyContent: 'flex-end' } }>
                        <Button variant="contained" color="secondary" onClick={ guardarInfo }>
                            <SaveAltIcon />
                            <Hidden lgDown >
                                Guardar</Hidden>

                        </Button>
                    </Grid>
                </Grid>

                <Grid item>
                    <TextField label={ 'Precio Contado Mayorista' }

                        InputProps={ { endAdornment: <InputAdornment position="end">%</InputAdornment> } }
                        size='small' variant="outlined" margin='normal' fullWidth
                        value={ '100' } />

                </Grid>

                <Grid item>
                    <TextField label={ 'Precio Contado Minorista' }
                        InputProps={ { endAdornment: <InputAdornment position="end">%</InputAdornment> } }
                        variant="outlined" margin='normal' size="small" fullWidth
                        value={ pMinorista } onChange={ e => setPMinorista( parseNumber( e.target.value ) ) } />

                </Grid>

                <Grid item>
                    <TextField label={ 'Precio Total 3 Cuotas' }
                        InputProps={ { endAdornment: <InputAdornment position="end">%</InputAdornment> } }
                        variant="outlined" margin='normal' size="small" fullWidth
                        value={ p3cuotas } onChange={ e => setP3cuotas( parseNumber( e.target.value ) ) } />

                </Grid>

                <Grid item>
                    <TextField label={ 'Precio Total 3 Cuotas' }
                        InputProps={ { endAdornment: <InputAdornment position="end">%</InputAdornment> } }
                        variant="outlined" margin='normal' size="small" fullWidth
                        value={ p6cuotas } onChange={ e => setP6cuotas( parseNumber( e.target.value ) ) } />

                </Grid>

                <Grid item>
                    <TextField label={ 'Precio Total 3 Cuotas' }
                        InputProps={ { endAdornment: <InputAdornment position="end">%</InputAdornment> } }
                        variant="outlined" margin='normal' size="small" fullWidth
                        value={ p12cuotas } onChange={ e => setP12cuotas( parseNumber( e.target.value ) ) } />

                </Grid>


            </Grid>
        </Grid>
    )

}
export default Ajustes