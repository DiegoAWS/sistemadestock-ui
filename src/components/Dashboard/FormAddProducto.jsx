import React from 'react';
import { TextField } from '@material-ui/core';


const FormAddProducto = ({ datos, formData, SetFormData }) => {






    const varchar = (item) => (

        <TextField label={item[1]} variant="outlined" margin='normal' size="small"
            value={formData[item[0]]} onChange={e => { SetFormData({ ...formData, [item[0]]: e.target.value }) }} />
    )

    const double = (item) => (

        <TextField label={item[1]} variant="outlined" margin='normal' size="small"
            value={formData[item[0]]} onChange={e => { SetFormData({ ...formData, [item[0]]: e.target.value }) }} />
    )

    return (


        <div className="container">
            <div className="row">
                {datos.map((item, i) => (

                    <div className="col-12 col-md-6 col-lg-4" key={i}>

                        {item[2] === 'varchar' ? varchar(item) : double(item)}


                    </div>
                ))}
            </div>



        </div>





    )

}
export default FormAddProducto