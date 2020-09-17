import React, { useState, useEffect, useRef } from 'react'
import { getRequest, postRequest, deleteRequest } from '../../API/apiFunctions'
import FormAddProducto from '../../components/Dashboard/FormAddProducto'
import logo from '../../assets/images/logo.png'

import Datatable from '../../components/Dashboard/Datatable'


import faker from 'faker/locale/es'

import Popup from '../../components/Dashboard/Popup'
import { Button, TextField, InputAdornment, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import AddIcon from '@material-ui/icons/Add'
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices'

//#region  Fake Producto ----------------------------------

const createFakeProducto = () =>
{
  const precioBase = faker.commerce.price( 80000, 1000000 )
  const campos = {
    Codigo: faker.finance.account(),
    Categoria: faker.commerce.department(),
    Categoria_id: 1,
    Producto: faker.commerce.product(),
    Marca: "SAMSUNG",
    Color: faker.commerce.color(),
    CostoUnitario: precioBase,
    PrecioVentaContadoMayorista: ( precioBase * 0.8 ).toFixed( 0 ) * 100,
    PrecioVentaContadoMinorista: ( precioBase * 1.0 ).toFixed( 0 ) * 100,
    PrecioVenta3Cuotas: ( precioBase * 1.2 ).toFixed( 0 ) * 100,
    PrecioVenta6Cuotas: ( precioBase * 1.4 ).toFixed( 0 ) * 100,
    PrecioVenta12Cuotas: ( precioBase * 1.8 ).toFixed( 0 ) * 100,
    PrecioVenta18Cuotas: ( precioBase * 2 ).toFixed( 0 ) * 100,
    PrecioVenta24Cuotas: ( precioBase * 2.2 ).toFixed( 0 ) * 100
  }

  return campos
}
//#endregion Fake Producto



const Productos = props =>
{


  //#region  campos Producto ----------------------------------

  const campos = [

    [ 'Categoria', 'Categoría', 'categSelector' ],

    [ 'Codigo', 'Código', 'varchar' ],

    [ 'Producto', 'Producto', 'varchar' ],
    [ 'Marca', 'Marca', 'varchar' ],

    [ 'Color', 'Color', 'varchar' ],


    [ 'CostoUnitario', 'Costo Unitario de Compra', 'double' ],

    [ 'PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'double' ],

    [ 'PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double' ],

    [ 'PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double' ],
    [ 'PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double' ],
    [ 'PrecioVenta12Cuotas', 'Precio Venta 12 Cuotas', 'double' ],
    [ 'PrecioVenta18Cuotas', 'Precio Venta 18 Cuotas', 'double' ],
    [ 'PrecioVenta24Cuotas', 'Precio Venta 24 Cuotas', 'double' ]
  ]
  //#endregion campos Producto



  //#region  CONST's STATE ----------------------------------


  const [ openPopup, setOpenPopup ] = useState( false )

  const [ sinDatos, SetSinDatos ] = useState( false )
  const [ data, setData ] = useState( [] ) //Data de la tabla
  const [ categorias, setCategorias ] = useState( [] ) // Categorias


  const [ search, setSearch ] = useState( '' )
  const [ filterData, setFilterData ] = useState( [] )

  //#region  Inicializing the Form ----------------------------------




  var formInit = {
    Codigo: "",
    Categoria: null,
    Categoria_id: -1,
    Producto: "",
    Marca: "",
    Color: "",

    PrecioVentaContadoMayorista: "",
    PrecioVentaContadoMinorista: "",
    PrecioVenta3Cuotas: "",
    PrecioVenta6Cuotas: "",
    PrecioVenta12Cuotas: "",
    PrecioVenta18Cuotas: "",
    PrecioVenta24Cuotas: ""
  }



  //#endregion Inicializing the Form
  const [ formData, SetFormData ] = useState( formInit )



  const editingValue = useRef( {} )



  //#endregion CONST's

  // eslint-disable-next-line
  useEffect( () => { cargaData() }, [] )



  //#region  CRUD API ----------------------------------

  const cargaData = () =>
  {


    getRequest( '/productos' )
      .then( request =>
      {

        if ( request && request.data && request.data.Productos && request.data.Categorias )
        {

          var newData = request.data.Productos.map( dataRequested =>
          {

            let instantData = {}

            campos.forEach( item =>
            {

              instantData[ item[ 0 ] ] = ( !dataRequested[ item[ 0 ] ] ) ? "" : dataRequested[ item[ 0 ] ]
            } )

            return { ...instantData, id: dataRequested.id }

          } )

          setData( newData )




          var newCategorias = request.data.Categorias.map( dataRequested => ( {
            Nombre: dataRequested.Nombre,
            id: dataRequested.id
          } ) )


          setCategorias( newCategorias )
        }
        if ( request && request.statusText === 'OK' && request.data && request.data.Productos.length === 0 )
          SetSinDatos( true )

      } )
  }

  const saveData = () =>
  {
    setOpenPopup( false )




    var uri = '/productos'

    if ( formData.id && editingValue.current )
    {// Editing....
      uri = uri + '/' + formData.id


    }




    //Ningun Datoform
    if ( data.length === 0 )
      setData( [ formData ] )
    else//Ya hay datos
      setData( data.concat( formData ) )






    postRequest( uri, formData )
      .then( () =>
      {

        cargaData()


      } )


  }


  const editData = ( item ) =>
  {

    editingValue.current = item

    var temp = data.filter( it => it.id !== item.id )


    setData( temp )

    SetFormData( item )
    setOpenPopup( true )



  }

  const deleteData = ( itemDelete ) =>
  {


    setData( data.filter( it => it.id !== itemDelete.id ) )

    clearform()

    deleteRequest( '/productos/' + itemDelete.id, formData )
      .then( () =>
      {
        cargaData()

      } )
  }



  //#endregion CRUD API



  //#region  Others Functions ----------------------------------

  const clearform = () =>
  {

    editingValue.current = {}
    SetFormData( formInit )

  }
  const recolocaEditItem = () =>
  {
    setData( data.concat( editingValue.current ) )
  }

  const handleSearch = text =>
  {


    let dataFilter = data.filter( item =>
    {
      let resp = false

      campos.forEach( camp =>
      {
        if ( item[ camp[ 0 ] ].toLowerCase().includes( text.toLowerCase() ) )
          resp = true

      } )

      return resp

    } )

    if ( dataFilter.length === 0 )
      SetSinDatos( true )
    else
      SetSinDatos( false )

    setFilterData( dataFilter )
  }
  //#endregion Others Functions





  //#endregion Categorias Handler


  //#region  Return ----------------------------------

  return (
    <>
      <div style={ { display: 'flex', justifyContent: 'space-between' } }>



        <div>
          <Button style={ { margin: '10px' } }
            startIcon={ <AddIcon /> }
            endIcon={ <ImportantDevicesIcon /> }

            variant="contained" color="primary"
            onClick={ () => { clearform(); setOpenPopup( true ) } } > Añadir Productos</Button>

          <Button style={ { margin: '10px' } } variant="contained" color="primary"
            onClick={ () => { SetFormData( createFakeProducto() ); setOpenPopup( true ) } } >Producto Falso</Button>
        </div>
        <div>
          <TextField
            value={ search || '' }
            margin="dense"
            color={ ( search.length === 0 ) ? "primary" : "secondary" }
            size="small"

            onChange={ e => { setSearch( e.target.value ); handleSearch( e.target.value ) } }
            variant={ ( search.length === 0 ) ? "outlined" : "filled" }
            InputProps={ {
              startAdornment: <InputAdornment position="start"> <SearchIcon color='primary' /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                <IconButton
                  onClick={ e => { setSearch( '' ); handleSearch( '' ) } }                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>,
            } } />
        </div>

      </div>

      <Datatable data={ ( search.length === 0 ) ? data : filterData }

        sinDatos={ sinDatos }
        campos={ campos }
        responsive
        handleDelete={ deleteData }
        handleEdit={ editData } />

      <Popup
        openPopup={ openPopup }
        clearform={ clearform }
        setOpenPopup={ setOpenPopup }
        title={ ( formData.id ) ? 'Editar Producto' : 'Añadir Producto' }
        logo={ logo }
        recolocaEditItem={ recolocaEditItem }
        saveData={ saveData }>
        <FormAddProducto
          cargaData={ cargaData }
          categorias={ categorias }
          setCategorias={ setCategorias }
          campos={ campos }
          formData={ formData }
          SetFormData={ SetFormData }
        />
      </Popup>


    </>
  )

  //#endregion Return

}
export default Productos