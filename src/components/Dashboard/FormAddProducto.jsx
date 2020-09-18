import React, { useState } from 'react'
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core'

import MegaSelecter from './MegaSelecter'
import FormAddCategoria from './FormAddCategoria'

import MoneyOffIcon from '@material-ui/icons/MoneyOff'


const FormAddProducto = ( { formData, SetFormData, categorias, setCategorias, campos, cargaData, ajustesPrecios } ) =>
{




    //Open Close Form Categorias
    const [ openPopupCategoria, setOpenPopupCategoria ] = useState( false )

    //Control del Form Categorias
    const [ formCategorias, setFormCategorias ] = useState( {
        Nombre: ''
    } )



    const EstilizaString = ( s ) =>
    {
        if ( !s )
            return ""

        var re = '\\d(?=(\\d{3})+$)'
        return s.toString().replace( new RegExp( re, 'g' ), '$& ' )
    }



    const AutoFillMoney = item =>
    {
        let precioBase = parseInt( formData[ item[ 0 ] ] )

        if ( isNaN( precioBase ) )
            return


        SetFormData( {
            ...formData,
            PrecioVentaContadoMinorista: Math.round( ( ajustesPrecios.pMinorista * precioBase ) / 100000 ) * 1000,
            PrecioVenta3Cuotas: Math.round( ( ajustesPrecios.p3cuotas * precioBase ) / 100000 ) * 1000,
            PrecioVenta6Cuotas: Math.round( ( ajustesPrecios.p6cuotas * precioBase ) / 100000 ) * 1000,
            PrecioVenta12Cuotas: Math.round( ( ajustesPrecios.p12cuotas * precioBase ) / 100000 ) * 1000
        } )

    }


    //#region  Inputs Genericos ----------------------------------




    const varchar = ( item ) => (

        <TextField label={ item[ 1 ] } variant="outlined" margin='normal' size="small" fullWidth
            value={ formData[ item[ 0 ] ] || '' } onChange={ e => { SetFormData( { ...formData, [ item[ 0 ] ]: e.target.value } ) } } />
    )

    const categSelector = ( item ) => (

        <MegaSelecter
            textAdd='Añadir Categoría'
            label='Categoría'
            etiqueta='Nombre'
            value={ formData[ item[ 0 ] ] }
            setValue={ ( cat, id ) =>
            {
                SetFormData( { ...formData, [ item[ 0 ] ]: cat, [ item[ 0 ] + '_id' ]: id } )
            } }
            list={ categorias }
            toggleOpenFormAdd={ toggleOpenAddCategoria }
        />

    )
    const double = ( item ) => (

        <TextField label={ item[ 1 ] } variant="outlined" margin='normal' size="small" fullWidth
            value={ EstilizaString( formData[ item[ 0 ] ] ) || 0 }
            onChange={ e => { SetFormData( { ...formData, [ item[ 0 ] ]: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } } />

    )



    const doubleAutoRellenar = ( item ) => (
        <TextField label={ item[ 1 ] } variant="outlined" margin='normal' size="small" fullWidth
            value={ EstilizaString( formData[ item[ 0 ] ] ) || 0 }
            InputProps={ {
                endAdornment: <InputAdornment position="end">

                    <IconButton onClick={ e => { AutoFillMoney( item ) } } color='secondary' title='Autorellenar Precios'>

                        <MoneyOffIcon />

                    </IconButton>

                </InputAdornment >,
            } }
            onChange={ e =>
            {
                SetFormData( { ...formData, [ item[ 0 ] ]: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } )
            } } />


    )

    const date = ( item ) => (

        <TextField label={ item[ 1 ] } type="date" fullWidth value={ formData[ item[ 0 ] ] }
            onChange={ e => { SetFormData( { ...formData, [ item[ 0 ] ]: e.target.value } ) } }
            InputLabelProps={ { shrink: true, } } />

    )
    //#endregion Inputs Genericos


    const toggleOpenAddCategoria = ( value ) =>
    {
        setOpenPopupCategoria( true )
        setFormCategorias( { ...formCategorias, Nombre: value } )


    }






    const input = item =>
    {

        switch ( item[ 2 ] )
        {

            case 'date':
                return date( item )

            case 'double':
                return double( item )

            case 'categSelector':
                return categSelector( item )

            case 'varchar':
                return varchar( item )

            case 'autoRellenar':
                return doubleAutoRellenar( item )

            default:
                return ( <></> )
        }
    }

    return (

        <>

            <Grid container spacing={ 3 }>






                { campos.map( ( item, i ) => (
                    <Grid item xs={ 12 } sm={ item[ 2 ] === 'categSelector' ? 12 : 6 } lg={ item[ 2 ] === 'categSelector' ? 12 : 4 } key={ i }>


                        { input( item ) }



                    </Grid>
                ) ) }
            </Grid>


            <FormAddCategoria openPopup={ openPopupCategoria } setOpenPopup={ setOpenPopupCategoria }// Control PopUP
                formCategorias={ formCategorias } setFormCategorias={ setFormCategorias } // State del Form
                categorias={ categorias } setCategorias={ setCategorias } // Lista de Categorias
                cargaData={ cargaData }
            />
        </>


    )

}
export default FormAddProducto