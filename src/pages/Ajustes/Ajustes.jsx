import React, { useState, useEffect } from 'react'
import { Grid, makeStyles, TextField, InputAdornment, Button, Hidden } from '@material-ui/core'

import SaveAltIcon from '@material-ui/icons/SaveAlt'

import { getRequest, postRequest } from '../../API/apiFunctions'

import loadingGif from '../../assets/images/loading.gif'

const useStyle = makeStyles((theme) => ({

    AjustePrecios: {
        backgroundColor: '#e8e8e8',
        borderRadius: '10px',
        margin: '10px',
        padding: '10px'

    },

    Container: {
        margin: '0 10px'
    }


}))



const Ajustes = props => {

    const classes = useStyle()

    //#region  State ----------------------------------

    const [id, setId] = useState(-1)
    const [pMinorista, setPMinorista] = useState(106.25)
    const [p3cuotas, setP3cuotas] = useState(112.50)
    const [p6cuotas, setP6cuotas] = useState(130)
    const [p12cuotas, setP12cuotas] = useState(150)

    const [p18cuotas, setP18cuotas] = useState(180)
    const [p24cuotas, setP24cuotas] = useState(200)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)


    //#endregion State

    useEffect(() => { leerInfo() }, [])

    const parseNumber = entr => entr.replace(/[^\d.]/, '')

    //#region  Info SAVE & LOAD ----------------------------------

    const leerInfo = () => {
        getRequest('/ajustes')
            .then(response => {
                setLoading(false)

                if (response && response.data && response.data[0]) {
                    let r = response.data[0]


                    setId(r.id)
                    setPMinorista(r.pMinorista)
                    setP3cuotas(r.p3cuotas)
                    setP6cuotas(r.p6cuotas)
                    setP12cuotas(r.p12cuotas)
                    setP18cuotas(r.p18cuotas)
                    setP24cuotas(r.p24cuotas)
                }

            })
    }

    const guardarInfo = e => {
        if (loading)
            return

        setLoading(true)


        if (50 < pMinorista && pMinorista < 500 &&
            50 < p3cuotas && p3cuotas < 500 &&
            50 < p6cuotas && p6cuotas < 500 &&
            50 < p12cuotas && p12cuotas < 500 &&
            50 < p18cuotas && p18cuotas < 500 &&
            50 < p24cuotas && p24cuotas < 500) {


            let editar = ''
            if (id > 0)
                editar = '/' + id

            postRequest('/ajustes' + editar, {
                pMinorista,
                p3cuotas,
                p6cuotas,
                p12cuotas,
                p18cuotas,
                p24cuotas
            }).then(response => {
                leerInfo()
            })


        }
        else {

            setError(true)

            setTimeout(() => {

                setPMinorista(106.25)
                setP3cuotas(112.50)
                setP6cuotas(130)
                setP12cuotas(150)
                setP18cuotas(180)
                setP24cuotas(200)
                setError(false)
            }, 2000)


        }

    }

    //#endregion Info SAVE & LOAD



    //#region  Ajuste de Precios ----------------------------------

    const RegAjustePrecios = () => (
        <Grid item container direction='column' xs={12} md={4} classes={{ root: classes.AjustePrecios }}>
            <Grid item container justify='space-between'>
                <Grid item style={{ display: 'flex', justifyContent: 'center' }}>
                    <h4>Ajustes de Precios %</h4>
                </Grid>
                <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="secondary" onClick={guardarInfo}>

                        {loading ? <img src={loadingGif} width='24px' alt='' />
                            : <>
                                <SaveAltIcon />
                                <Hidden lgDown >
                                    Guardar</Hidden>
                            </>
                        }


                    </Button>
                </Grid>
            </Grid>

            <Grid item>
                <TextField label={'Precio Contado Mayorista'}

                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    size='small' variant="outlined" margin='normal' fullWidth error={error}
                    value={'100'} />

            </Grid>

            <Grid item>
                <TextField label={'Precio Contado Minorista'}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    variant="outlined" margin='normal' size="small" fullWidth error={error}
                    value={pMinorista} onChange={e => setPMinorista(parseNumber(e.target.value))} />

            </Grid>

            <Grid item>
                <TextField label={'Precio Total 3 Cuotas'}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    variant="outlined" margin='normal' size="small" fullWidth error={error}
                    value={p3cuotas} onChange={e => setP3cuotas(parseNumber(e.target.value))} />

            </Grid>

            <Grid item>
                <TextField label={'Precio Total 6 Cuotas'}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    variant="outlined" margin='normal' size="small" fullWidth error={error}
                    value={p6cuotas} onChange={e => setP6cuotas(parseNumber(e.target.value))} />

            </Grid>

            <Grid item>
                <TextField label={'Precio Total 12 Cuotas'}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    variant="outlined" margin='normal' size="small" fullWidth error={error}
                    value={p12cuotas} onChange={e => setP12cuotas(parseNumber(e.target.value))} />

            </Grid>


            <Grid item>
                <TextField label={'Precio Total 18 Cuotas'}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    variant="outlined" margin='normal' size="small" fullWidth error={error}
                    value={p18cuotas} onChange={e => setP18cuotas(parseNumber(e.target.value))} />

            </Grid>
            <Grid item>
                <TextField label={'Precio Total 24 Cuotas'}
                    InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                    variant="outlined" margin='normal' size="small" fullWidth error={error}
                    value={p24cuotas} onChange={e => setP24cuotas(parseNumber(e.target.value))} />

            </Grid>
        </Grid>

    )

    //#endregion Ajuste de Precios


    return (

        < Grid container spacing={3} classes={{ root: classes.Container }}>

            {RegAjustePrecios()}

        </Grid >
    )

}
export default Ajustes