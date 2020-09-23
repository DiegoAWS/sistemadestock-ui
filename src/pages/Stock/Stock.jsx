import React, { useState, useEffect, useRef } from 'react'
import { getRequest, deleteRequest } from '../../API/apiFunctions'

import Datatable from '../../components/Dashboard/Datatable'
import FormAddStock from '../../components/FormAdd/FormAddStock'


import { Button, TextField, InputAdornment, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import AddIcon from '@material-ui/icons/Add'





const Stock = props =>
{

    //#region  CONST's State ----------------------------------

    const [ openPopup, setOpenPopup ] = useState( false )

    const [ sinDatos, SetSinDatos ] = useState( false )


    const [ dataStock, setDataStock ] = useState( [] ) //Data de la tabla STOCK
    const [ dataProductos, setDataProductos ] = useState( [] ) //Data de la tabla Productos
    const [ dataProveedores, setDataProveedores ] = useState( [] ) //Data de la tabla Proveedores
    const [ dataCategorias, setDataCategorias ] = useState( [] ) //Data de la tabla Categorias

    const [ dataFull, setDataFull ] = useState( [] )

    const [ ajustesPrecios, setAjustesPrecio ] = useState( {
        pMinorista: 106.25,
        p3cuotas: 112.50,
        p6cuotas: 130,
        p12cuotas: 150,
        p18cuotas: 180,
        p24cuotas: 200
    } )

    const [ search, setSearch ] = useState( '' )
    const [ filterData, setFilterData ] = useState( [] )

    //#endregion CONST's State

    //#region  campos Producto ----------------------------------

    const camposProducto = [


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

    //#region  campos Proveedor ----------------------------------

    const camposProveedor = [

        [ 'Proveedor', 'Proveedor', 'varchar' ],
        [ 'Telefono', 'Teléfono', 'varchar' ],
        [ 'Email', 'Email', 'varchar' ],
        [ 'Direccion', 'Dirección', 'varchar' ],
        [ 'OtrosDatos', 'Otros', 'varchar' ]
    ]

    //#endregion campos Proveedor

    //#region  campos Stock ----------------------------------

    const camposStock = [ [ 'Producto_id' ], [ 'Proveedor_id' ], [ 'CostoUnitario' ], [ 'Cantidad' ], [ 'Factura' ], [ 'FechaCompra' ] ]

    //#endregion campos Stock

    //#region  campos datFull ----------------------------------

    const camposDataFull = [
        [ 'Codigo', 'Código', 'varchar' ],

        [ 'Categoria', 'Categoría', 'categSelector' ],
        [ 'Producto', 'Producto', 'varcharX' ],

        [ 'Marca', 'Marca', 'varchar' ],

        [ 'Color', 'Color', 'varchar' ],

        [ 'Cantidad', 'Cantidad', 'double' ],
        [ 'Proveedor', 'Proveedor', 'varchar' ],
        [ 'Factura', 'Factura de Compra', 'varchar' ],
        [ 'FechaCompra', 'Fecha de Compra', 'datetime' ],
        [ 'CostoUnitario', 'Costo Unitario', 'double' ],

        [ 'PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'autoRellenar' ],

        [ 'PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double' ],

        [ 'PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double' ],
        [ 'PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double' ],
        [ 'PrecioVenta12Cuotas', 'Precio Venta 12 Cuotas', 'double' ],
        [ 'PrecioVenta18Cuotas', 'Precio Venta 18 Cuotas', 'double' ],
        [ 'PrecioVenta24Cuotas', 'Precio Venta 24 Cuotas', 'double' ]
    ]

    //#endregion campos datFull

    //#region  Inicializing the Form ----------------------------------


    const initFormStock = {
        Producto_id: '',
        Proveedor_id: '',
        CostoUnitario: '',
        Cantidad: '',
        Factura: '',
        FechaCompra: ''
    }

    const [ formStock, SetFormStock ] = useState( initFormStock )



    //#endregion Inicializing the Form



    const editingValue = useRef( {} )



    //#region  use Effect ----------------------------------

    // eslint-disable-next-line
    useEffect( () => { cargaData() }, [] )

    useEffect( () =>
    {

        let newFullData = dataStock.map( item =>
        {
            let newProducto = dataProductos.filter( itemProducto =>
            {
                if ( itemProducto.id )
                    return itemProducto.id.toString() === item.Producto_id
                else
                    return false
            } )[ 0 ]

            let newProveedor = dataProveedores.filter( itemProveedor =>
            {

                if ( itemProveedor.id )
                    return itemProveedor.id.toString() === item.Proveedor_id
                else
                    return false
            } )[ 0 ]

            let fullDataItem = { ...item, ...newProducto, ...newProveedor }

            return { ...fullDataItem, id: item.id }
        } )

        setDataFull( newFullData )
    }, [ dataStock, dataProductos, dataProveedores ] )



    //#endregion use Effect



    //#region  Carga Data ----------------------------------

    const cargaData = () =>
    {
        getRequest( '/stocks' ).then( request =>
        {
            if ( request && request.statusText === 'OK' && request.data && request.data.Productos && request.data.Proveedors && request.data.Stock )
            {
                //#region  Productos ----------------------------------

                setDataProductos( request.data.Productos.map( dataRequested =>
                {

                    let instantData = {}

                    camposProducto.forEach( item => { instantData[ item[ 0 ] ] = ( !dataRequested[ item[ 0 ] ] ) ? '' : dataRequested[ item[ 0 ] ] } )

                    return { ...instantData, id: dataRequested.id }

                } ) )

                //#endregion Productos

                //#region  Proveedors ----------------------------------

                setDataProveedores( request.data.Proveedors.map( dataRequested =>
                {

                    let instantData = {}

                    camposProveedor.forEach( item =>
                    {

                        instantData[ item[ 0 ] ] = ( !dataRequested[ item[ 0 ] ] ) ? '' : dataRequested[ item[ 0 ] ]
                    } )

                    return { ...instantData, id: dataRequested.id }

                } ) )

                //#endregion Proveedors

                //#region  Stock ----------------------------------

                setDataStock( request.data.Stock.map( dataRequested =>
                {

                    let instantData = {}

                    camposStock.forEach( item => { instantData[ item[ 0 ] ] = ( !dataRequested[ item[ 0 ] ] ) ? '' : dataRequested[ item[ 0 ] ] } )

                    return { ...instantData, id: dataRequested.id }

                } ) )

                //#endregion Stock

                //#region  Categorias ----------------------------------

                setDataCategorias( request.data.Categorias.map( dataRequested => ( {
                    Nombre: dataRequested.Nombre ? dataRequested.Nombre : '',
                    id: dataRequested.id ? dataRequested.id : ''
                } ) ) )

                //#endregion Categorias

                //#region  Ajuste Precio ----------------------------------

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
                //#endregion Ajuste Precio

            }



            if ( request && request.statusText === 'OK' && request.data && request.data.Stock.length === 0 )
                SetSinDatos( true )

        } )
    }

    //#endregion Carga Data



    //#region  Edit Delete----------------------------------



    const editData = ( item ) =>
    {

        editingValue.current = item

        var temp = dataStock.filter( it => it.id !== item.id )


        setDataStock( temp )

        SetFormStock( item )
        setOpenPopup( true )



    }

    const deleteData = ( itemDelete ) =>
    {

        console.log( itemDelete )

        setDataStock( dataStock.filter( it => it.id !== itemDelete.id ) )

        clearform()

        deleteRequest( '/stocks/' + itemDelete.id, formStock )
            .then( () =>
            {
                cargaData()

            } )
    }



    //#endregion Edit Delete



    //#region  Others Functions ----------------------------------

    const clearform = () =>
    {

        editingValue.current = {}
        SetFormStock( initFormStock )

    }


    const handleSearch = text =>
    {


        let dataFilter = dataFull.filter( item =>
        {
            let resp = false

            camposStock.forEach( camp =>
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


    const recolocaEditItem = () =>
    {
        alert( 'recolocaEditItem' )
    }
    //#endregion Others Functions



    //#region  Return ----------------------------------




    return (
        <>
            <div style={ { display: 'flex', justifyContent: 'space-between' } }>



                <div>
                    <Button style={ { margin: '10px' } } variant="contained" color="primary"
                        startIcon={ <AddIcon /> }
                        endIcon={ <LocalShippingIcon /> }
                        onClick={ () => { clearform(); setOpenPopup( true ) } } > Añadir Productos al Stock</Button>


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

            <Datatable data={ ( search.length === 0 ) ? dataFull : filterData }

                sinDatos={ sinDatos }
                campos={ camposDataFull }

                handleDelete={ deleteData }
                handleEdit={ editData } />


            <FormAddStock
                openPopup={ openPopup }
                setOpenPopup={ setOpenPopup }

                formStock={ formStock }
                SetFormStock={ SetFormStock }


                dataStock={ dataStock }
                setDataStock={ setDataStock }

                dataProductos={ dataProductos }
                setDataProductos={ setDataProductos }

                dataProveedores={ dataProveedores }
                setDataProveedores={ setDataProveedores }

                dataCategorias={ dataCategorias }
                setDataCategorias={ setDataCategorias }

                recolocaEditItem={ recolocaEditItem }
                cargaData={ cargaData }
                ajustesPrecios={ ajustesPrecios }
            />


        </>
    )

    //#endregion Return

}
export default Stock