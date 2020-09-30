import React, { useState, useEffect, useRef } from "react"
import DataTable from 'react-data-table-component'

import { makeStyles, Grid, Card, TextField, InputAdornment, Typography, IconButton, Button, Divider } from "@material-ui/core"
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'



import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import AddIcon from "@material-ui/icons/Add"
import CloseIcon from '@material-ui/icons/Close'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import InfoIcon from '@material-ui/icons/Info'
import EditIcon from '@material-ui/icons/Edit'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import WarningIcon from '@material-ui/icons/Warning'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'


import { getRequest } from '../../API/apiFunctions'
import FormAddCliente from '../../components/FormAdd/FormAddCliente'

//#region JSS
const useStyle = makeStyles( ( theme ) => ( {

    leftContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    seccionProductos: {
        border: '1px solid black',
        padding: '10px 5px',
        marginBottom: '10px',
        borderRadius: '10px',

    },
    seccionClientes: {
        border: '1px solid black',
        borderRadius: '10px',
        padding: '10px 5px',
        marginBottom: '10px',
    },
    nombreProducto: {
        marginBottom: '10px'
    },
    preciosCard: {
        width: '100%',
        backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);'
    },

    textoCliente: {
        backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);',
        textAlign: "center",
        padding: '5px',
        margin: '5px',
        flexGrow: '1',
        borderRadius: '10px'
    },
    numberCliente: {
        fontSize: 'x-large',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

} ) )

//#endregion JSS


