import React from 'react'
import { withRouter } from 'react-router-dom'

import { Route } from 'react-router-dom'
import { getProfile } from '../API/apiFunctions'

const SecureRoute = ({ path, component: Component, history }) => {


    if (!localStorage.usertoken) {

        localStorage.removeItem('usertoken')
        localStorage.removeItem('UserOficialName')
        localStorage.removeItem('UserRole')
        history.push('/')
    }
    //Redireccion Inmediata si no existe Token



    getProfile(path).then((response) => {

        if (response && response.data) {

            localStorage.setItem("UserOficialName", response.data.name)
            localStorage.setItem("UserRole", response.data.role)

            if (response.data.role === 'vendedor' && path !== '/ventas')
                history.push('/ventas')

        }
        else {


            localStorage.removeItem('usertoken')
            localStorage.removeItem('UserOficialName')
            localStorage.removeItem('UserRole')
            history.push('/')

        }

    })



    return (
        <Route exact path={path} component={Component} />
    )

}
export default withRouter(SecureRoute)