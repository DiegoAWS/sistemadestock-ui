import React, { useState, useRef, useCallback, useMemo } from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import { TextField, InputAdornment, IconButton, Modal, Button, Grid } from '@material-ui/core'

import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import loading from '../../assets/images/loading.gif'






function Datatable({ campos, sinDatos, SetSinDatos, data, handleDelete, handleEdit, seleccion = false, clearSelection = false, Seleccion }) {

  //#region CreaTheme
  createTheme('tableTheme', {
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
  })

  //#endregion


  if (!data)
    data = []


  const showingValue = useRef([])

  const [openModalShow, setOpenModalShow] = useState(false)

  const [search, setSearch] = useState('')
  const [filterData, setFilterData] = useState([])



  var columns =
    [{
      name: 'Acción',
      grow: 0,
      cell: row => <ActionsButtons data={row} />
    }
    ]

  columns = columns.concat(campos.map(item => ({
    minWidth: '100px',
    grow: ['Codigo', 'Categoria', 'Producto', 'FechaCompra',].includes(item[0]) ? 1 : 0,

    name: item[1],
    selector: item[0],
    sortable: true
  })))






  const ActionsButtons = ({ data }) => (
    <div style={{ display: 'flex' }}>

      <IconButton
        style={{ margin: '0 5px' }}
        size="small"
        title='Borrar datos' color="secondary"
        variant="contained"
        onClick={e => {
          if (window.confirm("¿Seguro que desea Borrar este ítem?"))
            handleDelete(data)
        }}>

        <DeleteForeverIcon />

      </IconButton>

      <IconButton
        title='Editar datos' color="primary"
        size="small"
        style={{ margin: '0 5px' }}
        variant="contained"
        onClick={(e) => {
          if (window.confirm("¿Seguro que desea Editar este ítem?"))
            handleEdit(data)
        }} >

        <EditIcon />

      </IconButton>
    </div>
  )


  const handleShow = row => {
    let newShow = []
    campos.forEach(item => {
      newShow.push([item[1], row[item[0]]])
    })
    showingValue.current = newShow
    setOpenModalShow(true)
  }



  const handleSearch = text => {



    let dataFilter = data.filter(item => {

      let resp = false


      campos.forEach(camp => {


        if ((item[camp[0]]).toString().toLowerCase().includes(text.toLowerCase())) {

          resp = true
        }

      })

      return resp

    })

    if (dataFilter.length === 0)
      SetSinDatos(true)
    else
      SetSinDatos(false)

    setFilterData(dataFilter)
  }

  return (
    <div >
      <div>
        <TextField
          value={search || ''}
          margin="dense"
          color={(search.length === 0) ? "primary" : "secondary"}
          size="small"

          onChange={e => { setSearch(e.target.value); handleSearch(e.target.value) }}
          variant={"outlined"}
          InputProps={{
            startAdornment: <InputAdornment position="start"> <SearchIcon color='primary' /></InputAdornment>,
            endAdornment: <InputAdornment position="end">
              <IconButton onClick={e => { setSearch(''); handleSearch('') }}                >
                <CloseIcon />
              </IconButton>
            </InputAdornment>,
          }} />
      </div>

      <DataTable
        columns={useMemo(() => columns, [columns])}
        data={(search.length === 0) ? data : filterData}
        keyField={'id'}
        defaultSortField={'id'}
        defaultSortAsc={false}
        selectableRows={seleccion}
        pagination
        highlightOnHover
        dense
        noHeader
        onRowClicked={useCallback(handleShow, [handleShow])}
        responsive
        selectableRowsVisibleOnly
        selectableRowsHighlight
        clearSelectedRows={clearSelection}
        onSelectedRowsChange={useCallback(Seleccion, [Seleccion])}
        noDataComponent={sinDatos ? <div><hr /><h3>Sin Resultados que mostrar</h3><hr /></div> : <img src={loading} width='20px' alt='' />}
        paginationComponentOptions={{
          rowsPerPageText: 'Filas por Pagina:',
          rangeSeparatorText: 'de'
        }}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
        theme="tableTheme"
      />



      <Modal
        open={openModalShow}
        onClose={r => {
          showingValue.current = []
          setOpenModalShow(false)
        }}
        disableScrollLock
      >

        <Grid container wrap='wrap' style={{
          backgroundColor: 'white', position: 'absolute',
          top: '50%', left: '50%', borderRadius: '20px',
          transform: ' translate(-50%, -50%)', padding: '10px'
        }}>
          <Grid item xs={12} container justify='flex-end'>
            <Button

              color="secondary"
              variant="contained"
              onClick={() => {
                showingValue.current = []
                setOpenModalShow(false)
              }}><CloseIcon /></Button>
          </Grid>



          {showingValue.current.map(item => (

            <Grid item key={item[0]} style={{ margin: '10px', backgroundColor: 'gray', border: '1px solid black', borderRadius: '10px' }}>

              <div style={{ padding: '2px 10px', backgroundColor: 'red', borderStartEndRadius: '10px', borderStartStartRadius: '10px', color: 'white', textAlign: 'center' }}>
                {item[0]}</div>

              <div style={{ padding: '2px', color: 'white', textAlign: 'center' }}> {item[1]} </div>

            </Grid>
          ))}



        </Grid>

      </Modal>
    </div>

  )
}

export default Datatable