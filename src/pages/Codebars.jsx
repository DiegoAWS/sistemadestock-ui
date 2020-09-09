import React, { useState, useEffect } from 'react';
import { getRequest } from '../API/apiFunctions'
import { Grid } from '@material-ui/core';
import Barcode from 'react-barcode'

import loadingIcon from '../assets/images/loading.gif'
const Codebars = props => {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {



        getRequest('/productos')
            .then(request => {
                setLoading(false)
                if (request && request.data && request.data[0] && request.data[0].Codigo) {

                    setProductos(request.data)

                }

            })


        // eslint-disable-next-line
    }, [])

    return (

        <Grid container spacing={6}>
            {loading && <Grid item container xs={12} justify={'center'}><img src={loadingIcon} width='40px' alt='' /></Grid>}

            {


                productos.map(item => (
                    <Grid item xs={3} key={item.id}>
                        <Barcode value={item.Codigo} />
                        <div>{item.Producto}</div>
                        <div>{'G ' + item.PrecioVentaContadoMinorista}</div>
                    </Grid>

                ))
            }

        </Grid>
    )

}
export default Codebars;


/*
{
    Barcode Options
  width: 2,
  height: 100,
  format: "CODE128",
  displayValue: true,
  fontOptions: "",
  font: "monospace",
  textAlign: "center",
  textPosition: "bottom",
  textMargin: 2,
  fontSize: 20,
  background: "#ffffff",
  lineColor: "#000000",
  margin: 10,
  marginTop: undefined,
  marginBottom: undefined,
  marginLeft: undefined,
  marginRight: undefined
}

*/