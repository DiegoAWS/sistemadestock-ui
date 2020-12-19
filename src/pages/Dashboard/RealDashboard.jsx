import React, { useState, useEffect, useRef } from "react";

import { Grid, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import ReportProblemRoundedIcon from "@material-ui/icons/ReportProblemRounded";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';


import { getRequest } from "../../API/apiFunctions";



//#region makeStyle

const useStyles = makeStyles({
    root: {
        backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)',
        backgroundColor: '#dedede',
        height: "80%",
        padding: "5px",
        margin: "10px",
        borderRadius: '10px'
    },
    numericValue: {
        textAlign: 'center',
        color: 'black',
        borderRadius: '10px',
        border: '1px solid black',
        padding: '10px',
        fontSize: "large",
        fontWeight: "bolder",
    },
    textCard: {
        padding: "10px",
        textAlign: "center",
        color: "blue",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

});

//#endregion

const formater = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
});

const RealDashboard = () => {
    const classes = useStyles();

    const isMounted = useRef(false)

    //#region STATE

    const [cantidadProductos, setCantidadProductos] = useState(0);
    const [productosFaltantes, setProductosFaltantes] = useState(0);
    const [inversionStock, setInversionStock] = useState(0);
    const [valorStock, setValorStock] = useState(0)




    const [dataStock, setDataStock] = useState([])

    const [dataVentas, setDataVentas] = useState([])

    //#endregion


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


    //#region campos Ventas

    const camposVentas = [
        'vendedor',
        'fechaVenta',
        'Stock_id',
        'Cliente_id',
        'Garantia',
        'Pago',
    ]

    //#endregion



    useEffect(() => {
        isMounted.current = true
        cargaData();
        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line   
    }, []);




    //#region Carga Data

    const cargaData = () => {
        getRequest("/ventas").then((request) => {
            if (
                request &&
                request.statusText === "OK" &&
                request.data &&

                request.data.Stock &&
                request.data.Ventas &&
                request.data.Clientes
            ) {




                //#region  Stock ----------------------------------

                let newDataStock = request.data.Stock.map(dataRequested => {

                    let instantData = {}

                    camposStock.forEach(item => { instantData[item[0]] = (!dataRequested[item[0]]) ? '' : dataRequested[item[0]] })




                    return { ...instantData, id: dataRequested.id }

                })

                //#endregion Stock




                //#region  Ventas ----------------------------------

                let newDataVentas = request.data.Ventas.map(dataRequested => {

                    let instantData = {}

                    camposVentas.forEach(item => { instantData[item[0]] = (!dataRequested[item[0]]) ? '' : dataRequested[item[0]] })




                    return { ...instantData, id: dataRequested.id }

                })

                //#endregion Ventas



                //#region Calculando Datos
                let faltantesP = newDataStock.filter((item) => item.Cantidad === 0 || item.Cantidad === '0' || !item.Cantidad).length;


                let inversion = 0;
                let valorSt = 0;
                newDataStock.forEach(item => {
                    inversion = inversion + item.CostoUnitario * item.Cantidad;
                    valorSt = valorSt + item.PrecioVentaContadoMinorista * item.Cantidad
                })

                if (isMounted.current) {
                    setDataStock(newDataStock)

                    setDataVentas(newDataVentas)
                    setProductosFaltantes(faltantesP);
                    setCantidadProductos(newDataStock.length - faltantesP);
                    setInversionStock(inversion);
                    setValorStock(valorSt)
                }
                //#endregion



            }
        })
    }
    //#endregion

    return (
        <>
            <Grid container direction="column">
                {
                    //#region Tarjetas
                }
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className={classes.root}>

                            <div className={classes.numericValue} style={{ backgroundColor: 'rgb(142 201 255)' }}>{cantidadProductos}</div>



                            <div className={classes.textCard} style={{ color: 'rgb(11 49 234)' }}>  <ImportantDevicesIcon />{' Productos en Stock (Total :' + dataStock.length + ')'}</div>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className={classes.root}>
                            <div className={classes.numericValue} style={{ backgroundColor: 'rgb(255 111 111)' }}>{productosFaltantes}</div>

                            <div className={classes.textCard} style={{ color: 'red' }}> <ReportProblemRoundedIcon /> Productos Faltantes </div>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className={classes.root}>
                            <div className={classes.numericValue} style={{ backgroundColor: 'rgb(86 255 169)' }}>{formater.format(inversionStock)}</div>

                            <div className={classes.textCard} style={{ color: 'rgb(34 144 83)' }}>  <LocalAtmIcon /> Inversión de stock </div>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className={classes.root}>
                            <div className={classes.numericValue} style={{ backgroundColor: '#5bc0de' }}>{formater.format(valorStock)}</div>

                            <div className={classes.textCard} style={{ color: 'rgb(0 74 71)' }}> <MonetizationOnIcon /> Valor base de Stock </div>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className={classes.root}>
                            <div className={classes.numericValue} style={{ backgroundColor: '#cbc0de' }}>{dataVentas.length}</div>

                            <div className={classes.textCard} style={{ color: 'rgb(0 174 71)' }}> <MonetizationOnIcon /> Total de Ventas </div>
                        </Card>
                    </Grid>
                </Grid>

                {
                    //#endregion
                }


            </Grid>
        </>
    );
};

export default RealDashboard;
