import React, { useState, useEffect } from 'react'


import { postRequest } from '../../API/apiFunctions'
import DataTable from 'react-data-table-component'

import { Button, makeStyles, Grid, TextField } from "@material-ui/core"

import loadingGif from '../../assets/images/loading.gif'

import swal from '@sweetalert/with-react'

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import es from 'date-fns/locale/es'
import format from 'date-fns/format'

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
    boxText: {
        border: '1px solid black',
        borderRadius: '10px',
        pading: '10px',
        margin: '10px'
    }
}))
const Registros = ({ view }) => {
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

    const cellStyle = {
        padding: '5px',
        justifyContent: 'center',
        display: 'flex',
        textAlign: 'justify'
    }

    //#region Ventas cols

    const ventasCols = [

        {
            name: <div style={cellStyle}>Fecha de Venta</div>,
            style: cellStyle,
            selector: 'Producto.Producto',
            cell: row => <div>{row.Venta.fechaVenta}</div>
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
        }

    ]
    //#endregion

    //#region Creditos cols

    const nextPayment = (row) => {

        let proximoPago = 'PAGADO'

        if (row.CreditosPendientes.length > 0)
            proximoPago = row.CreditosPendientes.sort((a, b) => a.FechaPago > b.FechaPago ? 1 : -1)[0].FechaPago

        return proximoPago

    }




    const ButtonsAction = ({ row }) => (
        <>
            <Button variant='contained' disabled={row.CreditosPendientes.length === 0}
                color='secondary' onClick={() => { pagarCuota(row) }} style={{ marginRight: '5px' }}>Pagar</Button>

            <Button variant='contained' color='primary' onClick={() => { verDetalles(row) }} >Detalles</Button>
        </>
    )



    const columnsCreditos = [
        {
            name: <div style={cellStyle}>Acciones</div>,
            style: cellStyle,
            cell: row => <ButtonsAction row={row} />

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

    //#region columns

    const columns = () => {
        const garantia = 'GARANTIA'
        const ventas = 'VENTAS'
        const creditos = 'CREDITOS'

        switch (view) {

            case ventas:
                return ventasCols

            case garantia:
                return []


            case creditos:
                return columnsCreditos

            default:
                return null
        }

    }

    //#endregion


    // eslint-disable-next-line
    useEffect(() => { cargaData() }, [])


    //#region  carga Data ----------------------------------

    const cargaData = () => {


        let fechasBounds = {
            fechaInicio: '2020-10-31',
            fechaFinal: '2020-11-5'
        }
        postRequest('/ventarecords', fechasBounds)
            .then(request => {
                SetSinDatos(true)
                setLoading(false)
                if (request && request.data) {
                    console.log(request.data)
                    setDataCreditos(request.data)

                }
                if (request && request.statusText === 'OK' && request.data && request.data.length === 0)
                    SetSinDatos(true)

            })
    }



    //#endregion


    //#region PAGAR
    const pagarCuota = row => {

        const cantidadTotalCuotas = row.Creditos.length
        const nextCantidadCuotasPagas = 1 + row.CreditosPagos.length
        const cuotaX = row.CreditosPendientes.sort((a, b) => a.FechaPago > b.FechaPago ? 1 : -1)[0]

        const cantidadAPagar = cuotaX.DebePagar
        const dataFecha = {
            fechaRealPago: fechaDeCobro.getFullYear() + '-' + fechaDeCobro.getMonth() + '-' + fechaDeCobro.getDate()
        }
        const efectuaPago = () => {
            swal.close()
            setLoading(true)
            postRequest('/cobrarcuota/' + cuotaX.id, dataFecha)
                .then(resp => {
                    console.log(resp)
                    cargaData()
                })

        }


        const cantidadAPagarFormated = formater.format(cantidadAPagar)


        swal(
            <div>
                <div style={{ fontSize: '2rem', margin: '10px' }}>PAGO DE CUOTAS</div>

                <div style={{ border: '1px solid black', borderRadius: '10px', pading: '10px' }}>{'Fecha: ' + format(fechaDeCobro, "yyyy-MM-dd")}</div>

                <div>Pagando cuota</div>
                <div>
                    {nextCantidadCuotasPagas + ' de ' + cantidadTotalCuotas}
                </div>
                <div style={{ border: '1px solid black', borderRadius: '10px', pading: '10px', fontSize: '1.5rem', margin: '10px 0px' }}>
                    {cantidadAPagarFormated}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant='contained' color='primary' onClick={() => { swal.close() }} >Cancelar</Button>
                    <Button variant='contained' color='secondary' onClick={efectuaPago}>Pagar</Button>
                </div>
            </div>, {
            closeOnClickOutside: false,
            closeOnEsc: true,
            buttons: {
                confirm: false,
            },
        }
        )



    }
    //#endregion


    //#region DETALLES
    const verDetalles = row => {

        console.log(row)

        swal(
            <div>
                <div style={{ fontSize: '2rem', margin: '10px', textAlign: 'center' }}>Detalles</div>

                <div className={classes.boxText}>{'Cliente: ' + row.Cliente.Nombre}</div>
                <div className={classes.boxText}>{'Producto: ' + row.Producto.Producto}</div>
                <div className={classes.boxText}>{'Comprado el: ' + row.Producto.Producto}</div>
                <br />
                <div className={classes.boxText}>{'Cuotas pagadas: ' + row.CreditosPagos.length + ' de ' + row.Creditos.length}</div>
                <hr />
                {row.CreditosPagos.map(item => (

                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>

                        <div style={{ backgroundColor: item.EstadoCredito === 'A' ? 'green' : (item.EstadoCredito === 'B' ? 'yellow' : 'red') }}>{item.EstadoCredito}</div>
                        <div> {item.FechaPago}</div>
                        <div> {item.DebePagar}</div>

                    </div>

                ))}
            </div>, {
            closeOnClickOutside: true,
            closeOnEsc: true,
            buttons: { confirm: 'Ok', },
        }
        )
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

            <div style={{ textAlign: 'center', fontSize: '2rem' }}>{view}</div>

            {
                //#region Search
            }

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
                        <div style={{ textAlign: 'center' }}>Fecha de Cobro</div>
                    </Grid>

                    <Grid item xs={12} sm={8} md={6} lg={8}>
                        <TextField variant='outlined' label='Nombre Cédula o RUC'
                            value={searchText} fullWidth
                            onChange={search}
                        />

                    </Grid>
                </Grid>
            </Grid>
            {
                //#endregion
            }
            {
                //#region RDT
            }
            <div style={{ marginTop: '10px' }}>
                <DataTable
                    columns={columns()}
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
            </div>
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





        </>

    )
    //#endregion Others Functions
}

export default Registros