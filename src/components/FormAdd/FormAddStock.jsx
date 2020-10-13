import React, { useState, useEffect, useRef } from 'react'
import { TextField, Grid, Button, InputAdornment, IconButton, Checkbox } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { postRequest } from '../../API/apiFunctions'


import MoneyOffIcon from '@material-ui/icons/MoneyOff'
import Popup from './Popup'

import loadingGif from '../../assets/images/loading.gif'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import es from 'date-fns/locale/es'

import { dateToString, stringToDate } from '../../API/timeFunctions'

registerLocale('es', es)
setDefaultLocale('es')



const FormAddStock = (
    {

        openPopup, setOpenPopup,
        formStock, setFormStock,
        dataStock, proveedores,
        loading, setLoading,
        cargaData, recolocaEditItem, ajustesPrecios

    }) => {


    //#region  CONST ----------------------------------

    const [costoUniError, setCostoUniError] = useState(false)
    const [cantidadError, setCantidadError] = useState(false)



    //disabled 18 y 24 Cuotas
    const [disabled18, setdisabled18] = useState(true)
    const [disabled24, setdisabled24] = useState(true)


    const refCategorias = useRef([])
    const refMarcas = useRef([])
    const refColors = useRef([])
    const refProveedores = useRef([])

    //#endregion CONST



    //#region useEffect CNRM

    useEffect(() => {

        refProveedores.current = proveedores.map(item => item.Proveedor)

    }, [proveedores])



    //#endregion CNRM

    //#region  saveData ----------------------------------

    const saveData = () => {

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
        let formDataOK = { ...formStock }



        if (formStock.id)// Editing....
            uri = uri + '/' + formStock.id



        postRequest(uri, formDataOK).then(() => {
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

    const EstilizaString = (s) => {
        if (!s)
            return ""

        var re = '\\d(?=(\\d{3})+$)'
        return s.toString().replace(new RegExp(re, 'g'), '$& ')
    }

    //#endregion Estiliza como money String



    //#region  Auto Fill Money ----------------------------------

    const AutoFillMoney = () => {

        let precioBase = parseInt(formStock.CostoUnitario)

        if (isNaN(precioBase))
            return

        let precio18 = disabled18 ? null : Math.ceil((ajustesPrecios.p18cuotas * precioBase) / 180000) * 100
        let precio24 = disabled24 ? null : Math.ceil((ajustesPrecios.p24cuotas * precioBase) / 240000) * 100

        setFormStock({
            ...formStock,
            PrecioVentaContadoMayorista: Math.ceil((ajustesPrecios.pMayorista * precioBase) / 10000) * 100,
            PrecioVentaContadoMinorista: Math.ceil((ajustesPrecios.pMinorista * precioBase) / 10000) * 100,
            PrecioVenta3Cuotas: Math.ceil((ajustesPrecios.p3cuotas * precioBase) / 30000) * 100,
            PrecioVenta6Cuotas: Math.ceil((ajustesPrecios.p6cuotas * precioBase) / 60000) * 100,
            PrecioVenta12Cuotas: Math.ceil((ajustesPrecios.p12cuotas * precioBase) / 120000) * 100,
            PrecioVenta18Cuotas: precio18,
            PrecioVenta24Cuotas: precio24
        })

    }

    //#endregion Auto Fill Money


    //#region  Return ----------------------------------


    const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (

        <TextField ref={ref} label='Fecha de Compra' variant="outlined" margin='normal' size="small"
            value={value} fullWidth onClick={onClick}
        />
    ))

    return (
        <Popup
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}

            title={(formStock.id) ? 'Editar Stock' : 'COMPRA'}

            recolocaEditItem={recolocaEditItem}
            saveData={saveData}>
            <>
                <Button hidden={dataStock && dataStock.length > 0} variant='contained'
                    color='primary' size='small' onClick={() => { autorrellena() }} style={{ float: 'right' }} >
                    Ultimo
                </Button>

                <Grid container style={{ border: '1px solid black', borderRadius: '10px', marginBottom: '10px', padding: '10px' }}>
                    <Grid item xs={12} sm={12} md={5} style={{ padding: '0 10px' }}>

                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={refProveedores.current}
                            value={formStock.Proveedor}
                            onChange={(event, newInputValue) => { setFormStock({ ...formStock, Proveedor: newInputValue ? newInputValue : '' }) }}
                            inputValue={formStock.Proveedor}
                            onInputChange={(event, newInputValue) => { setFormStock({ ...formStock, Proveedor: newInputValue }) }}
                            renderInput={(params) => <TextField {...params} label="Proveedor" variant="outlined" margin="normal" size="small" fullWidth />}
                        />

                    </Grid>

                    <Grid item xs={12} sm={6} md={3} style={{ padding: '0 10px' }} >

                        <DatePicker
                            selected={stringToDate(formStock.FechaCompra)}
                            onChange={date => { setFormStock({ ...formStock, FechaCompra: dateToString(date) }) }}
                            showTimeInput
                            timeInputLabel="Hora:"
                            withPortal
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

                <Grid container style={{ justifyContent: 'space-around', border: '1px solid black', borderRadius: '10px', marginBottom: '10px', paddingTop: '10px' }}>

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
                        <TextField label='Código' variant="outlined" margin='normal' size="small" fullWidth
                            value={formStock.Codigo} onChange={e => { setFormStock({ ...formStock, Codigo: e.target.value }) }} />
                    </Grid>




                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }} >
                        <TextField label='Cantidad' variant="outlined" margin='normal' size="small" fullWidth error={cantidadError}
                            value={formStock.Cantidad} onChange={e => { setFormStock({ ...formStock, Cantidad: e.target.value.replace(/\D/, '').replace(' ', '') }) }} />
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

                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <TextField label='Costo Unitario' variant="outlined" margin='normal' size="small" fullWidth error={costoUniError}
                            value={EstilizaString(formStock.CostoUnitario)}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={e => { AutoFillMoney() }} color='secondary' title='Autorellenar Precios'>
                                        <MoneyOffIcon />  </IconButton>  </InputAdornment >
                            }}
                            onChange={e => { setFormStock({ ...formStock, CostoUnitario: e.target.value.replace(/\D/g, '').replace(' ', '') }) }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <TextField label='Precio Mayorista' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVentaContadoMayorista)}

                            onChange={e => { setFormStock({ ...formStock, PrecioVentaContadoMayorista: e.target.value.replace(/\D/g, '').replace(' ', '') }) }} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <TextField label='Precio Venta Contado' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVentaContadoMinorista)}

                            onChange={e => { setFormStock({ ...formStock, PrecioVentaContadoMinorista: e.target.value.replace(/\D/, '').replace(' ', '') }) }} /></Grid>


                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <TextField label='Precio Venta 3 Cuotas' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVenta3Cuotas)}

                            onChange={e => { setFormStock({ ...formStock, PrecioVenta3Cuotas: e.target.value.replace(/\D/, '').replace(' ', '') }) }}
                            InputProps={{ startAdornment: <InputAdornment position="start">3x </InputAdornment > }}
                        /></Grid>




                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <TextField label='Precio Venta 6 Cuotas' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVenta6Cuotas)}
                            InputProps={{ startAdornment: <InputAdornment position="start">6x </InputAdornment > }}
                            onChange={e => { setFormStock({ ...formStock, PrecioVenta6Cuotas: e.target.value.replace(/\D/, '').replace(' ', '') }) }} /></Grid>


                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <TextField label='Precio Venta 12 Cuotas' variant="outlined" margin='normal' size="small" fullWidth
                            value={EstilizaString(formStock.PrecioVenta12Cuotas)}
                            InputProps={{ startAdornment: <InputAdornment position="start">12x </InputAdornment > }}
                            onChange={e => { setFormStock({ ...formStock, PrecioVenta12Cuotas: e.target.value.replace(/\D/, '').replace(' ', '') }) }} /></Grid>


                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>

                        <TextField label={disabled18 ? 'Deshabilitado' : 'Precio Venta 18 Cuotas'} variant="outlined" margin='normal' size="small" fullWidth
                            value={disabled18 ? '' : EstilizaString(formStock.PrecioVenta18Cuotas)}
                            disabled={disabled18}
                            onChange={e => { setFormStock({ ...formStock, PrecioVenta18Cuotas: e.target.value.replace(/\D/, '').replace(' ', '') }) }}
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
                    </Grid>


                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0 10px' }}>
                        <TextField label={disabled24 ? 'Deshabilidato' : 'Precio Venta 24 Cuotas'} variant="outlined" margin='normal' size="small" fullWidth
                            value={disabled24 ? '' : EstilizaString(formStock.PrecioVenta24Cuotas)}
                            disabled={disabled24}
                            onChange={e => { setFormStock({ ...formStock, PrecioVenta24Cuotas: e.target.value.replace(/\D/, '').replace(' ', '') }) }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">24x </InputAdornment >,
                                endAdornment: <InputAdornment position="end">
                                    <Checkbox checked={!disabled24}
                                        onChange={e => { setdisabled24(!disabled24) }}
                                        title={disabled24 ? 'Activar 24 Cuotas' : 'Deshabilitar'}
                                    /></InputAdornment>
                            }}
                        />
                    </Grid>

                </Grid>


                <div style={{
                    position: 'fixed', top: '0', left: '0', height: '100vh', width: '100vw',
                    backgroundColor: 'rgba(0,0,0,0.6)', display: loading ? 'flex' : 'none',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <img src={loadingGif} alt="" height='30px' /></div>
            </>


        </Popup >
    )
    //#endregion Return
}
export default FormAddStock