import React from 'react';
import DataTable, { createTheme } from 'react-data-table-component'

function Datatable({ columns, data, onRowClicked }) {

  var op = {
    rowsPerPageText: 'Filas por Pagina:',
    rangeSeparatorText: 'de'
  }
  createTheme('solarized', {
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


  return (
    <DataTable
      columns={columns}
      data={data}
      defaultSortField={'id'}
      defaultSortAsc={false}
      onRowClicked={onRowClicked}
      pagination
      highlightOnHover
      dense
      noHeader
      noDataComponent={'No hay resultados que mostrar'}
      paginationComponentOptions={op}
      paginationRowsPerPageOptions={[10, 50, 100, 200]}
      theme="solarized"
    />
  )
}

export default Datatable;