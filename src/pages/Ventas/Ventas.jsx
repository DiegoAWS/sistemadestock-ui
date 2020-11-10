import React, { useState, useEffect, useRef } from "react"
import DataTable from 'react-data-table-component'

import { jsPDF } from "jspdf"


import Barcode from 'react-barcode'

import format from 'date-fns/format'

import swal from 'sweetalert';

// MUI--------------------
import { makeStyles, Grid, TextField, Typography, IconButton, Button, Divider } from "@material-ui/core"
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'


import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import AddIcon from "@material-ui/icons/Add"
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info'
import EditIcon from '@material-ui/icons/Edit'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import WarningIcon from '@material-ui/icons/Warning'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

//MUI---------------------

import { getRequest, postRequest } from '../../API/apiFunctions'
import FormAddCliente from '../../components/FormAdd/FormAddCliente'
import FormVentasCuotas from './FormVentasCuotas/FormVentasCuotas'

import loadingGif from '../../assets/images/loading.gif'

import shortid from 'shortid'

import ButtonCuota from './FormVentasCuotas/ButtonCuota'


const formater = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
});


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
    seccionStock: {
        border: '1px solid black',
        padding: '10px',
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
    buttonCard: {
        display: 'block',
        backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);',
        height: '100%'
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
    condicionPagoContainer: {
        border: '1px solid black',
        borderRadius: '10px'
    },
    condicionDePago: {
        margin: '0px',
        borderRadius: '10px 10px 0px 0px',
        textAlign: 'center',
        backgroundColor: '#86fff1',

    },
    iconBack: {
        position: 'absolute',
        left: '0',
        top: '0',
        bottom: '0',
        padding: '0px'
    },
    preciosMayoristas: {
        border: '1 solid black',
        borderRadius: '5px'
    },
    mayoristaHeader: {
        borderRadius: '10px 10px 0px 0px',
        backgroundColor: '#86fff1',
        display: 'flex',
        justifyContent: 'space-around',
        fontWeight: 'bold',
        position: 'relative'
    },
    entrada: {
        margin: '5px',
        padding: '5px',
        borderRadius: '10px',
        backgroundImage: 'linear-gradient(50deg, #ff4444 0%, #ffcfce 74%);',
    }

}))

