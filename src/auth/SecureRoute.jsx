import React from 'react';
import { withRouter } from 'react-router-dom'

import { Route } from 'react-router-dom'
import { getProfile } from './loginFunctions'

const SecureRoute = ({ path, component: Component, history }) => {



    if (!(localStorage.usertoken && localStorage.UserOficialName && localStorage.UserRole)) {
        localStorage.removeItem('usertoken')
        localStorage.removeItem('UserOficialName')
        localStorage.removeItem('UserRole')
        history.push('/')
    }
    //Redireccion Inmediata si no existe Token



    getProfile().then((response) => {

        if (response && response.data) {

            localStorage.setItem("UserOficialName", response.data.name);
            localStorage.setItem("UserRole", response.data.role);
        }
        else {


            localStorage.removeItem('usertoken')
            localStorage.removeItem('UserOficialName')
            localStorage.removeItem('UserRole')

            history.push('/')
        }

    })




    return (
        <Route path={path} component={Component} />
    )

}
export default withRouter(SecureRoute)