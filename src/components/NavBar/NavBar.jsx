import React, { useState } from "react";

import { TextField, Button } from '@material-ui/core'

import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';


import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'


import { withRouter } from 'react-router-dom'
import { login, getProfile, logout } from '../../API/apiFunctions'

import loading from '../../assets/images/loading.gif'


const NavBar = ({ history, access, accesManager }) => {
    const init = {
        username: '',
        password: '',
        showLoading: false,
        inputError: false,
        accediendo: false
    }
    const [state, setState] = useState(init)

    const loginHandler = e => {
    setState({ ...state, accediendo: true })
        if (state.username.length === 0 || state.password.length < 8) {

            setState({ ...state, inputError: true })

            setTimeout(() => {
                setState(init)
            }, 2000)
            return
        }



        const user = {
            username: state.username,
            password: state.password
        }
        login(user).then((res) => {
			setState(init)
			
            if (res && res.statusText && res.statusText === "OK") {

                
                getProfile().then((response) => {
                    if (response && response.data) {
                        localStorage.setItem("UserOficialName", response.data.name);
                        localStorage.setItem("UserRole", response.data.role);
                        accesManager(true)
                        history.push('/dashboard')

                    }
                })
            }
           

        })

    }



    const logoutHandler = e => {

 setState(init)
  accesManager(false)
 
        localStorage.removeItem('UserOficialName')
        localStorage.removeItem('UserRole')

       

        logout().then(() => {
            localStorage.removeItem('usertoken')

           

            history.push('/')

        })
    }



    const formAcces = () => {

        if (!access) {
            return (
                <>
                    <AssignmentIndIcon />

                    <TextField label="Usuario" variant="outlined" size='small'
                        autoComplete="user" error={state.inputError} type='text'
                        value={state.username} onChange={e => setState({ ...state, username: e.target.value })} style={{ marginRight: '10px' }} />


                    <VpnKeyIcon />
                    <TextField label="Password" variant="outlined" size='small' type='password' error={state.inputError}
                        value={state.password} onChange={e => setState({ ...state, password: e.target.value })} />

                    <Button hidden={state.accediendo} variant="contained" color="primary" onClick={loginHandler} style={{ marginLeft: '20px' }}>  Acceso</Button>


                    <img hidden={!state.accediendo} style={{ width: '10px' }} src={loading} alt="loading" />
                </>
            )
        }
        else {
            return (


                <Button color="primary" title='Cerrar Sesión' onClick={logoutHandler}>
                    <CancelPresentationIcon />
                </Button>)
        }


    }




    return (
        <>
            <Link to='/register'>

                <img src={logo} height="65px" alt="" />

            </Link>
            <h3 style={{ flex: 1, marginLeft: '10px' }}> Sistema de Stock</h3>



            {formAcces()}

        </>
    )
}

export default withRouter(NavBar)