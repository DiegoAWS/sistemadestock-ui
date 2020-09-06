import React, { useState, useEffect } from 'react';
import { getRequest, postRequest } from '../auth/ApiFunctions'
import FormAddProducto from '../components/Dashboard/FormAddProducto'
import logo from '../assets/images/logo.png'
import loadinGif from '../assets/images/loading.gif'
import Datatable from '../components/Dashboard/Datatable';


import faker from 'faker/locale/es'

import Popup from '../components/Dashboard/Popup';
import { Button } from '@material-ui/core';


const createFakeProducto = () => {
  const precioBase = faker.commerce.price()
  const camposProductos = [


    ['Codigo', 'Código', 'varchar', faker.finance.account()],
    ['CategoriaId', 'Categoría', 'varchar', faker.commerce.department()],
    ['Producto', 'Producto', 'varchar', faker.commerce.productName()],
    ['Descripcion', 'Descripción', 'varchar', faker.commerce.productAdjective()],

    ['Cantidad', 'Cantidad', 'int', faker.random.number(2000)],

    ['Proveedor', 'Proveedor', 'varchar', faker.company.companyName()],
    ['FacturaCompra', 'Factura', 'varchar', faker.finance.bitcoinAddress().slice(0, 16)],

    ['FechaCompra', 'Fecha de Compra', 'datetime', faker.date.recent(1000).toISOString().slice(0, 19).replace('T', ' ')],

    ['CostoUnitario', 'Costo Unitario', 'double', (precioBase * 0.6).toFixed(2)],

    ['PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'Código', (precioBase * 0.8).toFixed(2)],

    ['PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double', precioBase],

    ['PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double', (precioBase * 1.2).toFixed(2)],
    ['PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double', (precioBase * 1.4).toFixed(2)],
    ['PrecioVenta9Cuotas', 'Precio Venta 9 Cuotas', 'double', (precioBase * 1.6).toFixed(2)],
    ['PrecioVenta12Cuotas', 'Precio Venta 12 Cuotas', 'double', (precioBase * 1.8).toFixed(2)],
    ['PrecioVenta18Cuotas', 'Precio Venta 18 Cuotas', 'double', (precioBase * 2).toFixed(2)],
    ['PrecioVenta24Cuotas', 'Precio Venta 24 Cuotas', 'double', (precioBase * 2.2).toFixed(2)]
  ]

  return camposProductos
}

const Productos = props => {


  const [loading, setLoading] = useState(true)
  const [openPopup, setOpenPopup] = useState(false)
  const [cargaD, setCargaD] = useState(1)

  const [data, setData] = useState([])

  var init = {}

  createFakeProducto().forEach(ite => { init = { ...init, [ite[0]]: ite[3] } })

  const [formData, SetFormData] = useState(init)


  useEffect(() => { cargaDatos() }, [cargaD])

const onRowClicked=e=>{
   console.log(e)
  
}


  const saveData = () => {
    setLoading(true)
    postRequest('/productos', formData)
      .then(response => {

        setCargaD(cargaD * -1)
      })

    setOpenPopup(false);
  }
  const cargaDatos = () => {
    setLoading(true)
    getRequest('/productos')
      .then(request => {
        setLoading(false)
        if (request && request.data && request.data[0] && request.data[0].Codigo)

          setData(request.data)

      })
  }


  const columns = createFakeProducto().map(item => ({
    name: item[1],
    selector: item[0],
    sortable: true

  }))

  return (
    <>
      <Button className=" m-2" variant="contained" color="primary"
        onClick={() => cargaDatos()} >

        {loading ?
          <img height='20px' width='20px' src={loadinGif} alt="loading" />
          : <span>Actualizar</span>}

      </Button>

      <Button className=" m-2" variant="contained" color="primary"
        onClick={() => setOpenPopup(true)} > Añadir Productos</Button>



      <div className="card p-2 my-2">
        <Datatable data={data} columns={columns} onRowClicked={onRowClicked} />
      </div>

      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title='Añadir Producto'
        logo={logo}
        saveData={saveData}>
        <FormAddProducto
          datos={createFakeProducto()}
          formData={formData}
          SetFormData={SetFormData}
        />
      </Popup>


    </>
  )

}
export default Productos;