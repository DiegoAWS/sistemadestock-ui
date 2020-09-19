import React from 'react'
import { withRouter } from 'react-router-dom'

import { makeStyles } from "@material-ui/core/styles"

import back from "../assets/images/back.jpg"

import trabajando from "../assets/images/trabajando.png"

const useStyles = makeStyles( {



    mainBackground: {


        zIndex: '-1',
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        textAlign: 'center',
        backgroundImage: `url(${ back })`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    trabajando: {
        marginTop: '10vh'
    },
    text: {
        padding: '5px',
        backgroundColor: 'gold',
        fontSize: '2rem',
        borderRadius: '15px'
    }
} )



const Back = ( { history } ) =>
{
    const classes = useStyles()






    return (

        <div className={ classes.mainBackground }>
            <img className={ classes.trabajando } src={ trabajando } alt='' width='100px' />
            <span className={ classes.text }>En Progreso 90% .....</span>
        </div>


    )

}
export default withRouter( Back )