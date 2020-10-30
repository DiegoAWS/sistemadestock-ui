import React, { useState, useEffect, useMemo } from 'react'


import { getRequest } from '../../API/apiFunctions'
import DataTable from 'react-data-table-component'
//makeStyles, Grid, Card, TextField, Typography, IconButton, Divider

import { Button } from "@material-ui/core"
import loading from '../../assets/images/loading.gif'


const Creditos = () => {

    //#region  STATE ----------------------------------

    const [sinDatos, SetSinDatos] = useState(false)
    const [dataCreditos, setDataCreditos] = useState([])

    //#endregion CONST's


    //#region Columns


    // let totalCuotas = itemCreditos.length
    // let cuotasPagadas = itemCreditosPagados.length
    // let proximoPago = 'PAGADO'

    // if (itemCreditosPendientes.length > 0)
    //     proximoPago = itemCreditosPendientes
    //         .sort((a, b) => a.FechaPago > b.FechaPago ? 1 : -1)[0].FechaPago

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
        [{
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


            <DataTable
                columns={useMemo(() => columns, [columns])}
                data={dataCreditos}
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