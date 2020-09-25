import React, { useState, useEffect } from 'react'
import { TextField, Grid } from '@material-ui/core'

import { postRequest, deleteRequest } from '../../API/apiFunctions'

import ProductoSelect from './ProductoSelect'


import Popup from './Popup'
import FormAddProducto from './FormAddProducto'
import ProveedoresSelect from './ProveedoresSelect'
import FormAddProveedor from './FormAddProveedor'

import loadingGif from '../../assets/images/loading.gif'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import es from 'date-fns/locale/es'

import { dateToString, stringToDate } from '../../API/timeFunctions'

registerLocale( 'es', es )
setDefaultLocale( 'es' )


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

    //#region  Producto ----------------------------------

    //Control del Producto
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


    const [ valueProducto, setValueProducto ] = useState( null )
    //#endregion Producto

    //#region  Proveedor ----------------------------------

    const [ formProveedor, setFormProveedor ] = useState( {
        Proveedor: '',
        Telefono: '',
        Email: '',
        Direccion: '',
        OtrosDatos: ''
    } )

    //Open Close Form Proveedor
    const [ openPopupProveedor, setOpenPopupProveedor ] = useState( false )



    const [ valueProveedor, setValueProveedor ] = useState( null )
    //#endregion Proveedor



    const [ loading, setLoading ] = useState( false )

    //#endregion CONST


    //#region  useEffect ----------------------------------


    useEffect( () =>
    {

        let proveedorSel = dataProveedores.filter( item =>
        {

            if ( item && item.id && formStock && formStock.Proveedor_id )
                return item.id.toString() === formStock.Proveedor_id.toString()
            return false

        } )

        setValueProveedor( proveedorSel.length === 1 ? proveedorSel[ 0 ] : null )

        let productoSel = dataProductos.filter( item =>
        {
            if ( item && item.id && formStock && formStock.Producto_id )
                return item.id.toString() === formStock.Producto_id.toString()
            return false

        } )

        setValueProducto( productoSel.length === 1 ? productoSel[ 0 ] : null )
    }, [ dataProveedores, dataProductos, formStock ] )



    //#endregion useEffect


    //#region  saveData ----------------------------------

    const saveData = () =>
    {

        setLoading( true )



        var uri = '/stocks'
        let formDataOK = { ...formStock }



        if ( formStock.id )// Editing....
            uri = uri + '/' + formStock.id

        //             else{
        //  if ( dataStock.length === 0 )//Ningun Dato
        //             setDataStock( [ formDataOK ] )
        //         else//Ya hay datos
        //             setDataStock( dataStock.concat( formDataOK ) )

        //             }



        let data = formDataOK.FechaCompra
        console.log( data )
        // formDataOK.FechaCompra = 'HOY'
        postRequest( uri, formDataOK ).then( () =>
        {
            cargaData()
            setOpenPopup( false )
            setLoading( false )
        } )
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


    const CustomDateInput = React.forwardRef( ( { value, onClick }, ref ) => (

        <TextField ref={ ref } label='Fecha de Compra' variant="outlined" margin='normal' size="small"
            value={ value } onClick={ onClick } fullWidth
        />
    ) )

    return (
        <Popup
            openPopup={ openPopup }
            setOpenPopup={ setOpenPopup }

            title={ ( formStock.id ) ? 'Editar Stock' : 'COMPRA' }

            recolocaEditItem={ recolocaEditItem }
            saveData={ saveData }>
            <>
                <Grid container style={ { border: '1px solid black', borderRadius: '10px', marginBottom: '10px', padding: '10px' } }>
                    <Grid item xs={ 12 } md={ 6 } style={ { padding: '0px 10px', display: 'flex', alignItems: 'flex-end' } } >

                        <ProveedoresSelect

                            value={ valueProveedor }
                            setValue={ proveedor =>
                            {
                                setValueProveedor( proveedor )
                                SetFormStock( { ...formStock, Proveedor_id: proveedor && proveedor.id ? proveedor.id : -1 } )
                            } }
                            list={ dataProveedores }

                            toggleOpenFormAdd={ () => { setOpenPopupProveedor( true ) } }

                            handleEdit={ handleEditProveedor }
                            handleDelete={ handleDeleteProveedor }
                        />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } md={ 3 } style={ { padding: '0px 10px' } }>

                        <DatePicker
                            selected={ stringToDate( formStock.FechaCompra ) }
                            onChange={ date => { SetFormStock( { ...formStock, FechaCompra: dateToString( date ) } ) } }
                            showTimeInput
                            timeInputLabel="Hora:"
                            withPortal
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            todayButton="Hoy"
                            customInput={ <CustomDateInput /> }
                        />
                    </Grid>


                    <Grid item xs={ 12 } sm={ 6 } md={ 3 } style={ { padding: '0px 10px' } }>
                        <TextField label='Factura de Compra' variant="outlined" margin='normal' size="small"
                            fullWidth
                            value={ formStock.Factura } onChange={ e => { SetFormStock( { ...formStock, Factura: e.target.value } ) } } />
                    </Grid>
                </Grid>

                <Grid container style={ { border: '1px solid black', borderRadius: '10px', marginBottom: '10px', padding: '10px' } }>

                    <Grid item xs={ 12 } md={ 6 } style={ { padding: '0px 10px', display: 'flex', alignItems: 'flex-end' } }>

                        <ProductoSelect


                            value={ valueProducto }
                            setValue={ producto =>
                            {
                                setValueProducto( producto )
                                SetFormStock( { ...formStock, Producto_id: producto && producto.id ? producto.id : -1 } )

                            } }

                            list={ dataProductos }
                            toggleOpenFormAdd={ () => { setOpenPopupProducto( true ) } }

                            handleEdit={ handleEditProducto }
                            handleDelete={ handleDeleteProducto }
                        />
                    </Grid>



                    <Grid item xs={ 12 } sm={ 6 } md={ 3 } style={ { padding: '0px 10px' } } >
                        <TextField label='Costo Unitario' variant="outlined" margin='normal' size="small" fullWidth
                            value={ EstilizaString( formStock.CostoUnitario ) }

                            onChange={ e => { SetFormStock( { ...formStock, CostoUnitario: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } }

                        /></Grid>


                    <Grid item xs={ 12 } sm={ 6 } md={ 3 } style={ { padding: '0px 10px' } } >
                        <TextField label='Cantidad' variant="outlined" margin='normal' size="small" fullWidth
                            value={ formStock.Cantidad } onChange={ e => { SetFormStock( { ...formStock, Cantidad: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } } />
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
                <div style={ {
                    position: 'fixed', top: '0', left: '0', height: '100vh', width: '100vw',
                    backgroundColor: 'rgba(0,0,0,0.6)', display: loading ? 'flex' : 'none',
                    justifyContent: 'center', alignItems: 'center'
                } }>
                    <img src={ loadingGif } alt="" height='30px' /></div>
            </>


        </Popup >
    )
    //#endregion Return
}
export default FormAddStock