//#endregion JSS


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
    //#endregion

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
        ['Garantia', 'Garantía', 'varchar'],
        ['Factura', 'Factura de Compra', 'varchar'],
        ['FechaCompra', 'Fecha de Compra', 'datetime'],
        ['CostoUnitario', 'Costo Unitario', 'double'],
        ['PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'autoRellenar'],
        ['PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double'],
        ['EntradaInicial', 'Entrada Inicial', 'double'],
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

    const [formDetails, setFormDetails] = useState(false)
    const [ventaCuotas, setVentaCuotas] = useState(false)

    const [cantidadError, setCantidadError] = useState(false)

    const [compraSinPago, setCompraSinPago] = useState(false)

    const [cuotas, setCuotas] = useState(3)

    const [loading, setLoading] = useState(false)

    //#endregion State

    const refFijarValue = useRef(false)

    //#region UseEffect


    // eslint-disable-next-line 
    useEffect(() => { cargaData() }, [])


    useEffect(() => {
        let t = 0
        carritoList.forEach(item => {
            if (!isNaN(parseInt(item.subTotal)))
                t = t + parseInt(item.subTotal)
        })


        if (carritoList.length === 0) {
            setImporteTotal(0)
            setCompraSinPago(false)
        }
        else {

            if (t > 0) {
                setImporteTotal(t)
                setCompraSinPago(false)
            }
            else {
                setImporteTotal(0)
                setCompraSinPago(true)

            }
        }
    }, [carritoList])

    useEffect(() => {

        if (!productoSeleccionado)
            setFormDetails(false)
    }, [productoSeleccionado])

    //#endregion

    //#region Carga Data
    const cargaData = () => {
        setLoading(false)

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
        var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=")
        snd.play()
    }
    //#endregion

    //#region Carrito 

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
                id: shortid.generate()
            }))

            setTimeout(() => {
                setFormDetails(false)
                setCantidad(1)
                setProductoSeleccionado(null)
            }, 200)


        }
    }


    const addCartCUOTAS = (listaDeDiasDePago, diaPrimerPago) => {

        let key = ''

        switch (listaDeDiasDePago.length) {
            case 3:
                key = 'PrecioVenta3Cuotas'
                break
            case 6:
                key = 'PrecioVenta6Cuotas'
                break
            case 12:
                key = 'PrecioVenta12Cuotas'
                break
            case 18:
                key = 'PrecioVenta18Cuotas'
                break
            case 24:
                key = 'PrecioVenta24Cuotas'
                break

            default:
                throw new Error("Error Cantidada de CUOTAS")
        }

        let d = new Date()


        let Texto = key
        let produtoSel = { ...productoSeleccionado }
        let debePagar = parseInt(produtoSel[key])

        let pagar = 0



        // Serilizacion  key | fecha de pago $ debe pagar $ Fecha que realmente pago $ Cantidad que realmente pago|... x Veces, por cada Cuota
        //HOY
        // Ej PrecioVenta3Cuotas|2020-10-25$50000$2020-10-25|2020-10-26$50000$|2020-10-27$50000$|
        listaDeDiasDePago.forEach((item, i) => {

            if (productoSeleccionado.EntradaInicial && i === 0)
                Texto = Texto + '|' + format(item, "yyyy-MM-dd") + '$' + productoSeleccionado.EntradaInicial + '$'
            else
                Texto = Texto + '|' + format(item, "yyyy-MM-dd") + '$' + debePagar + '$'

            if (i === 0 && diaPrimerPago.getDate() === d.getDate() && diaPrimerPago.getMonth() === d.getMonth() && diaPrimerPago.getYear() === d.getYear()) {
                // SI el dia de Pago es HOY 

                Texto = Texto + format(d, "yyyy-MM-dd")

            }

        })

        if (diaPrimerPago.getDate() === d.getDate() && diaPrimerPago.getMonth() === d.getMonth() && diaPrimerPago.getYear() === d.getYear()) {

            if (productoSeleccionado.EntradaInicial)
                pagar = productoSeleccionado.EntradaInicial
            else
                pagar = parseInt(produtoSel[key])
        }

        setCarritoList(carritoList.concat({
            ...produtoSel,
            Pago: Texto,
            cantidadComprada: 1,
            subTotal: pagar,
            idStock: produtoSel.id,
            id: shortid.generate()
        }))
        setTimeout(() => {
            setFormDetails(false)
            setCantidad(1)
            setProductoSeleccionado(null)
        }, 200)

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

        //#region Comprobacion de Cantidad en Stock
        getRequest('/ventasonlystock')
            .then(responseStock => {
                if (responseStock && responseStock.data) {


                    let stockFull = responseStock.data

                    carritoList.forEach(item => {

                        let Prod = stockFull.filter(st => st.id === item.idStock)

                        if (Prod.length !== 1) {
                            swal('ERROR')
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
                    //#endregion

                    if (errorCantidad.length > 0) {
                        swal('ERROR \n No hay suficiente en Stock de \n \n' + errorCantidad)
                        setCarritoList([])
                        setPagando(false)
                    }
                    else {


                        let clienteNombre = 'Cliente de Contado'
                        if (clienteSeleccionado && clienteSeleccionado.id)

                            clienteNombre = clienteSeleccionado.id


                        postRequest('/ventas', { productos: carritoList, cliente: clienteNombre })
                            .then(response => {
                                setPagando(false)

                                if (response && response.data) {

                                    console.log(response.data.Ventas)//IMPRIMIR COMPROBANTES


                                    ImprimirComprobante()

                                    ImprimirGarantia(clienteNombre)
                                    setCarritoList([])
                                    setPagando(false)
                                    setPagado('')
                                }


                            })

                    }



                }
            })






    }
    //#endregion

    //#region PRINT

    //#region CODEBAR EXTRACTION

    /*
        const getCodebarURI = i => {
            let canvas = document.createElement('canvas')
            let svg = document.getElementById('b-' + i).innerHTML
    
            if (svg)
                svg = svg.replace(/\r?\n|\r/g, '').trim()
    
    
            let ctx = canvas.getContext('2d')
    
            let v = Canvg.fromString(ctx, svg)
    
            v.start()
    
    
            return canvas.toDataURL('image/png')
        }
    */
    //#endregion

    //#region Imprimir Comprobante

    const listaDeProductos = () => {
        let sal = ''

        carritoList.forEach(item => {
            sal = sal + item.Producto.substring(0, 30) + '\n' + formater.format(item.subTotal) + '\n\n'
        })
        return sal
    }

    // eslint-disable-next-line
    const ImprimirComprobante = () => {
        // let imgData = getCodebarURI(0)

        let d = new Date()

        //#region TEXTO

        var imgLogoURI = 'data:image/png;base64,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'


        var texto = `
************RECIBO DE PAGO************
NUMERO DE RECIBO : ????????
FECHA: ${d.getDate() + '/' + (1 + 1 * d.getMonth()) + '/' + d.getFullYear() + ' HORA: ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()}
USUARIO: ${localStorage.getItem('UserOficialName')}

***********************************************
CEDULA DE IDENTIDAD: ${clienteSeleccionado && clienteSeleccionado.Cedula ? clienteSeleccionado.Cedula : '---'}
CLIENTE: ${clienteSeleccionado && clienteSeleccionado.Nombre ? clienteSeleccionado.Nombre : '---'}
N° DE FACTURA: ????????
N° DE VENTA: ????????

PRODUCTO
${listaDeProductos()}***********************************************
DEBE PAGAR : ${formater.format(importeTotal)}
#################################
USTED PAGO  : ${formater.format(pagado)}
#################################
CAMBIO : ${formater.format((parseInt(pagado) - parseInt(importeTotal)).toString())}

***********************************************
¡GRACIAS POR SU COMPRA!
***********************************************
????????
NUMERO DE REFERENCIA DE PAGO
ESTE ES SU COMPROBANTE DE PAGO 
CONSERVELO
***********************************************
ESPACIO PARA MENSAJE OPCIONAL
COMO PROXIMO DIA DE OFERTAS O SIMILARES`

        //#endregion

        var doc = new jsPDF({ unit: "mm", format: [80, 180] })
        doc.autoPrint()

        doc.addImage(imgLogoURI, 'JPEG', 11, 4, 60, 30)
        doc.setFontSize(10)
        doc.text(texto, 40, 40, null, null, 'center')

        doc.output('dataurlnewwindow', 'Comprobante de Pago')
    }

    //#endregion

    //#region Imprimir Garantia

    // eslint-disable-next-line
    const ImprimirGarantia = (cliente) => {

        let d = new Date()

        //#region TEXTO

        var imgLogoURI = 'data:image/png;base64,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'


        var texto1 = `El periodo de garantía inicia en la fecha de entrega del producto adquirido, indicada en este documento. Para el uso de la garantía es necesario presentar la factura de venta proporcionada por la empresa, en caso de extravío o perdida de la factura se abonará una multa de Gs 30.000 por gastos administrativos y reimpresión. Todos nuestros productos están registrados por números de series, seriales o imei.
Si el producto fue adquirido en cuotas, es necesario estar al día con sus compromisos de pagos para ser beneficiario de todas las GARANTÍAS que ofrece la empresa, sin excepciones.`

        var texto2 = `La garantía no cubre las fallas, cuando estas son causadas por fenómenos naturales, como terremotos, inundaciones, tormentas eléctricas, etc; o por situaciones accidentales o provocadas por incendios, fluctuaciones del voltaje o corriente, robos; como tampoco cuando las mercaderías presenten adulteración del número de serie o que cuenten con el sello de seguridad violado.
Si la mercadería presenta señales de haber sido revisado por personal y/o taller no autorizado. 
Si en el momento de la conexión de la mercadería, ha sido conectado a una corriente distinta a la indicada en el producto. 
Si presenta señales de uso indebido, mal trato, golpes, caídas, rayaduras, raspones, fisuras, grietas por más mínimas que estas fueran.
En el caso de productos electrónicos la garantía no cubrirá daños ocasionados por la no instalación de antivirus.
En ningún caso la garantía cubre el mantenimiento del producto, esto es responsabilidad exclusiva del cliente.
Los accesorios de los productos NO TIENEN GARANTIA, ejemplo, control remoto, control para juegos electrónicos, cargadores de celulares, tablets y notebooks, fuentes de energía, productos en condición de regalo, carcazas, vidrios templados, fundas.
En los aires acondicionados, la empresa no se hace responsable por la mala instalación realizadas por técnicos no autorizado por nuestra empresa, ni las consecuencias que esta pudiera ocasionar (perdida de gas en instalación, mal funcionamiento general, placas dañadas).
En las cocinas tanto a gas como vitroceramica y a inducción no cubre roturas de vidrios, tapa, puerta y perillas.
En los corta césped, desmalezadoras, bordeadoras y motosierras no incluye el cambio de rulemanes, tornillos o cuchillas; en los casos del motor dañado por exceso de uso (tomando como parámetro las recomendaciones del fabricante), ejes de rotor descentrado por golpes, etc. En las heladeras, no contempla la rotura de las gomas o del tirador de la puerta y/o de los recipientes.
En los televisores, no cubre el quiebre de pantallas, controles, fuentes de energía ni accesorios. Asi también la instalación de aplicaciones potencialmente dañinas para el televisor Smart.
En los celulares y/o Smartphone, no cubre rotura de display, cargadores, auriculares y/o accesorios. La garantía en celulares queda nula si el producto es sumergidos en líquidos, aunque este fuere sumergible.
En los lavarropas, no cubre el quiebre de las perillas, del tirador de la puerta, de los burletes, o de la tapa.
La empresa no se hace responsable de las consecuencias derivadas de la adquisición de productos para uso doméstico utilizados de forma comercial o industrial.
Los artículos de electrónicos: tablets, celulares, notebooks, etc, deben ser probados en el momento de la adquisición. Al momento de recibir su mercadería. Revise el producto en un plazo no mayor de 48 horas para realizar el reclamo correspondiente, luego de este plazo todas las mercaderías necesariamente deben entrar en servicio técnico de la marca para su verificación y/o reparación.
Para usufructuar la garantía debe acercar su producto a nuestro establecimiento ubicado en la ciudad de San Lorenzo Barrio Barcequillo en la calle Avda. Avelino Martínez N° 1724 c/ Teniente Benítez. También puede solicitar el retiro del producto desde su locación por nuestros colaboradores por un costo extra, quedando esto limitado a disponibilidad y rango de cobertura.`

        //#endregion



        var doc = new jsPDF({ unit: "mm", format: 'A4' })
        doc.autoPrint()

        carritoList.forEach((item, ind) => {

            doc.addImage(imgLogoURI, 'JPEG', 11, 4, 40, 20)

            doc.setFontSize(18)
            doc.setFont('serif', 'bold')
            doc.text('Términos y Condiciones de Garantía', 105, 16, 'center')

            doc.setFontSize(12)
            doc.setFont('serif', 'normal')
            doc.text(texto1, 15, 40, { align: 'justify', maxWidth: '180' })
            doc.text(texto2, 15, 85, { align: 'justify', maxWidth: '180' })

            doc.text('CLIENTE: ' + cliente, 17, 260)



            doc.text('FECHA DE COMPRA: ' + d.getDate() + '/' + (1 + 1 * d.getMonth()) + '/' + d.getFullYear(), 17, 267)
            doc.text('PRODUCTO: ' + item.Producto.substring(0, 30), 17, 274)
            doc.text('SERIAL / IMEI: ' + item.Codigo, 17, 281)
            doc.text('TIEMPO DE GARANTÍA: ' + textoGarantia(item.Garantia), 17, 288)

            doc.rect(128, 258, 64, 29)


            doc.text(`FIRMA Y SELLO\nVERA E HIJOS COMERCIAL`, 160, 280, 'center')

            doc.setFont('serif', 'bold')

            doc.text('Usted, pierde su derecho a la garantía automáticamente', 15, 75, 'justify')
            doc.rect(15, 255, 105, 35)
            doc.line(15, 262, 120, 262)
            doc.line(15, 269, 120, 269)
            doc.line(15, 276, 120, 276)
            doc.line(15, 283, 120, 283)
            doc.rect(125, 255, 70, 35)


            if (ind + 1 !== carritoList.length)
                doc.addPage('a4')
        })

        doc.output('dataurlnewwindow', 'Garantia')



    }
    //#endregion


    //#endregion

    //#region Texto Garantia
    const textoGarantia = oldGarantia => {

        const singularOpcGarantia = [['dia', 'day'], ['mes', 'month'], ['año', 'year']]
        const pluralOpcGarantia = [['dias', 'day'], ['meses', 'month'], ['años', 'year']]

        if (!oldGarantia || typeof oldGarantia !== 'string')
            return 'NO GARANTIA'


        const spl = oldGarantia.split(' ')


        if (spl.length === 2) {

            let day = spl[0]
            let temp = spl[1]
            if (day && !isNaN(parseInt(day)) && parseInt(day) < 32) {
                if (parseInt(day) === 1)
                    return day + ' ' + singularOpcGarantia.find(item => item[1] === temp)[0]
                else
                    return day + ' ' + pluralOpcGarantia.find(item => item[1] === temp)[0]
            }

        }

    }
    //#endregion

    //#region return 

    const clickButtonCuota = (cuotas) => {
        setFormDetails(true)
        setVentaCuotas(true)
        setCuotas(cuotas)
    }

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
                                }, 1000)


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
                            setFormDataAddCliente(initFormAddCliente)
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
                                        swal('Historial de Compras del Cliente')

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

            <div className={classes.seccionStock} >

                {
                    //#region Search Producto
                }

                <div style={{ display: 'flex' }}>
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
                                }, 1000)


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


                </div>


                {
                    //#endregion Search Producto
                }

                {
                    //#region PRECIOS
                }
                <Grid container direction="column" spacing={1} >

                    {
                        productoSeleccionado && <>



                            {formDetails ?
                                <>
                                    {
                                        ventaCuotas ?
                                            <FormVentasCuotas
                                                productoSeleccionado={productoSeleccionado}
                                                addCartCUOTAS={addCartCUOTAS}
                                                cuotas={cuotas}
                                                setCuotas={setCuotas}
                                            />


                                            : < div className={classes.preciosMayoristas} >
                                                {
                                                    //#region VENTA MAYORISTA
                                                }
                                                <div className={classes.mayoristaHeader} >

                                                    <IconButton color='secondary' className={classes.iconBack}
                                                        onClick={() => { setFormDetails(false) }} >
                                                        <ArrowBackIcon />
                                                    </IconButton>

                                                    <div style={{ fontSize: '0.8rem' }}>Precio Mayorista</div>
                                                    <div style={{ fontSize: '1rem' }}>   {formater.format(productoSeleccionado.PrecioVentaContadoMayorista)}  </div>
                                                </div>


                                                <div style={{ display: 'flex', padding: '5px', justifyContent: 'space-around' }}>
                                                    <TextField
                                                        inputProps={{ min: 1, max: productoSeleccionado.Cantidad, style: { padding: '5px' } }}
                                                        label="Cantidad" variant="outlined"
                                                        value={cantidad} margin='none'
                                                        size='small' error={cantidadError}
                                                        onChange={(e) => {
                                                            let cant = parseInt(e.target.value.replace(/\D/g, ''))
                                                            if (isNaN(cant) || cant === 0)
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
                                                        onBlur={e => {

                                                            if (e.target.value.toString().length === 0)

                                                                setCantidad(1)
                                                        }}

                                                    />
                                                    <Button variant='contained' color='secondary' style={{ padding: '0px 5px', minWidth: '30px' }}
                                                        onClick={e => {

                                                            if (cantidad && !isNaN(parseInt(cantidad))) {
                                                                addCart('PrecioVentaContadoMayorista')
                                                                setFormDetails(false)
                                                            }
                                                            else {
                                                                setCantidadError(true)
                                                                setTimeout(() => {
                                                                    setCantidadError(false)
                                                                    setCantidad(1)
                                                                }, 1000)
                                                            }

                                                        }}>Añadir</Button>
                                                </div>
                                                {
                                                    //#endregion
                                                }
                                            </div>

                                    }

                                </>

                                : <Grid item container direction='column' style={{ padding: '0px' }} className={classes.condicionPagoContainer}>

                                    <div className={classes.condicionDePago}>

                                        <h2 style={{ margin: '0px' }}>  Condición de Pago   </h2>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        {/* Venta Mayorista */}
                                        {!isNaN(parseInt(productoSeleccionado.PrecioVentaContadoMayorista)) && clienteSeleccionado && localStorage.UserRole === 'admin' &&

                                            <Grid item xs={12} sm={4}  >
                                                <Button fullWidth className={classes.buttonCard}
                                                    onClick={() => {
                                                        setFormDetails(true)
                                                        setVentaCuotas(false)
                                                    }}
                                                >
                                                    <div style={{ fontSize: '0.8rem' }}>Precio Mayorista</div>
                                                    <div style={{ fontSize: '1rem' }}>   {formater.format(productoSeleccionado.PrecioVentaContadoMayorista)}  </div>


                                                </Button>

                                            </Grid>
                                        }

                                        {/* Venta Minorista */}
                                        {!isNaN(parseInt(productoSeleccionado.PrecioVentaContadoMinorista)) &&
                                            <Grid item xs={12} sm={4} >
                                                <Button fullWidth onClick={e => { addCart('PrecioVentaContadoMinorista') }}
                                                    className={classes.buttonCard} >
                                                    <div style={{ fontSize: '0.8rem' }}>Precio al Contado</div>
                                                    <div style={{ fontSize: '1rem' }}>
                                                        {formater.format(productoSeleccionado.PrecioVentaContadoMinorista)}  </div>


                                                </Button>
                                            </Grid>
                                        }
                                    </div>

                                    {clienteSeleccionado &&
                                        <Grid item xs={12} style={{ padding: '0px' }} >
                                            <div style={{
                                                textAlign: 'center', backgroundColor: '#bfffff', margin: '10px 0px 0px', fontWeight: '600',
                                                border: '1px solid black', borderBottom: 'none', borderRadius: '10px 10px 0px 0px'
                                            }}>Precios por CUOTAS</div>

                                            <div style={{
                                                display: 'flex', justifyContent: 'space-evenly',
                                                flexWrap: 'wrap', border: '1px solid black',
                                                borderTop: 'none', borderRadius: '0px 0px 10px 10px'
                                            }}>

                                                {productoSeleccionado.EntradaInicial && <div className={classes.entrada}>{'ENTRADA: ' + formater.format(productoSeleccionado.EntradaInicial)}</div>}

                                                {productoSeleccionado.PrecioVenta3Cuotas && <ButtonCuota cuotas={cuotas} cuotasSel={3} producto={productoSeleccionado} click={clickButtonCuota} />}
                                                {productoSeleccionado.PrecioVenta6Cuotas && <ButtonCuota cuotas={cuotas} cuotasSel={6} producto={productoSeleccionado} click={clickButtonCuota} />}
                                                {productoSeleccionado.PrecioVenta12Cuotas && <ButtonCuota cuotas={cuotas} cuotasSel={12} producto={productoSeleccionado} click={clickButtonCuota} />}
                                                {productoSeleccionado.PrecioVenta18Cuotas && <ButtonCuota cuotas={cuotas} cuotasSel={18} producto={productoSeleccionado} click={clickButtonCuota} />}
                                                {productoSeleccionado.PrecioVenta24Cuotas && <ButtonCuota cuotas={cuotas} cuotasSel={24} producto={productoSeleccionado} click={clickButtonCuota} />}


                                            </div>
                                        </Grid>
                                    }
                                </Grid>
                            }

                        </>
                    }

                </Grid>

                {
                    //#endregion PRECIOS
                }

            </div>

        </Grid >


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
                            if (k.key === "Enter" && parseInt(pagado) > importeTotal && !pagando)
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
                        disabled={!compraSinPago && (carritoList.length === 0 || isNaN(parseInt(pagado)) || parseInt(pagado) < importeTotal)}
                        color='secondary' onClick={() => {
                            if (!pagando)
                                pagarCuenta()
                        }}>{compraSinPago ? 'Efectuar VENTA' : (pagando ? 'Pagando...' : 'Pagar')} {pagando && < img src={loadingGif} alt="" height='20px' />}</Button>
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

            showLoading={() => { setLoading(true) }}
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

        {
            //#region Carrito CODEBARS 
            carritoList.map((item, i) => (
                <div key={item.id} style={{ display: 'none' }}>
                    <div id={'b-' + i}>
                        <Barcode value={item.Codigo && item.Codigo.toString().length > 0 ? item.Codigo.toString() : 'SIN CODIGO'} />
                    </div>
                </div>

            ))
            //#endregion
        }


        {
            //#region Loading 
        }
        <div style={{
            position: 'fixed', top: '0', left: '0', height: '100vh', width: '100vw', zIndex: '100',
            backgroundColor: 'rgba(0,0,0,0.6)', display: loading ? 'flex' : 'none',
            justifyContent: 'center', alignItems: 'center'
        }}>
            <img src={loadingGif} alt="" height='30px' /></div>
        {
            //#endregion
        }

    </Grid >
    //#endregion
}
export default Ventas
