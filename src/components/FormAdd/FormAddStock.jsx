import React, { useState } from 'react'
import { TextField, Grid } from '@material-ui/core'

import { postRequest, deleteRequest } from '../../API/apiFunctions'

import ProductoSelect from './ProductoSelect'


import Popup from './Popup'
import FormAddProducto from './FormAddProducto'
import ProveedoresSelect from './ProveedoresSelect'
import FormAddProveedor from './FormAddProveedor'


const FormAddStock = (
    {
        openPopup, setOpenPopup,
        formStock, SetFormStock,

        dataStock, setDataStock,
        dataProveedores, setDataProveedores,
        dataProductos, setDataProductos,
        dataCategorias, setDataCategorias,

        cargaData,
        recolocaEditItem, ajustesPrecios
    } ) =>
{
    //#region  CONST ----------------------------------

    //#region  Form Producto ----------------------------------

    //Control del Form Producto
    const [ formProducto, setFormProducto ] = useState( {
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
    } )

    //Open Close Form Producto
    const [ openPopupProducto, setOpenPopupProducto ] = useState( false )

    //#endregion Form Producto

    //#region  form Proveedor ----------------------------------

    const [ formProveedor, setFormProveedor ] = useState( {
        Proveedor: '',
        Telefono: '',
        Email: '',
        Direccion: '',
        OtrosDatos: ''
    } )

    //Open Close Form Proveedor
    const [ openPopupProveedor, setOpenPopupProveedor ] = useState( false )

    //#endregion form Proveedor

    //#endregion CONST


    //#region  saveData ----------------------------------

    const saveData = () =>
    {

        setOpenPopup( false )

        var uri = '/stocks'
        let formDataOK = formStock



        if ( formStock.id )// Editing....
            uri = uri + '/' + formStock.id

        if ( dataStock.length === 0 )//Ningun Dato
            setDataStock( [ formDataOK ] )
        else//Ya hay datos
            setDataStock( dataStock.concat( formDataOK ) )

        postRequest( uri, formDataOK ).then( () => { cargaData() } )
    }

    //#endregion saveData



    //#region  Estiliza como money String ----------------------------------

    const EstilizaString = ( s ) =>
    {
        if ( !s )
            return ""

        var re = '\\d(?=(\\d{3})+$)'
        return s.toString().replace( new RegExp( re, 'g' ), '$& ' )
    }

    //#endregion Estiliza como money String



    //#region  Edit Delete Producto ----------------------------------

    const handleEditProducto = ( { id } ) =>
    {

        let productoEditar = dataProductos.filter( item => item.id === id )[ 0 ]

        if ( productoEditar )
        {
            setFormProducto( productoEditar )

            setOpenPopupProducto( true )
        }

    }

    const handleDeleteProducto = ( { id } ) =>
    {
        setDataProductos( dataProductos.filter( it => it.id.toString() !== id.toString() ) )

        deleteRequest( '/productos/' + id ).then( () => { cargaData() } )
    }


    //#endregion  Edit Delete Producto


    //#region  Edit Delete Proveedor ----------------------------------

    const handleEditProveedor = ( { id } ) =>
    {

        let ProveedorEditar = dataProveedores.filter( item => item.id === id )[ 0 ]

        if ( ProveedorEditar )
        {
            setFormProveedor( ProveedorEditar )

            setOpenPopupProveedor( true )
        }



    }


    const handleDeleteProveedor = ( { id } ) =>
    {

        setDataProveedores( dataProveedores.filter( it => it.id.toString() !== id.toString() ) )

        deleteRequest( '/proveedores/' + id ).then( () => { cargaData() } )
    }



    //#endregion Edit Delete Proveedores


    //#region  Return ----------------------------------




    return (
        <Popup
            openPopup={ openPopup }
            setOpenPopup={ setOpenPopup }

            title={ ( formStock.id ) ? 'Editar Stock' : 'COMPRA' }

            recolocaEditItem={ recolocaEditItem }
            saveData={ saveData }>
            <>

                <Grid container spacing={ 3 }>



                    <Grid item xs={ 12 } >

                        <ProductoSelect


                            value={ formStock.Producto }
                            setValue={ id => { SetFormStock( { ...formStock, Producto_id: id } ) } }
                            list={ dataProductos }

                            toggleOpenFormAdd={ () => { setOpenPopupProducto( true ) } }

                            handleEdit={ handleEditProducto }
                            handleDelete={ handleDeleteProducto }
                        />
                    </Grid>

                    <Grid item xs={ 12 } >

                        <ProveedoresSelect

                            value={ formStock.Proveedor }
                            setValue={ id => { SetFormStock( { ...formStock, Proveedor_id: id } ) } }
                            list={ dataProveedores }

                            toggleOpenFormAdd={ () => { setOpenPopupProveedor( true ) } }

                            handleEdit={ handleEditProveedor }
                            handleDelete={ handleDeleteProveedor }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Costo Unitario' variant="outlined" margin='normal' size="small" fullWidth
                            value={ EstilizaString( formStock.CostoUnitario ) }

                            onChange={ e => { SetFormStock( { ...formStock, CostoUnitario: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } }

                        /></Grid>


                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Cantidad' variant="outlined" margin='normal' size="small" fullWidth
                            value={ formStock.Cantidad } onChange={ e => { SetFormStock( { ...formStock, Cantidad: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } } />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                        <TextField label='Factura de Compra' variant="outlined" margin='normal' size="small" fullWidth
                            value={ formStock.Factura } onChange={ e => { SetFormStock( { ...formStock, Factura: e.target.value } ) } } />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                        <TextField label='Fecha de Compra' variant="outlined" margin='normal' size="small" fullWidth
                            value={ formStock.FechaCompra } onChange={ e => { SetFormStock( { ...formStock, FechaCompra: e.target.value } ) } } />
                    </Grid>


                </Grid>

                <FormAddProducto
                    openPopup={ openPopupProducto } setOpenPopup={ setOpenPopupProducto }// Control PopUP
                    formProducto={ formProducto } setFormProducto={ setFormProducto } // State del Form
                    categorias={ dataCategorias } setCategorias={ setDataCategorias }

                    dataProductos={ dataProductos } setDataProductos={ setDataProductos } // Lista de Productos
                    cargaData={ cargaData } recolocaEditItem={ () => { } } ajustesPrecios={ ajustesPrecios }
                />
                <FormAddProveedor
                    data={ dataProveedores } setData={ setDataProveedores } // Lista de Proveedores
                    formData={ formProveedor } SetFormData={ setFormProveedor } // State del Form
                    openPopup={ openPopupProveedor } setOpenPopup={ setOpenPopupProveedor }// Control PopUP
                    recolocaEditItem={ () => { } }

                    cargaData={ cargaData }
                />
            </>


        </Popup>
    )
    //#endregion Return
}
export default FormAddStock