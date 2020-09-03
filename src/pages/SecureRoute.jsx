import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom'


const SecureRoute = ({ path, redirect = '/', component: Component }) => {

    console.log('directo')

    var Auth = true
    useEffect(() => {
        console.log('Use Effect')
    }, [])
    return (
        <Route path={path}

            render={(componentProps) => {

                if (Auth) {
                    console.log(Auth)

                    console.log('Aqui')

                    return (<Component {...componentProps} />)
                }

                else {
                    console.log('Redirect')

                    return (<Redirect from={path} to={redirect} />)
                }
            }}
        />
    )

}
export default SecureRoute;