import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

const filter = createFilterOptions()

const MegaSelecter = ( { list, etiqueta, textAdd, toggleOpenFormAdd, label, value, setValue } ) =>
{





    return (

        <Autocomplete
            size='small'
            fullWidth
            value={ value }
            noOptionsText=''
            onChange={ ( event, newValue ) =>
            {

                if ( typeof newValue === 'string' )
                {
                    console.log( 'string', newValue )

                }
                else if ( newValue && newValue.inputValue )// Opcion ADD
                {

                    toggleOpenFormAdd( newValue.inputValue )
                    //Abre Form de Crear nueva Categoria
                    //Se usa el inputValue porque el 'Nombre' [etiqueta] contiene el texto 'Añadir Categoria /XX/'

                } else if ( newValue && newValue[ etiqueta ] && newValue.id ) //Seleccionando Un valor
                {

                    setValue( newValue[ etiqueta ], newValue.id )

                }
                else
                {
                    // Al darle al bton de borrar campo newValue=null
                    setValue( newValue, -1 )//Opcion dejar en blanco o resetear lo escrito
                }
            } }

            filterOptions={ ( options, params ) =>
            {

                const filtered = filter( options, params )

                if ( params.inputValue !== '' )
                {
                    filtered.push( {
                        inputValue: params.inputValue,
                        [ etiqueta ]: `${ textAdd }: "${ params.inputValue }"`,
                    } )
                }

                return filtered
            } }

            options={ list }
            getOptionLabel={ ( option ) =>
            {
                // e.g value selected with enter, right from the input
                if ( typeof option === 'string' )
                {
                    if ( option.length === 0 )
                        return null

                    return option
                }
                if ( option.inputValue )
                {
                    return option.inputValue
                }
                return option[ etiqueta ]
            } }
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={ ( option ) => option[ etiqueta ] }
            freeSolo
            renderInput={ ( params ) => (
                <TextField { ...params } label={ label } variant="outlined" />
            ) }
        />




    )
}





export default MegaSelecter