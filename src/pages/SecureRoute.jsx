import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom'

import { Route, Redirect } from 'react-router-dom'
import { getProfile } from '../auth/axiosLoginFunctions'

const SecureRoute = ({ path, redirect = '/', component: Component, history }) => {


    var Auth = false

    if (localStorage.usertoken)
        Auth = true

    useEffect(() => {




        getProfile().then((response) => {


            if (response && response.user) {

                localStorage.setItem("UserOficialName", response.user.name);
                localStorage.setItem("UserRole", response.user.role);
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
        <Route path={path}

            render={(componentProps) => {

                if (Auth) {
                    return (<Component {...componentProps} />)
                }

                else {
                    return (<Redirect from={path} to={redirect} />)
                }
            }}
        />
    )

}
export default withRouter(SecureRoute)