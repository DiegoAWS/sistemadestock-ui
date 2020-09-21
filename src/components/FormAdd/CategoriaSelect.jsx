import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
import { IconButton } from '@material-ui/core'

import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'
import AddBoxIcon from '@material-ui/icons/AddBox'

const filter = createFilterOptions()

const CategoriaSelect = ( { list, toggleOpenFormAdd, value, setValue, handleEdit, handleDelete } ) =>
{



    return (

        <Autocomplete
            size='small'
            autoComplete
            fullWidth
            value={ value }
            noOptionsText=''
            onChange={ ( event, newValue ) =>
            {

                if ( typeof newValue === 'string' )
                {

                    console.log( 'string', newValue )

                }
                else if ( newValue && typeof newValue.inputValue === 'string' )// Opcion ADD
                {

                    toggleOpenFormAdd( newValue.inputValue )
                    //Abre Form de Crear nueva Categoria


                } else if ( newValue && newValue.Nombre && newValue.id ) //Seleccionando Un valor
                {

                    setValue( newValue.Nombre, newValue.id )

                }
                else
                {


                    // Al darle al bton de borrar campo newValue=null, id
                    setValue( newValue, null )//Opcion dejar en blanco o resetear lo escrito
                }
            } }

            filterOptions={ ( options, params ) =>
            {

                const filtered = filter( options, params )

                filtered.push( {
                    inputValue: params.inputValue,
                    Nombre: `Añadir Categoría: "${ params.inputValue }"`
                } )


                return filtered
            } }

            options={ list }
            getOptionLabel={ ( option ) =>
            {

                if ( !option )
                    return ''
                // e.g value selected with enter, right from the input
                if ( typeof option === 'string' )
                {
                    if ( option.length === 0 )
                        return ''

                    return option
                }
                if ( option.inputValue )
                {
                    return option.inputValue
                }
                return option.Nombre
            } }
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            renderOption={ ( option ) => (
                <>


                    { option.Nombre.includes( 'Añadir Categoría: ' ) ?
                        <>
                            <IconButton title='Añadir nueva Categoria' color="primary">
                                <AddBoxIcon />
                            </IconButton>
                        </>
                        :
                        <>
                            <IconButton onClick={ e =>
                            {
                                e.stopPropagation()
                                if ( window.confirm( "¿Seguro que desea Borrar esta Categoría?" ) )
                                    handleDelete( option )
                            } }
                                title='Borrar datos' color="secondary"
                                size="medium"
                                variant="contained">

                                <DeleteForeverIcon />

                            </IconButton>

                            <IconButton onClick={ e =>
                            {
                                e.stopPropagation()
                                if ( window.confirm( "¿Seguro que desea Editar esta Categoría?" ) )
                                    handleEdit( option )
                            } }
                                title='Editar datos' color="primary"
                                size="medium"
                                variant="contained">

                                <EditIcon />

                            </IconButton>
                        </>
                    }


                    <h4>  { option.Nombre }</h4>

                </>

            ) }
            freeSolo
            renderInput={ ( params ) => (
                <TextField { ...params } label='Categoría' variant="outlined" />
            ) }
        />




    )
}





export default CategoriaSelect