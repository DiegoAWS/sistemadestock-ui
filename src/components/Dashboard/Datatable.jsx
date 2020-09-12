import React, { useState, useEffect } from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import { Button } from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'

import loading from '../../assets/images/loading.gif'

function Datatable ( { campos, sinDatos, data, handleDelete, handleEdit } )
{



  const [ state, setState ] = useState( {
    allInLine: true,
    cantidadColumnas: 0
  } )

  const preparaColumnas = () =>
  {


    let capacidad = Math.floor( ( window.innerWidth - 360 ) / 100 )
    let allInLine = ( campos.length < capacidad )



    setState( {
      allInLine,
      cantidadColumnas: allInLine ? campos.length : capacidad

    } )
  }



  useEffect( preparaColumnas, [ campos ] )






  window.onresize = e => { preparaColumnas() }




  if ( !data )
    data = []

  var op = {
    rowsPerPageText: 'Filas por Pagina:',
    rangeSeparatorText: 'de'
  }
  createTheme( 'tableTheme', {
    text: {
      primary: '#268bd2',
      secondary: '#2aa198',
    },
    background: {
      default: 'white',
    },

    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    striped: {
      default: 'black',
      text: 'white',
    },
    highlightOnHover: {
      default: '#ebebeb',
      text: 'rgba(0, 0, 0, 0.87)',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    },
  } )

  var columns = !state.allInLine ? [] : [ {
    width: '140px',
    compact: true,
    cell: row => actionsButtons( row )
  }
  ]

  columns = columns.concat( campos.map( item => ( {

    name: item[ 1 ],
    selector: item[ 0 ],
    sortable: true,

  } ) ) )


  const actionsButtons = data => (
    <>
      <Button onClick={ e => handleDelete( data ) }
        style={ { margin: '5px 10px 5px 0' } }
        title='Borrar Producto' color="secondary"
        variant="contained">

        <DeleteForeverIcon />

      </Button>

      <Button onClick={ ( e ) => handleEdit( data ) }
        title='Borrar Producto' color="primary"
        variant="contained">

        <EditIcon />

      </Button>
    </>
  )

  const NoFitItems = ( { newCols, data } ) => (

    <div style={ { display: 'flex' } }>

      { newCols.map( ( item, i ) => (
        <div key={ i } style={ { border: '1px solid black', borderRadius: '10px', margin: '10px' } }>
          <h5>  { item.name }</h5>
          <span>  { data[ item.selector ] }</span>
        </div>
      ) ) }
    </div>
  )

  const ExpandedComponent = ( { data } ) =>
  {


    var newCols = columns.slice( state.cantidadColumnas )



    return (


      <div style={ { display: 'flex', border: '4px solid black', borderRadius: '5px', borderTop: '', alignItems: 'center' } }>


        { actionsButtons( data ) }

        { ( newCols.length > 0 ) && <NoFitItems
          newCols={ newCols }
          data={ data }
        /> }


      </div >

    )

  }



  return (
    <div style={ { width: 250 + state.cantidadColumnas * 100, borderRadius: '10px', margin: '0 20px 0 0' } }>
      <DataTable
        columns={ state.allInLine ? columns.slice( 0, state.cantidadColumnas + 1 ) : columns.slice( 0, state.cantidadColumnas ) }
        data={ data }
        keyField={ 'id' }
        defaultSortField={ 'id' }
        defaultSortAsc={ false }
        pagination
        highlightOnHover
        dense
        noHeader
        expandableRows={ !state.allInLine }

        expandOnRowDoubleClicked={ !state.allInLine }
        expandableRowsComponent={ <ExpandedComponent /> }
        noDataComponent={ sinDatos ? <div><hr /><h3>SIN DATOS</h3><hr /></div> : <img src={ loading } width='20px' alt='' /> }
        paginationComponentOptions={ op }
        paginationRowsPerPageOptions={ [ 10, 25, 50, 100, 200 ] }
        theme="tableTheme"
      />


    </div>

  )
}

export default Datatable