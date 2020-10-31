import React, { useState, useEffect, useMemo } from 'react'


import { getRequest } from '../../API/apiFunctions'
import DataTable from 'react-data-table-component'

import { Button, makeStyles, Grid, TextField } from "@material-ui/core"

import loading from '../../assets/images/loading.gif'

import swal from '@sweetalert/with-react'



const formater = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
});

//#region JSS
const useStyle = makeStyles(() => ({
    search: {

    },
}))
const Creditos = () => {
    const classes = useStyle()
    //#region  STATE ----------------------------------

    const [sinDatos, SetSinDatos] = useState(false)
    const [dataCreditos, setDataCreditos] = useState([])
    const [searchText, setSearchText] = useState('')
    const [dataSearched, setDataSearched] = useState([])
    //#endregion CONST's


    //#region 

    //#endregion


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

    let cellStyle = {
        // padding: '5px',

    }

    var columns =
        [
            {
                name: <div >Pagar</div>,
                style: cellStyle,
                cell: row => <Button variant='contained' color='secondary' onClick={() => { pagarCuota(row) }} >Pagar</Button>
            },
            {
                name: <div >Detalles</div>,
                style: cellStyle,
                cell: row => <Button variant='contained' color='primary' onClick={() => { verDetalles(row) }} >Detalles</Button>
            },
            {
                name: 'Producto',
                style: cellStyle,
                cell: row => <div>{row.Producto.Producto}</div>
            },
            {
                name: 'Cliente',
                style: cellStyle,
                cell: row => <div>{row.Cliente.Nombre}</div>
            },
            {
                name: 'Cuotas',
                style: cellStyle,
                cell: row => <div>{row.CreditosPagos.length + ' de ' + row.Creditos.length}</div>
            },
            {
                name: 'Próximo Pago',
                style: cellStyle,
                selector: 'ProximoPago',
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

        let cantidadTotalCuotas = row.Creditos.length
        let cantidadCuotasPagas = 1 + row.CreditosPagos.length
        let cuotaX = row.CreditosPendientes.sort((a, b) => a.FechaPago > b.FechaPago ? 1 : -1)[0]

        let cantidadAPagar = cuotaX.DebePagar
        let fechaPago = new Date(cuotaX.FechaPago.replace(/-/g, '/'))

        let fechaPagoFormated = fechaPago.getDate() + ' de ' + fechaPago.getMonth() + ' del ' + fechaPago.getFullYear()
        console.log(cuotaX.FechaPago, fechaPago)


        if (cantidadAPagar && !isNaN(parseInt(cantidadAPagar))) {
            let cantidadAPagarFormated = formater.format(cantidadAPagar)


            swal({
                title: cantidadAPagarFormated + '\n\n' + fechaPagoFormated,
                text: 'Pago de Cuota # ' + cantidadCuotasPagas + ' de ' + cantidadTotalCuotas,
                icon: "warning",
                button: "PAGAR",
            })
                .then(() => {
                    console.log(row)
                })
            //SEND PAGA CUOTAS
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
                paddingLeft: '8px', // override the cell padding for head cells
                paddingRight: '8px',
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




    return (
        <>
            <Grid container spacing={1} >
                <Grid item xs={12} style={{ textAlign: 'center', backgroundColor: 'black', color: 'gold' }}> <h1>En Construccion...</h1></Grid>
                <Grid item xs={12} container className={classes.search}>
                    <TextField variant='outlined' label='Nombre Cédula o RUC' fullWidth
                        value={searchText}
                        onChange={search}
                    />
                </Grid>
            </Grid>
            <DataTable
                columns={useMemo(() => columns, [columns])}
                data={searchText && searchText.length > 0 ? dataSearched : dataCreditos}
                keyField={'id'}
                defaultSortField={'ProximoPago'}
                defaultSortAsc
                customStyles={customStyles}
                pagination
                highlightOnHover
                dense
                noHeader
                responsive
                noDataComponent={sinDatos ? <div><hr /><h3>Sin Resultados que mostrar</h3><hr /></div> : <img src={loading} width='20px' alt='' />}
                paginationComponentOptions={{
                    rowsPerPageText: 'Filas por Pagina:',
                    rangeSeparatorText: 'de'
                }}
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
            />







        </>

    )
    //#endregion Others Functions
}

export default Creditos