import React, { useState, useEffect, useRef } from 'react'
import { TextField, Grid, Button } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { postRequest, deleteRequest } from '../../API/apiFunctions'

import ProductoSelect from './ProductoSelect'

import Popup from './Popup'
import FormAddProducto from './FormAddProducto'

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
        openPopupProducto, setOpenPopupProducto,
        formStock, SetFormStock,
        dataStock,
        dataProductos, setDataProductos,
        loading, setLoading,
        cargaData, recolocaEditItem, ajustesPrecios

    }) => {


    //#region  CONST ----------------------------------

    const [costoUniError, setCostoUniError] = useState(false)
    const [cantidadError, setCantidadError] = useState(false)
    const [productoError, setProductoError] = useState(false)

    //#region  Producto ----------------------------------

    //Control del Producto
    const [formProducto, setFormProducto] = useState({
        Codigo: "",
        Categoria: "",
        Categoria_id: "",
        Producto: "",
        Marca: "",
        Color: "",

        PrecioVentaContadoMayorista: "",
        PrecioVentaContadoMinorista: "",
        PrecioVenta3Cuotas: "",
        PrecioVenta6Cuotas: "",
        PrecioVenta12Cuotas: "",
        PrecioVenta18Cuotas: "",
        PrecioVenta24Cuotas: ""
    })




    const [valueProducto, setValueProducto] = useState(null)
    //#endregion Producto

    const refProveedores = useRef([])

    //#endregion CONST

    //#region  useEffect ----------------------------------


    useEffect(() => {


        let productoSel = dataProductos.filter(item => {
            if (item && item.id && formStock && formStock.Producto_id)
                return item.id.toString() === formStock.Producto_id.toString()
            return false

        })



        setValueProducto(productoSel.length === 1 ? productoSel[0] : null)
    }, [dataStock, dataProductos, formStock])





    //#endregion useEffect

    //#region useEffect CNRM

    useEffect(() => {

        refProveedores.current = [...new Set(dataStock.map(item => item.Proveedor))].filter(item => item && item.length > 0)

    }, [dataStock])



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

        if (!valueProducto || !valueProducto.Producto || valueProducto.Producto.length === 0) {
            setProductoError(true)

            setTimeout(() => { setProductoError(false) }, 1000)
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

    //#region  Estiliza como money String ----------------------------------

    const EstilizaString = (s) => {
        if (!s)
            return ""

        var re = '\\d(?=(\\d{3})+$)'
        return s.toString().replace(new RegExp(re, 'g'), '$& ')
    }

    //#endregion Estiliza como money String

    //#region  Edit Delete Producto ----------------------------------

    const handleEditProducto = ({ id }) => {

        let productoEditar = dataProductos.filter(item => item.id === id)[0]

        if (productoEditar) {
            setFormProducto(productoEditar)

            setOpenPopupProducto(true)
        }

    }

    const handleDeleteProducto = ({ id }) => {
        setDataProductos(dataProductos.filter(it => it.id.toString() !== id.toString()))

        deleteRequest('/productos/' + id).then(() => { cargaData() })
    }


    //#endregion  Edit Delete Producto

    //#region Autorrellena

    const autorrellena = () => {
        if (dataStock.length > 0 && dataStock[dataStock.length - 1]) {

            let oldForm = dataStock[dataStock.length - 1]

            SetFormStock({ ...formStock, FechaCompra: oldForm.FechaCompra, Factura: oldForm.Factura, Proveedor: oldForm.Proveedor })

        }
    }

    //#endregion

    //#region  Return ----------------------------------


    const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (

        <TextField ref={ref} label='Fecha de Compra' variant="outlined" margin='normal' size="small"
            value={value} onClick={onClick} fullWidth
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
                    <Grid item xs={12} sm={12} md={5} style={{ padding: '0px 10px' }} >

                        <Autocomplete
                            fullWidth
                            freeSolo
                            options={refProveedores.current}
                            value={formStock.Proveedor}
                            onChange={(event, newInputValue) => { SetFormStock({ ...formStock, Proveedor: newInputValue ? newInputValue : '' }) }}
                            inputValue={formStock.Proveedor}
                            onInputChange={(event, newInputValue) => { SetFormStock({ ...formStock, Proveedor: newInputValue }) }}
                            renderInput={(params) => <TextField {...params} label="Proveedor" variant="outlined" margin="normal" size="small" fullWidth />}
                        />

                    </Grid>

                    <Grid item xs={12} sm={6} md={3} style={{ padding: '0px 10px' }}>

                        <DatePicker
                            selected={stringToDate(formStock.FechaCompra)}
                            onChange={date => { SetFormStock({ ...formStock, FechaCompra: dateToString(date) }) }}
                            showTimeInput
                            timeInputLabel="Hora:"
                            withPortal
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            todayButton="Hoy"
                            customInput={<CustomDateInput />}
                        />
                    </Grid>


                    <Grid item xs={12} sm={6} md={4} style={{ padding: '0px 10px' }}>
                        <TextField label='Factura de Compra' variant="outlined" margin='normal' size="small"
                            fullWidth
                            value={formStock.Factura} onChange={e => { SetFormStock({ ...formStock, Factura: e.target.value }) }} />
                    </Grid>
                </Grid>

                <Grid container style={{ border: '1px solid black', borderRadius: '10px', marginBottom: '10px', paddingTop: '10px' }}>

                    <Grid item xs={12} md={6} style={{ padding: '0px 10px', display: 'flex', alignItems: 'flex-end' }}>


                        <ProductoSelect


                            value={valueProducto}
                            setValue={producto => {
                                setValueProducto(producto)
                                SetFormStock({ ...formStock, Producto_id: producto && producto.id ? producto.id : -1 })

                            }}
                            error={productoError}
                            list={dataProductos}
                            toggleOpenFormAdd={() => { setOpenPopupProducto(true) }}

                            handleEdit={handleEditProducto}
                            handleDelete={handleDeleteProducto}
                        />
                    </Grid>



                    <Grid item xs={12} sm={6} md={3} style={{ padding: '0px 10px' }} >
                        <TextField label='Costo Unitario' variant="outlined" margin='normal' size="small" fullWidth error={costoUniError}
                            value={EstilizaString(formStock.CostoUnitario)} onChange={e => { SetFormStock({ ...formStock, CostoUnitario: e.target.value.replace(/\D/, '').replace(' ', '') }) }} />
                    </Grid>


                    <Grid item xs={12} sm={6} md={3} style={{ padding: '0px 10px' }} >
                        <TextField label='Cantidad' variant="outlined" margin='normal' size="small" fullWidth error={cantidadError}
                            value={formStock.Cantidad} onChange={e => { SetFormStock({ ...formStock, Cantidad: e.target.value.replace(/\D/, '').replace(' ', '') }) }} />
                    </Grid>



                </Grid>

                <FormAddProducto
                    openPopup={openPopupProducto} setOpenPopup={setOpenPopupProducto}// Control PopUP
                    formProducto={formProducto} setFormProducto={setFormProducto} // State del Form
                    dataProductos={dataProductos} cargaData={cargaData} setLoading={setLoading}
                    loading={loading} recolocaEditItem={() => { }} ajustesPrecios={ajustesPrecios}
                />

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