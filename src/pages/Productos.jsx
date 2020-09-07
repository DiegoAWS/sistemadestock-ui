import React, { useState, useEffect } from 'react';
import { getRequest, postRequest, deleteRequest } from '../auth/ApiFunctions'
import FormAddProducto from '../components/Dashboard/FormAddProducto'
import logo from '../assets/images/logo.png'
import loadinGif from '../assets/images/loading.gif'
import Datatable from '../components/Dashboard/Datatable';


import faker from 'faker/locale/es'

import Popup from '../components/Dashboard/Popup';
import { Button } from '@material-ui/core';


const createFakeProducto = () => {
  const precioBase = faker.commerce.price(1000, 1000000)
  const camposProductos = {
    Codigo: faker.finance.account(),
    CategoriaId: faker.commerce.department(),
    Producto: faker.commerce.product(),
    Descripcion: faker.commerce.productAdjective(),
    Cantidad: faker.random.number(2000),
    Proveedor: faker.company.companyName(),
    FacturaCompra: faker.finance.bitcoinAddress().slice(0, 16),
    FechaCompra: faker.date.recent(1000).toISOString().slice(0, 10),
    CostoUnitario: (precioBase * 0.6).toFixed(0) * 100,
    PrecioVentaContadoMayorista: (precioBase * 0.8).toFixed(0) * 100,
    PrecioVentaContadoMinorista: (precioBase * 1.0).toFixed(0) * 100,
    PrecioVenta3Cuotas: (precioBase * 1.2).toFixed(0) * 100,
    PrecioVenta6Cuotas: (precioBase * 1.4).toFixed(0) * 100,
    PrecioVenta9Cuotas: (precioBase * 1.6).toFixed(0) * 100,
    PrecioVenta12Cuotas: (precioBase * 1.8).toFixed(0) * 100,
    PrecioVenta18Cuotas: (precioBase * 2).toFixed(0) * 100,
    PrecioVenta24Cuotas: (precioBase * 2.2).toFixed(0) * 100
  }

  return camposProductos
}

const Productos = props => {

  //#region  CONST's ----------------------------------

  const [loading, setLoading] = useState(true)
  const [openPopup, setOpenPopup] = useState(false)
  const [cargaD, setCargaD] = useState(1)

  const [data, setData] = useState([]) //Data de la tabla

  //#region  campos Producto ----------------------------------

  const camposProductos = [


    ['Codigo', 'Código', 'varchar'],
    ['CategoriaId', 'Categoría', 'varchar'],
    ['Producto', 'Producto', 'varchar'],
    ['Descripcion', 'Descripción', 'varchar'],

    ['Cantidad', 'Cantidad', 'integer'],

    ['Proveedor', 'Proveedor', 'varchar'],
    ['FacturaCompra', 'Factura', 'varchar'],

    ['FechaCompra', 'Fecha de Compra', 'datetime'],

    ['CostoUnitario', 'Costo Unitario', 'double'],

    ['PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'double'],

    ['PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double'],

    ['PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double'],
    ['PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double'],
    ['PrecioVenta9Cuotas', 'Precio Venta 9 Cuotas', 'double'],
    ['PrecioVenta12Cuotas', 'Precio Venta 12 Cuotas', 'double'],
    ['PrecioVenta18Cuotas', 'Precio Venta 18 Cuotas', 'double'],
    ['PrecioVenta24Cuotas', 'Precio Venta 24 Cuotas', 'double']
  ]
  //#endregion campos Producto


  //#region  Inicializing the Form ----------------------------------




  var init = {}

  camposProductos.forEach(item => {
    if (item[2] === 'integer')
      init = { ...init, [item[0]]: '' }

    if (item[2] === 'double')
      init = { ...init, [item[0]]: '' }



    if (item[2] === 'datetime')
      init = { ...init, [item[0]]: (new Date()).toISOString().slice(0, 10) }

  })
  //#endregion Inicializing the Form
  const [formData, SetFormData] = useState(init)


  useEffect(() => {
    cargaData(); console.log('useEffect');
  }, [cargaD])

  //#endregion CONST's

  console.log('render')



  //#region  CRUD API ----------------------------------

  const saveData = () => {
    setOpenPopup(false);

  
    setData(data.concat(formData))


    setLoading(true)
    postRequest('/productos', formData)
      .then(() => {

        setCargaD(cargaD * -1)
      })


  }
  const cargaData = () => {
    setLoading(true)
    getRequest('/productos')
      .then(request => {
        setLoading(false)
        if (request && request.data && request.data[0] && request.data[0].Codigo)

          setData(request.data)

      })
  }

  const editData = (item) => {
    console.log(item)

    setOpenPopup(true)

  }

  const deleteData = (itemDelete) => {

    setData(data.filter(it => it.id === itemDelete))
    setLoading(true)

    deleteRequest('/productos/' + itemDelete.id, formData)
      .then(response => {

        setCargaD(cargaD * -1)
      })
  }



  //#endregion CRUD API




  //#region  Return ----------------------------------




  return (
    <>
      <Button className=" m-2" variant="contained" color="primary"
        onClick={() => cargaData()} >

        {loading ?
          <img height='20px' width='20px' src={loadinGif} alt="loading" />
          : <span>Actualizar</span>}

      </Button>

      <Button className=" m-2" variant="contained" color="primary"
        onClick={() => setOpenPopup(true)} > Añadir Productos</Button>

      <Button className=" m-2" variant="contained" color="primary"
        onClick={() => { SetFormData(createFakeProducto()); setOpenPopup(true); }} >Producto Falso</Button>

      <div className="card p-2 my-2">
        <Datatable data={data} camposProductos={camposProductos} handleDelete={deleteData} handleEdit={editData} />
      </div>

      <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        title='Añadir Producto'
        logo={logo}
        saveData={saveData}>
        <FormAddProducto
          camposProductos={camposProductos}
          formData={formData}
          SetFormData={SetFormData}
        />
      </Popup>


    </>
  )

  //#endregion Return
}
export default Productos;