import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom'

import { Route} from 'react-router-dom'
import { getProfile } from './loginFunctions'

const SecureRoute = ({ path, redirect = '/', component: Component, history }) => {



    if (!localStorage.usertoken)
        history.push('/')
        //Redireccion Inmediata si no existe Token

    useEffect(() => {




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



    })
    return (
        <Route path={path} render={(componentProps) => (<Component {...componentProps} />)} />
    )

}
export default withRouter(SecureRoute)