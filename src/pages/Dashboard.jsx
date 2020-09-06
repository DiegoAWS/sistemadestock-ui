import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

const Dashboard = props => {



    return (

        <div className='container-fluid  '>
            <div className="row">

                <div className="col-10 mx-auto">

                    <Link to='/productos'>
                        <Button className=" m-2" variant="contained" color="primary"
                        >Productos</Button>
                    </Link>
                </div>

            </div>

            <div className="row">

            </div>

        </div>
    )

}


export default Dashboard;