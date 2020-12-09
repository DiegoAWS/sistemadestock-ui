import React, { useState, useEffect, useRef } from 'react'
import { getRequest, deleteRequest } from '../../API/apiFunctions'
import FormAddCliente from '../../components/FormAdd/FormAddCliente'

import Datatable from '../../components/Datatable/Datatable'


import { Button } from '@material-ui/core'

import ContactMailIcon from '@material-ui/icons/ContactMail'
import AddIcon from '@material-ui/icons/Add'


const Clientes = props => {



    //#region  CONST's ----------------------------------


    const [openPopup, setOpenPopup] = useState(false)

    const [sinDatos, SetSinDatos] = useState(false)
    const [data, setData] = useState([]) //Data de la tabla




    //#region  campos  Cliente----------------------------------

    const camposCliente = [

        ['Nombre', 'Nombre'],
        ['Email', 'Email'],
        ['Cedula', 'Cédula de Identidad'],
        ['Ciudad', 'Ciudad'],
        ['Barrio', 'Barrio'],
        ['Telefono', 'Teléfono'],
        ['Referencia', 'Referencia'],
        ['FNacimiento', 'Fecha de Nacimiento'],
        ['Genero', 'Género'],
        ['Recomendado', 'Recomendado por'],
        ['Direccion', 'Dirección'],
    ]
    //#endregion campos Cliente



    //#region  Inicializing the Form ----------------------------------




    var formInit = {}



    //#endregion Inicializing the Form
    const [formData, SetFormData] = useState(formInit)



    const editingValue = useRef({})



    //#endregion CONST's

    // eslint-disable-next-line
    useEffect(() => { cargaData() }, [])



    //#region  CRUD API ----------------------------------

    const cargaData = () => {

        clearform()

        getRequest('/clientes')
            .then(request => {

                if (request && request.data && request.data[0] && request.data[0].id) {

                    var newData = request.data.map(dataRequested => {

                        let instantData = {}

                        camposCliente.forEach(item => {
                            instantData[item[0]] = (!dataRequested[item[0]]) ? "" : dataRequested[item[0]]
                        })

                        return { ...instantData, id: dataRequested.id }

                    })


                    setData(newData)
                }
                if (request && request.statusText === 'OK' && request.data && request.data.length === 0)
                    SetSinDatos(true)

            })
    }

    const editData = (item) => {

        editingValue.current = item

        var temp = data.filter(it => it.id !== item.id)


        setData(temp)

        SetFormData(item)
        setOpenPopup(true)



    }

    const deleteData = (itemDelete) => {


        setData(data.filter(it => it.id !== itemDelete.id))

        clearform()

        deleteRequest('/clientes/' + itemDelete.id)
            .then(() => {
                cargaData()

            })
    }



    //#endregion CRUD API



    //#region  Others Functions ----------------------------------

    const clearform = () => {

        editingValue.current = {}
        SetFormData(formInit)

    }
    const recolocaEditItem = () => {
        setData(data.concat(editingValue.current))
    }
    //#endregion Others Functions




    //#region  Return ----------------------------------




    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div>
                    <Button style={{ margin: '10px' }} variant="contained" color="primary"
                        startIcon={<AddIcon />}
                        endIcon={<ContactMailIcon />}
                        onClick={() => { clearform(); setOpenPopup(true) }} > Añadir Cliente </Button>

                </div>
            </div>

            <Datatable data={data}

                sinDatos={sinDatos}
                SetSinDatos={SetSinDatos}
                campos={camposCliente}
                responsive
                handleDelete={deleteData}
                handleEdit={editData} />

            <FormAddCliente
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}

                formData={formData}
                SetFormData={SetFormData}

                data={data}
                setData={setData}

                recolocaEditItem={recolocaEditItem}
                cargaData={cargaData}
            />








        </>
    )

    //#endregion Return

}
export default Clientes