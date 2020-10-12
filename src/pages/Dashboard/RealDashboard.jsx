import React, { useState, useEffect } from "react";

import { Grid, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ImportantDevicesIcon from "@material-ui/icons/ImportantDevices";
import ReportProblemRoundedIcon from "@material-ui/icons/ReportProblemRounded";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';


import { getRequest } from "../../API/apiFunctions";
import AreaGraph from './AreaGraph'


//#region fakeData
const data = [
    {
        "name": "Enero",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Febrero",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Marzo",
        "Inversiones": 2000,
        "Ganancia Neta": 6800,
        "amt": 2290
    },
    {
        "name": "Abril",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Mayo",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    },
    {
        "name": "Junio",
        "Inversiones": 2390,
        "Ganancia Neta": 3800,
        "amt": 2500
    },
    {
        "name": "Julio",
        "Inversiones": 3490,
        "Ganancia Neta": 4300,
        "amt": 2100
    }, {
        "name": "Agosto",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Septiembre",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Octubre",
        "Inversiones": 2000,
        "Ganancia Neta": 9800,
        "amt": 2290
    },
    {
        "name": "Noviembre",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Diciembre",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    }, {
        "name": "Enero",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Febrero",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Marzo",
        "Inversiones": 2000,
        "Ganancia Neta": 6800,
        "amt": 2290
    },
    {
        "name": "Abril",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Mayo",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    },
    {
        "name": "Junio",
        "Inversiones": 2390,
        "Ganancia Neta": 3800,
        "amt": 2500
    },
    {
        "name": "Julio",
        "Inversiones": 3490,
        "Ganancia Neta": 4300,
        "amt": 2100
    }, {
        "name": "Agosto",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Septiembre",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Octubre",
        "Inversiones": 2000,
        "Ganancia Neta": 9800,
        "amt": 2290
    },
    {
        "name": "Noviembre",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Diciembre",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    }, {
        "name": "Enero",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Febrero",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Marzo",
        "Inversiones": 2000,
        "Ganancia Neta": 6800,
        "amt": 2290
    },
    {
        "name": "Abril",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Mayo",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    },
    {
        "name": "Junio",
        "Inversiones": 2390,
        "Ganancia Neta": 3800,
        "amt": 2500
    },
    {
        "name": "Julio",
        "Inversiones": 3490,
        "Ganancia Neta": 4300,
        "amt": 2100
    }, {
        "name": "Agosto",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Septiembre",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Octubre",
        "Inversiones": 2000,
        "Ganancia Neta": 9800,
        "amt": 2290
    },
    {
        "name": "Noviembre",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Diciembre",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    }, {
        "name": "Enero",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Febrero",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Marzo",
        "Inversiones": 2000,
        "Ganancia Neta": 6800,
        "amt": 2290
    },
    {
        "name": "Abril",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Mayo",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    },
    {
        "name": "Junio",
        "Inversiones": 2390,
        "Ganancia Neta": 3800,
        "amt": 2500
    },
    {
        "name": "Julio",
        "Inversiones": 3490,
        "Ganancia Neta": 4300,
        "amt": 2100
    }, {
        "name": "Agosto",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Septiembre",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Octubre",
        "Inversiones": 2000,
        "Ganancia Neta": 9800,
        "amt": 2290
    },
    {
        "name": "Noviembre",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Diciembre",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    }, {
        "name": "Enero",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Febrero",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Marzo",
        "Inversiones": 2000,
        "Ganancia Neta": 6800,
        "amt": 2290
    },
    {
        "name": "Abril",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Mayo",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    },
    {
        "name": "Junio",
        "Inversiones": 2390,
        "Ganancia Neta": 3800,
        "amt": 2500
    },
    {
        "name": "Julio",
        "Inversiones": 3490,
        "Ganancia Neta": 4300,
        "amt": 2100
    }, {
        "name": "Agosto",
        "Inversiones": 4000,
        "Ganancia Neta": 2400,
        "amt": 2400
    },
    {
        "name": "Septiembre",
        "Inversiones": 3000,
        "Ganancia Neta": 1398,
        "amt": 2210
    },
    {
        "name": "Octubre",
        "Inversiones": 2000,
        "Ganancia Neta": 9800,
        "amt": 2290
    },
    {
        "name": "Noviembre",
        "Inversiones": 2780,
        "Ganancia Neta": 3908,
        "amt": 2000
    },
    {
        "name": "Diciembre",
        "Inversiones": 1890,
        "Ganancia Neta": 4800,
        "amt": 2181
    },

]
//#endregion

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


    //#region STATE

    const [cantidadProductos, setCantidadProductos] = useState(0);
    const [productosFaltantes, setProductosFaltantes] = useState(0);
    const [inversionStock, setInversionStock] = useState(0);
    const [valorStock, setValorStock] = useState(0)






    //#endregion

    //#region  campos Producto ----------------------------------

    const camposProducto = [
        ["Producto", "Producto", "varcharX"],
        ["Categoria", "Categoría", "categSelector"],

        ["Codigo", "Código", "varchar"],
        ["Marca", "Marca", "varchar"],

        ["Color", "Color", "varchar"],

        ["PrecioVentaContadoMayorista", "Precio Venta Mayorista", "autoRellenar"],

        ["PrecioVentaContadoMinorista", "Precio Venta Minorista", "double"],

        ["PrecioVenta3Cuotas", "Precio Venta 3 Cuotas", "double"],
        ["PrecioVenta6Cuotas", "Precio Venta 6 Cuotas", "double"],
        ["PrecioVenta12Cuotas", "Precio Venta 12 Cuotas", "double"],
        ["PrecioVenta18Cuotas", "Precio Venta 18 Cuotas", "double"],
        ["PrecioVenta24Cuotas", "Precio Venta 24 Cuotas", "double"],
    ];
    //#endregion campos Producto

    //#region  campos Stock ----------------------------------

    const camposStock = [
        ["id"],
        ["Producto_id"],
        ["Proveedor"],
        ["CostoUnitario"],
        ["Cantidad"],
        ["FechaCompra"],
        ["Factura"],
    ];

    //#endregion campos Stock

    // eslint-disable-next-line
    useEffect(() => { cargaData(); }, []);




    //#region Carga Data

    const cargaData = () => {
        getRequest("/stocks").then((request) => {
            if (
                request &&
                request.statusText === "OK" &&
                request.data &&
                request.data.Productos &&
                request.data.Stock &&
                request.data.Ajuste
            ) {
                //#region  Productos ----------------------------------

                let dataProductos = request.data.Productos.map((dataRequested) => {
                    let instantData = {};

                    camposProducto.forEach((item) => {
                        instantData[item[0]] = !dataRequested[item[0]]
                            ? ""
                            : dataRequested[item[0]];
                    });

                    return { ...instantData, id: dataRequested.id };
                })


                //#endregion Productos

                //#region  Stock ----------------------------------

                let dataStock = request.data.Stock.map((dataRequested) => {
                    let instantData = {};

                    camposStock.forEach((item) => {
                        instantData[item[0]] = !dataRequested[item[0]]
                            ? ""
                            : dataRequested[item[0]];
                    });

                    return { ...instantData };
                });




                //#endregion Stock

                //#region DataFull
                let fullData = dataStock.map((item) => {
                    let newProducto = dataProductos.filter((itemProducto) =>
                        itemProducto.id
                            ? itemProducto.id.toString() === item.Producto_id
                            : false
                    )[0];

                    return { ...item, ...newProducto, id: item.id };
                })
                //#endregion 



                //#region Calculando Datos
                let faltantesP = dataStock.filter((item) => item.Cantidad === 0).length;


                let inversion = 0;
                let valorSt = 0;
                fullData.forEach(item => {
                    inversion = inversion + item.CostoUnitario * item.Cantidad;
                    valorSt = valorSt + item.PrecioVentaContadoMinorista * item.Cantidad
                })



                setProductosFaltantes(faltantesP);
                setCantidadProductos(dataStock.length - faltantesP);
                setInversionStock(inversion);
                setValorStock(valorSt)
                //#endregion



            }
        })
    }
    //#endregion

    return (
        <>
            <Grid container direction="column" spacing={3}>
                {
                    //#region Tarjetas
                }
                <Grid container item xs={12}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card className={classes.root}>

                            <div className={classes.numericValue} style={{ backgroundColor: 'rgb(142 201 255)' }}>{cantidadProductos}</div>



                            <div className={classes.textCard} style={{ color: 'rgb(11 49 234)' }}>  <ImportantDevicesIcon /> Cantidad de Productos en Stock </div>
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
                </Grid>

                {
                    //#endregion
                }
                <AreaGraph data={data} />

            </Grid>
        </>
    );
};

export default RealDashboard;
