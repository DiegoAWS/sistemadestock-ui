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
            <li className="mr-4">
                <h4>
                    DashBoard
                    </h4>
            </li>
            <li className="nav-item dropdown mx-3">
                <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Sistema</button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                    <Link to='/dashboard'>   <button className="dropdown-item" type="button">DashBoard</button></Link>
                    <Link to='/productos'>   <button className="dropdown-item" type="button">Productos</button></Link>
                    <Link to='/'>   <button className="dropdown-item" type="button">Another action</button></Link>
                    <Link to='/'>    <button className="dropdown-item" type="button">Something else here</button></Link>
                </div>
            </li>



            <li className="nav-item dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Administración
                    </button>


                <div id="navbarDropdown" className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">

                    <button className="dropdown-item disabled" >
                        Panel de Control
                        </button>


                    <button className="dropdown-item" >
                        Registrar Usuario
                        </button>

                    <Link to='/register'>

                        <button className=" dropdown-item disabled" >
                            Control de Usuarios
                        </button>
                    </Link>
                    <button className="dropdown-item" onClick={logoutHandler}>
                        Cerrar Sessión
                        </button>


                </div>
            </li>
        </ul>


    )

}
export default withRouter(ControlLinks)