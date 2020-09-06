import React, { useState } from 'react';

const FormAddProducto = ({ datos, sendResponse }) => {



    const init = []

    datos.forEach(ite => {

        init[ite[0]] = ite[3]

    })


    const [formData, SetFormData] = useState(init)





    return (


        <div className="container">
            <div className="row">
                {datos.map((item, i) => (

                    <div className="form-group col-12 col-md-6 col-lg-4" key={i}>
                        <label htmlFor="NombreProducto">{item[1]}</label>
                        <input type="text" className="form-control" id="NombreProducto"
                            value={formData[item[0]]}
                            onChange={e => { SetFormData({ ...formData, [item[0]]: e.target.value }) }}
                            placeholder={item[1]} />
                    </div>
                ))}
            </div>
            <div className="row">
                <div className="col-12">
                    <button type="button" onClick={e => { sendResponse(formData) }} className="btn btn-primary" >Guardar</button>
                    <button type="button" className="btn btn-danger">Cancelar</button>
                </div>
            </div>


        </div>





    )

}
export default FormAddProducto