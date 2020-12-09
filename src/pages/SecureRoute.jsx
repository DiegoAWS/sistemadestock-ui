import React from 'react'
import { withRouter } from 'react-router-dom'

import { Route } from 'react-router-dom'
import { getProfile } from '../API/apiFunctions'

const SecureRoute = ({ path, component: Component, history }) => {


    if (!localStorage.usertoken || !localStorage.UserOficialName || !localStorage.UserRole) {
        localStorage.removeItem('usertoken')
        localStorage.removeItem('UserOficialName')
        localStorage.removeItem('UserRole')
        history.push('/')
    }
    //Redireccion Inmediata si no existe algun Token


    getProfile(path).then((response) => {
        console.log('RESPONSE', response.data)
        if (response && response.data) {

            localStorage.setItem("UserOficialName", response.data.name)
            localStorage.setItem("UserRole", response.data.role)

            if (response.data.role === 'vendedor' && path !== '/ventas')
                history.push('/ventas')


            if (response.data.role === 'cobrador' && path !== '/creditos')
                history.push('/creditos')
        }
        else {

            localStorage.removeItem('usertoken')
            localStorage.removeItem('UserOficialName')
            localStorage.removeItem('UserRole')
            history.push('/')

        }

    })
    
    getProfile(path)

    return <Route exact path={path} render={(props) => (<Component  {...props} />)} />


}
export default withRouter(SecureRoute)