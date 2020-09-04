import React, { useState } from 'react';
import { withRouter } from 'react-router-dom'

import { makeStyles } from "@material-ui/core/styles";


import { register } from '../../auth/loginFunctions'

import loading from '../../assets/images/loading.gif'



const useStyles = makeStyles({

    loadingGif: {
        width: '15px',
        display: 'inline'
    }

});

const Register = ({ history }) => {

    const classes = useStyles();


    const [role, setRole] = useState('empleado')
    const [name, setName] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPassword_confirmation] = useState('');



    const SubmitHandler = (e) => {

        e.preventDefault()

        var LoadingGif = document.getElementById('loadinggGif')

        LoadingGif.hidden = false

        if (password !== password_confirmation || (password.length < 8)) {


            var helper = document.getElementById('passwordHelpBlock')
            var newPassword = document.getElementById('new-password')
            var passwordConfirm = document.getElementById('password-confirm')
            if (password.length < 8)
                helper.innerText = 'Son necesarias 8 o más letras'
            else
                helper.innerText = 'Contraseñas no coinciden'
            newPassword.style.border = '3px solid red'
            passwordConfirm.style.border = '3px solid red'


            setTimeout(() => {

                passwordConfirm.style.border = ''

            }, 800)



            setTimeout(() => {
                helper.innerText = ''
                newPassword.style.border = ''
            }, 2000)

            LoadingGif.hidden = true
            return
        } //// FALTA VALIDAR LONGITUDES MAXIMAS E INYECCION SQL

        const user = {
            role,
            name,
            username,
            password,
            password_confirmation
        }
        register(user).then((res) => {
            console.log(res)
            if (res&&res.statusText && res.statusText === "Created") {

                history.push('/dashboard')




            }
            setRole('empleado')
            setUsername('')
            setPassword('')
            setPassword_confirmation('')
            setName('')
            LoadingGif.hidden = true
        })

    }


    return (


        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Register</div>

                        <div className="card-body">
                            <form method="POST" onSubmit={(e) => { SubmitHandler(e) }}>


                                <div className="form-group row">
                                    <label htmlFor="role" className="col-md-4 col-form-label text-md-right">Responsabilidad</label>

                                    <select id="role" name="role" className="col-md-6" value={role} onChange={e => { setRole(e.target.value) }} >

                                        <option value="admin">Administrador</option>
                                        <option value="jefe">Jefe Local</option>
                                        <option value="empleado">Empleado</option>
                                    </select>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="name" className="col-md-4 col-form-label text-md-right">Nombre Completo</label>

                                    <div className="col-md-6">

                                        <input id="name" type="text" className="form-control" name="name"
                                            required autoComplete="name" autoFocus value={name} onChange={e => { setName(e.target.value) }} />

                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="username"
                                        className="col-md-4 col-form-label text-md-right">Nombre de Usuario</label>

                                    <div className="col-md-6">

                                        <input id="username" type="text" className="form-control" name="username"
                                            required autoComplete="username" value={username} onChange={e => { setUsername(e.target.value) }} />

                                    </div>
                                </div>



                                <div className="form-group row">
                                    <label htmlFor="new-password"
                                        className="col-md-4 col-form-label text-md-right">Contraseña</label>

                                    <div className="col-md-6">
                                        <input id="new-password" type="password"
                                            className="form-control" name="password"
                                            required autoComplete="new-password" value={password} onChange={e => { setPassword(e.target.value) }} />

                                        <small id="passwordHelpBlock" className="form-text text-danger">
                                        </small>
                                    </div>

                                </div>

                                <div className="form-group row">
                                    <label htmlFor="password-confirm"
                                        className="col-md-4 col-form-label text-md-right">Confirmar Contraseña</label>

                                    <div className="col-md-6">
                                        <input id="password-confirm" type="password" className="form-control"
                                            name="password_confirmation" required autoComplete="new-password" value={password_confirmation} onChange={e => { setPassword_confirmation(e.target.value) }} />
                                    </div>

                                </div>

                                <div className="form-group row mb-0">
                                    <div className="col-md-6 offset-md-4">
                                        <button type="submit" className="btn btn-primary">
                                            Registrar
                                            <img hidden id='loadinggGif' className={classes.loadingGif+' ml-2'} src={loading} alt="loading" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default withRouter(Register);