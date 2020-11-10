import React, { useState, useEffect } from 'react'


import { postRequest, deleteRequest } from '../../API/apiFunctions'
import DataTable from 'react-data-table-component'

import { makeStyles, Button, Checkbox, FormControlLabel } from "@material-ui/core"

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import loadingGif from '../../assets/images/loading.gif'

import swal from '@sweetalert/with-react'

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

import es from 'date-fns/locale/es'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import isWithinInterval from 'date-fns/isWithinInterval'

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


const RegistroVentas = () => {
    const classes = useStyle()

    //#region  STATE ----------------------------------

    const [sinDatos, SetSinDatos] = useState(false)
    const [dataCreditos, setDataCreditos] = useState([])
    let HOY = new Date(format(new Date(), 'yyyy/MM/d'))
    const [inicioRango, setInicioRango] = useState(addDays(HOY, -7))
    const [finRango, setFinRango] = useState(addDays(HOY, 7))

    const [loading, setLoading] = useState(false)

    const [seleccionFecha, setSeleccionFecha] = useState(false)

    const [textoBotonRango, setTextoBotonRango] = useState('Seleccionar rango de fechas')
    //#endregion CONST's

    //#region Ventas cols
    const ingresos = row => {

        let total = 0

        if (row.Venta.Pago === "ventaCuotas")
            row.CreditosPagos.forEach(item => { total = total + parseInt(item.DebePagar) })

        if (row.Venta.Pago === "PrecioVentaContadoMinorista")
            total = row.Producto["PrecioVentaContadoMinorista"]



        return <div>{formater.format(total)}</div>
    }


    const tipoDeVenta = row => {
        let tipoVenta
        if (row.Venta.Pago === "ventaCuotas")
            tipoVenta = row.Creditos.length + ' cuotas'

        if (row.Venta.Pago === "PrecioVentaContadoMinorista")
            tipoVenta = 'Contado'

        if (row.Venta.Pago === "PrecioVentaContadoMayorista")
            tipoVenta = 'Mayorista x ' + row.Venta.CantidadComprada

        return <div>{tipoVenta}</div>
    }

    const columns = [
        {
            name: <div style={cellStyle}>Acciones</div>,
            style: cellStyle,
            cell: row => <Button variant='contained' color='primary' onClick={() => { verDetalles(row) }} >Detalles</Button>

        },
        {
            name: <div style={cellStyle}>Tipo</div>,
            style: cellStyle,
            cell: tipoDeVenta

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
            cell: row => <div>{row.Cliente ? row.Cliente.Nombre : 'VENTA AL CONTADO'}</div>
        },
        {
            name: <div style={cellStyle}>Ingresos</div>,
            style: cellStyle,
            cell: ingresos
        }

    ]
    //#endregion


    //#region useEffect

    useEffect(() => {

        cargaData()


        // eslint-disable-next-line
    }, [])

    //#endregion

    //#region  carga Data ----------------------------------

    const cargaData = () => {
        setDataCreditos([])
        SetSinDatos(false)


        postRequest('/ventarecords')
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

    //#region Data()

    const toDate = stringDate => new Date(stringDate.replace(/-/g, '/'))

    const data = () => {
        if (seleccionFecha) {

            let end = finRango
            if (!end) {
                end = inicioRango
            }
            let interval = {
                start: inicioRango,
                end: end
            }



            console.log(interval)

            return dataCreditos.filter(item => {
                console.log(toDate(item.Venta.fechaVenta))
                return isWithinInterval(toDate(item.Venta.fechaVenta), interval)
            })


        }
        else {
            return dataCreditos
        }
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
                <div className={classes.boxText}>{row.Cliente ? 'Cliente: ' + row.Cliente.Nombre : 'VENTA AL CONTADO'}</div>


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


    const textoInicioRango = () => {
        if (inicioRango)
            return format(inicioRango, "dd'/'MMM'/'yyyy")
        else
            return '--/--/----'
    }
    const textoFinRango = () => {
        if (finRango)
            return format(finRango, "dd'/'MMM'/'yyyy")
        else
            return '--/--/----'
    }

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <Button ref={ref} onClick={onClick} color='primary' variant='contained'>
            {textoBotonRango}
        </Button>
    ))
    return (
        <>


            {
                //#region Barra Opciones Visuales
            }
            <div style={{ display: 'flex' }}>
                <div style={{ backgroundColor: seleccionFecha ? '#3f51b5' : '#ff2650', color: 'white', borderRadius: '5px' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                color="secondary"
                                checked={seleccionFecha}
                                onChange={(e) => { setSeleccionFecha(e.target.checked) }}
                            />}

                        label="Ver Período de Tiempo"
                    />

                </div>
            </div>
            {
                //#endregion
            }
            {
                //#region Selector de fechas Inicio y Fin
            }
            {seleccionFecha && <div style={{ display: 'flex', zIndex: '10', flexDirection: 'column', backgroundColor: '#ffe6e6', borderRadius: '5px', justifyContent: 'center', minWidth: 'fit-content' }}>
                <div style={{ textAlign: 'center', fontSize: 'small', margin: '5px', }}>Rango de Fechas</div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'right', fontSize: 'small', margin: '5px', }}>{'De: ' + textoInicioRango()}</div>
                    < div style={{ textAlign: 'center', fontSize: 'small', margin: '5px', }}>{'A: ' + textoFinRango()}</div>
                </div>


                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <DatePicker
                        selected={inicioRango}
                        onChange={dates => {
                            const [start, end] = dates;

                            setInicioRango(start);
                            setFinRango(end);
                        }}
                        startDate={inicioRango}
                        endDate={finRango}
                        selectsRange
                        customInput={<CustomInput />}
                        onCalendarClose={() => {
                            if (finRango)
                                setTextoBotonRango('Seleccionar rango de fechas')
                            else
                                setTextoBotonRango('Seleccionar Fecha Final')
                        }}
                        onCalendarOpen={() => {
                            if (finRango)
                                setTextoBotonRango('Seleccionar Fecha Inicial')
                            else
                                setTextoBotonRango('Seleccionar Fecha Final')
                        }}


                    />
                </div>
            </div>
            }

            {
                //#endregion
            }


            {
                //#region RDT
            }
            <div style={{ marginTop: '30px' }}>
                <DataTable
                    columns={columns}
                    data={data()}
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

export default RegistroVentas