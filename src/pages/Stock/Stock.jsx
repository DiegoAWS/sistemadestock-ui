import React, { useState, useEffect, useRef } from 'react'
import { getRequest, deleteRequest } from '../../API/apiFunctions'

import Datatable from '../../components/Dashboard/Datatable'
import FormAddStock from '../../components/FormAdd/FormAddStock'


import { Button } from '@material-ui/core'


import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import AddIcon from '@material-ui/icons/Add'

import SaveAltIcon from '@material-ui/icons/SaveAlt';
import GridOnIcon from '@material-ui/icons/GridOn';

import CheckBoxIcon from '@material-ui/icons/CheckBox';



import { dateToString } from '../../API/timeFunctions'
import { exportToXLSX } from '../../components/exportImport/exportToXLSX'
const Stock = props => {


    //#region  CONST's State ----------------------------------


    const [buscar, setBuscar] = useState(false)

    const [openPopup, setOpenPopup] = useState(false)

    const [sinDatos, SetSinDatos] = useState(false)


    const [dataStock, setDataStock] = useState([])

    let initAjuste = {
        pMayorista: 102,
        pMinorista: 106.25,
        p3cuotas: 112.50,
        p6cuotas: 130,
        p12cuotas: 150,
        p18cuotas: 180,
        p24cuotas: 200
    }

    const [ajustesPrecios, setAjustesPrecio] = useState(initAjuste)


    const [proveedores, setProveedores] = useState([])

    const [loading, setLoading] = useState(true)

    const [seleccion, setSeleccion] = useState(false)
    const [clearSelection, setClearSelection] = useState(false)
    const [cantidadSeleccionados, setCantidadSeleccionados] = useState(0)
    const [elementosSeleccionados, setElementosSeleccionados] = useState([])

    //#endregion CONST's State

    //#region  campos Proveedores ----------------------------------

    const camposProveedores = [


        ['Proveedor', 'Proveedor', 'varchar'],
        ['Telefono', 'Teléfono', 'varchar'],
        ['Email', 'Email', 'varchar'],
        ['Direccion', 'Dirección', 'varchar'],
        ['OtrosDatos', 'Otros', 'varchar']


    ]
    //#endregion campos Proveedores

    //#region  campos Stock ----------------------------------


    const camposStock = [
        ['Codigo', 'Código', 'varchar'],
        ['Categoria', 'Categoría', 'categSelector'],
        ['Producto', 'Producto', 'varcharX'],
        ['Marca', 'Marca', 'varchar'],
        ['Color', 'Color', 'varchar'],
        ['Cantidad', 'Cantidad', 'double'],
        ['Garantia', 'Garantía', 'varchar'],
        ['Proveedor', 'Proveedor', 'varchar'],
        ['Factura', 'Factura de Compra', 'varchar'],
        ['FechaCompra', 'Fecha de Compra', 'datetime'],
        ['CostoUnitario', 'Costo Unitario', 'double'],
        ['PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'autoRellenar'],
        ['PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double'],
        ['PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double'],
        ['PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double'],
        ['PrecioVenta12Cuotas', 'Precio Venta 12 Cuotas', 'double'],
        ['PrecioVenta18Cuotas', 'Precio Venta 18 Cuotas', 'double'],
        ['PrecioVenta24Cuotas', 'Precio Venta 24 Cuotas', 'double']
    ]

    //#endregion campos Stock

    //#region   Form Stock ----------------------------------


    const initFormStock = {
        Proveedor: '',
        CostoUnitario: '',
        Cantidad: '',
        Factura: '',
        FechaCompra: dateToString(new Date()),
        Codigo: "",
        Garantia: ' month',
        Categoria: "",
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
    }

    const [formStock, setFormStock] = useState(initFormStock)



    //#endregion Inicializing the Form





    const fileName = 'Stock-' + (new Date()).toLocaleDateString('es-ES').replace(RegExp('/', 'gi'), '-')


    const editingValue = useRef({})

    const garantiaEs = useRef([])


    //#region  use Effect ----------------------------------

    // eslint-disable-next-line
    useEffect(() => { cargaData() }, [])

    useEffect(() => {
        if (dataStock.length > 0) {


            garantiaEs.current = dataStock.map(item => {
                let G = item.Garantia.split(' ')
                if (G.length === 2 && !isNaN(parseInt(G[0]))) {
                    let num = G[0]
                    let per = ''
                    switch (G[1]) {
                        case 'day':
                            per = num > 1 ? 'dias' : 'dia'
                            break
                        case 'month':
                            per = num > 1 ? 'meses' : 'mes'
                            break
                        case 'year':
                            per = num > 1 ? 'años' : 'año'
                            break


                        default:
                            break
                    }

                    return { ...item, Garantia: num + ' ' + per }
                }
                else
                    return { ...item, Garantia: 'SIN GARANTIA' }
            })
        }
    }, [dataStock])

    //#endregion use Effect



    //#region  Carga Data ----------------------------------

    const cargaData = () => {
        getRequest('/stocks').then(request => {


            setLoading(false)


            setOpenPopup(false)

            if (request && request.statusText === 'OK' && request.data && request.data.Proveedors && request.data.Stock && request.data.Ajuste) {

                //#region  Stock ----------------------------------

                setDataStock(request.data.Stock.map(dataRequested => {

                    let instantData = {}

                    camposStock.forEach(item => { instantData[item[0]] = (!dataRequested[item[0]]) ? '' : dataRequested[item[0]] })




                    return { ...instantData, id: dataRequested.id }

                }))

                //#endregion Stock


                //#region Proveedores
                const dataProveedores = request.data.Proveedors.map(dataRequested => {

                    let instantData = {}

                    camposProveedores.forEach(item => { instantData[item[0]] = (!dataRequested[item[0]]) ? '' : dataRequested[item[0]] })

                    return { ...instantData, id: dataRequested.id }

                })
                //#endregion
                setProveedores(dataProveedores)


                //#region  Ajuste Precio ----------------------------------

                if (request.data.Ajuste && request.data.Ajuste.length === 7) {

                    let dataRequested = request.data.Ajuste

                    let newAjuste = {}
                    dataRequested.forEach(item => { newAjuste = { ...newAjuste, [item.campo]: item.valor } })

                    setAjustesPrecio(newAjuste)


                } else {

                    setAjustesPrecio(initAjuste)

                }
                //#endregion Ajuste Precio

            }



            if (request && request.statusText === 'OK' && request.data && request.data.Stock.length === 0)
                SetSinDatos(true)

        })
    }

    //#endregion Carga Data

    //#region Españolizando GARANTIA


    //#endregion


    //#region  Edit Delete----------------------------------



    const editData = (item) => {

        editingValue.current = item

        var temp = dataStock.filter(it => it.id !== item.id)


        setDataStock(temp)

        setFormStock(item)
        setOpenPopup(true)



    }

    const deleteData = (itemDelete) => {

        clearform()

        setDataStock(dataStock.filter(it => it.id !== itemDelete.id))



        deleteRequest('/stocks/' + itemDelete.id)
            .then(() => {
                cargaData()

            })
    }



    //#endregion Edit Delete



    //#region  Others Functions ----------------------------------

    const clearform = () => {

        editingValue.current = {}
        setFormStock(initFormStock)

    }




    const recolocaEditItem = () => {
        setDataStock(dataStock.concat(editingValue.current))
    }

    const toggleSelections = () => {


        if (seleccion) {

            setClearSelection(true)

            setTimeout(() => { setClearSelection(false) }, 100);

        }


        setSeleccion(!seleccion)


    }
    const Seleccion = ({ selectedCount, selectedRows }) => {
        setCantidadSeleccionados(selectedCount)
        setElementosSeleccionados(selectedRows)

    }


    const conditionalRowStyles = [
        {
            when: row => row.Cantidad < 1,
            style: {
                backgroundColor: 'red',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'red',
                    color: 'white',
                }
            }
        }
    ]
    //#endregion Others Functions



    //#region  Return ----------------------------------



    return (
        <>
            <h5 style={{ margin: '0px', position: 'absolute', width: '70%', textAlign: 'center' }}>{seleccion ? cantidadSeleccionados + ' : Elementos Seleccionados' : ''}</h5>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>

                <div style={{ margin: '10px' }}>
                    <Button style={{ margin: '10px' }} variant="contained" color={!buscar ? "primary" : "secondary"} size='small'
                        disabled={loading}
                        startIcon={<SearchIcon />}

                        onClick={() => { setBuscar(!buscar) }} >Buscar</Button>
                    <Button style={{ margin: '10px' }} variant="contained" color={!seleccion ? "primary" : "secondary"} size='small'
                        disabled={loading}
                        startIcon={!seleccion && <MenuIcon />}
                        endIcon={seleccion && <CheckBoxIcon />}
                        onClick={(e) => { toggleSelections() }}>{seleccion ? cantidadSeleccionados + '  Elementos' : 'TODOS'}</Button>

                    <Button style={{ margin: '10px' }} variant="contained" color="primary" size='small'
                        disabled={loading}
                        startIcon={<AddIcon />}
                        endIcon={<LocalShippingIcon />}
                        onClick={() => { clearform(); setOpenPopup(true) }} >Añadir</Button>

                    <Button style={{ margin: '10px' }} variant="contained" color='secondary' size='small'
                        disabled={loading}
                        startIcon={<SaveAltIcon />}
                        endIcon={<GridOnIcon />}
                        onClick={(e) => {
                            if (seleccion && cantidadSeleccionados === 0) {
                                alert('Ningun elemento seleccionado')
                                return
                            }
                            exportToXLSX(seleccion ? elementosSeleccionados : dataStock, fileName, camposStock)
                        }}>{seleccion ? 'Exportar Selección' : 'Exportar a Excel'}</Button>

                </div>



            </div>

            <Datatable data={garantiaEs.current}
                buscar={buscar}
                seleccion={seleccion}
                sinDatos={sinDatos}
                SetSinDatos={SetSinDatos}
                campos={camposStock}

                clearSelection={clearSelection}
                Seleccion={Seleccion}
                conditionalRowStyles={conditionalRowStyles}
                handleDelete={deleteData}
                handleEdit={editData}
            />


            <FormAddStock
                openPopup={openPopup} setOpenPopup={setOpenPopup}
                formStock={formStock} setFormStock={setFormStock}
                loading={loading} setLoading={setLoading}
                proveedores={proveedores}
                cargaData={cargaData} recolocaEditItem={recolocaEditItem}
                ajustesPrecios={ajustesPrecios} dataStock={dataStock}
            />


        </>
    )

    //#endregion Return

}
export default Stock