import React, { useState, useEffect, useRef } from 'react'
import { TextField, Grid, Button, InputAdornment, IconButton, Checkbox, MenuItem } from '@material-ui/core'

import Autocomplete from '@material-ui/lab/Autocomplete'

import { postRequest } from '../../API/apiFunctions'


import MoneyOffIcon from '@material-ui/icons/MoneyOff'
import AddIcon from "@material-ui/icons/Add"

import Popup from './Popup'
import FormAddProveedor from '../../components/FormAdd/FormAddProveedor'

import loadingGif from '../../assets/images/loading.gif'


import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'




import { dateToString, stringToDate } from '../../API/timeFunctions'

import 'react-datepicker/dist/react-datepicker.css'

import es from 'date-fns/locale/es'
registerLocale('es', es)
setDefaultLocale('es')




const FormAddStock = (
    {

        openPopup, setOpenPopup,
        openProveedorPopup, setOpenProveedorPopup,
        formStock, setFormStock,
        formProveedores, SetFormProveedores,
        dataStock, proveedores,
        loading, setLoading,
        cargaData, recolocaEditItem,
        ajustesPrecios, setAjustesPrecio

    }) => {


    //#region  CONST ----------------------------------





    //Error
    const [costoUniError, setCostoUniError] = useState(false)
    const [cantidadError, setCantidadError] = useState(false)
    const [codigoError, setCodigoError] = useState(false)

    //Entrada
    const [aplicaEntrada, setAplicaEntrada] = useState(!isNaN(parseInt(formStock.EntradaInicial)) && parseInt(formStock.EntradaInicial) > 0)
    //disabled 12 18 y 24 Cuotas
    const [disabled12, setdisabled12] = useState(formStock.PrecioVenta12Cuotas.toString().length === 0 || (isNaN(parseInt(formStock.PrecioVenta12Cuotas)) && formStock.PrecioVenta12Cuotas !== "X"))
    const [disabled18, setdisabled18] = useState(formStock.PrecioVenta18Cuotas.toString().length === 0 || isNaN(parseInt(formStock.PrecioVenta18Cuotas)))
    const [disabled24, setdisabled24] = useState(formStock.PrecioVenta24Cuotas.toString().length === 0 || isNaN(parseInt(formStock.PrecioVenta24Cuotas)))

    //GARANTIA    

    const [cantidadGarantia, setCantidadGarantia] = useState(formStock.Garantia.split(' ')[0])
    const [periodoGarantia, setPeriodoGarantia] = useState(formStock.Garantia.split(' ')[1])

    const singularOpcGarantia = [['dia', 'day'], ['mes', 'month'], ['año', 'year']]
    const pluralOpcGarantia = [['dias', 'day'], ['meses', 'month'], ['años', 'year']]
    const [opcGarantia, setOpcGarantia] = useState(singularOpcGarantia)



    //useRef--------


    const refCategorias = useRef([])
    const refMarcas = useRef([])
    const refColors = useRef([])
    const refProveedores = useRef([])

    const formInitProveedores = {
        Proveedor: '',
        Telefono: '',
        Email: '',
        Direccion: '',
        OtrosDatos: ''
    }
    //#endregion CONST

    //#region useEffect Actualiza Campos Automáticos

    useEffect(() => {
        AutoFillMoney(formStock.EntradaInicial)
        // eslint-disable-next-line
    }, [ajustesPrecios])

    //#endregion

    //#region useEffect Campos con MEMORIA :)

    useEffect(() => {

        refCategorias.current = dataStock.map(item => item.Categoria).filter((item, index, data) => data.indexOf(item) === index)
        refMarcas.current = dataStock.map(item => item.Marca).filter((item, index, data) => data.indexOf(item) === index)
        refColors.current = dataStock.map(item => item.Color).filter((item, index, data) => data.indexOf(item) === index)
        refProveedores.current = proveedores.map(item => item.Proveedor).filter((item, index, data) => data.indexOf(item) === index)

    }, [dataStock, proveedores])

    //#endregion 

    //#region useEffect precio Base
    //#endregion


    //#region  saveData ----------------------------------

    const saveData = () => {

        if (!formStock.Codigo || formStock.Codigo.length === 0) {
            setCodigoError(true)

            setTimeout(() => { setCodigoError(false) }, 1000)
            return

        }


        if (!formStock.CostoUnitario || formStock.CostoUnitario.length === 0) {
            setCostoUniError(true)

            setTimeout(() => { setCostoUniError(false) }, 1000)
            return

        }

        if (!formStock.Cantidad || formStock.Cantidad.length === 0) {
            setCantidadError(true)

            setTimeout(() => { setCantidadError(false) }, 1000)
            return

        }



        setLoading(true)



        var uri = '/stocks'
        let formDataOK = {
            ...formStock,
            Garantia: `${cantidadGarantia} ${periodoGarantia}`,
            EntradaInicial: aplicaEntrada ? "" : formStock.EntradaInicial,
            PrecioVenta12Cuotas: disabled12 ? "" : formStock.PrecioVenta12Cuotas,
            PrecioVenta18Cuotas: disabled18 ? "" : formStock.PrecioVenta18Cuotas,
            PrecioVenta24Cuotas: disabled24 ? "" : formStock.PrecioVenta24Cuotas
        }



        if (formStock.id)// Editing....
            uri = uri + '/' + formStock.id

        // disabled12

        postRequest(uri, formDataOK).then(() => {
            setCantidadGarantia(1)
            setPeriodoGarantia('month')
            setOpcGarantia(singularOpcGarantia)
            cargaData()

        })
    }

    //#endregion saveData



    //#region Autorrellena

    const autorrellena = () => {
        if (dataStock.length > 0 && dataStock[dataStock.length - 1]) {

            let oldForm = dataStock[dataStock.length - 1]

            setFormStock({ ...formStock, FechaCompra: oldForm.FechaCompra, Factura: oldForm.Factura, Proveedor: oldForm.Proveedor })

        }
    }

    //#endregion



    //#region  Estiliza como money String ----------------------------------

    const formater = new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
    });


    const EstilizaString = (s) => {
        if (!s)
            return ''

        let d = s.toString().replace(/\D/g, '')

        if (isNaN(parseInt(d)) || parseInt(d) === 0)
            return ''

        return formater.format(d)
    }

    //#endregion Estiliza como money String


    //#region  Auto Fill Money ----------------------------------

    const AutoFillMoney = (d) => {



        if (isNaN(parseInt(formStock.CostoUnitario)))
            return

        let entrada = parseInt(d)
        if (!aplicaEntrada || isNaN(entrada))
            entrada = 0


        let precioBase = parseInt(formStock.CostoUnitario) - entrada

        const ceiling = (value, cuotas) => {
            let parc = parseInt(value)
            let sec = (100 + parc) * precioBase
            let ceil = Math.ceil(sec / (cuotas * 50000))

            return ceil * 500
        }


        setFormStock({
            ...formStock,
            PrecioVentaContadoMayorista: ceiling(ajustesPrecios.pMayorista, 1),
            PrecioVentaContadoMinorista: ceiling(ajustesPrecios.pMinorista, 1),
            EntradaInicial: entrada === 0 ? '' : d,
            PrecioVenta3Cuotas: ceiling(ajustesPrecios.p3cuotas, 3),
            PrecioVenta6Cuotas: ceiling(ajustesPrecios.p6cuotas, 6),
            PrecioVenta12Cuotas: ceiling(ajustesPrecios.p12cuotas, 12),
            PrecioVenta18Cuotas: ceiling(ajustesPrecios.p18cuotas, 18),
            PrecioVenta24Cuotas: ceiling(ajustesPrecios.p24cuotas, 24),
        })

    }

    //#endregion Auto Fill Money


    const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (<TextField ref={ref} label='Fecha de Compra' variant="outlined" margin='normal' size="small" value={value} fullWidth onClick={onClick} />))

    return (
        <Popup
            openPopup={openPopup} setOpenPopup={setOpenPopup} saveData={saveData}
            title={(formStock.id) ? 'Editar Stock' : 'COMPRA'} recolocaEditItem={recolocaEditItem}      >      <>

                {
                    //#region Proveedor Info
                }
                <Button hidden={dataStock && dataStock.length > 0} variant='contained'
                    color='primary' size='small' onClick={() => { autorrellena() }} style={{ float: 'right' }} >
                    Ultimo
                </Button>

                <Grid container style={{ border: '1px solid black', borderRadius: '10px', marginBottom: '10px', padding: '10px' }}>
                    <Grid item xs={12} sm={12} md={5} style={{ padding: '0 10px', display: 'flex', alignItems: 'baseline' }} >

                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={refProveedores.current}
                            value={formStock.Proveedor && formStock.Proveedor.length > 0 ? formStock.Proveedor : null}
                            noOptionsText={'Proveedor no encontrado'}
                            onChange={(event, newInputValue) => { setFormStock({ ...formStock, Proveedor: newInputValue }) }}
                            renderInput={(params) => <TextField {...params} label="Proveedor" variant="outlined" margin="normal" size="small" />}
                        />
                        <IconButton onClick={() => {
                            SetFormProveedores(formInitProveedores)
                            setOpenProveedorPopup(true)
                        }}

                            size='small'
                            title='Añadir Proveedor Nuevo'>

                            <AddIcon color='primary' />
                        </IconButton>

                    </Grid>

                    <Grid item xs={12} sm={6} md={3} style={{ padding: '0 10px' }} >

                        <DatePicker
                            selected={stringToDate(formStock.FechaCompra)}
                            onChange={date => { setFormStock({ ...formStock, FechaCompra: dateToString(date) }) }}
                            showTimeInput
                            timeInputLabel="Hora:"
                            withPortal
                            
                            showMonthDropdown
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            todayButton="Hoy"
                            customInput={<CustomDateInput />}
                        />
                    </Grid>


                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <TextField label='Factura de Compra' variant="outlined" margin='normal' size="small"
                            fullWidth
                            value={formStock.Factura} onChange={e => { setFormStock({ ...formStock, Factura: e.target.value }) }} />
                    </Grid>
                </Grid>
                {
                    //#endregion
                }
                {
                    //#region Producto
                }

                <Grid container style={{ justifyContent: 'space-around', border: '1px solid black', borderRadius: '10px', marginBottom: '10px', paddingTop: '10px' }}>
                    {
                        //#region Detalles del Producto
                    }


                    <Grid item xs={12} sm={4} md={3} style={{ padding: '0 10px' }}>
                        <Autocomplete
                            freeSolo
                            value={formStock.Categoria}
                            onChange={(event, newInputValue) => { setFormStock({ ...formStock, Categoria: newInputValue ? newInputValue : '' }) }}
                            inputValue={formStock.Categoria}
                            onInputChange={(event, newInputValue) => { setFormStock({ ...formStock, Categoria: newInputValue }) }}
                            options={refCategorias.current}
                            renderInput={(params) => <TextField {...params} label="Categoria" variant="outlined" margin="normal" size="small" fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={8} md={6} style={{ padding: '0 10px' }}>
                        <TextField label='Producto' variant="outlined" margin='normal' size="small" fullWidth
                            value={formStock.Producto}
                            onChange={e => { setFormStock({ ...formStock, Producto: e.target.value }) }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} style={{ padding: '0 10px' }}>
                        <TextField label='Código' variant="outlined" margin='normal' size="small" fullWidth error={codigoError}
                            value={formStock.Codigo} onChange={e => { setFormStock({ ...formStock, Codigo: e.target.value }) }} />
                    </Grid>




                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }} >
                        <TextField label='Cantidad' variant="outlined" margin='normal' size="small" fullWidth error={cantidadError}
                            value={formStock.Cantidad} onChange={e => { setFormStock({ ...formStock, Cantidad: e.target.value.replace(/\D/g, '') }) }} />
                    </Grid>


                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <Autocomplete
                            freeSolo
                            value={formStock.Marca}
                            inputValue={formStock.Marca ? formStock.Marca : ''}
                            onInputChange={(event, newInputValue) => { setFormStock({ ...formStock, Marca: newInputValue }) }}
                            options={refMarcas.current}
                            renderInput={(params) => <TextField {...params} label="Marca" variant="outlined" margin="normal" size="small" fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <Autocomplete
                            freeSolo
                            value={formStock.Color}
                            inputValue={formStock.Color ? formStock.Color : ''}
                            onInputChange={(event, newInputValue) => { setFormStock({ ...formStock, Color: newInputValue }) }}
                            options={refColors.current}
                            renderInput={(params) => <TextField {...params} label="Color" variant="outlined" margin="normal" size="small" fullWidth />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} style={{ padding: '8px 10px 0px', display: 'flex', alignItems: 'baseline' }}>

                        <TextField
                            fullWidth
                            label="Garantía"
                            variant="outlined"
                            inputProps={{ min: 1, max: 100 }}
                            value={cantidadGarantia}
                            margin='none'
                            size='small'
                            onChange={(e) => {
                                let cant = parseInt(e.target.value.replace(/\D/g, ''))

                                if (isNaN(cant) || cant === 0 || cant < 0)

                                    setCantidadGarantia('')
                                else if (cant > 100) {
                                    setCantidadGarantia(1)
                                    setOpcGarantia(singularOpcGarantia)
                                }
                                else
                                    setCantidadGarantia(cant)

                                if (cant > 1)
                                    setOpcGarantia(pluralOpcGarantia)
                                else
                                    setOpcGarantia(singularOpcGarantia)
                            }}

                        />

                        <TextField
                            select
                            disabled={cantidadGarantia.toString().length === 0}
                            fullWidth
                            margin='none'
                            size='small'
                            value={periodoGarantia}
                            onChange={e => { setPeriodoGarantia(e.target.value) }}

                            variant="outlined"
                        >
                            {opcGarantia.map((option) => (
                                <MenuItem key={option[1]} value={option[1]}>
                                    {option[0]}
                                </MenuItem>
                            ))}
                        </TextField>


                    </Grid>
                    {
                        //#endregion
                    }
                    {
                        //#region Costo y Precios  Simples
                    }
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px' }}>
                        <TextField label='Costo Unitario' variant="outlined" margin='normal' size="small" fullWidth error={costoUniError}
                            value={EstilizaString(formStock.CostoUnitario)}
                            onChange={e => {
                                let d = e.target.value.replace(/\D/g, '')
                                if (d.length === 0 || parseInt(d) === 0)
                                    setAplicaEntrada(false)

                                setFormStock({ ...formStock, CostoUnitario: parseInt(d) === 0 ? '' : d })

                            }}

                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={e => { AutoFillMoney(formStock.EntradaInicial) }}
                                        disabled={isNaN(parseInt(formStock.CostoUnitario))}
                                        color='secondary' title='Autorellenar Precios'>
                                        <MoneyOffIcon />  </IconButton>  </InputAdornment >
                            }}
                        />
                    </Grid>
                    {/* Venta Mayorista */}
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px', display: 'flex', alignItems: 'baseline' }}>

                        <TextField label='Precio Mayorista' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVentaContadoMayorista)}

                            onChange={e => { setFormStock({ ...formStock, PrecioVentaContadoMayorista: e.target.value.replace(/\D/g, '') }) }}


                        />
                        <TextField variant="outlined" value={'+' + ajustesPrecios.pMayorista + '%'}
                            inputProps={{ style: { width: '5rem', textAlign: 'center' } }}
                            size='small'
                            onChange={e => {
                                let d = e.target.value.replace(/[^0-9.]/g, '')
                                if (d < 0)
                                    d = 0
                                if (d > 500)
                                    d = 500
                                setAjustesPrecio({ ...ajustesPrecios, pMayorista: d })
                            }} />
                    </Grid>
                    {/* Venta Minorista */}
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px', display: 'flex', alignItems: 'baseline' }}>
                        <TextField label='Precio Venta Contado' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVentaContadoMinorista)}
                            onChange={e => { setFormStock({ ...formStock, PrecioVentaContadoMinorista: e.target.value.replace(/\D/g, '') }) }}

                        />
                        <TextField variant="outlined" value={'+' + ajustesPrecios.pMinorista + '%'}
                            inputProps={{ style: { width: '5rem', textAlign: 'center' } }}
                            size='small'
                            onChange={e => {
                                let d = e.target.value.replace(/[^0-9.]/g, '')
                                if (d < 0)
                                    d = 0
                                if (d > 500)
                                    d = 500
                                setAjustesPrecio({ ...ajustesPrecios, pMinorista: d })
                            }} />
                    </Grid>
                    {
                        //#endregion
                    }
                    {
                        //#region Ventas Por Cuotas
                    }

                    {/* EntradaInicial */}
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px' }}>
                        <TextField label={aplicaEntrada ? 'Entrada Inicial' : 'Entrada Inicial Deshabilitado'} variant="outlined" margin='normal' size="small" fullWidth
                            value={aplicaEntrada ? EstilizaString(formStock.EntradaInicial) : ''}
                            disabled={!aplicaEntrada}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <Checkbox checked={aplicaEntrada}
                                        onChange={() => {
                                            if (!aplicaEntrada && isNaN(parseInt(formStock.CostoUnitario))) {
                                                alert('Debe Establecer primero un COSTO UNITARIO')
                                                return
                                            }
                                            if (aplicaEntrada)
                                                AutoFillMoney(0)
                                            setAplicaEntrada(!aplicaEntrada)


                                        }}
                                        title={aplicaEntrada ? 'Deshabilitar' : 'Activar Entrada Inicial'}
                                    />  </InputAdornment>
                            }}

                            onChange={e => {
                                let d = parseInt(e.target.value.replace(/\D/g, ''))

                                if (d < formStock.CostoUnitario)
                                    AutoFillMoney(d)
                                else
                                    AutoFillMoney(formStock.CostoUnitario)
                            }} /></Grid>

                    {/* Precio 3 Cuotas */}
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px', display: 'flex', alignItems: 'baseline' }}>
                        <TextField label='Precio Venta 3 Cuotas' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVenta3Cuotas)}

                            onChange={e => { setFormStock({ ...formStock, PrecioVenta3Cuotas: e.target.value.replace(/\D/g, '') }) }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">3x </InputAdornment >
                            }}
                        />
                        <TextField variant="outlined" value={'+' + ajustesPrecios.p3cuotas + '%'}
                            inputProps={{ style: { width: '5rem', textAlign: 'center' } }}
                            size='small'
                            onChange={e => {
                                let d = e.target.value.replace(/[^0-9.]/g, '')
                                if (d < 0)
                                    d = 0
                                if (d > 500)
                                    d = 500
                                setAjustesPrecio({ ...ajustesPrecios, p3cuotas: d })
                            }} />
                    </Grid>



                    {/* Precio 6 Cuotas */}
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px', display: 'flex', alignItems: 'baseline' }}>
                        <TextField label='Precio Venta 6 Cuotas' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVenta6Cuotas)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">6x </InputAdornment >

                            }}
                            onChange={e => { setFormStock({ ...formStock, PrecioVenta6Cuotas: e.target.value.replace(/\D/g, '') }) }} />
                        <TextField variant="outlined" value={'+' + ajustesPrecios.p6cuotas + '%'}
                            inputProps={{ style: { width: '5rem', textAlign: 'center' } }}
                            size='small'
                            onChange={e => {
                                let d = e.target.value.replace(/[^0-9.]/g, '')
                                if (d < 0)
                                    d = 0
                                if (d > 500)
                                    d = 500
                                setAjustesPrecio({ ...ajustesPrecios, p6cuotas: d })
                            }} />
                    </Grid>

                    {/* Precio 12 Cuotas */}
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px', display: 'flex', alignItems: 'baseline' }}>
                        <TextField label={disabled12 ? 'Deshabilitado' : 'Precio Venta 12 Cuotas'} variant="outlined" margin='normal' size="small" fullWidth
                            value={disabled12 ? '' : EstilizaString(formStock.PrecioVenta12Cuotas)}
                            onChange={e => { setFormStock({ ...formStock, PrecioVenta12Cuotas: e.target.value.replace(/\D/g, '') }) }}
                            disabled={disabled12}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">12x </InputAdornment >,
                                endAdornment: <InputAdornment position="end">

                                    <Checkbox checked={!disabled12}
                                        onChange={e => { setdisabled12(!disabled12) }}
                                        title={disabled12 ? 'Activar 12 Cuotas' : 'Deshabilitar'}
                                    />
                                </InputAdornment>
                            }}
                        />
                        <TextField variant="outlined" value={'+' + ajustesPrecios.p12cuotas + '%'}
                            inputProps={{ style: { width: '5rem', textAlign: 'baseline' } }}
                            size='small'
                            onChange={e => {
                                let d = e.target.value.replace(/[^0-9.]/g, '')
                                if (d < 0)
                                    d = 0
                                if (d > 500)
                                    d = 500
                                setAjustesPrecio({ ...ajustesPrecios, p12cuotas: d })
                            }} />
                    </Grid>

                    {/* Precio 18 Cuotas */}
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px', display: 'flex', alignItems: 'baseline' }}>

                        <TextField label={disabled18 ? 'Deshabilitado' : 'Precio Venta 18 Cuotas'} variant="outlined" margin='normal' size="small" fullWidth
                            value={disabled18 ? '' : EstilizaString(formStock.PrecioVenta18Cuotas)}
                            disabled={disabled18}
                            onChange={e => { setFormStock({ ...formStock, PrecioVenta18Cuotas: e.target.value.replace(/\D/g, '') }) }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">18x </InputAdornment >,
                                endAdornment: <InputAdornment position="end">

                                    <Checkbox checked={!disabled18}
                                        onChange={e => { setdisabled18(!disabled18) }}
                                        title={disabled18 ? 'Activar 18 Cuotas' : 'Deshabilitar'}
                                    />
                                </InputAdornment>
                            }}
                        />
                        <TextField variant="outlined" value={'+' + ajustesPrecios.p18cuotas + '%'}
                            inputProps={{ style: { width: '5rem', textAlign: 'center' } }}
                            size='small'
                            onChange={e => {
                                let d = e.target.value.replace(/[^0-9.]/g, '')
                                if (d < 0)
                                    d = 0
                                if (d > 500)
                                    d = 500
                                setAjustesPrecio({ ...ajustesPrecios, p18cuotas: d })
                            }} />
                    </Grid>

                    {/* Precio 24 Cuotas */}
                    <Grid item xs={12} md={6} lg={4} style={{ padding: '0 10px', display: 'flex', alignItems: 'baseline' }}>
                        <TextField label={disabled24 ? 'Deshabilidato' : 'Precio Venta 24 Cuotas'} variant="outlined" margin='normal' size="small" fullWidth
                            value={disabled24 ? '' : EstilizaString(formStock.PrecioVenta24Cuotas)}
                            disabled={disabled24}
                            onChange={e => { setFormStock({ ...formStock, PrecioVenta24Cuotas: e.target.value.replace(/\D/g, '') }) }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">24x </InputAdornment >,
                                endAdornment: <InputAdornment position="end">

                                    <Checkbox checked={!disabled24}
                                        onChange={e => { setdisabled24(!disabled24) }}
                                        title={disabled24 ? 'Activar 24 Cuotas' : 'Deshabilitar'}
                                    /></InputAdornment>
                            }}
                        />
                        <TextField variant="outlined" value={'+' + ajustesPrecios.p24cuotas + '%'}
                            inputProps={{ style: { width: '5rem', textAlign: 'center' } }}
                            size='small'
                            onChange={e => {
                                let d = e.target.value.replace(/[^0-9.]/g, '')
                                if (d < 0)
                                    d = 0
                                if (d > 500)
                                    d = 500
                                setAjustesPrecio({ ...ajustesPrecios, p24cuotas: d })
                            }} />
                    </Grid>
                    {
                        //#endregion 
                    }
                </Grid>
                {
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

                {
                    //#region Add Proveedor
                }

                <FormAddProveedor
                    openPopup={openProveedorPopup}
                    setOpenPopup={setOpenProveedorPopup}

                    formData={formProveedores}
                    SetFormData={SetFormProveedores}

                    data={proveedores}
                    setData={(data) => {

                        let newVal = data[data.length - 1]
                        if (newVal) {
                            refProveedores.current = refProveedores.current.concat(newVal.Proveedor)
                            setFormStock({ ...formStock, Proveedor: newVal.Proveedor })
                        }

                        setLoading(true)
                    }}


                    recolocaEditItem={recolocaEditItem}
                    cargaData={cargaData}

                />


                {
                    //#endregion
                }


            </>


        </Popup >
    )

}
export default FormAddStock