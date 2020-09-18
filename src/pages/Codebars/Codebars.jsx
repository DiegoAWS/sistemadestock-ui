import React, { useState, useEffect } from 'react'
import { jsPDF } from "jspdf"
import Canvg from 'canvg'

import { getRequest } from '../../API/apiFunctions'
import { Grid, Button } from '@material-ui/core'
import Barcode from 'react-barcode'

import PrintIcon from '@material-ui/icons/Print'


import loadingIcon from '../../assets/images/loading.gif'
import logoEtiqueta from '../../assets/images/logoEtiqueta.png'

const Codebars = props =>
{

    const [ productos, setProductos ] = useState( [] )
    const [ loading, setLoading ] = useState( true )



    useEffect( () =>
    {



        getRequest( '/productos' )
            .then( request =>
            {
                setLoading( false )

                if ( request && request.data && request.data.Productos && request.data.Productos[ 0 ] && request.data.Productos[ 0 ].Codigo )
                {

                    setProductos( request.data.Productos )

                }

            } )


        // eslint-disable-next-line
    }, [] )


    const precio = ( p, c ) => ( Math.round( ( p / c ) / 1000 ) + '.000' )

    const crearPDF = () =>
    {
        var doc = new jsPDF( {
            orientation: "landscape",
            unit: "mm",
            format: [ 90, 29 ]
        } )
        productos.forEach( ( prod, i ) =>
        {

            let svg = document.getElementsByClassName( 'b-' + i )[ 0 ].innerHTML

            if ( svg )
                svg = svg.replace( /\r?\n|\r/g, '' ).trim()

            let canvas = document.createElement( 'canvas' )


            let ctx = canvas.getContext( '2d' )

            let v = Canvg.fromString( ctx, svg )

            v.start()


            let imgData = canvas.toDataURL( 'image/png' )





            // Generate PDF





            doc.rect( 1, 1, 88, 27 )
            doc.addImage( logoEtiqueta, 'PNG', 12, 15, 20, 10, null, null, 90 )

            doc.addImage( imgData, 'PNG', 15, 15, 20, 10 )

            doc.setFontSize( 11 )
            doc.text( prod.Producto, 48, 5, null, null, "center" )

            doc.setFontSize( 9 )
            doc.text( 'CONTADO', 25, 10, null, null, "center" )

            doc.setFontSize( 8 )
            doc.text( 'Gs. ' + precio( prod.PrecioVentaContadoMinorista, 1 ), 25, 14, null, null, "center" )

            doc.rect( 40, 8, 46, 18 )
            doc.line( 40, 17, 86, 17 )
            doc.line( 63, 8, 63, 26 )


            doc.text( '3x' + precio( prod.PrecioVenta3Cuotas, 3 ), 51, 13.5, null, null, "center" )
            doc.text( '6x' + precio( prod.PrecioVenta6Cuotas, 6 ), 51, 22.5, null, null, "center" )

            doc.text( '12x' + precio( prod.PrecioVenta12Cuotas, 12 ), 74, 13.5, null, null, "center" )

            if ( parseInt( prod.PrecioVenta18Cuotas ) > 100 )
                doc.text( '18x' + precio( prod.PrecioVenta18Cuotas, 18 ), 74, 22.5, null, null, "center" )





            if ( i + 1 !== productos.length )
                doc.addPage( [ 90, 29 ], "landscape" )
        } )
        doc.autoPrint( { variant: 'non-conform' } )
        doc.save( 'Imprimir.pdf' )




    }


    return (


        <Grid container spacing={ 3 } style={ { width: '90vw' } }>
            <Grid item xs={ 12 } style={ { display: 'flex', justifyContent: 'flex-end' } }>

                <Button variant='contained' color='primary' onClick={ e => { crearPDF() } }>Imprimir <PrintIcon /></Button>
            </Grid>


            { loading && <Grid item container xs={ 12 } justify={ 'center' }><img src={ loadingIcon } width='24px' alt='' /></Grid> }

            {


                productos.map( ( item, i ) => (

                    <Grid item xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } xl={ 2 } key={ item.id }>
                        <div className={ 'b-' + i }>
                            <Barcode value={ item.Codigo } />
                        </div>
                        <div>{ item.Producto }</div>
                        <div>{ 'G ' + item.PrecioVentaContadoMinorista }</div>
                    </Grid>

                ) )
            }

        </Grid>
    )

}
export default Codebars


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