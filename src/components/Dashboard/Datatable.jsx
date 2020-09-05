import React from 'react';
import DataTable from 'react-data-table-component'

function Datatable({ title, columns, data }) {

  var op = {
    rowsPerPageText: 'Filas por Pagina:',
    rangeSeparatorText: 'de'
  }

  return (
    <DataTable
      title={title}
      columns={columns}
      data={data}
      pagination
      persistTableHead
      fixedHeader={true}
      fixedHeaderScrollHeight="300px"
      paginationComponentOptions={op}

    />
  )
}

export default Datatable;