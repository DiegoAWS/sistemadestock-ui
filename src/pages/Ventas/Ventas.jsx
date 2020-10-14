import React, { useState, useEffect, useRef } from "react"
import DataTable from 'react-data-table-component'

import { makeStyles, Grid, Card, TextField, Typography, IconButton, Button, Divider } from "@material-ui/core"
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

import { jsPDF } from "jspdf"
import Canvg from 'canvg'

import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import AddIcon from "@material-ui/icons/Add"
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info'
import EditIcon from '@material-ui/icons/Edit'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import WarningIcon from '@material-ui/icons/Warning'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import Barcode from 'react-barcode'

import { getRequest, postRequest } from '../../API/apiFunctions'
import FormAddCliente from '../../components/FormAdd/FormAddCliente'

import logoEtiqueta from '../../assets/images/logoEtiqueta.png'

//#region JSS
const useStyle = makeStyles((theme) => ({

    leftContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 12px'
    },
    rightContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0 12px'
    },
    seccionStockStock: {
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
        backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);',
        textAlign: 'center',
        fontWeigth: '500',
        textTransform: 'uppercase'
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

}))

//#endregion JSS

const formater = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
});

const Ventas = (props) => {

    //#region Constantes utiles

    const filterProducto = createFilterOptions({ stringify: option => option.Codigo + option.Producto })
    const filterCliente = createFilterOptions({ stringify: option => option.Nombre + option.Telefono })
    const classes = useStyle()

    //  DataTable Columnas ----------------------------------
    const cols = [

        {
            cell: row => (<div style={{ display: 'flex', padding: '10px 0' }}>
                {(row.cantidad > 1) && <div style={{ whiteSpace: 'nowrap', fontSize: 'large' }}>{row.cantidad + 'x'} </div>}
                <div style={{ fontSize: 'large', display: 'flex', alignItems: 'center', textAlign: 'center' }}>{row.Producto}</div>
                <div style={{ margin: '0 10px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                    {formater.format(row.subTotal)}
                </div>
                <IconButton color='secondary' onClick={() => { handleBajaCarrito(row) }}>  <CloseIcon />  </IconButton>

            </div>)

        }

    ]

    //#region useBlur :)
    const useBlur = () => {
        const htmlElRef = useRef(null)
        const setBlur = () => { htmlElRef.current && htmlElRef.current.blur() }

        return [htmlElRef, setBlur]
    }


    const [inputRef, setInputBlur] = useBlur()
    const [inputRefCliente, setInputBlurCliente] = useBlur()

    //#endregion



    //#region  campos Stock ----------------------------------


    const camposStock = [
        ['Codigo', 'Código', 'varchar'],
        ['Categoria', 'Categoría', 'categSelector'],
        ['Producto', 'Producto', 'varcharX'],
        ['Marca', 'Marca', 'varchar'],
        ['Color', 'Color', 'varchar'],
        ['Cantidad', 'Cantidad', 'double'],
        ['Proveedor', 'Proveedor', 'varchar'],
        ['Factura', 'Factura de Compra', 'varchar'],
        ['FechaCompra', 'Fecha de Compra', 'datetime'],
        ['CostoUnitario', 'Costo Unitario', 'double'],
        ['PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'autoRellenar'],
        ['PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double'],
        ['PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double'],
        ['PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double'],
        ['PrecioVenta12Cuotas', 'Precio Venta 12 Cuotas', 'double'],
        ['PrecioVenta18Cuotas', 'Precio Venta 18 Cuotas', 'double'],
        ['PrecioVenta24Cuotas', 'Precio Venta 24 Cuotas', 'double']
    ]

    //#endregion campos Stock

    //#region  campos  Cliente----------------------------------

    const camposCliente = [

        ['Nombre', 'Nombre', 'varchar'],
        ['Email', 'Email', 'varchar'],
        ['Cedula', 'Cédula de Identidad', 'varchar'],
        ['Direccion', 'Dirección', 'varchar'],
        ['OtrosDatos', 'Otros', 'varchar']

    ]
    //#endregion campos Cliente


    //#endregion

    //#region  State ----------------------------------



    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [productoSearchText, setProductoSearchText] = useState('')

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
    const [clienteSearchText, setClienteSearchText] = useState("")


    const [openFormAddCliente, setOpenFormAddCliente] = useState(false)
    const initFormAddCliente = {
        Nombre: '',
        Email: '',
        Cedula: '',
        Direccion: '',
        OtrosDatos: ''
    }

    const [formDataAddClient, setFormDataAddCliente] = useState(initFormAddCliente)

    const [carritoList, setCarritoList] = useState([])


    const [importeTotal, setImporteTotal] = useState(0)



    const [dataClientes, setDataClientes] = useState([])
    const [dataStock, setDataStock] = useState([])
    // const [ dataVentas, setDataVentas ] = useState( [] )


    const [cantidad, setCantidad] = useState(1)

    const [pagado, setPagado] = useState('')

    const [pagando, setPagando] = useState(false)
    const [cantidadError, setCantidadError] = useState(false)

    //#endregion State

    const refFijarValue = useRef(false)

    //#region UseEffect


    // eslint-disable-next-line 
    useEffect(() => { cargaData() }, [])


    useEffect(() => {
        if (carritoList.length === 0)
            setImporteTotal(0)
        else {


            let t = 0
            carritoList.forEach(item => {
                if (!isNaN(parseInt(item.subTotal)))
                    t = t + parseInt(item.subTotal)
            })

            if (t > 0)
                setImporteTotal(t)
        }
    }, [carritoList])


    //#endregion

    //#region Carga Data
    const cargaData = () => {

        getRequest('/ventas')
            .then(resp => {


                if (resp && resp.statusText && resp.statusText === "OK" && resp.data && resp.data.Clientes && resp.data.Stock && resp.data.Ventas) {

                    //#region Stock

                    if (Array.isArray(resp.data.Stock)) {
                        const dataStock = []

                        resp.data.Stock.forEach(dataRequested => {
                            if (dataRequested.Cantidad > 0) {

                                let instantData = {}

                                camposStock.forEach(item => { instantData[item[0]] = (!dataRequested[item[0]]) ? '' : dataRequested[item[0]] })

                                dataStock.push({ ...instantData, id: dataRequested.id })

                            }

                        })

                        setDataStock(dataStock)


                    }
                    //#endregion

                    //#region Clientes

                    if (Array.isArray(resp.data.Clientes)) {
                        setDataClientes(resp.data.Clientes.map(dataRequested => {

                            let instantData = {}

                            camposCliente.forEach(item => { instantData[item[0]] = (!dataRequested[item[0]]) ? '' : dataRequested[item[0]] })

                            return { ...instantData, id: dataRequested.id }

                        }))
                    }
                    //#endregion
                    if (refFijarValue.current) {
                        setClienteSeleccionado(formDataAddClient)
                        refFijarValue.current = false
                    }

                }

            })
    }
    //#endregion

    //#region Beep

    function beep() {
        var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=")
        snd.play()
    }
    //#endregion

    //#region  Carrito 

    //Monta en el carrito
    const addCart = key => {
        let produtoSel = { ...productoSeleccionado }

        if (!isNaN(parseInt(produtoSel[key]))) {
            setCarritoList(carritoList.concat({
                ...produtoSel,
                Pago: key,
                cantidadComprada: cantidad,
                subTotal: parseInt(produtoSel[key]) * cantidad,
                idStock: produtoSel.id,
                id: Date.now()
            }))

            setTimeout(() => {
                setCantidad(1)
                setProductoSeleccionado(null)
            }, 200)


        }
    }

    //Baja del carrito
    const handleBajaCarrito = row => {
        //setCarritoList
        if (window.confirm('Seguro que desea quitar de la lista de la compra ' + row.Producto + '...?')) {

            let tempCarrito = carritoList.filter(item => item.id.toString() !== row.id.toString())
            setCarritoList(tempCarrito)

        }


    }
    //#endregion

    //#region PAGAR
    const pagarCuenta = () => {
        setPagando(true)
        getRequest('/ventasonlystock')
            .then(responseStock => {
                if (responseStock && responseStock.data) {

                    let stockFull = responseStock.data

                    carritoList.forEach(item => {

                        let Prod = stockFull.filter(st => st.id === item.idStock)

                        if (Prod.length !== 1) {
                            alert('ERROR')
                            return
                        }
                        let newProducto = { ...Prod[0], Cantidad: Prod[0].Cantidad - item.cantidadComprada }
                        stockFull = stockFull.map(st => {
                            if (st.id === item.idStock)
                                return newProducto
                            else
                                return st
                        })
                    })
                    let errorCantidad = ''
                    stockFull.forEach(item => {
                        if (item.Cantidad < 0)
                            errorCantidad = errorCantidad + item.Producto + '\n'
                    })


                    if (errorCantidad.length > 0) {
                        alert('ERROR \n No hay suficiente en Stock de \n \n' + errorCantidad)
                        setCarritoList([])
                        setPagando(false)
                    }
                    else {


                        let clienteNombre = 'Cliente de Contado'
                        if (clienteSeleccionado && clienteSeleccionado.Nombre)
                            clienteNombre = clienteSeleccionado.Nombre


                        postRequest('/ventas', { productos: carritoList, cliente: clienteNombre })
                            .then(response => {
                                setPagando(false)

                                if (response && response.data) {
                                    console.log(response.data)//IMPRIMIR COMPROBANTES
                                    if (response.data.print)
                                        ImprimirComprobante()

                                }


                            })

                    }



                }
            })






    }
    //#endregion

    //#region PRINT

    //#region Comprobante

    const ImprimirComprobante = () => {
        var doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [80, 180]
        })


        let svg = document.getElementsByClassName('CODEBAR')[0].innerHTML

        if (svg)
            svg = svg.replace(/\r?\n|\r/g, '').trim()

        let canvas = document.createElement('canvas')


        let ctx = canvas.getContext('2d')

        let v = Canvg.fromString(ctx, svg)

        v.start()


        let imgData = canvas.toDataURL('image/png')





        // Generate PDF






        doc.addImage(logoEtiqueta, 'PNG', 12, 15, 20, 10, null, null, 90)

        doc.addImage(imgData, 'PNG', 15, 15, 20, 10)

        doc.setFontSize(11)
        doc.text('TEXTO', 48, 5, null, null, "center")





        doc.autoPrint()
        doc.save('Imprimir.pdf')


    }

    //#endregion

    //#endregion


    return <Grid container style={{ width: '100%' }} >

        {
            //#region Left PANEL
        }
        <Grid item xs={12} sm={12} md={6} className={classes.leftContainer} >

            <div className={classes.seccionClientes}>

                {
                    //#region Search Cliente
                }

                <div style={{ display: "flex" }}>



                    <Autocomplete

                        size='small'
                        autoComplete
                        clearOnBlur
                        fullWidth
                        noOptionsText=''
                        clearText='Limpiar Cliente'
                        options={dataClientes}
                        filterOptions={(options, params) => {
                            let filtered = filterCliente(options, params)

                            if (filtered.length === 1) {

                                setTimeout(() => {
                                    setInputBlurCliente()
                                    setClienteSeleccionado(filtered[0])
                                }, 50)


                            }
                            return filtered
                        }}

                        value={clienteSeleccionado}
                        onChange={(e, newValue) => { setClienteSeleccionado(newValue) }}

                        getOptionSelected={(option, value) => {

                            return option.Nombre === value.Nombre
                        }}

                        inputValue={clienteSearchText}
                        onInputChange={(event, newInputValue) => { setClienteSearchText(newInputValue) }}
                        getOptionLabel={option => (option && option.Nombre) ? option.Nombre : ''}
                        renderOption={option => <h4>  {option.Nombre}</h4>}
                        renderInput={params => <TextField className={classes.nombreProducto} inputRef={inputRefCliente}
                            {...params} label='Cliente' variant="outlined"

                        />}
                    />



                    <IconButton
                        onClick={e => {
                            setClienteSeleccionado(null)
                            setOpenFormAddCliente(true)
                        }}
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

                <Grid container direction="column" spacing={1}  >


                    <div style={{ border: '1px solid black', borderRadius: '10px', padding: '3px', margin: '5px' }}>
                        <div style={{ display: 'flex', backgroundColor: 'gray', borderRadius: '10px 10px 0 0', padding: ' 8px' }} >
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            >
                                <AccountCircleIcon style={{ color: clienteSeleccionado ? 'white' : '#b5b5b5' }} />
                            </div>

                            <div style={{ textAlign: "center", flexGrow: '1' }}>
                                <Typography variant="h5" color="initial"> {clienteSeleccionado ? clienteSeleccionado.Nombre : 'Cliente Contado'} </Typography>
                            </div>

                            <div>
                                <IconButton
                                    onClick={e => {
                                        if (clienteSeleccionado)
                                            setOpenFormAddCliente(true)
                                    }}
                                    title="Editar Cliente"

                                    size="small"
                                    variant="contained"
                                >
                                    <EditIcon style={{ color: clienteSeleccionado ? '#ff5353' : '#b5b5b5' }} />
                                </IconButton>
                            </div>
                            <div>
                                <IconButton
                                    onClick={e => {
                                        alert('Historial de Compras del Cliente')

                                    }}
                                    title="Historial del Cliente"

                                    size="small"
                                    variant="contained"
                                >

                                    <InfoIcon style={{ color: clienteSeleccionado ? '#5cc4ff' : '#b5b5b5' }} />
                                </IconButton>
                            </div>
                        </div>



                        <div style={{ margin: '10px 0', display: 'flex' }}>
                            <div className={classes.textoCliente}>
                                <div>Compras Realizadas </div>
                                <div className={classes.numberCliente} style={{ color: 'blue' }}><ShoppingCartIcon />0</div>
                            </div>

                            <Divider flexItem orientation="vertical" />

                            <div className={classes.textoCliente}>

                                <div>Puntos de Fidelidad </div>
                                <div className={classes.numberCliente} style={{ color: 'green' }}><LoyaltyIcon /> 0</div>

                            </div>

                            <Divider flexItem orientation="vertical" />

                            <div className={classes.textoCliente}>
                                <div>  Pagos Atrasados </div>
                                <div className={classes.numberCliente} style={{ color: 'red' }}><WarningIcon />0</div>
                            </div>
                        </div>

                    </div>
                </Grid>

                {
                    //#endregion Datos Cliente
                }

            </div>

            <div className={classes.seccionStockStock} >

                {
                    //#region Search Producto
                }



                <Autocomplete
                    autoComplete
                    clearOnBlur
                    fullWidth
                    clearOnEscape
                    size='small'
                    noOptionsText=''
                    clearText='Limpiar Producto'
                    options={dataStock}
                    filterOptions={(options, params) => {
                        let filtered = filterProducto(options, params)

                        if (filtered.length === 1) {
                            beep()
                            setTimeout(() => {
                                setInputBlur()
                                setProductoSeleccionado(filtered[0])
                            }, 50)


                        }
                        return filtered
                    }}
                    value={productoSeleccionado}
                    onChange={(e, newValue) => {
                        if (newValue)
                            beep()
                        setProductoSeleccionado(newValue)
                    }}
                    inputValue={productoSearchText}
                    onInputChange={(event, newInputValue) => { setProductoSearchText(newInputValue.replace('!', '')) }}

                    getOptionLabel={option => (option && option.Producto) ? option.Producto : ''}
                    renderOption={option => <h4>  {option.Producto}</h4>}
                    renderInput={params => <TextField autoFocus className={classes.nombreProducto} inputRef={inputRef}  {...params} label='Producto' variant="outlined" />}
                />




                {
                    //#endregion Search Producto
                }

                {
                    //#region PRECIOS
                }
                <Grid container direction="column" spacing={1} >

                    {productoSeleccionado &&
                        <Grid item container style={{ justifyContent: 'space-evenly' }}>

                            {!isNaN(parseInt(productoSeleccionado.PrecioVentaContadoMayorista)) && clienteSeleccionado && localStorage.UserRole === 'admin' &&

                                <Grid item sm={6} lg={4} >
                                    <Card className={classes.preciosCard}>
                                        <div style={{ fontSize: '0.8rem' }}>Precio Mayorista</div>
                                        <div style={{ fontSize: '1rem' }}>   {formater.format(productoSeleccionado.PrecioVentaContadoMayorista)}  </div>


                                        <div style={{ display: 'flex', padding: '5px', justifyContent: 'space-around' }}>
                                            <TextField

                                                label="Cantidad"

                                                variant="outlined"

                                                inputProps={{ min: 1, max: productoSeleccionado.Cantidad, style: { padding: '5px' } }}

                                                value={cantidad}
                                                margin='none'
                                                size='small'
                                                error={cantidadError}
                                                onChange={(e) => {
                                                    let cant = parseInt(e.target.value.replace(/\D/g, ''))

                                                    if (isNaN(cant) || cant === 0 || cant < 0)

                                                        setCantidad('')
                                                    else if (cant > productoSeleccionado.Cantidad) {
                                                        setCantidadError(true)
                                                        setTimeout(() => {
                                                            setCantidadError(false)
                                                            setCantidad(productoSeleccionado.Cantidad)
                                                        }, 1000)
                                                    }


                                                    else
                                                        setCantidad(cant)
                                                }}

                                            />
                                            <Button variant='contained' color='secondary' style={{ padding: '0px 5px', minWidth: '30px' }}
                                                onClick={e => {
                                                    if (cantidad && !isNaN(parseInt(cantidad)))
                                                        addCart('PrecioVentaContadoMayorista')
                                                    else {
                                                        setCantidadError(true)
                                                        setTimeout(() => {
                                                            setCantidadError(false)
                                                            setCantidad(1)
                                                        }, 1000)
                                                    }

                                                }}>Añadir</Button>
                                        </div>

                                    </Card>

                                </Grid>
                            }

                            {!isNaN(parseInt(productoSeleccionado.PrecioVentaContadoMinorista)) &&
                                <Grid item sm={6} lg={4}>
                                    <Button fullWidth onClick={e => { addCart('PrecioVentaContadoMinorista') }}>
                                        <Card className={classes.preciosCard}>
                                            <div style={{ fontSize: '0.8rem' }}>Precio al Contado</div>
                                            <div style={{ fontSize: '1rem' }}>
                                                {formater.format(productoSeleccionado.PrecioVentaContadoMinorista)}  </div>
                                            <div style={{ fontSize: '0.8rem' }}> Pago único</div>
                                        </Card>
                                    </Button>
                                </Grid>
                            }

                            {!isNaN(parseInt(productoSeleccionado.PrecioVenta3Cuotas)) && clienteSeleccionado &&
                                <Grid item sm={6} lg={4}>
                                    <Button fullWidth

                                        onClick={e => { addCart('PrecioVenta3Cuotas') }}>
                                        <Card className={classes.preciosCard}>
                                            <div style={{ fontSize: '0.8rem' }}>Precio 3 cuotas</div>
                                            <div style={{ fontSize: '1rem' }}>
                                                {formater.format(productoSeleccionado.PrecioVenta3Cuotas) + ' x 3'}  </div>
                                            <div style={{ fontSize: '0.8rem' }}>
                                                {formater.format((3 * parseInt(productoSeleccionado.PrecioVenta3Cuotas)))}</div>
                                        </Card>
                                    </Button>
                                </Grid>}

                            {!isNaN(parseInt(productoSeleccionado.PrecioVenta6Cuotas)) && clienteSeleccionado &&
                                <Grid item sm={6} lg={4} >
                                    <Button fullWidth

                                        onClick={e => { addCart('PrecioVenta6Cuotas') }}>
                                        <Card className={classes.preciosCard}>
                                            <div style={{ fontSize: '0.8rem' }}>Precio 6 cuotas</div>
                                            <div style={{ fontSize: '1rem' }}>
                                                {formater.format(productoSeleccionado.PrecioVenta6Cuotas) + ' x 6'}  </div>
                                            <div style={{ fontSize: '0.8rem' }}>
                                                {formater.format((6 * parseInt(productoSeleccionado.PrecioVenta6Cuotas)))}</div>
                                        </Card>
                                    </Button>
                                </Grid>}

                            {!isNaN(parseInt(productoSeleccionado.PrecioVenta12Cuotas)) && clienteSeleccionado &&
                                <Grid item sm={6} lg={4} >
                                    <Button fullWidth

                                        onClick={e => { addCart('PrecioVenta12Cuotas') }}>
                                        <Card className={classes.preciosCard}>
                                            <div style={{ fontSize: '0.8rem' }}>Precio 12 cuotas</div>
                                            <div style={{ fontSize: '1rem' }}>
                                                {formater.format(productoSeleccionado.PrecioVenta12Cuotas) + ' x 12'}  </div>
                                            <div style={{ fontSize: '0.8rem' }}>
                                                {formater.format((12 * parseInt(productoSeleccionado.PrecioVenta12Cuotas)))}</div>
                                        </Card>
                                    </Button>
                                </Grid>}

                            {!isNaN(parseInt(productoSeleccionado.PrecioVenta18Cuotas)) && clienteSeleccionado &&
                                <Grid item sm={6} lg={4} >
                                    <Button fullWidth

                                        onClick={e => { addCart('PrecioVenta18Cuotas') }}>
                                        <Card className={classes.preciosCard}>
                                            <div style={{ fontSize: '0.8rem' }}>Precio 18 cuotas</div>
                                            <div style={{ fontSize: '1rem' }}>
                                                {formater.format(productoSeleccionado.PrecioVenta18Cuotas) + ' x 18'}  </div>
                                            <div style={{ fontSize: '0.8rem' }}>
                                                {formater.format((18 * parseInt(productoSeleccionado.PrecioVenta18Cuotas)))}</div>
                                        </Card>
                                    </Button>
                                </Grid>}


                            {!isNaN(parseInt(productoSeleccionado.PrecioVenta24Cuotas)) && clienteSeleccionado &&
                                <Grid item sm={6} lg={4} >
                                    <Button fullWidth

                                        onClick={e => { addCart('PrecioVenta24Cuotas') }}>
                                        <Card className={classes.preciosCard}>
                                            <div style={{ fontSize: '0.8rem' }}>Precio 24 cuotas</div>
                                            <div style={{ fontSize: '1rem' }}>
                                                {formater.format(productoSeleccionado.PrecioVenta24Cuotas) + ' x 24'}  </div>
                                            <div style={{ fontSize: '0.8rem' }}>
                                                {formater.format((24 * parseInt(productoSeleccionado.PrecioVenta24Cuotas)))}</div>
                                        </Card>
                                    </Button>
                                </Grid>}
                        </Grid>

                    }

                </Grid>

                {
                    //#endregion PRECIOS
                }

            </div>

        </Grid>


        {
            //#endregion
        }

        {
            //#region Right Panel ----------------------------------------------
        }
        <Grid item xs={12} sm={12} md={6} className={classes.rightContainer} >


            {
                //#region Listado de StockStock Comprados ----------------------------------------------
            }


            <div style={{ borderRadius: '10px', padding: '10px', backgroundColor: 'gray', height: '30vh', overflowY: 'auto' }}>

                <DataTable
                    style={{ borderRadius: '10px', overflowX: 'hidden' }}
                    columns={cols}
                    noDataComponent={<AddShoppingCartIcon color='primary' />}
                    data={carritoList}
                    highlightOnHover
                    noHeader
                    noTableHead

                />


            </div>

            {
                //#endregion Listado de StockStock Comprados
            }


            {
                //#region Acciones de Compra ----------------------------------------------
            }
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                <div>
                    <TextField
                        label="Pagado"
                        fullWidth
                        variant="outlined"
                        style={{ flexGrow: "1" }}
                        value={pagado === 0 || pagado.toString().length === 0 ? '' : formater.format(pagado)}
                        margin='normal'
                        onChange={(e) => {
                            let texto = e.target.value.replace(/\D/g, '')

                            setPagado(texto)
                        }}
                        onKeyDown={k => {
                            if (k.key === "Enter" && parseInt(pagado) > importeTotal)
                                pagarCuenta()

                        }}

                    />


                </div>
                <div style={{ margin: '10px', padding: '10px' }}>

                    <div className={classes.numberCliente}>
                        <div> Pagado : </div>
                        <div >{isNaN(parseInt(pagado)) ? '' : formater.format(parseInt(pagado))} </div>
                    </div>

                    <div className={classes.numberCliente}>
                        <div> Importe Total : </div>
                        <div>{importeTotal === 0 ? '' : formater.format(importeTotal)} </div>
                    </div>

                    <hr />
                    <div className={classes.numberCliente}>
                        <div> Cambio : </div>
                        <div>{isNaN(parseInt(pagado)) || parseInt(pagado) < importeTotal ? '' : formater.format(parseInt(pagado) - importeTotal)} </div>
                    </div>

                </div>
                <div>
                    <Button variant='contained' fullWidth
                        disabled={carritoList.length === 0 || isNaN(parseInt(pagado)) || parseInt(pagado) < importeTotal}
                        color='secondary' onClick={() => {
                            if (!pagando)
                                pagarCuenta()
                        }}>{pagando ? 'Pagando...' : 'Pagar'}</Button>
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
            openPopup={openFormAddCliente}
            setOpenPopup={setOpenFormAddCliente}

            formData={formDataAddClient}
            SetFormData={setFormDataAddCliente}

            data={dataClientes}
            setData={setDataClientes}

            recolocaEditItem={() => { }}
            cargaData={() => {
                refFijarValue.current = true
                cargaData()
            }

            }
        />

        {
            //#endregion Form Add Cliente ----------------------------------------------
        }
        {/* carritoList.length > 0 && */}
        {<div style={{ display: 'none' }} className={'CODEBAR'}>
            <Barcode value={"12345678"} />
        </div>}
    </Grid >
}
export default Ventas
