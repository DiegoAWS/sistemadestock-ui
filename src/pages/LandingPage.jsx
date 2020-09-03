import React from 'react'

import { makeStyles } from "@material-ui/core/styles"

import background from "../assets/images/background.jpg";



const useStyles = makeStyles({
    navbar: {
        height: '80px',
        backgroundColor: 'rgba(141, 141, 141, 0.26)',
        backgroundPosition: 'center'
    },


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



const LandingPage = props => {
    const classes = useStyles()


    return (

            <main className="app">
                <div className="wrapper">

                    <div className={classes.mainBackground}>

                    </div>
                </div>
            </main>
     
    )

}
export default LandingPage