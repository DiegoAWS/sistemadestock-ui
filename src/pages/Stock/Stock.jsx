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
    //Open Close Form Producto
    const [openPopupProducto, setOpenPopupProducto] = useState(false)

    const [sinDatos, SetSinDatos] = useState(false)


    const [dataStock, setDataStock] = useState([]) //Data de la tabla STOCK
    const [dataProductos, setDataProductos] = useState([]) //Data de la tabla Productos

    const [dataFull, setDataFull] = useState([])

    const [ajustesPrecios, setAjustesPrecio] = useState({
        pMinorista: 106.25,
        p3cuotas: 112.50,
        p6cuotas: 130,
        p12cuotas: 150,
        p18cuotas: 180,
        p24cuotas: 200
    })




    const [loading, setLoading] = useState(true)

    const [seleccion, setSeleccion] = useState(false)
    const [clearSelection, setClearSelection] = useState(false)
    const [cantidadSeleccionados, setCantidadSeleccionados] = useState(0)
    const [elementosSeleccionados, setElementosSeleccionados] = useState([])

    //#endregion CONST's State

    //#region  campos Producto ----------------------------------

    const camposProducto = [


        ['Producto', 'Producto', 'varcharX'],
        ['Categoria', 'Categoría', 'categSelector'],

        ['Codigo', 'Código', 'varchar'],
        ['Marca', 'Marca', 'varchar'],

        ['Color', 'Color', 'varchar'],


        ['PrecioVentaContadoMayorista', 'Precio Venta Mayorista', 'autoRellenar'],

        ['PrecioVentaContadoMinorista', 'Precio Venta Minorista', 'double'],

        ['PrecioVenta3Cuotas', 'Precio Venta 3 Cuotas', 'double'],
        ['PrecioVenta6Cuotas', 'Precio Venta 6 Cuotas', 'double'],
        ['PrecioVenta12Cuotas', 'Precio Venta 12 Cuotas', 'double'],
        ['PrecioVenta18Cuotas', 'Precio Venta 18 Cuotas', 'double'],
        ['PrecioVenta24Cuotas', 'Precio Venta 24 Cuotas', 'double']


    ]
    //#endregion campos Producto

    //#region  campos Stock ----------------------------------

    const camposStock = [['id'], ['Producto_id'], ['Proveedor'], ['CostoUnitario'], ['Cantidad'], ['FechaCompra'], ['Factura']]

    //#endregion campos Stock

    //#region  campos datFull ----------------------------------

    const camposDataFull = [
        ['Codigo', 'Código', 'varchar'],

        ['Categoria', 'Categoría', 'categSelector'],
        ['Producto', 'Producto', 'varcharX'],

        ['Marca', 'Marca', 'varchar'],

        ['Color', 'Color', 'varchar'],

        ['Cantidad', 'Cantidad', 'double'],
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

    //#endregion campos datFull

    //#region  Inicializing the Form ----------------------------------


    const initFormStock = {
        Producto_id: '-1',
        Proveedor: '',
        CostoUnitario: '',
        Cantidad: '',
        Factura: '',
        FechaCompra: dateToString(new Date())
    }

    const [formStock, SetFormStock] = useState(initFormStock)



    //#endregion Inicializing the Form

    const fileName = 'Stock-' + (new Date()).toLocaleDateString('es-ES').replace(RegExp('/', 'gi'), '-')


    const editingValue = useRef({})



    //#region  use Effect ----------------------------------

    // eslint-disable-next-line
    useEffect(() => { cargaData() }, [])

    useEffect(() => {

        let newFullData = dataStock.map(item => {
            let newProducto = dataProductos.filter(itemProducto => itemProducto.id ? itemProducto.id.toString() === item.Producto_id : false

            )[0]




            return { ...item, ...newProducto, id: item.id }
        })

        setDataFull(newFullData)
    }, [dataStock, dataProductos])



    //#endregion use Effect



    //#region  Carga Data ----------------------------------

    const cargaData = () => {
        getRequest('/stocks').then(request => {


            setLoading(false)

            if (openPopupProducto)
                setOpenPopupProducto(false)
            else
                setOpenPopup(false)

            if (request && request.statusText === 'OK' && request.data && request.data.Productos && request.data.Stock && request.data.Ajuste) {


                //#region  Productos ----------------------------------

                setDataProductos(request.data.Productos.map(dataRequested => {

                    let instantData = {}

                    camposProducto.forEach(item => { instantData[item[0]] = (!dataRequested[item[0]]) ? '' : dataRequested[item[0]] })

                    return { ...instantData, id: dataRequested.id }

                }))

                //#endregion Productos

                //#region  Stock ----------------------------------

                setDataStock(request.data.Stock.map(dataRequested => {

                    let instantData = {}

                    camposStock.forEach(item => { instantData[item[0]] = (!dataRequested[item[0]]) ? '' : dataRequested[item[0]] })

                    return { ...instantData }

                }))

                //#endregion Stock

                //#region  Ajuste Precio ----------------------------------

                if (request.data.Ajuste[0]) {

                    let dataRequested = request.data.Ajuste[0]

                    let pMinorista = parseInt(dataRequested.pMinorista, 10)
                    let p3cuotas = parseInt(dataRequested.p3cuotas, 10)
                    let p6cuotas = parseInt(dataRequested.p6cuotas, 10)
                    let p12cuotas = parseInt(dataRequested.p12cuotas, 10)
                    let p18cuotas = parseInt(dataRequested.p18cuotas, 10)
                    let p24cuotas = parseInt(dataRequested.p24cuotas, 10)
                    if (!(isNaN(pMinorista) || isNaN(p3cuotas) || isNaN(p6cuotas) || isNaN(p12cuotas))) {


                        setAjustesPrecio(
                            {
                                pMinorista,
                                p3cuotas,
                                p6cuotas,
                                p12cuotas,
                                p18cuotas,
                                p24cuotas
                            })
                    }

                } else {

                    setAjustesPrecio(
                        {
                            pMinorista: 106.25,
                            p3cuotas: 112.50,
                            p6cuotas: 130,
                            p12cuotas: 150,
                            p18cuotas: 180,
                            p24cuotas: 200
                        })


                }
                //#endregion Ajuste Precio

            }



            if (request && request.statusText === 'OK' && request.data && request.data.Stock.length === 0)
                SetSinDatos(true)

        })
    }

    //#endregion Carga Data



    //#region  Edit Delete----------------------------------



    const editData = (item) => {

        editingValue.current = item

        var temp = dataStock.filter(it => it.id !== item.id)


        setDataStock(temp)

        SetFormStock(item)
        setOpenPopup(true)



    }

    const deleteData = (itemDelete) => {



        setDataStock(dataStock.filter(it => it.id !== itemDelete.id))

        clearform()

        deleteRequest('/stocks/' + itemDelete.id, formStock)
            .then(() => {
                cargaData()

            })
    }



    //#endregion Edit Delete



    //#region  Others Functions ----------------------------------

    const clearform = () => {

        editingValue.current = {}
        SetFormStock(initFormStock)

    }




    const recolocaEditItem = () => {
        setDataStock(dataStock.concat(editingValue.current))
    }
    //#endregion Others Functions


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
                            exportToXLSX(seleccion ? elementosSeleccionados : dataFull, fileName, camposDataFull)
                        }}>{seleccion ? 'Exportar Selección' : 'Exportar a Excel'}</Button>

                </div>



            </div>

            <Datatable data={dataFull}
                buscar={buscar}
                seleccion={seleccion}
                sinDatos={sinDatos}
                SetSinDatos={SetSinDatos}
                campos={camposDataFull}

                clearSelection={clearSelection}
                Seleccion={Seleccion}

                handleDelete={deleteData}
                handleEdit={editData}
            />


            <FormAddStock
                openPopup={openPopup} setOpenPopup={setOpenPopup}
                openPopupProducto={openPopupProducto} setOpenPopupProducto={setOpenPopupProducto}
                formStock={formStock} SetFormStock={SetFormStock}

                dataProductos={dataProductos} setDataProductos={setDataProductos}

                loading={loading} setLoading={setLoading}

                cargaData={cargaData} recolocaEditItem={recolocaEditItem}
                ajustesPrecios={ajustesPrecios} dataStock={dataStock}
            />


        </>
    )

    //#endregion Return

}
export default Stock