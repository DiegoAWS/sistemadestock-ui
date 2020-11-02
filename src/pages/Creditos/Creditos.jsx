import React, { useState, useEffect } from 'react'


import { getRequest, postRequest } from '../../API/apiFunctions'
import DataTable from 'react-data-table-component'

import { Button, makeStyles, Grid, TextField } from "@material-ui/core"

import loadingGif from '../../assets/images/loading.gif'

import swal from '@sweetalert/with-react'

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import es from 'date-fns/locale/es'
registerLocale('es', es)
setDefaultLocale('es')



const formater = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
});

//#region JSS
const useStyle = makeStyles(() => ({
    search: {
        display: 'flex',
    },
}))
const Creditos = () => {
    const classes = useStyle()
    //#region  STATE ----------------------------------

    const [sinDatos, SetSinDatos] = useState(false)
    const [dataCreditos, setDataCreditos] = useState([])
    const [searchText, setSearchText] = useState('')
    const [dataSearched, setDataSearched] = useState([])
    const [fechaDeCobro, setFechaDeCobro] = useState(new Date())
    const [loading, setLoading] = useState(false)
    //#endregion CONST's


    //#region search!

    const search = e => {
        let text = e.target.value
        setSearchText(text)

        const dataSearched = dataCreditos.filter(item => {
            let nombre = item.Cliente.Nombre.toString().toLowerCase()
            let cedula = item.Cliente.Cedula.toString().toLowerCase()


            return nombre.includes(text.toLowerCase()) || cedula.includes(text.toLowerCase())

        })

        setDataSearched(dataSearched)
    }
    //#endregion


    //#region Columns

    const nextPayment = (row) => {

        let proximoPago = 'PAGADO'

        if (row.CreditosPendientes.length > 0)
            proximoPago = row.CreditosPendientes.sort((a, b) => a.FechaPago > b.FechaPago ? 1 : -1)[0].FechaPago

        return proximoPago

    }

    let cellStyle = React.useMemo(() => ({
        padding: '5px',
        justifyContent: 'center',
        display: 'flex',


    }), [])

    var columns = [
        {
            name: <div style={cellStyle}>Pagar</div>,
            style: cellStyle,
            cell: row => <Button variant='contained' color='secondary' onClick={() => { pagarCuota(row) }} >Pagar</Button>
        },
        {
            name: <div style={cellStyle}>Detalles</div>,
            style: cellStyle,
            cell: row => <Button variant='contained' color='primary' onClick={() => { verDetalles(row) }} >Detalles</Button>
        },
        {
            name: <div style={cellStyle}>Producto</div>,
            style: cellStyle,
            selector: 'Producto.Producto',
            cell: row => <div>{row.Producto.Producto}</div>
        },
        {
            name: <div style={cellStyle}> Cliente</div>,
            style: cellStyle,
            selector: 'Cliente.Nombre',
            cell: row => <div>{row.Cliente.Nombre}</div>
        },
        {
            name: <div style={cellStyle}>Cuotas</div>,
            style: cellStyle,
            cell: row => <div>{row.CreditosPagos.length + ' de ' + row.Creditos.length}</div>
        },
        {
            name: <div style={cellStyle}>Próximo Pago</div>,
            style: cellStyle,
            selector: 'CreditosPendientes[0].FechaPago',

            cell: nextPayment
        }


    ]





    //#endregion


    // eslint-disable-next-line
    useEffect(() => { cargaData() }, [])


    //#region  carga Data ----------------------------------

    const cargaData = () => {

        getRequest('/creditos')
            .then(request => {
                SetSinDatos(true)
                setLoading(false)
                if (request && request.data) {

                    let dataVentas = request.data.Ventas
                    let dataClientes = request.data.Clientes
                    let dataStock = request.data.Stock
                    let dataCreditos = request.data.Creditos


                    //#region Data 

                    let Data = dataVentas.map(item => {


                        let itemCliente = dataClientes.find(ite => ite.id.toString() === item.Cliente_id.toString())
                        let itemProducto = dataStock.find(ite => ite.id.toString() === item.Stock_id.toString())

                        let fullDataItem = {
                            Venta: item,
                            Cliente: itemCliente,
                            Producto: itemProducto,
                        }

                        if (item.Pago === "ventaCuotas") {

                            let itemCreditos = dataCreditos.filter(ite => ite.VentaNewId === item.newId).sort((a, b) => a.FechaPago > b.FechaPago ? 1 : -1)
                            let itemCreditosPagados = itemCreditos.filter(ite => ite.FechaRealDePago.length > 7)
                            let itemCreditosPendientes = itemCreditos.filter(ite => ite.FechaRealDePago.length === 0)

                            fullDataItem = {
                                ...fullDataItem,
                                Creditos: itemCreditos,
                                CreditosPagos: itemCreditosPagados,
                                CreditosPendientes: itemCreditosPendientes
                            }

                        } else {

                            fullDataItem = {
                                ...fullDataItem,
                                Creditos: [],
                                CreditosPagos: [],
                                CreditosPendientes: []
                            }
                        }


                        return fullDataItem

                    })

                    //#endregion

                    setDataCreditos(Data)

                }
                if (request && request.statusText === 'OK' && request.data && request.data.length === 0)
                    SetSinDatos(true)

            })
    }



    //#endregion


    //#region PAGAR
    const pagarCuota = row => {

        const cantidadTotalCuotas = row.Creditos.length
        const cantidadCuotasPagas = 1 + row.CreditosPagos.length
        const cuotaX = row.CreditosPendientes.sort((a, b) => a.FechaPago > b.FechaPago ? 1 : -1)[0]

        const cantidadAPagar = cuotaX.DebePagar


        if (cantidadAPagar && !isNaN(parseInt(cantidadAPagar))) {
            const cantidadAPagarFormated = formater.format(cantidadAPagar)

            const dataFecha = {
                fechaRealPago: fechaDeCobro.getFullYear() + '-' + fechaDeCobro.getMonth() + '-' + fechaDeCobro.getDate()
            }
            swal({
                title: cantidadAPagarFormated,
                text: '\n\nPago de Cuota # ' + cantidadCuotasPagas + ' de ' + cantidadTotalCuotas,
                icon: "warning",
                button: "PAGAR",
            })
                .then(() => {
                    setLoading(true)
                    postRequest('/cobrarcuota/' + cuotaX.id, dataFecha)
                        .then(resp => {
                            console.log(resp)
                            cargaData()
                        })

                })

        }
    }
    //#endregion


    //#region Metodos Extra
    const verDetalles = row => {
        console.log(row)
    }





    //#endregion


    //#region Custom Table styles

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px', // override the row height
            }
        },
        headCells: {
            style: {
                display: 'flex',
                justifyContent: 'center'
            },
        },
        cells: {
            style: {
                wordBreak: 'keep-all',
                padding: '5px',
            },
        },
    };
    //#endregion



    //#region  Return ----------------------------------


    const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (<Button ref={ref} fullWidth variant="contained" color='primary' onClick={onClick} >{value}</Button>))

    return (
        <>
            <Grid container spacing={1} >
                <Grid item xs={12} container justify='space-between' className={classes.search}>
                    <Grid item xs={12} sm={4} md={3} lg={2}>

                        <DatePicker
                            selected={fechaDeCobro}
                            onChange={date => { setFechaDeCobro(date) }}
                            showMonthDropdown
                            dateFormat="dd/MMMM/yyyy"
                            todayButton="Hoy"
                            customInput={<CustomDateInput />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={8} md={6} lg={8}>
                        <TextField variant='outlined' label='Nombre Cédula o RUC'
                            value={searchText} fullWidth
                            onChange={search}
                        />

                    </Grid>
                </Grid>
            </Grid>
            <DataTable
                columns={columns}
                data={searchText && searchText.length > 0 ? dataSearched : dataCreditos}
                customStyles={customStyles}
                defaultSortField='CreditosPendientes[0].FechaPago'
                defaultSortAsc={true}

                pagination
                highlightOnHover
                dense
                noHeader
                responsive
                noDataComponent={sinDatos ? <div><hr /><h3>Sin Resultados que mostrar</h3><hr /></div> : <img src={loadingGif} width='20px' alt='' />}
                paginationComponentOptions={{
                    rowsPerPageText: 'Filas por Pagina:',
                    rangeSeparatorText: 'de'
                }}
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
            />


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





        </>

    )
    //#endregion Others Functions
}

export default Creditos