import React, { useState } from 'react';

import { withRouter } from 'react-router-dom'
import { login, getProfile } from '../../API/apiFunctions'



import loading from '../../assets/images/loading.gif'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    error: {
        position: 'absolute',
        top: '70px',
        fontWeight: 'bold',
        backgroundColor: '#b5b5b563',
        borderRadius: '3px',
    },
    BotonAcceso: {
        width: '70px'
    },
    loadingGif: {
        width: '15px',
        display: 'inline'
    }

});
/*
element.style {
    
} */

const FormLogin = ({ history, logIn }) => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const SubmitHandler = e => {
        e.preventDefault()

        var LoadingGif = document.getElementById('loadingGif')
        var errorSpan = document.getElementById('errorSpan')

        LoadingGif.hidden = false


        const user = {
            username,
            password

        }


        login(user).then((res) => {



            if (res && res.statusText && res.statusText === "OK") {


                getProfile().then((response) => {


                    if (response && response.data) {

                        localStorage.setItem("UserOficialName", response.data.name);
                        localStorage.setItem("UserRole", response.data.role);



                        //Actualizar la navBar
                        logIn()
                        history.push('/dashboard')

                    }


                })



            }
            else {

                errorSpan.hidden = false

                setTimeout(() => {
                    errorSpan.hidden = true
                }, 2000)

                setUsername('')
                setPassword('')
                LoadingGif.hidden = true

            }

        })






    }

    return (

        <form className="form-inline my-2 my-lg-0" method='post' onSubmit={SubmitHandler}>

            <span id='errorSpan' hidden className={'mx-2 text-danger ' + classes.error} >Usuario o contraseña incorrecta</span>

            <input className="form-control  mr-sm-2" type="text" id="login" name="login" placeholder="Usuario"
                aria-label="usuario" required autoComplete="usuario" autoFocus value={username} onChange={e => setUsername(e.target.value)} />


            <input id="password" type="password" className="form-control " name="password" placeholder="Contraseña"
                required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />




            <button id='BotonAcceso' className={classes.BotonAcceso + " btn bg-primary text-white ml-2 my-2 my-sm-0"} type="submit" >


                Entrar

                <img hidden id='loadingGif' className={classes.loadingGif + ' ml-2'} src={loading} alt="loading" />
            </button>



        </form>
    )

}
export default withRouter(FormLogin)



