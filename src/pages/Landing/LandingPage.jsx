import React from 'react'
import { withRouter } from 'react-router-dom'

import { makeStyles } from "@material-ui/core/styles"

import background from "../../assets/images/background.jpg";



const useStyles = makeStyles({



    mainBackground: {


        zIndex: '-1',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',

        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    }
})



const LandingPage = ({ history }) => {
    const classes = useStyles()




    if (localStorage.getItem('UserRole') && localStorage.getItem('UserRole') === 'admin')
        history.push('/dashboard')

    if (localStorage.getItem('UserRole') && localStorage.getItem('UserRole') === 'vendedor')
        history.push('/ventas')


    return (

        <div className={classes.mainBackground}>


        </div>


    )

}
export default withRouter(LandingPage)