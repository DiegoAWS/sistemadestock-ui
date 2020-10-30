import React, { useState, useEffect } from 'react'


import { getRequest } from '../../API/apiFunctions'


import Datatable from '../../components/Dashboard/Datatable'




const Creditos = () => {
    //#region  CONST's ----------------------------------
    const [sinDatos, SetSinDatos] = useState(false)
    const [dataCreditos, setDataCreditos] = useState([]) //Data de la tabla



    //#region  campos Proveedores ----------------------------------

    const camposNormal = [

        ['ProximoPago', 'Próximo Pago'],
        ['Nombre', 'Nombre'],
        ['Producto', 'Producto'],
        ['CuotasPagas', 'Cuotas Pagadas']

    ]
    //#endregion campos Proveedores




    //#endregion CONST's

    // eslint-disable-next-line
    useEffect(() => { cargaData() }, [])



    //#region  carga Data ----------------------------------

    const cargaData = () => {

        getRequest('/creditos')
            .then(request => {
                SetSinDatos(true)
                console.log(request.data)
                if (request && request.data) {

                    let dataVentas = request.data.Ventas
                    let dataClientes = request.data.Clientes
                    let dataCreditos = request.data.Creditos

                    let dataStock = request.data.Stock

                    let fullData = []


                    let CreditosFaltantes = dataCreditos.filter(item => item.FechaRealDePago.length === 0)

                    let VentasEnCuotas = dataVentas.filter(item => item.Pago === "ventaCuotas")

                    console.log(dataVentas)
                    let VentasPreparadas = VentasEnCuotas.map(item => {
                        let itemCreditos = dataCreditos.filter(ite => ite.VentaNewId === item.newId).
                            sort((a, b) => a.FechaPago < b.FechaPago ? 1 : -1)

                        console.log(itemCreditos)
                    })

                    setDataCreditos(fullData)

                }
                if (request && request.statusText === 'OK' && request.data && request.data.length === 0)
                    SetSinDatos(true)

            })
    }



    //#endregion


    //#region  Return ----------------------------------




    return (
        <>

            <h1>WORK IN PROGRESS...</h1>
            {/* <Datatable
                data={[]}
                sinDatos={sinDatos}
                campos={camposNormal}
                responsive
                handleDelete={() => { }}
                handleEdit={() => { }}
            /> */}







        </>

    )
    //#endregion Others Functions
}

export default Creditos