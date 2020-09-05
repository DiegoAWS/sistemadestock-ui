import React from 'react';
// import { getRequest, postRequest } from '../auth/ApiFunctions'
import ModalFormAddProducto from '../components/Dashboard/ModalFormAddProducto';


import Datatable from '../components/Dashboard/Datatable';


import faker from 'faker'
const Productos = props => {


    const createUser = () => ({
        id: faker.random.uuid(),
        name: faker.name.findName(),
        email: faker.internet.email(),
        address: faker.address.streetAddress(),
        bio: faker.lorem.sentence()
      });
      
      const createUsers = (numUsers = 5) =>
        new Array(numUsers).fill(undefined).map(createUser);
      
      const data = createUsers(2000);

    //#region


    const columns = [
        {
          name: 'Name',
          selector: 'name',
          sortable: true,
        },
        {
          name: 'Email',
          selector: 'email',
          sortable: true,
        },
        {
          name: 'Address',
          selector: 'address',
          sortable: true,
        },
      ];

    const camposProductos = [

        'Codigo',
        'CategoriaId',
        'Producto',
        'Descripcion',

        'Cantidad',

        'Proveedor',
        'FacturaCompra',

        'FechaCompra',

        'CostoUnitario',
        'PrecioVentaContadoMayorista',
        'PrecioVentaContadoMinorista',
        'PrecioVenta3Cuotas',
        'PrecioVenta6Cuotas',
        'PrecioVenta9Cuotas',
        'PrecioVenta12Cuotas',
        'PrecioVenta18Cuotas',
        'PrecioVenta24Cuotas',
    ]

    const camposProductosUsuario = [

        'Código',
        'Categoria',
        'Nombre del Producto',
        'Descripcion',

        'Cantidad',

        'Proveedor',
        'Factura de Compra',

        'Fecha de Compra',

        'Costo Unitario',
        'Precio de Venta Mayorista',
        'Precio de Venta al Contado',
        'Precio de Venta 3 Cuotas',
        'Precio de Venta 6 Cuotas',
        'Precio de Venta 9 Cuotas',
        'Precio de Venta 12 Cuotas',
        'Precio de Venta 18 Cuotas',
        'Precio de Venta 24 Cuotas',
    ]
    //#endregion 


    return (

        <div className='container-fluid'>
            <div className='row p-5'>
                <button type="button" className="btn btn-info" data-toggle="modal" data-target="#staticBackdrop">
                    Añadir Productos
            </button>
            </div>
            <ModalFormAddProducto
                titleForm='Agregar Producto'
                datos={camposProductos}
                camposUsuario={camposProductosUsuario}
            />
            <div className="card p-2 my-2">
                <Datatable data={data} columns={columns} />
            </div>




        </div>
    )

}
export default Productos;