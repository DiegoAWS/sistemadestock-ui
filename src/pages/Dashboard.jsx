import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = props => {



    return (

        <div className='container-fluid  '>
            <div className="row">

                <div className="col-10 mx-auto">

                    <Link to='/productos'>
                        <button className="btn btn-primary" >Productos</button>
                    </Link>
                </div>

            </div>

            <div className="row">
               
            </div>

        </div>
    )

}


export default Dashboard;