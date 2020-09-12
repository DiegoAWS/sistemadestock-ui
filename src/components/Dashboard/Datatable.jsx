import React from 'react';
import DataTable, { createTheme } from 'react-data-table-component'
import { Button } from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';

import loading from '../../assets/images/loading.gif'

function Datatable({ campos, sinDatos, data, handleDelete, handleEdit }) {


  let capacidad = Math.floor((window.innerWidth - 100) / 100)
  const cantidadColumnas = (campos.length > capacidad) ? capacidad : campos.length


  if (!data)
    data = []

  var op = {
    rowsPerPageText: 'Filas por Pagina:',
    rangeSeparatorText: 'de'
  }
  createTheme('tableTheme', {
    /*  text: {
        primary: '#268bd2',
        secondary: '#2aa198',
      },
      background: {
        default: 'white',
      },*/

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
  });


  const columns = campos.map(item => ({
    name: item[1],
    selector: item[0],
    sortable: true,
    compact: true,
    width: '100px'
  }))



  const ExpandedComponent = (props) => {


    var newCols = columns.slice(cantidadColumnas).map(ite => ({ ...ite, sortable: false }))



    return (


      <div style={{ display: 'flex', border: '4px solid black', borderRadius: '5px', borderTop: '', alignItems: 'center', backgroundColor: 'black' }}>


        <Button onClick={e => handleDelete(props.data)} aria-label="delete" className='mx-2' title='Borrar Producto' color="secondary" variant="contained">
          <DeleteForeverIcon />


        </Button>
        <Button onClick={(e) => handleEdit(props.data)} aria-label="delete" className='mx-2' title='Borrar Producto' color="primary" variant="contained">
          <EditIcon />

        </Button>

        {(newCols.length > 0) && <DataTable
          style={{ flexGrow: '1' }}
          columns={newCols}
          data={[props.data]}

          striped
          noHeader
        />}


      </div >

    )

  }



  return (
    <div style={{ width: 50 + cantidadColumnas * 100, borderRadius: '10px' }}>
      <DataTable
        columns={columns.slice(0, cantidadColumnas)}
        data={data}
        keyField={'id'}
        defaultSortField={'id'}
        defaultSortAsc={false}
        pagination
        highlightOnHover
        dense
        noHeader
        expandableRows

        expandOnRowDoubleClicked
        expandableRowsComponent={<ExpandedComponent />}
        noDataComponent={sinDatos ? <div><hr /><h3>SIN DATOS</h3><hr /></div> : <img src={loading} width='20px' alt='' />}
        paginationComponentOptions={op}
        paginationRowsPerPageOptions={[10, 50, 100, 200]}
        theme="tableTheme"
      />


    </div>

  )
}

export default Datatable;