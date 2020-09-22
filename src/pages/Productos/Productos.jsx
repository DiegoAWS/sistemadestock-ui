import React, { useState, useEffect, useRef } from 'react'
import { getRequest, deleteRequest } from '../../API/apiFunctions'
import FormAddProducto from '../../components/FormAdd/FormAddProducto'


import Datatable from '../../components/Dashboard/Datatable'



import { Button, TextField, InputAdornment, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import AddIcon from '@material-ui/icons/Add'
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices'


const Productos = props =>
{


  //#region  campos Producto ----------------------------------

  const campos = [
    [ 'Producto', 'Producto', 'varcharX' ],
    [ 'Categoria', 'Categoría', 'categSelector' ],

    [ 'Codigo', 'Código', 'varchar' ],
    [ 'Marca', 'Marca', 'varchar' ],

    [ 'Color', 'Color', 'varchar' ],


    [ 'PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'autoRellenar' ],

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
  const [ dataProductos, setDataProductos ] = useState( [] ) //Data de la tabla
  const [ categorias, setCategorias ] = useState( [] ) // Categorias


  const [ search, setSearch ] = useState( '' )
  const [ filterData, setFilterData ] = useState( [] )

  //#region  Inicializing the Form ----------------------------------




  var formInit = {
    Codigo: "",
    Categoria: "",
    Categoria_id: "",
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
  const [ formProducto, setFormProducto ] = useState( formInit )


  const [ ajustesPrecios, setAjustesPrecio ] = useState( {
    pMinorista: 106.25,
    p3cuotas: 112.50,
    p6cuotas: 130,
    p12cuotas: 150,
    p18cuotas: 180,
    p24cuotas: 200
  } )



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

        if ( request && request.data && request.data.Productos && request.data.Categorias && request.data.Ajuste )
        {

          var newData = request.data.Productos.map( dataRequested =>
          {

            let instantData = {}

            campos.forEach( item =>
            {

              instantData[ item[ 0 ] ] = ( !dataRequested[ item[ 0 ] ] ) ? "" : dataRequested[ item[ 0 ] ].replace( ' ', '' )

            } )

            return { ...instantData, id: dataRequested.id }

          } )

          setDataProductos( newData )




          var newCategorias = request.data.Categorias.map( dataRequested => ( {
            Nombre: dataRequested.Nombre,
            id: dataRequested.id
          } ) )


          setCategorias( newCategorias )


          if ( request.data.Ajuste[ 0 ] )
          {

            let dataRequested = request.data.Ajuste[ 0 ]

            let pMinorista = parseInt( dataRequested.pMinorista, 10 )
            let p3cuotas = parseInt( dataRequested.p3cuotas, 10 )
            let p6cuotas = parseInt( dataRequested.p6cuotas, 10 )
            let p12cuotas = parseInt( dataRequested.p12cuotas, 10 )
            let p18cuotas = parseInt( dataRequested.p18cuotas, 10 )
            let p24cuotas = parseInt( dataRequested.p24cuotas, 10 )
            if ( !( isNaN( pMinorista ) || isNaN( p3cuotas ) || isNaN( p6cuotas ) || isNaN( p12cuotas ) ) )
            {


              setAjustesPrecio(
                {
                  pMinorista,
                  p3cuotas,
                  p6cuotas,
                  p12cuotas,
                  p18cuotas,
                  p24cuotas
                } )
            }

          }

        }



        if ( request && request.statusText === 'OK' && request.data && request.data.Productos.length === 0 )
          SetSinDatos( true )

      } )
  }


  const editData = ( item ) =>
  {

    editingValue.current = item

    var temp = dataProductos.filter( it => it.id !== item.id )


    setDataProductos( temp )

    setFormProducto( item )
    setOpenPopup( true )



  }

  const deleteData = ( itemDelete ) =>
  {


    setDataProductos( dataProductos.filter( it => it.id !== itemDelete.id ) )

    clearform()

    deleteRequest( '/productos/' + itemDelete.id )
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
    setFormProducto( formInit )

  }
  const recolocaEditItem = () =>
  {
    setDataProductos( dataProductos.concat( editingValue.current ) )
  }

  const handleSearch = text =>
  {


    let dataFilter = dataProductos.filter( item =>
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

        </div>
        <div>
          <TextField
            value={ search || '' }
            margin="dense"
            color={ ( search.length === 0 ) ? "primary" : "secondary" }
            size="small"

            onChange={ e => { setSearch( e.target.value.replace( '!', '' ) ); handleSearch( e.target.value.replace( '!', '' ) ) } }
            variant={ ( search.length === 0 ) ? "outlined" : "filled" }
            InputProps={ {
              startAdornment: <InputAdornment position="start"> <SearchIcon color='primary' /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                <IconButton
                  onClick={ e => { setSearch( '' ); handleSearch( '' ) } }    >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>,
            } } />
        </div>

      </div>

      <Datatable data={ ( search.length === 0 ) ? dataProductos : filterData }

        sinDatos={ sinDatos }
        campos={ campos }
        responsive
        handleDelete={ deleteData }
        handleEdit={ editData } />



      <FormAddProducto
        openPopup={ openPopup }
        setOpenPopup={ setOpenPopup }


        formProducto={ formProducto }
        setFormProducto={ setFormProducto }


        dataProductos={ dataProductos }
        setDataProductos={ setDataProductos }




        categorias={ categorias }
        setCategorias={ setCategorias }

        recolocaEditItem={ recolocaEditItem }

        cargaData={ cargaData }
        ajustesPrecios={ ajustesPrecios }
        campos={ campos }

      />



    </>
  )

  //#endregion Return

}
export default Productos