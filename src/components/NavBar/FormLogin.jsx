import React, { useState } from 'react';

import { login } from '../../auth/axiosLoginFunctions'

import { makeStyles } from "@material-ui/core/styles";



const useStyles = makeStyles({
    error: {
        position: 'absolute',
        top: '70px',
        fontWeight: 'bold',
        backgroundColor: ' #80808099',
        borderRadius: '3px',
    }

});
/*
element.style {
    
} */

const FormLogin = props => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const SubmitHandler = e => {
        e.preventDefault()

        const user = {
            username,
            password
        }

        var BotonAcceso = document.getElementById('BotonAcceso')

        BotonAcceso.innerHTML = 'Cargando'


        var errorSpan = document.getElementById('errorSpan')


        login(user).then((response) => {

            if (response) {
                console.log(response);
            }
            else {
                console.log('ERROR AQUI');
                BotonAcceso.innerHTML = 'Entrar'



                console.log(errorSpan.hidden)


                errorSpan.hidden = false
                console.log(errorSpan.hidden)
                setTimeout(() => {
                    errorSpan.hidden = true
                }, 1000)
                setUsername('')
                setPassword('')
            }


        })
            .catch((err) => { });







    }

    return (

        <form className="form-inline my-2 my-lg-0" method='post' onSubmit={SubmitHandler}>

            <span id='errorSpan' className={'mx-2 text-danger'+classes.error} >Usuario o contraseña incorrecta</span>

            <input className="form-control  mr-sm-2" type="text" id="login" name="login" placeholder="Usuario"
                aria-label="usuario" required autoComplete="usuario" autoFocus value={username} onChange={e => setUsername(e.target.value)} />


            <input id="password" type="password" className="form-control " name="password" placeholder="Contraseña"
                required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />




            <button id='BotonAcceso' className="btn btn-outline-success bg-primary text-white ml-2 my-2 my-sm-0" type="submit" >Entrar</button>



        </form>
    )

}
export default FormLogin;



