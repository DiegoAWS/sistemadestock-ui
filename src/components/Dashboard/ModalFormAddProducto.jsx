import React, { useState } from 'react';

const ModalFormAddProducto = ({ datos, titleForm }) => {

    const [NombreProducto, setNombreProducto] = useState('');




    return (

        <div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{titleForm}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">


                        {/* <div class="card card-primary"> */}

                        <form>
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="NombreProducto">Nombre del Producto</label>
                                    <input type="text" class="form-control" id="NombreProducto"
                                        value={NombreProducto}
                                        onChange={e => { setNombreProducto(e.target.value) }}
                                        placeholder="Nombre del Producto" />
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputFile">File input</label>
                                    <div class="input-group">
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="exampleInputFile" />
                                            <label class="custom-file-label" for="exampleInputFile">Choose file</label>
                                        </div>
                                        <div class="input-group-append">
                                            <span class="input-group-text">Upload</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                                    <label class="form-check-label" for="exampleCheck1">Check me out</label>
                                </div>
                            </div>


                            <div class="card-footer">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                        {/* </div> */}


                    </div>
                    <div className="card-footer" style={{ display: 'block' }}>
                        Guardar Footer
                        </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Guardar</button>
                        <button type="button" className="btn btn-primary">Descartar</button>
                    </div>
                </div>

            </div>
        </div >

    )

}
export default ModalFormAddProducto;