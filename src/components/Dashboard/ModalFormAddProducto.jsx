import React, { useState } from 'react';
const ModalFormAddProducto = ({ datos, titleForm, camposUsuario,sendResponse }) => {



    const [formData, SetFormData] = useState({})

    const GuargarHandler = (e) => {
  
  sendResponse(formData)
      


    }

    return (

        <div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{titleForm}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            <div className="row">
                                {datos.map((item, i) => (

                                    <div className="form-group col-12 col-md-6 col-lg-4 col-xl-3" key={i}>
                                        <label htmlFor="NombreProducto">{camposUsuario[i]}</label>
                                        <input type="text" className="form-control" id="NombreProducto"
                                            value={formData.item}
                                            onChange={e => { SetFormData({ ...formData, [item]: e.target.value }) }}
                                            placeholder={camposUsuario[i]} />
                                    </div>
                                ))}
                            </div>


                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={e => { GuargarHandler(e) }} className="btn btn-primary" data-dismiss="modal">Guardar</button>
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>

            </div>
        </div >

    )

}
export default ModalFormAddProducto;