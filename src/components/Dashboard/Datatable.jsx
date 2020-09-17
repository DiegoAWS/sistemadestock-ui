import React, { useState, useEffect, useRef } from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import { IconButton, Modal, Button, Grid } from '@material-ui/core'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import loading from '../../assets/images/loading.gif'

function Datatable ( { campos, sinDatos, data, handleDelete, handleEdit } )
{


  const [ openDeleteConfirm, setOpenDeleteConfirm ] = useState( false )
  const deletingValue = useRef( {} )

  const showingValue = useRef( [] )

  const [ openModalShow, setOpenModalShow ] = useState( false )
  const [ state, setState ] = useState( {
    allInLine: true,
    cantidadColumnas: 0
  } )


  const formatea = text =>
  {
    var re = '\\d(?=(\\d{3})+$)'

    if ( text && text.toString() )
    {

      return text.toString().replace( new RegExp( re, 'g' ), '$& ' )
    }
    else
      return text
  }

  const formateaMonedas = () =>
  {

    let dataFormated = data.map( item =>
    {

      let newItem = item
      campos.forEach( camp =>
      {


        if ( camp[ 1 ].toString().toLowerCase().includes( 'costo' ) || camp[ 1 ].toString().toLowerCase().includes( 'precio' ) )
        {
          newItem[ camp[ 0 ] ] = formatea( item[ camp[ 0 ] ] )
        }
      } )
      return newItem
    } )

    return dataFormated
  }
  const preparaColumnas = () =>
  {


    let capacidad = Math.floor( ( window.innerWidth ) / 140 ) - 1
    let allInLine = ( campos.length + 1 < capacidad )



    setState( {
      allInLine,
      cantidadColumnas: allInLine ? campos.length + 1 : capacidad

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
    cell: row => <ActionsButtons data={ row } />
  }
  ]

  columns = columns.concat( campos.map( item => ( {

    name: item[ 1 ],
    selector: item[ 0 ],
    sortable: true,
    width: '140px'
  } ) ) )



  const confirmDelete = item =>
  {
    deletingValue.current = item
    setOpenDeleteConfirm( true )

  }


  const ActionsButtons = ( { data } ) => (
    <div style={ { flexBasis: '140x', flexGrow: 1, display: 'flex' } }>
      <IconButton onClick={ e => confirmDelete( data ) }
        style={ { margin: '0 12px' } }
        size="medium"
        title='Borrar datos' color="secondary"
        variant="contained">

        <DeleteForeverIcon />

      </IconButton>

      <IconButton onClick={ ( e ) => { handleEdit( data ) } }
        title='Editar datos' color="primary"
        size="medium"

        style={ { margin: '0 12px' } }
        variant="contained">

        <EditIcon />

      </IconButton>
    </div>
  )

  const NoFitItems = ( { newCols, data } ) => (

    <>
      { newCols.map( ( item, i ) => (

        <div key={ i } style={ {
          border: '1px solid black', flexBasis: '120px',
          flexGrow: 1,
          display: 'flex', flexDirection: 'column',
          backgroundColor: 'gray',
          borderRadius: '10px', margin: '10px'
        } }>

          <div style={ { backgroundColor: 'red', borderStartEndRadius: '10px', borderStartStartRadius: '10px', color: 'white', textAlign: 'center' } }>  { item.name }</div>

          <div style={ { color: 'white', textAlign: 'center' } }> { data[ item.selector ] }</div>
        </div>
      ) ) }
    </>
  )


  const ExpandedComponent = ( { data } ) =>
  {


    var newCols = columns.slice( state.cantidadColumnas )



    return (


      <div style={ {
        width: 60 + state.cantidadColumnas * 140,
        display: 'flex', flexWrap: 'wrap',
        border: '4px solid black',
        borderRadius: '5px', borderTop: ''
      } }>


        <ActionsButtons data={ data } />

        { ( newCols.length > 0 ) && <NoFitItems
          newCols={ newCols }
          data={ data }
        /> }


      </div >

    )

  }



  const handleShow = row =>
  {
    let newShow = []
    campos.forEach( item =>
    {
      newShow.push( [ item[ 1 ], row[ item[ 0 ] ] ] )
    } )
    showingValue.current = newShow
    setOpenModalShow( true )
  }


  return (
    <div style={ { width: 60 + state.cantidadColumnas * 140, borderRadius: '10px', margin: '0 20px 0 0' } }>

      <DataTable
        columns={ state.allInLine ? columns.slice( 0, state.cantidadColumnas + 1 ) : columns.slice( 0, state.cantidadColumnas ) }
        data={ formateaMonedas() }
        keyField={ 'id' }
        defaultSortField={ 'id' }
        defaultSortAsc={ false }
        pagination
        highlightOnHover
        dense
        noHeader
        onRowDoubleClicked={ handleShow }
        expandableRows={ !state.allInLine }

        expandOnRowDoubleClicked={ false }

        expandableRowsComponent={ <ExpandedComponent /> }
        noDataComponent={ sinDatos ? <div><hr /><h3>Sin Resultados que mostrar</h3><hr /></div> : <img src={ loading } width='20px' alt='' /> }
        paginationComponentOptions={ op }
        paginationPerPage={ 10 }
        paginationRowsPerPageOptions={ [ 5, 10, 25, 50, 100, 200 ] }
        theme="tableTheme"
      />
      <Modal
        open={ openDeleteConfirm }
        disableScrollLock
        disableBackdropClick
        disableEscapeKeyDown
      >

        <Grid container style={ {
          backgroundColor: 'white', position: 'absolute',
          width: 400, top: '50%', left: '50%', borderRadius: '20px',
          transform: ' translate(-50%, -50%)'
        } }
          spacing={ 3 }>
          <Grid item xs={ 12 }>
            <h3 style={ { textAlign: 'center' } }>¿Seguro que desea eliminar ese registro?</h3>

          </Grid>

          <Grid item xs={ 12 } style={ { justifyContent: 'space-evenly', display: 'flex' } }>
            <Button

              color="primary"
              variant="contained"
              onClick={ () =>
              {
                setOpenDeleteConfirm( false )
                handleDelete( deletingValue.current )
                deletingValue.current = {}
              } }>Borrar</Button>



            <Button

              color="secondary"
              variant="contained"
              onClick={ () =>
              {
                deletingValue.current = []
                setOpenDeleteConfirm( false )
              } }>Cancelar</Button>
          </Grid>
        </Grid>

      </Modal>


      <Modal
        open={ openModalShow }
        onClose={ r =>
        {
          showingValue.current = []
          setOpenModalShow( false )
        } }
        disableScrollLock
      >

        <Grid container wrap='wrap' style={ {
          backgroundColor: 'white', position: 'absolute',
          width: ( state.cantidadColumnas ) * 120, top: '50%', left: '50%', borderRadius: '20px',
          transform: ' translate(-50%, -50%)', padding: '10px'
        } }>
          <Grid item xs={ 12 } container justify='flex-end'>
            <Button

              color="secondary"
              variant="contained"
              onClick={ () =>
              {
                showingValue.current = []
                setOpenModalShow( false )
              } }><CloseIcon /></Button>
          </Grid>



          { showingValue.current.map( item => (

            <Grid item key={ item[ 0 ] } style={ { margin: '10px', backgroundColor: 'gray', border: '1px solid black', borderRadius: '10px' } }>

              <div style={ { padding: '2px 10px', backgroundColor: 'red', borderStartEndRadius: '10px', borderStartStartRadius: '10px', color: 'white', textAlign: 'center' } }>
                { item[ 0 ] }</div>

              <div style={ { padding: '2px', color: 'white', textAlign: 'center' } }> { item[ 1 ] } </div>

            </Grid>
          ) ) }



        </Grid>

      </Modal>
    </div>

  )
}

export default Datatable