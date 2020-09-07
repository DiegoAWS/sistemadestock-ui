import React from 'react';
import { TextField } from '@material-ui/core';


const FormAddProducto = ({ camposProductos, formData, SetFormData }) => {



    const espaciado = (value) => {

        const EstilizaString = (s) => {
            var re = '\\d(?=(\\d{3})+$)';
            return s.toString().replace(new RegExp(re, 'g'), '$& ');
        }



        return EstilizaString(value)
    }


    const varchar = (item) => (

        <TextField label={item[1]} variant="outlined" margin='normal' size="small"
            value={formData[item[0]]} onChange={e => { SetFormData({ ...formData, [item[0]]: e.target.value }) }} />
    )

    const double = (item) => (

        <TextField label={item[1]} variant="outlined" margin='normal' size="small"
            value={espaciado(formData[item[0]])} onChange={e => { SetFormData({ ...formData, [item[0]]: e.target.value.replace(/\D/, '').replace(' ', '') }) }} />
    )

    return (


        <div className="container">
            <div className="row">
                {camposProductos.map((item, i) => (

                    <div className="col-12 col-md-6 col-lg-4" key={i}>

                        {item[2] === 'varchar' ? varchar(item) : double(item)}


                    </div>
                ))}
            </div>



        </div>





    )

}
export default FormAddProducto