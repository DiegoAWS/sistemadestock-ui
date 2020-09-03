import React, { useState } from 'react';

import { withRouter } from 'react-router-dom'
import { login, getProfile } from '../../auth/axiosLoginFunctions'

import { makeStyles } from "@material-ui/core/styles";

import loading from '../../assets/images/loading.gif'



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

        login(user).then((response) => {


            if (response) {

                console.log(response)


                getProfile().then((respons) => {



                    if (respons && respons.user) {


                        localStorage.setItem("UserOficialName", respons.user.name);
                        localStorage.setItem("UserRole", respons.user.role);


                        console.log(response)
                        logIn()
                        history.push('/dashboard')
                    }
                }).finally(() => {

                    LoadingGif.hidden = true

                })




            }
            else {

                errorSpan.hidden = false


                setTimeout(() => {
                    errorSpan.hidden = true
                }, 2000)
                setUsername('')
                setPassword('')
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

                <img hidden id='loadingGif' className={classes.loadingGif} src={loading} alt="loading" />
            </button>



        </form>
    )

}
export default withRouter(FormLogin)



