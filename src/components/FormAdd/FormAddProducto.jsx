import React, { useState, useEffect } from 'react'
import { TextField, Grid, InputAdornment, IconButton, Checkbox } from '@material-ui/core'

import { postRequest, deleteRequest } from '../../API/apiFunctions'

import CategoriaSelect from './CategoriaSelect'

import FormAddCategoria from './FormAddCategoria'

import MoneyOffIcon from '@material-ui/icons/MoneyOff'

import Popup from './Popup'


const FormAddProducto = (
    {
        openPopup, setOpenPopup,
        formProducto, setFormProducto,
        dataProductos, setDataProductos,
        categorias, setCategorias,

        cargaData,
        recolocaEditItem, ajustesPrecios
    } ) =>
{
    //#region  CONST ----------------------------------

    //Control del Form Categorias
    const [ formCategorias, setFormCategorias ] = useState( { Nombre: '' } )

    //Open Close Form Categorias
    const [ openPopupCategoria, setOpenPopupCategoria ] = useState( false )

    //Diseable 18 y 24 Cuotas
    const [ diseable18, setDiseable18 ] = useState( true )
    const [ diseable24, setDiseable24 ] = useState( true )

    //#endregion CONST


    useEffect( () =>
    {

        if ( formProducto && formProducto.PrecioVenta18Cuotas && formProducto.PrecioVenta18Cuotas.length > 0 )
            setDiseable18( false )
        else
            setDiseable18( true )


        if ( formProducto && formProducto.PrecioVenta24Cuotas && formProducto.PrecioVenta24Cuotas.length > 0 )
            setDiseable24( false )
        else
            setDiseable24( true )

    }, [ formProducto ] )

    //#region  saveData ----------------------------------

    const saveData = () =>
    {
        setOpenPopup( false )

        var uri = '/productos'
        let formDataOK = formProducto
        if ( diseable18 )
            formDataOK.PrecioVenta18Cuotas = null

        if ( diseable24 )
            formDataOK.PrecioVenta24Cuotas = null

        if ( formProducto.id )// Editing....
            uri = uri + '/' + formProducto.id

        if ( dataProductos.length === 0 )//Ningun Dato
            setDataProductos( [ formDataOK ] )
        else//Ya hay datos
            setDataProductos( dataProductos.concat( formDataOK ) )

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



    //#region  Auto Fill Money ----------------------------------

    const AutoFillMoney = () =>
    {
        let precioBase = parseInt( formProducto.PrecioVentaContadoMayorista )

        if ( isNaN( precioBase ) )
            return


        setFormProducto( {
            ...formProducto,
            PrecioVentaContadoMinorista: Math.ceil( ( ajustesPrecios.pMinorista * precioBase ) / 10000 ) * 100,
            PrecioVenta3Cuotas: Math.ceil( ( ajustesPrecios.p3cuotas * precioBase ) / 30000 ) * 100,
            PrecioVenta6Cuotas: Math.ceil( ( ajustesPrecios.p6cuotas * precioBase ) / 60000 ) * 100,
            PrecioVenta12Cuotas: Math.ceil( ( ajustesPrecios.p12cuotas * precioBase ) / 120000 ) * 100,
            PrecioVenta18Cuotas: Math.ceil( ( ajustesPrecios.p18cuotas * precioBase ) / 180000 ) * 100,
            PrecioVenta24Cuotas: Math.ceil( ( ajustesPrecios.p24cuotas * precioBase ) / 240000 ) * 100
        } )

    }

    //#endregion Auto Fill Money




    //#region  Edit Delete Categorias ----------------------------------


    const handleEditCategoria = ( { Nombre, id } ) =>
    {
        setFormCategorias( { ...formCategorias, Nombre: Nombre, id: id } )

        setOpenPopupCategoria( true )

    }
    const handleDeleteCategoria = option =>
    {

        setCategorias( categorias.filter( it => it.id !== option.id ) )

        deleteRequest( '/categorias/' + option.id ).then( () => { cargaData() } )


    }

    //#endregion Edit Delete Categorias


    return (
        <Popup
            openPopup={ openPopup }
            setOpenPopup={ setOpenPopup }

            title={ ( formProducto.id ) ? 'Editar Producto' : 'Añadir Producto' }

            recolocaEditItem={ recolocaEditItem }
            saveData={ saveData }>
            <>

                <Grid container spacing={ 3 }>

                    <Grid item xs={ 3 } >
                        <TextField label='Código' variant="outlined" margin='normal' size="small" fullWidth
                            value={ formProducto.Codigo } onChange={ e => { setFormProducto( { ...formProducto, Codigo: e.target.value } ) } } />
                    </Grid>
                    <Grid item xs={ 9 }>
                        <TextField label='Producto' variant="outlined" margin='normal' size="small" fullWidth
                            value={ formProducto.Producto }
                            onChange={ e => { setFormProducto( { ...formProducto, Producto: e.target.value } ) } } />
                    </Grid>

                    <Grid item xs={ 12 } >

                        <CategoriaSelect


                            value={ formProducto.Categoria }
                            setValue={ ( cat, id ) => { setFormProducto( { ...formProducto, Categoria: cat, Categoria_id: id } ) } }
                            list={ categorias }

                            toggleOpenFormAdd={ value =>
                            {
                                setOpenPopupCategoria( true )
                                setFormCategorias( { ...formCategorias, Nombre: value } )
                            } }

                            handleEdit={ handleEditCategoria }
                            handleDelete={ handleDeleteCategoria }
                        />
                    </Grid>



                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Marca' variant="outlined" margin='normal' size="small" fullWidth
                            value={ formProducto.Marca } onChange={ e => { setFormProducto( { ...formProducto, Marca: e.target.value } ) } } />
                    </Grid>
                    <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                        <TextField label='Color' variant="outlined" margin='normal' size="small" fullWidth
                            value={ formProducto.Color } onChange={ e => { setFormProducto( { ...formProducto, Color: e.target.value } ) } } />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Precio Mayorista' variant="outlined" margin='normal' size="small" fullWidth
                            value={ EstilizaString( formProducto.PrecioVentaContadoMayorista ) }
                            InputProps={ {
                                endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={ e => { AutoFillMoney() } } color='secondary' title='Autorellenar Precios'>
                                        <MoneyOffIcon />  </IconButton>  </InputAdornment >
                            } }
                            onChange={ e => { setFormProducto( { ...formProducto, PrecioVentaContadoMayorista: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } } />
                    </Grid>

                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Precio Venta Contado' variant="outlined" margin='normal' size="small" fullWidth
                            value={ EstilizaString( formProducto.PrecioVentaContadoMinorista ) }

                            onChange={ e => { setFormProducto( { ...formProducto, PrecioVentaContadoMinorista: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } } /></Grid>


                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Precio Venta 3 Cuotas' variant="outlined" margin='normal' size="small" fullWidth
                            value={ EstilizaString( formProducto.PrecioVenta3Cuotas ) }

                            onChange={ e => { setFormProducto( { ...formProducto, PrecioVenta3Cuotas: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } }
                            InputProps={ { startAdornment: <InputAdornment position="start">3x </InputAdornment > } }
                        /></Grid>




                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Precio Venta 6 Cuotas' variant="outlined" margin='normal' size="small" fullWidth
                            value={ EstilizaString( formProducto.PrecioVenta6Cuotas ) }
                            InputProps={ { startAdornment: <InputAdornment position="start">6x </InputAdornment > } }
                            onChange={ e => { setFormProducto( { ...formProducto, PrecioVenta6Cuotas: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } } /></Grid>


                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >
                        <TextField label='Precio Venta 12 Cuotas' variant="outlined" margin='normal' size="small" fullWidth
                            value={ EstilizaString( formProducto.PrecioVenta12Cuotas ) }
                            InputProps={ { startAdornment: <InputAdornment position="start">12x </InputAdornment > } }
                            onChange={ e => { setFormProducto( { ...formProducto, PrecioVenta12Cuotas: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } } /></Grid>


                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } >

                        <TextField label={ diseable18 ? 'Deshabilitado' : 'Precio Venta 18 Cuotas' } variant="outlined" margin='normal' size="small" fullWidth
                            value={ diseable18 ? '' : EstilizaString( formProducto.PrecioVenta18Cuotas ) }
                            disabled={ diseable18 }
                            onChange={ e => { setFormProducto( { ...formProducto, PrecioVenta18Cuotas: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } }
                            InputProps={ {
                                startAdornment: <InputAdornment position="start">18x </InputAdornment >,
                                endAdornment: <InputAdornment position="end">
                                    <Checkbox checked={ !diseable18 }
                                        onChange={ e => { setDiseable18( !diseable18 ) } }
                                        title={ diseable18 ? 'Activar 18 Cuotas' : 'Deshabilitar' }
                                    />
                                </InputAdornment>
                            } }
                        />
                    </Grid>


                    <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
                        <TextField label={ diseable24 ? 'Deshabilidato' : 'Precio Venta 24 Cuotas' } variant="outlined" margin='normal' size="small" fullWidth
                            value={ diseable24 ? '' : EstilizaString( formProducto.PrecioVenta24Cuotas ) }
                            disabled={ diseable24 }
                            onChange={ e => { setFormProducto( { ...formProducto, PrecioVenta24Cuotas: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } }
                            InputProps={ {
                                startAdornment: <InputAdornment position="start">24x </InputAdornment >,
                                endAdornment: <InputAdornment position="end">
                                    <Checkbox checked={ !diseable24 }
                                        onChange={ e => { setDiseable24( !diseable24 ) } }
                                        title={ diseable24 ? 'Activar 24 Cuotas' : 'Deshabilitar' }
                                    /></InputAdornment>
                            } }
                        />
                    </Grid>

                </Grid>
                <FormAddCategoria openPopup={ openPopupCategoria } setOpenPopup={ setOpenPopupCategoria }// Control PopUP
                    formCategorias={ formCategorias } setFormCategorias={ setFormCategorias } // State del Form
                    categorias={ categorias } setCategorias={ setCategorias } // Lista de Categorias
                    cargaData={ cargaData }
                />
            </>

        </Popup>
    )

}
export default FormAddProducto