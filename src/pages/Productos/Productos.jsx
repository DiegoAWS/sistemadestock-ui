import React, { useState, useEffect, useRef } from 'react';
import { getRequest, postRequest, deleteRequest } from '../../API/apiFunctions'
import FormAddProducto from '../../components/Dashboard/FormAddProducto'
import logo from '../../assets/images/logo.png'

import Datatable from '../../components/Dashboard/Datatable';


import faker from 'faker/locale/es'

import Popup from '../../components/Dashboard/Popup';
import { Button } from '@material-ui/core';





//#region  Fake Producto ----------------------------------

const createFakeProducto = () => {
  const precioBase = faker.commerce.price(80000, 1000000)
  const campos = {
    Codigo: faker.finance.account(),
    CategoriaId: faker.commerce.department(),
    Producto: faker.commerce.product(),
    Descripcion: faker.commerce.productAdjective(),
    Cantidad: faker.random.number(2000),
    Proveedor: faker.company.companyName(),
    FacturaCompra: faker.finance.bitcoinAddress().slice(0, 16),
    FechaCompra: faker.date.recent(3000).toISOString().slice(0, 10),
    CostoUnitario: (precioBase * 0.6).toFixed(0) * 100,
    PrecioVentaContadoMayorista: (precioBase * 0.8).toFixed(0) * 100,
    PrecioVentaContadoMinorista: (precioBase * 1.0).toFixed(0) * 100,
    PrecioVenta3Cuotas: (precioBase * 1.2).toFixed(0) * 100,
    PrecioVenta6Cuotas: (precioBase * 1.4).toFixed(0) * 100,
    PrecioVenta12Cuotas: (precioBase * 1.8).toFixed(0) * 100,
    PrecioVenta18Cuotas: (precioBase * 2).toFixed(0) * 100,
    PrecioVenta24Cuotas: (precioBase * 2.2).toFixed(0) * 100
  }

  return campos
}
//#endregion Fake Producto



const Productos = props => {



  //#region  CONST's ----------------------------------


  const [openPopup, setOpenPopup] = useState(false)

  const [sinDatos, SetSinDatos] = useState(false)
  const [data, setData] = useState([]) //Data de la tabla

  //#region  campos Producto ----------------------------------

  const campos = [


    ['Codigo', 'Código', 'varchar'],
    ['CategoriaId', 'Categoría', 'varchar'],
    ['Producto', 'Producto', 'varchar'],
    ['Descripcion', 'Descripción', 'varchar'],

    ['Cantidad', 'Cantidad', 'integer'],

    ['Proveedor', 'Proveedor', 'varchar'],
    ['FacturaCompra', 'Factura', 'varchar'],

    ['FechaCompra', 'Fecha de Compra', 'date'],

    ['CostoUnitario', 'Costo Unitario', 'double'],

    ['PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'double'],

    ['PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double'],

    ['PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double'],
    ['PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double'],
    ['PrecioVenta12Cuotas', 'Precio Venta 12 Cuotas', 'double'],
    ['PrecioVenta18Cuotas', 'Precio Venta 18 Cuotas', 'double'],
    ['PrecioVenta24Cuotas', 'Precio Venta 24 Cuotas', 'double']
  ]
  //#endregion campos Producto


  //#region  Inicializing the Form ----------------------------------




  var formInit = {}

  campos.forEach(item => {
    if (item[2] === 'integer')
      formInit = { ...formInit, [item[0]]: '' }

    if (item[2] === 'double')
      formInit = { ...formInit, [item[0]]: '' }



    if (item[2] === 'date')
      formInit = { ...formInit, [item[0]]: (new Date()).toISOString().slice(0, 10) }

  })

  //#endregion Inicializing the Form
  const [formData, SetFormData] = useState(formInit)



  const editingValue = useRef({})

  //#endregion CONST's

  // eslint-disable-next-line
  useEffect(() => { cargaData() }, [])


  //#region  CRUD API ----------------------------------

  const saveData = () => {
    setOpenPopup(false);




    var uri = '/productos'

    if (formData.id && editingValue.current) {// Editing....
      uri = uri + '/' + formData.id


    }



    var DataOK = {}

    campos.forEach((item, i) => {

      DataOK[item[0]] = (!formData[item[0]] || formData[item[0]] === "") ? "**null**" : formData[item[0]]

    })



    //Ningun Dato
    if (data.length === 0)
      setData([formData])
    else//Ya hay datos
      setData(data.concat(formData))






    postRequest(uri, DataOK)
      .then(() => {

        cargaData()


      })


  }
  const cargaData = () => {

    clearform()

    getRequest('/productos')
      .then(request => {

        if (request && request.data && request.data[0] && request.data[0].Codigo) {

          var newData = request.data.map(dataRequested => {

            let instantData = {}

            campos.forEach(item => {
              instantData[item[0]] = (dataRequested[item[0]] === "**null**") ? "" : dataRequested[item[0]]
            })

            return { ...instantData, id: dataRequested.id }

          })

          setData(newData)
        }
        if (request && request.statusText === 'OK' && request.data && request.data.length === 0)
          SetSinDatos(true)

      })
  }

  const editData = (item) => {

    editingValue.current = item

    var temp = data.filter(it => it.id !== item.id)


    setData(temp)

    SetFormData(item)
    setOpenPopup(true)



  }

  const deleteData = (itemDelete) => {


    setData(data.filter(it => it.id !== itemDelete.id))

    clearform()

    deleteRequest('/productos/' + itemDelete.id, formData)
      .then(() => {
        cargaData()

      })
  }



  //#endregion CRUD API



  //#region  Others Functions ----------------------------------

  const clearform = () => {

    editingValue.current = {}
    SetFormData(formInit)

  }
  const recolocaEditItem = () => {
    setData(data.concat(editingValue.current))
  }
  //#endregion Others Functions




  //#region  Return ----------------------------------




  return (
    <>



      <Button style={{ margin: '10px' }} variant="contained" color="primary"
        onClick={() => { setData(data); clearform(); setOpenPopup(true); }} > Añadir Productos</Button>

      <Button style={{ margin: '10px' }} variant="contained" color="primary"
        onClick={() => { SetFormData(createFakeProducto()); setOpenPopup(true); }} >Producto Falso</Button>


      <Datatable data={data}

        sinDatos={sinDatos}
        campos={campos}
        responsive
        handleDelete={deleteData}
        handleEdit={editData} />

      <Popup
        openPopup={openPopup}
        clearform={clearform}
        setOpenPopup={setOpenPopup}
        title={(formData.id) ? 'Editar Producto' : 'Añadir Producto'}
        logo={logo}
        recolocaEditItem={recolocaEditItem}
        saveData={saveData}>
        <FormAddProducto
          campos={campos}
          formData={formData}
          SetFormData={SetFormData}
        />
      </Popup>


    </>
  )

  //#endregion Return

}
export default Productos;