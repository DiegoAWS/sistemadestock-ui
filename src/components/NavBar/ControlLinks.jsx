import React from 'react';
import { withRouter, Link } from 'react-router-dom'

import { logout } from '../../auth/loginFunctions'

const ControlLinks = ({ history, loggout }) => {

    const logoutHandler = e => {

        document.getElementById('dropdownMenuButton').innerText = 'Saliendo...'



        localStorage.removeItem('UserOficialName')
        localStorage.removeItem('UserRole')








        logout().then(() => {
            localStorage.removeItem('usertoken')

            //Update NavBar
            loggout()

            history.push('/')

        })




    }

    return (


        <ul className="navbar-nav ml-auto">


            <li className="nav-item dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Usuario
                    </button>


                <div id="navbarDropdown" className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">

                    <Link to='/dashboard'>   <button className="dropdown-item" type="button">DashBoard</button></Link>
                    <Link to='/productos'>   <button className="dropdown-item" type="button">Productos</button></Link>
                    <Link to='/table'>  <button className=" dropdown-item" >  Kitchen  </button>   </Link>
                    <Link to='/table1'>  <button className=" dropdown-item" >  Finder Module </button>   </Link>
                    <Link to='/register'>  <button className=" dropdown-item " >  Usuario Nuevo </button>   </Link>
                    <button className="dropdown-item" onClick={logoutHandler}>
                        Cerrar Sessión
                        </button>


                </div>
            </li>
        </ul>


    )

}
export default withRouter(ControlLinks)