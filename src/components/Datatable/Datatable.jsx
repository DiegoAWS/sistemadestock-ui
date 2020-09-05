import React, { useEffect } from 'react';
import $ from 'jquery'
$('#example').DataTable = require('datatables.net')


const Datatable = ({ data }) => {


    useEffect(() => {
        $('#example').DataTable({
            responsive: true,
            autoWidth: false,
            data: dataSet,
            language: {
                processing: "Procesando...",
                search: "Buscar:",
                lengthMenu: "Mostrando _MENU_ elementos",
                info: "Mostrando elementos _START_ al _END_ de _TOTAL_ elementos",
                infoEmpty: "Ningún elemento que mostrar",
                infoFiltered: "( _MAX_ elementos en total)",
                infoPostFix: "",
                loadingRecords: "Cargando...",
                zeroRecords: "Ningún Resultado que mostrar",
                emptyTable: "Actualmente no existen datos en esta categoría",
                paginate: {
                    first: "Inicio",
                    previous: "<",
                    next: ">",
                    last: "Final"
                },
            },
            columns: [
                { title: "Producto" },
                { title: "Marca" },
                { title: "Modelo" },
                { title: "Costo" },
                { title: "Fecha Compra" },
                { title: "Precio Mayorista" }
            ]
        });

    })

    return (


        <table id="example" className="display" width="100%"></table>
    )

}




export default Datatable;



const dataSet = [["Celular", "iPhone", "iPhone 6", "G 2 575 060.00", "2011/04/25", "G 2 923 060.00"], ["Celular", "iPhone", "iPhone 6 Plus", "G 3 150 120.00", "2011/07/25", "G 3 846 120.00"], ["Celular", "iPhone", "iPhone 7", "G 3 725 180.00", "2009/01/12", "G 4 769 180.00"], ["Celular", "iPhone", "iPhone 7 Plus", "G 4 300 240.00", "2012/03/29", "G 5 692 240.00"], ["Celular", "iPhone", "iPhone 8", "G 4 875 300.00", "2008/11/28", "G 6 615 300.00"], ["Celular", "iPhone", "iPhone 8 Plus", "G 5 450 360.00", "2012/12/02", "G 7 538 360.00"], ["Celular", "iPhone", "iPhone X", "G 6 025 420.00", "2012/08/06", "G 8 461 420.00"], ["Celular", "iPhone", "iPhone XS", "G 6 600 480.00", "2010/10/14", "G 9 384 480.00"],["Celular","Samsung","Galaxy S6","G 2 562 184.70","2011/04/25","G 2 908 444.70"],["Celular","Samsung","Galaxy S7","G 3 134 369.40","2011/07/25","G 3 826 889.40"],["Celular","Samsung","Galaxy S8","G 3 706 554.10","2009/01/12","G 4 745 334.10"],["Celular","Samsung","Galaxy S9","G 4 278 738.80","2012/03/29","G 5 663 778.80"],["Celular","Samsung","Galaxy S10","G 4 850 923.50","2008/11/28","G 6 582 223.50"],["Celular","Samsung","Galaxy S20","G 5 423 108.20","2012/12/02","G 7 500 668.20"],]