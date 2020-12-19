import React, { useState, useEffect, useRef } from 'react'
import { getRequest, deleteRequest } from '../../API/apiFunctions'

import Datatable from '../../components/Datatable/Datatable'
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

import { jsPDF } from "jspdf"
import Canvg from 'canvg'
import Barcode from 'react-barcode'

import PrintIcon from '@material-ui/icons/Print'
import logoEtiqueta from '../../assets/images/logoEtiqueta.png'

const Stock = props => {

    const isMounted = useRef(false)
    //#region  CONST's State ----------------------------------


    const [buscar, setBuscar] = useState(false)

    const [openPopup, setOpenPopup] = useState(false)
    const [openProveedorPopup, setOpenProveedorPopup] = useState(false)

    const [sinDatos, SetSinDatos] = useState(false)


    const [dataStock, setDataStock] = useState([])



    let initAjuste = {
        pMayorista: 2,
        pMinorista: 6.25,
        p3cuotas: 12.50,
        p6cuotas: 30,
        p12cuotas: 50,
        p18cuotas: 80,
        p24cuotas: 100
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
        ['EntradaInicial', 'Entrada Inicial', 'double'],
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
        EntradaInicial: "",
        PrecioVenta3Cuotas: "",
        PrecioVenta6Cuotas: "",
        PrecioVenta12Cuotas: "X",
        PrecioVenta18Cuotas: "",
        PrecioVenta24Cuotas: ""
    }

    const [formStock, setFormStock] = useState(initFormStock)

    const formInitProveedores = {
        Proveedor: '',
        Telefono: '',
        Email: '',
        Direccion: '',
        OtrosDatos: ''
    }
    const [formProveedores, SetFormProveedores] = useState(formInitProveedores)
    //#endregion Inicializing the Form




    const fileName = 'Stock-' + (new Date()).toLocaleDateString('es-ES').replace(RegExp('/', 'gi'), '-')


    const editingValue = useRef({})


    const [dataMostrar, setDataMostrar] = useState([])

    //#region  use Effect ----------------------------------

    // eslint-disable-next-line
    useEffect(() => {
        isMounted.current = true
        cargaData();
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line   
    }, []);
    useEffect(() => {
        if (dataStock.length > 0) {


            setDataMostrar(dataStock.map(item => {
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
            }))
        }
    }, [dataStock])

    //#endregion use Effect



    //#region  Carga Data ----------------------------------

    const cargaData = () => {
        getRequest('/stocks').then(request => {
            if (isMounted) {

                setLoading(false)

                if (openProveedorPopup)
                    setOpenProveedorPopup(false)
                else
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
            }
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


    //#region Crear PDF
    const formater = new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
    });


    const precio = (s) => formater.format(s)

    const crearPDF = (data) => {
        var doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [90, 29],
            title: "PDF Diego"
        })


        data.forEach((prod, i) => {




            // Generate PDF
            for (let ind = 0; ind < prod.Cantidad; ind++) {

                let svg = document.getElementsByClassName('b-' + i)[0].innerHTML

                if (svg)
                    svg = svg.replace(/\r?\n|\r/g, '').trim()

                let canvas = document.createElement('canvas')


                let ctx = canvas.getContext('2d')

                let v = Canvg.fromString(ctx, svg)

                v.start()


                let imgData = canvas.toDataURL('image/png')



                doc.rect(1, 1, 88, 27)
                doc.addImage(logoEtiqueta, 'PNG', 12, 15, 20, 10, null, null, 90)

                doc.addImage(imgData, 'PNG', 15, 15, 20, 10)

                doc.setFontSize(11)

                doc.text(prod.Producto.substring(0, 32), 48, 5, null, null, "center")

                doc.setFontSize(9)
                doc.text('CONTADO', 25, 10, null, null, "center")

                doc.setFontSize(8)
                doc.text(precio(prod.PrecioVentaContadoMinorista), 25, 14, null, null, "center")

                doc.rect(40, 8, 46, 18)
                doc.line(40, 17, 86, 17)
                doc.line(63, 8, 63, 26)


                doc.text('3x ' + precio(prod.PrecioVenta3Cuotas), 51, 13.5, null, null, "center")
                doc.text('6x ' + precio(prod.PrecioVenta6Cuotas), 51, 22.5, null, null, "center")

                doc.text('12x ' + precio(prod.PrecioVenta12Cuotas), 74, 13.5, null, null, "center")

                if (!isNaN(parseInt(prod.PrecioVenta18Cuotas)) && parseInt(prod.PrecioVenta18Cuotas) > 1000 && isNaN(parseInt(prod.PrecioVenta24Cuotas)))
                    doc.text('18x ' + precio(prod.PrecioVenta18Cuotas), 74, 22.5, null, null, "center")

                else if (!isNaN(parseInt(prod.PrecioVenta24Cuotas)) && parseInt(prod.PrecioVenta24Cuotas) > 1000 && isNaN(parseInt(prod.PrecioVenta18Cuotas)))
                    doc.text('24x ' + precio(prod.PrecioVenta24Cuotas), 74, 22.5, null, null, "center")
                else if (!isNaN(parseInt(prod.PrecioVenta18Cuotas)) && !isNaN(parseInt(prod.PrecioVenta24Cuotas))
                    && parseInt(prod.PrecioVenta18Cuotas) > 1000 && parseInt(prod.PrecioVenta24Cuotas) > 1000) {
                    doc.text('18x ' + precio(prod.PrecioVenta18Cuotas), 74, 21, null, null, "center")
                    doc.text('24x ' + precio(prod.PrecioVenta24Cuotas), 74, 25, null, null, "center")
                }




                if (!(i + 1 === data.length && ind + 1 === prod.Cantidad))
                    doc.addPage([90, 29], "landscape")

            }




        })
        doc.autoPrint({ variant: 'non-conform' })
        // doc.save('Imprimir.pdf')
        let x = window.open(URL.createObjectURL(doc.output("blob", 'PRINT')))

        x.onload = e => {

            // setTimeout(() => {
            //     x.close()
            // }, 20000)
        }
        x.onafterprint = e => {
            alert('AFTERPRINT')
        }
        x.onbeforeprint = e => {
            alert('Before')
        }

    }



    //#endregion


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

                    <Button style={{ margin: '10px' }} variant='contained' color='secondary' size='small'
                        disabled={loading}
                        onClick={e => {
                            if (seleccion && cantidadSeleccionados === 0) {
                                alert('Ningun elemento seleccionado')
                                return
                            }

                            crearPDF(seleccion ? elementosSeleccionados : dataStock)
                        }}>{seleccion ? 'Imprimir selección' : 'Imprimir Etiquetas'}<PrintIcon /> </Button>


                </div>



            </div>

            <Datatable data={dataMostrar}
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
                ajustesPrecios={ajustesPrecios} setAjustesPrecio={setAjustesPrecio} dataStock={dataStock}
                openProveedorPopup={openProveedorPopup} setOpenProveedorPopup={setOpenProveedorPopup}
                formProveedores={formProveedores} SetFormProveedores={SetFormProveedores}
            />



            {


                dataStock.map((item, i) => (

                    <div key={item.id} style={{ display: 'none' }}>
                        <div className={'b-' + i}>
                            <Barcode
                                width={1}
                                value={item.Codigo && item.Codigo.toString().length > 0 ? item.Codigo.toString() : 'SIN CODIGO'}

                            />
                        </div>

                    </div>

                ))
            }

        </>
    )

    //#endregion Return

}
export default Stock