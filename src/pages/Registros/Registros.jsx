import React, { useState, useEffect } from 'react'


import { postRequest, deleteRequest } from '../../API/apiFunctions'
import DataTable from 'react-data-table-component'

import { makeStyles, Button, IconButton, Grid, TextField } from "@material-ui/core"
import TodayIcon from '@material-ui/icons/Today';
import EventIcon from '@material-ui/icons/Event';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import loadingGif from '../../assets/images/loading.gif'

import swal from '@sweetalert/with-react'
import { jsPDF } from "jspdf"
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

const cellStyle = {
    padding: '5px',
    justifyContent: 'center',
    display: 'flex',
    textAlign: 'justify'
}
//#endregion


const Registros = ({ view }) => {
    const classes = useStyle()

    const garantia = 'GARANTIA'
    const ventas = 'VENTAS'
    const creditos = 'CREDITOS'


    //#region  STATE ----------------------------------

    const [sinDatos, SetSinDatos] = useState(false)
    const [dataCreditos, setDataCreditos] = useState([])
    const [searchText, setSearchText] = useState('')
    const [dataSearched, setDataSearched] = useState([])
    const [fechaDeCobro, setFechaDeCobro] = useState(new Date())
    const [inicioRango, setInicioRango] = useState(view === creditos ? new Date(2010, 0, 1) : new Date())
    const [finRango, setFinRango] = useState(view === creditos ? new Date(2030, 0, 1) : new Date())

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




    //#region Ventas cols


    const ventasCols = [
        {
            name: <div style={cellStyle}>Acciones</div>,
            style: cellStyle,
            cell: row => <Button variant='contained' color='primary' onClick={() => { verDetalles(row) }} >Detalles</Button>

        },
        {
            name: <div style={cellStyle}>Fecha de Venta</div>,
            style: cellStyle,
            selector: 'Producto.Producto',
            cell: row => <div>{row.Venta.fechaVenta}</div>
        },
        {
            name: <div style={cellStyle}>Producto</div>,
            style: cellStyle,
            minWidth: '200px',
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
            minWidth: '200px',
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



    useEffect(() => {



        cargaData()

        return () => { setSearchText('') }
        // eslint-disable-next-line
    }, [view, inicioRango, finRango])


    //#region  carga Data ----------------------------------

    const cargaData = () => {
        setDataCreditos([])
        SetSinDatos(false)


        let fechasBounds = {
            fechaInicio: format(inicioRango, "yyyy'-'MM'-'dd"),
            fechaFinal: format(finRango, "yyyy'-'MM'-'dd")
        }
        postRequest('/ventarecords', fechasBounds)
            .then(request => {
                SetSinDatos(true)
                setLoading(false)
                if (request && request.data) {

                    setDataCreditos(request.data)
                }
                if (request && request.statusText === 'OK' && request.data && request.data.length === 0)
                    SetSinDatos(true)

            })
    }



    //#endregion


    //#region PAGAR CUOTA
    const pagarCuota = row => {


        const nextCantidadCuotasPagas = 1 + row.CreditosPagos.length

        const cuotaX = row.CreditosPendientes.sort((a, b) => a.FechaPago > b.FechaPago ? 1 : -1)[0]

        const cantidadAPagarFormated = formater.format(cuotaX.DebePagar)

        const dataFecha = {
            fechaRealPago: format(fechaDeCobro, "yyyy'-'MM'-'dd", { locale: es })
        }
        const efectuaPago = (row) => {
            swal.close()
            ImprimirComprobante(row)
            postRequest('/cobrarcuota/' + cuotaX.id, dataFecha)
                .then(resp => {

                    cargaData()
                })

        }




        swal(
            <div>
                <div style={{ fontSize: '2rem', margin: '10px' }}>PAGO DE CUOTAS</div>

                {/* <div style={{ border: '1px solid black', borderRadius: '10px', pading: '10px' }}>{'Fecha: ' + format(fechaDeCobro, "yyyy-MM-dd")}</div> */}

                <div>{'Pagando cuota # ' + nextCantidadCuotasPagas}</div>

                <div style={{ border: '1px solid black', borderRadius: '10px', pading: '10px', fontSize: '1.5rem', margin: '10px 0px' }}>
                    {cantidadAPagarFormated}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant='contained' color='primary' onClick={() => { swal.close() }} >Cancelar</Button>
                    <Button variant='contained' color='secondary' onClick={() => { efectuaPago(row) }}>Pagar</Button>
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


    //#region Imprimir Comprobante



    const ImprimirComprobante = (row) => {
        // let imgData = getCodebarURI(0)

        let d = new Date()

        //#region TEXTO

        var imgLogoURI = 'data:image/png;base64,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'


        var texto = `
*********RECIBO DE PAGO DE CUOTA*********
NUMERO DE RECIBO : ????????
FECHA: ${d.getDate() + '/' + (1 + 1 * d.getMonth()) + '/' + d.getFullYear() + ' HORA: ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()}
USUARIO: ${localStorage.getItem('UserOficialName')}

***********************************************
CEDULA DE IDENTIDAD: ${row && row.Cliente && row.Cliente.Cedula ? row.Cliente.Cedula : '---'}
CLIENTE: ${row && row.Cliente && row.Cliente.Nombre ? row.Cliente.Nombre : '---'}
N° DE FACTURA: ????????
N° DE VENTA: ????????

PRODUCTO
${row.Producto.Producto.toString().substr(0, 30)}
***********************************************

DEBE PAGAR : ${formater.format(row.CreditosPendientes[0].DebePagar)}
#################################


***********************************************
¡GRACIAS POR SU COMPRA!
***********************************************
????????
NUMERO DE REFERENCIA DE PAGO
ESTE ES SU COMPROBANTE DE PAGO 
CONSERVELO
***********************************************`


        //#endregion

        var doc = new jsPDF({ unit: "mm", format: [80, 180] })


        doc.addImage(imgLogoURI, 'JPEG', 11, 4, 60, 30)
        doc.setFontSize(10)
        doc.text(texto, 40, 40, null, null, 'center')

        doc.output('dataurlnewwindow', 'Comprobante de Pago')
    }

    //#endregion


    //#region Borra Cuota
    const borraCuota = item => {
        console.log(item)
        if (window.confirm('Está seguro que desea BORRAR este pago??\n\nEsta acción NO SE PUEDE DESHACER')) {
            swal.close()

            deleteRequest('/borrarcuota/' + item.id)
                .then(request => {
                    cargaData()
                })
        }
    }
    //#endregion


    //#region DETALLES



    const verDetalles = row => {


        swal(
            <div>
                <div style={{ fontSize: '2rem', margin: '10px', textAlign: 'center' }}>Detalles</div>
                <div className={classes.boxText}>{'Cliente: ' + row.Cliente.Nombre}</div>


                <div className={classes.boxText}>{'Producto: ' + row.Producto.Producto}</div>
                <div className={classes.boxText}>{'Comprado'} <br /> {row.Venta.fechaVenta}</div>


                <br />
                <div className={classes.boxText}>{'Cuotas pagadas: ' + row.CreditosPagos.length + ' de ' + row.Creditos.length}</div>
                <hr />
                {row.CreditosPagos.map((item, index) => (
                    <div key={item.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex' }}>

                                <div style={{ backgroundColor: item.EstadoCredito === 'A' ? 'green' : (item.EstadoCredito === 'B' ? 'yellow' : 'red') }}>{item.EstadoCredito}</div>
                            </div>
                            <div> {item.FechaRealDePago}</div>
                            <div> {item.DebePagar}</div>

                        </div>
                        {(index + 1 === row.CreditosPagos.length) && <Button style={{ margin: '10px' }} fullWidth variant='contained' color='secondary' onClick={() => { borraCuota(item) }}><DeleteForeverIcon /> Borrar último pago<DeleteForeverIcon /></Button>}
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


    const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => <Button ref={ref} fullWidth variant='contained' color='primary' size='small' onClick={onClick} >{value}</Button >)

    const CustomDateInputIni = React.forwardRef(({ onClick }, ref) => <IconButton ref={ref} color='primary' size='small' onClick={onClick} ><TodayIcon /></IconButton >)
    const CustomDateInputFin = React.forwardRef(({ onClick }, ref) => <IconButton ref={ref} color='primary' size='small' onClick={onClick} ><EventIcon /></IconButton >)

    return (
        <>
            {
                //#region Selector de fechas Inicio y Fin
            }
            <div style={{ display: 'flex' }}>

                {view === ventas && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffe6e6', borderRadius: '5px', justifyContent: 'center', minWidth: 'fit-content' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <DatePicker
                                selected={inicioRango}
                                onChange={dates => { setInicioRango(dates) }}
                                startDate={inicioRango}
                                endDate={finRango}
                                showMonthDropdown
                                showYearDropdown
                                selectsStart
                                dateFormat="dd/MMMM/yyyy"
                                customInput={<CustomDateInputIni />}
                            />
                            <DatePicker
                                selected={inicioRango}
                                onChange={dates => { setFinRango(dates); }}
                                startDate={inicioRango}
                                endDate={finRango}
                                showMonthDropdown
                                showYearDropdown
                                selectsEnd
                                dateFormat="dd/MMMM/yyyy"
                                customInput={<CustomDateInputFin />}
                            />
                        </div>
                        <div style={{ textAlign: 'right', fontSize: 'small', margin: '5px', marginTop: '-10px' }}>Rango de Fechas</div>
                        <div style={{ textAlign: 'right', fontSize: 'small', margin: '5px', }}>{'De: ' + format(inicioRango, "dd'/'MMM'/'yyyy")}</div>
                        {finRango && < div style={{ textAlign: 'center', fontSize: 'small', margin: '5px', }}>{'A: ' + format(finRango, "dd'/'MMM'/'yyyy")}</div>}

                    </div>
                </div>}

            </div>

            {
                //#endregion
            }

            {
                //#region Search
            }

            {view !== ventas && < Grid container spacing={1} >
                <Grid item xs={12} container justify='flex-end' className={classes.search}>


                    <Grid item xs={12} sm={8} md={6} lg={8}>
                        <TextField variant='outlined' label='Nombre, Cédula o RUC' size='small'
                            margin='dense' value={searchText} fullWidth onChange={search}
                        />

                    </Grid>



                    {view === creditos && <Grid item xs={12} sm={4} md={3} lg={2} >
                        <div style={{ margin: '10px', display: 'flex', flexDirection: 'column' }}>
                            <DatePicker
                                selected={fechaDeCobro}
                                onChange={date => { setFechaDeCobro(date) }}
                                maxDate={new Date()}
                                showMonthDropdown
                                dateFormat="dd/MMMM/yyyy"
                                todayButton="Hoy"
                                customInput={<CustomDateInput />}
                            />
                            <div style={{ textAlign: 'center' }}>Fecha de Cobro</div>
                        </div>
                    </Grid>}


                </Grid>
            </Grid>}
            {
                //#endregion
            }
            {
                //#region RDT
            }
            <div style={{ marginTop: '30px' }}>
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