import React from 'react';
import DashBoardHeader from '../components/DashBoard/DashBoardHeader';



const DashBoard = props => {
    var user = localStorage.UserOficialName

  

    return (


        <div id="ContenidoPrincipal" className="content-wrapper">

            <h1>{user}</h1>
            <hr /> 
            <DashBoardHeader />
        </div>
    )

}
export default DashBoard;