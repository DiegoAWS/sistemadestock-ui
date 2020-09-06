import React, { useState } from 'react';
// import { getRequest, postRequest } from '../auth/ApiFunctions'
import FormAddProducto from '../components/Dashboard/FormAddProducto'


import Datatable from '../components/Dashboard/Datatable';


import faker from 'faker'

import Popup from '../components/Popup';



const createFakeProducto = () => {
  const precioBase = faker.commerce.price()
  const camposProductos = [


    ['Codigo', 'Código', 'varchar', faker.finance.account()],
    ['CategoriaId', 'Categoría', 'varchar', faker.commerce.department()],
    ['Producto', 'Producto', 'varchar', faker.commerce.productName()],
    ['Descripcion', 'Descripción', 'varchar', faker.commerce.productAdjective()],

    ['Cantidad', 'Cantidad', 'int', faker.random.number(2000)],

    ['Proveedor', 'Proveedor', 'varchar', faker.company.companyName()],
    ['FacturaCompra', 'Factura', 'varchar', faker.finance.bitcoinAddress()],

    ['FechaCompra', 'Fecha de Compra', 'datetime', faker.date.recent(1000).toISOString().slice(0, 19).replace('T', ' ')],

    ['CostoUnitario', 'Costo Unitario', 'double', (precioBase * 0.6).toFixed(2)],

    ['PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'Código', (precioBase * 0.8).toFixed(2)],

    ['PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double', precioBase],

    ['PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double', (precioBase * 1.2).toFixed(2)],
    ['PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double', (precioBase * 1.4).toFixed(2)],
    ['PrecioVenta9Cuotas', 'Precio Venta 9 Cuota', 'double', (precioBase * 1.6).toFixed(2)],
    ['PrecioVenta12Cuotas', 'Precio Venta 12 Cuota', 'double', (precioBase * 1.8).toFixed(2)],
    ['PrecioVenta18Cuotas', 'Precio Venta 18 Cuota', 'double', (precioBase * 2).toFixed(2)],
    ['PrecioVenta24Cuotas', 'Precio Venta 24 Cuota', 'double', (precioBase * 2.2).toFixed(2)]
  ]

  return camposProductos
}

const Productos = props => {





  console.log(faker.date.recent(1000).toISOString().slice(0, 19).replace('T', ' '))

  // new Date().toISOString().slice(0, 19).replace('T', ' ');

  const [openPopup, setOpenPopup] = useState(false)

  // const SendData = data => {
  //   console.log(data)

  // }

  const dataTable = []

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



  //#endregion 


  return (

    <div className='container-fluid'>
      <div className='row p-5'>
        <button type="button" className="btn btn-info" onClick={() => setOpenPopup(true)}>
          Añadir Productos
            </button>
      </div>




      <div className="card p-2 my-2">
        <Datatable data={dataTable} columns={columns} />
      </div>

      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title='Añadir Producto'

      >
        <FormAddProducto
          datos={createFakeProducto()} />
      </Popup>


    </div>
  )

}
export default Productos;