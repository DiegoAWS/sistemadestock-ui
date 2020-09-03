import React from 'react';

const ControlLinks = props => {

    const logoutHandler = e => {
        console.log('Cerrar Sesion')

    }

    return (


        <ul className="navbar-nav ml-auto">
            <li className="mr-4">
                <h4>
                    Dashboard
                    </h4>
            </li>
            <li className="nav-item dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Administración
                    </button>


                <div id="navbarDropdown" className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">

                    <button className="dropdown-item" >
                        Dashboard
                        </button>

                    <button className="dropdown-item disabled" >
                        Almacen
                        </button>
                    <button className="dropdown-item" >
                        Registrar Usuario
                        </button>

                    <button className="dropdown-item" onClick={logoutHandler}>
                        Cerrar Sessión
                        </button>

                    <form id="logout-form" action="{{ route('logout') }}" method="POST" className="d-none">

                    </form>
                </div>
            </li>
        </ul>


    )

}
export default ControlLinks;