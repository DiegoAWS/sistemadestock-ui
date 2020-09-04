import React, { useState } from "react";

import { Link } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles";
import logo from '../../assets/images/logo.png'
import FormLogin from './FormLogin'
import ControlLinks from './ControlLinks'


const useStyles = makeStyles({
    navbar: {
        height: '80px',
        backgroundColor: 'rgba(141, 141, 141, 0.26)',

    },

    togglerIcon: {
        height: '40px',
        fill: '#007bff'
    }

});

const NavBar = () => {
    const classes = useStyles();
    const [, updateState] = useState()
    const SeccionDerechaNavBar = (localStorage.UserOficialName) ? <ControlLinks logout={() => { updateState({}) }} /> : <FormLogin logIn={() => { updateState({}) }} />

    const ColorBgHandler = () => {

        var menu = document.getElementById('navbarSupportedContent')

        if (menu.className.includes('show'))
            menu.style.backgroundColor = ''
        else
            menu.style.backgroundColor = 'rgba(141, 141, 141, 0.26)'
    }


    return (
        <nav className={'navbar navbar-expand-md navbar-light ' + classes.navbar}>
            <Link to='/register'>
                <div className="navbar-brand" >
                    <img src={logo} height="60px" alt="" />
                </div>
            </Link>
            <h3> Sistema de Stock</h3>
            <button onClick={e => { ColorBgHandler() }} className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">

                <svg className={classes.togglerIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z" /></svg>
            </button>


            <div className={'collapse navbar-collapse '} id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">

                    </li>
                </ul>


                {SeccionDerechaNavBar}
            </div>


        </nav>
    )
}


export default NavBar;