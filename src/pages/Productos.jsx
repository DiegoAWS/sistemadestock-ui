import React, { useEffect } from 'react';


import ModalFormAddProducto from '../components/Dashboard/ModalFormAddProducto';

import $ from 'jquery'
import Datatable from '../components/Datatable/Datatable';


const Productos = props => {

    useEffect(() => {

    }, [])

    const clicka = e => {
        console.log('Clicka')

        $('#staticBackdrop').modal({
            show: true
        })


    }






    return (

        <div className='container-fluid'>

            <button type="button" className="btn btn-info" onClick={clicka}>
                Añadir Productos
            </button>

            <ModalFormAddProducto />
            <div class="card p-2 my-2">
                <Datatable />
            </div>




        </div>
    )

}
export default Productos;