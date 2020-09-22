import React, { useState, useEffect, useRef } from 'react'
import { getRequest, deleteRequest } from '../../API/apiFunctions'

import FormAddProveedor from '../../components/FormAdd/FormAddProveedor'

import Datatable from '../../components/Dashboard/Datatable'


import { Button, TextField, InputAdornment, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import AddIcon from '@material-ui/icons/Add'

const Proveedores = props =>
{



    //#region  CONST's ----------------------------------


    const [ openPopup, setOpenPopup ] = useState( false )

    const [ sinDatos, SetSinDatos ] = useState( false )
    const [ data, setData ] = useState( [] ) //Data de la tabla

    const [ search, setSearch ] = useState( '' )
    const [ filterData, setFilterData ] = useState( [] )


    //#region  campos Proveedores ----------------------------------

    const campos = [


        [ 'Proveedor', 'Proveedor', 'varchar' ],
        [ 'Telefono', 'Teléfono', 'varchar' ],
        [ 'Email', 'Email', 'varchar' ],
        [ 'Direccion', 'Dirección', 'varchar' ],
        [ 'OtrosDatos', 'Otros', 'varchar' ]


    ]
    //#endregion campos Proveedores


    //#region  Inicializing the Form ----------------------------------




    var formInit = {
        Proveedor: '',
        Telefono: '',
        Email: '',
        Direccion: '',
        OtrosDatos: ''
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

        clearform()

        getRequest( '/proveedores' )
            .then( request =>
            {
                if ( request && request.data && request.data[ 0 ] && request.data[ 0 ].id )
                {

                    var newData = request.data.map( dataRequested =>
                    {

                        let instantData = {}

                        campos.forEach( item =>
                        {
                            instantData[ item[ 0 ] ] = ( !dataRequested[ item[ 0 ] ] ) ? "" : dataRequested[ item[ 0 ] ]
                        } )

                        return { ...instantData, id: dataRequested.id }

                    } )


                    setData( newData )
                }
                if ( request && request.statusText === 'OK' && request.data && request.data.length === 0 )
                    SetSinDatos( true )

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

        deleteRequest( '/proveedores/' + itemDelete.id, formData )
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




    //#region  Return ----------------------------------




    return (
        <>
            <div style={ { display: 'flex', justifyContent: 'space-between' } }>



                <div>
                    <Button style={ { margin: '10px' } } variant="contained" color="primary"
                        startIcon={ <AddIcon /> }
                        endIcon={ <LocalShippingIcon /> }
                        onClick={ () => { clearform(); setOpenPopup( true ) } } > Añadir Proveedor</Button>


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



            <FormAddProveedor
                openPopup={ openPopup }
                setOpenPopup={ setOpenPopup }

                formData={ formData }
                SetFormData={ SetFormData }

                data={ data }
                setData={ setData }


                recolocaEditItem={ recolocaEditItem }
                cargaData={ cargaData }

            />



        </>
    )

    //#endregion Return

}
export default Proveedores