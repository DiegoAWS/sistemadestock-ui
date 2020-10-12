import React, { useState } from "react"

import { TextField, Button, Hidden, Avatar } from '@material-ui/core'

import AssignmentIndIcon from '@material-ui/icons/AssignmentInd'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation'



import logo from '../../assets/images/logo.png'

import { login, getProfile, logout } from '../../API/apiFunctions'

import loading from '../../assets/images/loading.gif'


const NavBar = ({ history, access, accesManager, title }) => {
    const init = {
        username: '',
        password: '',
        showLoading: false,
        inputError: false,
        accediendo: false
    }
    const [state, setState] = useState(init)

    const loginHandler = e => {




        if (state.accediendo)
            return


        setState({ ...state, accediendo: true })
        if (state.username.length === 0 || state.password.length < 8) {

            errorHandler()
            return
        }



        const user = {
            username: state.username,
            password: state.password
        }
        login(user).then((res) => {


            if (res && res.statusText && res.statusText === "OK") {


                getProfile().then((response) => {
                    if (response && response.data) {
                        localStorage.setItem("UserOficialName", response.data.name)
                        localStorage.setItem("UserRole", response.data.role)


                        if (response.data.role === 'admin')
                            history.push('/dashboard')
                        else if (response.data.role === 'vendedor')
                            history.push('/ventas')


                        accesManager(true)
                    }
                })
            } else { errorHandler() }


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


    const errorHandler = () => {
        setState({ ...state, inputError: true })

        setTimeout(() => {
            setState(init)
        }, 2000)
    }
    const keyHandler = e => {
        if (e.keyCode === 13) {
            e.preventDefault()
            loginHandler(e)
        }

    }

    const formAcces = () => {

        if (!access) {
            return (
                <>
                    <Hidden xsDown >
                        <AssignmentIndIcon color='primary' /></Hidden>

                    <TextField label="Usuario" variant="outlined" size='small'
                        autoComplete="user" error={state.inputError} type='text' onKeyDown={keyHandler}
                        value={state.username} onChange={e => setState({ ...state, username: e.target.value })} style={{ marginRight: '10px' }} />

                    <Hidden xsDown >
                        <VpnKeyIcon color='primary' /></Hidden>
                    <TextField label="Contraseña" variant="outlined" size='small' type='password' error={state.inputError}
                        onKeyDown={keyHandler} value={state.password} onChange={e => setState({ ...state, password: e.target.value })} />

                    <Button variant="contained" color="primary" onClick={loginHandler} style={{ marginLeft: '20px' }}>
                        {
                            (state.accediendo) ? <img style={{ width: '20px' }} src={loading} alt="loading" />
                                : <ExitToAppIcon />
                        }
                    </Button>
                </>
            )
        }
        else {
            return (

                <>

                    <Avatar style={{ backgroundColor: '#2d2c2c' }}>
                        <Button color="secondary" title='Cerrar Sesión' onClick={logoutHandler}>
                            <CancelPresentationIcon />
                        </Button>
                    </Avatar>
                </>
            )
        }


    }




    return (
        <>

            {access ?
                <img src={logo} height="64px" alt="" style={{ zIndex: 2 }} />
                : <Hidden smDown > <img src={logo} height="64px" alt="" style={{ zIndex: 2 }} />  </Hidden>
            }




            <Hidden mdUp >

                {access && <h1 style={{
                    marginLeft: '10px', color: access ? 'white' : 'black', position: 'absolute',
                    left: '50%', transform: 'translateX(-50%)', zIndex: 1
                }}> {title}</h1>}

            </Hidden>

            <Hidden smDown >
                {access && <h3 style={{ marginLeft: '50px', color: 'white' }}>{title}</h3>}

                <h1 style={{
                    marginLeft: '10px', color: access ? 'white' : 'black', position: 'absolute',
                    left: access ? '50%' : '25%', transform: 'translateX(-50%)'
                }}> Sistema de Stock</h1>

            </Hidden>
            <div style={{ height: '100%', backgroundColor: 'transparent', flexGrow: 1 }}></div>
            {formAcces()}

        </>
    )
}

export default NavBar