import React from 'react'
import { TextField, Grid } from '@material-ui/core'

const FormAddProveedor = ( { campos, formData, SetFormData } ) =>
{




    const espaciado = ( value ) =>
    {

        const EstilizaString = ( s ) =>
        {
            var re = '\\d(?=(\\d{3})+$)'
            return s.toString().replace( new RegExp( re, 'g' ), '$& ' )
        }



        return EstilizaString( value )
    }


    const varchar = ( item ) => (

        <TextField label={ item[ 1 ] } variant="outlined" margin='normal' size="small"
            value={ formData[ item[ 0 ] ] || '' } onChange={ e => { SetFormData( { ...formData, [ item[ 0 ] ]: e.target.value } ) } } />
    )

    const double = ( item ) => (

        <TextField label={ item[ 1 ] } variant="outlined" margin='normal' size="small"
            value={ espaciado( formData[ item[ 0 ] ] ) || '' }
            onChange={ e => { SetFormData( { ...formData, [ item[ 0 ] ]: e.target.value.replace( /\D/, '' ).replace( ' ', '' ) } ) } } />

    )

    const date = ( item ) => (

        <TextField label={ item[ 1 ] } type="date" value={ formData[ item[ 0 ] ] }
            onChange={ e => { SetFormData( { ...formData, [ item[ 0 ] ]: e.target.value } ) } }
            InputLabelProps={ { shrink: true, } } />

    )

    return (



        <Grid container spacing={ 3 }>
            { campos.map( ( item, i ) => (

                <Grid item xs={ 12 } sm={ 6 } lg={ 4 } key={ i }>


                    { item[ 2 ] === 'varchar' ? varchar( item ) : ( item[ 2 ] === 'date' ? date( item ) : double( item ) ) }



                </Grid>
            ) ) }
        </Grid>






    )

}
export default FormAddProveedor