const Ventas = ( props ) =>
{

    //#region Constantes utiles

    const filterProducto = createFilterOptions( { stringify: option => option.Codigo + option.Producto } )
    const filterCliente = createFilterOptions( { stringify: option => option.Nombre } )
    const classes = useStyle()

    //  DataTable Columnas ----------------------------------
    const cols = [

        { grow: 1, name: 'Producto', selector: 'Producto' },
        { width: '120px', cell: row => <div style={ { textAlign: 'right' } }>{ 'Gs. ' + row.subTotal }</div> },
        { width: '60px', cell: row => <IconButton color='secondary' onClick={ () => { handleBajaCarrito( row ) } }>  <CloseIcon />  </IconButton> }

    ]

    //#region useBlur :)
    const useBlur = () =>
    {
        const htmlElRef = useRef( null )
        const setBlur = () => { htmlElRef.current && htmlElRef.current.blur() }

        return [ htmlElRef, setBlur ]
    }


    const [ inputRef, setInputBlur ] = useBlur()
    const [ inputRefCliente, setInputBlurCliente ] = useBlur()

    //#endregion


    //#region  campos  ----------------------------------

    //  campos Producto
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


    //  campos Cliente 
    const camposCliente = [

        [ 'Nombre', 'Nombre', 'varchar' ],
        [ 'Email', 'Email', 'varchar' ],
        [ 'Telefono', 'Teléfono', 'varchar' ],
        [ 'Direccion', 'Dirección', 'varchar' ],
        [ 'OtrosDatos', 'Otros', 'varchar' ]

    ]
    //#endregion campos 


    //#endregion

    //#region  State ----------------------------------



    const [ productoSeleccionado, setProductoSeleccionado ] = useState( null )
    const [ productoSearchText, setProductoSearchText ] = useState( '' )

    const [ clienteSeleccionado, setClienteSeleccionado ] = useState( null )
    const [ clienteSearchText, setClienteSearchText ] = useState( "" )

    const [ openFormAddCliente, setOpenFormAddCliente ] = useState( false )

    const [ carritoProductos, setCarritoProductos ] = useState( [] )


    const [ importeTotal, setImporteTotal ] = useState( 0 )



    const [ dataClientes, setDataClientes ] = useState( [] )
    const [ dataProductos, setDataProductos ] = useState( [] )
    // const [ dataVentas, setDataVentas ] = useState( [] )




    const [ pagado, setPagado ] = useState( '' )

    //#endregion State

    //#region UseEffect



    // eslint-disable-next-line 
    useEffect( () => { cargaData() }, [] )


    useEffect( () =>
    {
        if ( carritoProductos.length === 0 )
            setImporteTotal( 0 )
        else
        {


            let t = 0
            carritoProductos.forEach( item =>
            {
                if ( !isNaN( parseInt( item.subTotal ) ) )
                    t = t + parseInt( item.subTotal )
            } )

            if ( t > 0 )
                setImporteTotal( t )
        }
    }, [ carritoProductos ] )


    //#endregion

    //#region Carga Data
    const cargaData = () =>
    {


        getRequest( '/ventas' )
            .then( resp =>
            {
                if ( resp && resp.statusText && resp.statusText === "OK" && resp.data && resp.data.Productos && resp.data.Clientes )
                {

                    //#region Productos

                    if ( Array.isArray( resp.data.Productos ) )
                    {
                        const dataProductos = resp.data.Productos.map( dataRequested =>
                        {

                            let instantData = {}

                            camposProducto.forEach( item => { instantData[ item[ 0 ] ] = ( !dataRequested[ item[ 0 ] ] ) ? '' : dataRequested[ item[ 0 ] ] } )

                            return { ...instantData, id: dataRequested.id }

                        } )

                        setDataProductos( dataProductos )


                    }
                    //#endregion

                    //#region Clientes

                    if ( Array.isArray( resp.data.Clientes ) )
                    {
                        setDataClientes( resp.data.Clientes.map( dataRequested =>
                        {

                            let instantData = {}

                            camposCliente.forEach( item => { instantData[ item[ 0 ] ] = ( !dataRequested[ item[ 0 ] ] ) ? '' : dataRequested[ item[ 0 ] ] } )

                            return { ...instantData, id: dataRequested.id }

                        } ) )
                    }
                    //#endregion


                }

            } )
    }
    //#endregion

    //#region Beep

    function beep ()
    {
        var snd = new Audio( "data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=" )
        snd.play()
    }
    //#endregion

    //#region  Carrito 

    //Monta en el carrito
    const addCart = key =>
    {
        let produtoSel = { ...productoSeleccionado }

        setCarritoProductos( carritoProductos.concat( { ...produtoSel, subTotal: produtoSel[ key ], id: Date.now() } ) )
        setProductoSeleccionado( null )
    }

    //Baja del carrito
    const handleBajaCarrito = row =>
    {
        //setCarritoProductos
        if ( window.confirm( 'Seguro que desea quitar de la lista de la compra ' + row.Producto + '...?' ) )
        {

            let tempCarrito = carritoProductos.filter( item => item.id.toString() !== row.id.toString() )
            setCarritoProductos( tempCarrito )

        }


    }
    //#endregion

    return <Grid container spacing={ 3 } style={ { height: "100%", width: '100%' } } >

        {
            //#region Left PANEL
        }
        <Grid item container xs={ 12 } md={ 6 } >
            <div className={ classes.leftContainer } >
                <div className={ classes.seccionProductos } >


                    {
                        //#region Search Producto
                    }



                    <Autocomplete
                        autoComplete
                        clearOnBlur
                        fullWidth
                        clearOnEscape
                        noOptionsText=''
                        clearText='Limpiar Producto'
                        options={ dataProductos }
                        filterOptions={ ( options, params ) =>
                        {
                            let filtered = filterProducto( options, params )

                            if ( filtered.length === 1 )
                            {
                                beep()
                                setTimeout( () =>
                                {
                                    setInputBlur()
                                    setProductoSeleccionado( filtered[ 0 ] )
                                }, 50 )


                            }
                            return filtered
                        } }
                        value={ productoSeleccionado }
                        onChange={ ( e, newValue ) =>
                        {
                            if ( newValue )
                                beep()
                            setProductoSeleccionado( newValue )
                        } }
                        inputValue={ productoSearchText }
                        onInputChange={ ( event, newInputValue ) => { setProductoSearchText( newInputValue.replace( '!', '' ) ) } }

                        getOptionLabel={ option => ( option && option.Producto ) ? option.Producto : '' }
                        renderOption={ option => <h4>  { option.Producto }</h4> }
                        renderInput={ params => <TextField autoFocus className={ classes.nombreProducto } inputRef={ inputRef }  { ...params } label='Producto' variant="outlined" /> }
                    />




                    {
                        //#endregion Search Producto
                    }


                    {
                        //#region PRECIOS
                    }
                    <Grid container direction="column" spacing={ 1 } >

                        { productoSeleccionado &&
                            <Grid item container style={ { justifyContent: 'space-evenly' } }>

                                { !isNaN( parseInt( productoSeleccionado.PrecioVentaContadoMayorista ) ) && //OJO Y ademas solo para Admins!!
                                    <Grid item sm={ 6 } lg={ 4 }>
                                        <Button fullWidth onClick={ e => { addCart( 'PrecioVentaContadoMayorista' ) } }>
                                            <Card className={ classes.preciosCard }>
                                                <div style={ { fontSize: '0.8rem' } }>Precio Mayorista</div>
                                                <div style={ { fontSize: '1rem' } }>
                                                    { 'Gs. ' + productoSeleccionado.PrecioVentaContadoMayorista }  </div>
                                                <div style={ { fontSize: '0.8rem' } }>Pago único</div>
                                            </Card>
                                        </Button>
                                    </Grid>
                                }

                                { !isNaN( parseInt( productoSeleccionado.PrecioVentaContadoMinorista ) ) &&
                                    <Grid item sm={ 6 } lg={ 4 }>
                                        <Button fullWidth onClick={ e => { addCart( 'PrecioVentaContadoMinorista' ) } }>
                                            <Card className={ classes.preciosCard }>
                                                <div style={ { fontSize: '0.8rem' } }>Precio al Contado</div>
                                                <div style={ { fontSize: '1rem' } }>
                                                    { 'Gs. ' + productoSeleccionado.PrecioVentaContadoMinorista }  </div>
                                                <div style={ { fontSize: '0.8rem' } }> Pago único</div>
                                            </Card>
                                        </Button>
                                    </Grid>
                                }

                                { !isNaN( parseInt( productoSeleccionado.PrecioVenta3Cuotas ) ) &&
                                    <Grid item sm={ 6 } lg={ 4 }>
                                        <Button fullWidth onClick={ e => { addCart( 'PrecioVenta3Cuotas' ) } }>
                                            <Card className={ classes.preciosCard }>
                                                <div style={ { fontSize: '0.8rem' } }>Precio 3 cuotas</div>
                                                <div style={ { fontSize: '1rem' } }>
                                                    { 'Gs. ' + productoSeleccionado.PrecioVenta3Cuotas + ' x 3' }  </div>
                                                <div style={ { fontSize: '0.8rem' } }>
                                                    { 'Gs. ' + ( 3 * parseInt( productoSeleccionado.PrecioVenta3Cuotas ) ) }</div>
                                            </Card>
                                        </Button>
                                    </Grid> }

                                { !isNaN( parseInt( productoSeleccionado.PrecioVenta6Cuotas ) ) &&
                                    <Grid item sm={ 6 } lg={ 4 }>
                                        <Button fullWidth onClick={ e => { addCart( 'PrecioVenta6Cuotas' ) } }>
                                            <Card className={ classes.preciosCard }>
                                                <div style={ { fontSize: '0.8rem' } }>Precio 6 cuotas</div>
                                                <div style={ { fontSize: '1rem' } }>
                                                    { 'Gs. ' + productoSeleccionado.PrecioVenta6Cuotas + ' x 6' }  </div>
                                                <div style={ { fontSize: '0.8rem' } }>
                                                    { 'Gs. ' + ( 6 * parseInt( productoSeleccionado.PrecioVenta6Cuotas ) ) }</div>
                                            </Card>
                                        </Button>
                                    </Grid> }

                                { !isNaN( parseInt( productoSeleccionado.PrecioVenta12Cuotas ) ) &&
                                    <Grid item sm={ 6 } lg={ 4 }>
                                        <Button fullWidth onClick={ e => { addCart( 'PrecioVenta12Cuotas' ) } }>
                                            <Card className={ classes.preciosCard }>
                                                <div style={ { fontSize: '0.8rem' } }>Precio 12 cuotas</div>
                                                <div style={ { fontSize: '1rem' } }>
                                                    { 'Gs. ' + productoSeleccionado.PrecioVenta12Cuotas + ' x 12' }  </div>
                                                <div style={ { fontSize: '0.8rem' } }>
                                                    { 'Gs. ' + ( 12 * parseInt( productoSeleccionado.PrecioVenta12Cuotas ) ) }</div>
                                            </Card>
                                        </Button>
                                    </Grid> }

                                { !isNaN( parseInt( productoSeleccionado.PrecioVenta18Cuotas ) ) &&
                                    <Grid item sm={ 6 } lg={ 4 }>
                                        <Button fullWidth onClick={ e => { addCart( 'PrecioVenta18Cuotas' ) } }>
                                            <Card className={ classes.preciosCard }>
                                                <div style={ { fontSize: '0.8rem' } }>Precio 18 cuotas</div>
                                                <div style={ { fontSize: '1rem' } }>
                                                    { 'Gs. ' + productoSeleccionado.PrecioVenta18Cuotas + ' x 18' }  </div>
                                                <div style={ { fontSize: '0.8rem' } }>
                                                    { 'Gs. ' + ( 18 * parseInt( productoSeleccionado.PrecioVenta18Cuotas ) ) }</div>
                                            </Card>
                                        </Button>
                                    </Grid> }


                                { !isNaN( parseInt( productoSeleccionado.PrecioVenta24Cuotas ) ) &&
                                    <Grid item sm={ 6 } lg={ 4 }>
                                        <Button fullWidth onClick={ e => { addCart( 'PrecioVenta24Cuotas' ) } }>
                                            <Card className={ classes.preciosCard }>
                                                <div style={ { fontSize: '0.8rem' } }>Precio 24 cuotas</div>
                                                <div style={ { fontSize: '1rem' } }>
                                                    { 'Gs. ' + productoSeleccionado.PrecioVenta24Cuotas + ' x 24' }  </div>
                                                <div style={ { fontSize: '0.8rem' } }>
                                                    { 'Gs. ' + ( 24 * parseInt( productoSeleccionado.PrecioVenta24Cuotas ) ) }</div>
                                            </Card>
                                        </Button>
                                    </Grid> }
                            </Grid>

                        }

                    </Grid>

                    {
                        //#endregion PRECIOS
                    }


                </div>
                <div className={ classes.seccionClientes }>


                    {
                        //#region Search Cliente
                    }

                    <div style={ { display: "flex" } }>



                        <Autocomplete

                            size='small'
                            autoComplete
                            clearOnBlur
                            fullWidth
                            noOptionsText=''
                            clearText='Limpiar Cliente'
                            options={ dataClientes }
                            filterOptions={ ( options, params ) =>
                            {
                                let filtered = filterCliente( options, params )

                                if ( filtered.length === 1 )
                                {

                                    setTimeout( () =>
                                    {
                                        setInputBlurCliente()
                                        setClienteSeleccionado( filtered[ 0 ] )
                                    }, 50 )


                                }
                                return filtered
                            } }

                            value={ clienteSeleccionado }
                            onChange={ ( e, newValue ) => { setClienteSeleccionado( newValue ) } }

                            inputValue={ clienteSearchText }
                            onInputChange={ ( event, newInputValue ) => { setClienteSearchText( newInputValue ) } }

                            getOptionLabel={ option => ( option && option.Nombre ) ? option.Nombre : '' }
                            renderOption={ option => <h4>  { option.Nombre }</h4> }
                            renderInput={ params => <TextField className={ classes.nombreProducto } inputRef={ inputRefCliente }
                                { ...params } label='Cliente' variant="outlined"

                            /> }
                        />



                        <IconButton
                            onClick={ e =>
                            {
                                setClienteSeleccionado( null )
                                setOpenFormAddCliente( true )
                            } }
                            title="Añadir Cliente"
                            color="secondary"
                            size="medium"
                            variant="contained"
                        >
                            <AddIcon />
                        </IconButton>
                    </div>

                    {
                        //#endregion Search Cliente
                    }


                    {
                        //#region Datos Cliente
                    }

                    <Grid container direction="column" spacing={ 1 }  >


                        <div style={ { border: '1px solid black', borderRadius: '10px', padding: '3px', margin: '5px' } }>
                            <div style={ { display: 'flex', backgroundColor: 'gray', borderRadius: '10px 10px 0 0', padding: ' 8px' } } >
                                <div style={ {
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                } }
                                >
                                    <AccountCircleIcon style={ { color: clienteSeleccionado ? 'white' : '#b5b5b5' } } />
                                </div>

                                <div style={ { textAlign: "center", flexGrow: '1' } }>
                                    <Typography variant="h5" color="initial"> { clienteSeleccionado ? clienteSeleccionado.Nombre : 'Cliente Contado' } </Typography>
                                </div>

                                <div>
                                    <IconButton
                                        onClick={ e =>
                                        {
                                            if ( clienteSeleccionado )
                                                setOpenFormAddCliente( true )
                                        } }
                                        title="Editar Cliente"

                                        size="small"
                                        variant="contained"
                                    >
                                        <EditIcon style={ { color: clienteSeleccionado ? '#ff5353' : '#b5b5b5' } } />
                                    </IconButton>
                                </div>
                                <div>
                                    <IconButton
                                        onClick={ e =>
                                        {
                                            alert( 'Historial de Compras del Cliente' )

                                        } }
                                        title="Historial del Cliente"

                                        size="small"
                                        variant="contained"
                                    >

                                        <InfoIcon style={ { color: clienteSeleccionado ? '#5cc4ff' : '#b5b5b5' } } />
                                    </IconButton>
                                </div>
                            </div>



                            <div style={ { margin: '10px 0', display: 'flex' } }>
                                <div className={ classes.textoCliente }>
                                    <div>Compras Realizadas </div>
                                    <div className={ classes.numberCliente } style={ { color: 'blue' } }><ShoppingCartIcon />0</div>
                                </div>

                                <Divider flexItem orientation="vertical" />

                                <div className={ classes.textoCliente }>

                                    <div>Puntos de Fidelidad </div>
                                    <div className={ classes.numberCliente } style={ { color: 'green' } }><LoyaltyIcon /> 0</div>

                                </div>

                                <Divider flexItem orientation="vertical" />

                                <div className={ classes.textoCliente }>
                                    <div>  Pagos Atrasados </div>
                                    <div className={ classes.numberCliente } style={ { color: 'red' } }><WarningIcon />0</div>
                                </div>
                            </div>

                        </div>
                    </Grid>

                    {
                        //#endregion Datos Cliente
                    }

                </div>

            </div>
        </Grid>


        {
            //#endregion
        }

        {
            //#region Right Panel ----------------------------------------------
        }
        <Grid item xs={ 12 } md={ 6 } style={ {} }>


            {
                //#region Listado de Productos Comprados ----------------------------------------------
            }


            <div style={ { borderRadius: '10px', padding: '10px', backgroundColor: 'gray', height: '30vh', overflowY: 'auto' } }>

                <DataTable
                    style={ { borderRadius: '10px', overflowX: 'hidden' } }
                    columns={ cols }
                    noDataComponent={ <AddShoppingCartIcon color='primary' /> }
                    data={ carritoProductos }
                    highlightOnHover
                    noHeader
                    noTableHead

                />


            </div>

            {
                //#endregion Listado de Productos Comprados
            }


            {
                //#region Acciones de Compra ----------------------------------------------
            }
            <div style={ { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }>

                <div>
                    <TextField
                        label="Pagado"
                        fullWidth
                        variant="outlined"
                        style={ { flexGrow: "1" } }
                        value={ pagado }
                        margin='normal'
                        onChange={ ( e ) => { setPagado( e.target.value ) } }
                        InputProps={ {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <AttachMoneyIcon />
                                </InputAdornment>
                            ),
                        } }
                    />


                </div>
                <div style={ { margin: '10px', padding: '10px' } }>


                    <div className={ classes.numberCliente }>
                        <div> Importe Total : </div>
                        <div>{ 'Gs. ' + importeTotal } </div>
                    </div>
                    <div className={ classes.numberCliente }>
                        <div> Pagado : </div>
                        <div >{ isNaN( parseInt( pagado ) ) ? '' : 'Gs. ' + parseInt( pagado ) } </div>
                    </div>
                    <hr />
                    <div className={ classes.numberCliente }>
                        <div> Cambio : </div>
                        <div>{ isNaN( parseInt( pagado ) ) ? '' : 'Gs. ' + ( parseInt( pagado ) - importeTotal ) } </div>
                    </div>

                </div>
                <div>
                    <Button variant='contained' fullWidth color='secondary' onClick={ e => { alert( 'Imprimir Comprobante Garantia y si corresponde pagaré de cuotas' ) } }>Pagar</Button>
                </div>
            </div>
            {
                //#endregion Acciones de Compra
            }

        </Grid>

        {
            //#endregion Right Panel
        }

        {
            //#region Form Add Cliente ----------------------------------------------
        }
        <FormAddCliente
            openPopup={ openFormAddCliente }
            setOpenPopup={ setOpenFormAddCliente }

            formData={ clienteSeleccionado ? clienteSeleccionado : {
                Nombre: '',
                Email: '',
                Telefono: '',
                Direccion: '',
                OtrosDatos: ''
            } }
            SetFormData={ setClienteSeleccionado }

            data={ dataClientes }
            setData={ setDataClientes }

            recolocaEditItem={ () => { } }
            cargaData={ cargaData }
        />

        {
            //#endregion Form Add Cliente ----------------------------------------------
        }

    </Grid>
}
export default Ventas
