import React, { useState } from 'react'

import { withRouter } from 'react-router-dom'

import {  Grid, Button, TextField } from '@material-ui/core'

import logo from '../../assets/images/logo.png'
import Popup from '../FormAdd/Popup'
// import { makeStyles } from "@material-ui/core/styles";


import { register } from '../../API/apiFunctions'

import loading from '../../assets/images/loading.gif'


const Register = ( { history } ) =>
{

    // const classes = useStyles();

    const init = {
        role: 'empleado',
        name: '',
        username: '',
        password: '',
        password_confirmation: '',
        loading: false,
        error: false,
        openPopup: false,
        errorMensaje: "Más de 8 caracteres"
    }


    const [ state, setState ] = useState( init )

    const saveData = e =>
    {

        e.preventDefault()

        setState( { ...state, loading: true } )

        if ( state.password !== state.password_confirmation || state.password.length < 8 )
        {
            if ( state.password !== state.password_confirmation )

                setState( { ...state, error: true } )

            if ( state.password.length < 8 )
                setState( { ...state, error: true, errorMensaje: "Contraseña muy corta" } )


            setTimeout( () =>
            {

                setState( { ...state, error: false, password: '', password_confirmation: '', errorMensaje: "Más de 8 caracteres" } )

            }, 3800 )
            return
        }




        const user = {
            role: state.role,
            name: state.name,
            username: state.username,
            password: state.password,
            password_confirmation: state.password_confirmation
        }
        register( user ).then( ( res ) =>
        {



            if ( res && res.statusText && res.statusText === "Created" )
            {

                history.push( '/' )

            }
            else
            {
                // helper.innerText = 'Error en el Nombre de Usuario '

                setTimeout( () =>
                {
                    // helper.innerText = ''

                }, 2000 )
            }
            //mostrar mensaje de Error
            setState( init )
        } )

    }

    const handlerOpenPopup = ( value ) =>
    {
        setState( { ...state, openPopup: value } )
    }



    return (

        <>
            <Button variant="contained" color="secondary" onClick={ e => handlerOpenPopup( true ) }>
                { state.loading ?
                    <img style={ { width: '20px' } } src={ loading } alt="loading" />
                    : 'Añadir Usuario'
                }
            </Button>

            <Popup
                openPopup={ state.openPopup }
                clearform={ () => { setState( init ) } }
                setOpenPopup={ value => handlerOpenPopup( value ) }
                title={ 'Añadir Usuario' }
                logo={ logo }
                saveData={ saveData }>

                <Grid justify={ 'space-around' } container spacing={ 4 }>
                    <Grid item xs={ 12 } lg={ 4 }>

                        <TextField

                            select
                            label="Perfil"
                            value={ state.role }
                            onChange={ e => setState( { ...state, role: e.target.value } ) }
                            SelectProps={ {
                                native: true,
                            } }
                            helperText="Nivel de acceso al sistema"
                            variant="outlined" >

                            <option value={ "empleado" }>Empleado</option>
                            <option value={ "jefe" }>Jefe Local</option>
                            <option value={ "admin" }>Administrador</option>

                        </TextField>



                    </Grid>

                    <Grid item xs={ 12 } lg={ 8 }>

                        <TextField fullWidth
                            value={ state.name } onChange={ e => setState( { ...state, name: e.target.value } ) }
                            label="Nombre completo" variant="outlined" />

                    </Grid>

                    <Grid item xs={ 12 } lg={ 4 }>

                        <TextField
                            value={ state.username }
                            helperText="Identificador Único"
                            onChange={ e => setState( { ...state, username: e.target.value } ) }
                            fullWidth label="Usuario" variant="outlined" />

                    </Grid>

                    <Grid item xs={ 12 } lg={ 4 }>

                        <TextField
                            value={ state.password } onChange={ e => setState( { ...state, password: e.target.value } ) }
                            error={ state.error }

                            fullWidth label="Contraseña" variant="outlined" />

                    </Grid>

                    <Grid item xs={ 12 } lg={ 4 }>

                        <TextField dsdsvalue={ state.password_confirmation }
                            onChange={ e => setState( { ...state, password_confirmation: e.target.value } ) }
                            fullWidth error={ state.error }
                            helperText={ state.errorMensaje }
                            label="Repetir Contraseña" variant="outlined" />

                    </Grid>

                </Grid>
            </Popup>


        </>

    )

}
export default withRouter( Register )