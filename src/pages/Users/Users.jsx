import React, { useState, useEffect, useRef } from 'react'
import { Grid, Button, TextField } from '@material-ui/core'

import Popup from '../../components/FormAdd/Popup'
import { getRequest, postRequest, deleteRequest } from '../../API/apiFunctions'

import logo from '../../assets/images/logo.png'
import Datatable from '../../components/Dashboard/Datatable'

import GroupAddIcon from '@material-ui/icons/GroupAdd'
import AddIcon from '@material-ui/icons/Add'
const Users = () => {

    //#region  State ----------------------------------



    const formInit = {
        role: 'vendedor',
        name: '',
        username: '',
        password: '',
        password_confirmation: ''
    }




    const [errorName, setErrorName] = useState(false)
    const [errorNameMensaje, setErrorNameMensaje] = useState('')
    const [errorUserName, setErrorUserName] = useState(false)
    const [errorUserNameMensaje, setErrorUserNameMensaje] = useState('Identificador único')
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorPasswordMensaje, setErrorPasswordMensaje] = useState('Más de 8 caracteres')

    const [openPopup, setOpenPopup] = useState(false)

    const [data, setData] = useState([]) //Data de la tabla
    const [formData, SetFormData] = useState(formInit)

    //#endregion State

    const campos = [
        ['role', 'Rol', 'varchar'],
        ['username', 'Nombe de Usuario', 'varchar'],
        ['name', 'Nombre Completo', 'varchar']
    ]

    const editingValue = useRef({})

    // eslint-disable-next-line
    useEffect(() => { cargaData() }, [])


    //#region  CRUD functions ----------------------------------

    //#region  SAVE  ----------------------------------


    const saveData = () => {



        //#region  Validaciones ----------------------------------

        if (data.filter(item => (item.username === formData.username)).length > 0 ||

            formData.name.length === 0 ||
            formData.username.length === 0 ||
            formData.password < 8 ||
            formData.password !== formData.password_confirmation) {


            if (data.filter(item => (item.username === formData.username)).length > 0) {
                setErrorUserName(true)
                setErrorUserNameMensaje('Username ya en uso')
            }
            if (formData.name.length === 0) {
                setErrorName(true)
                setErrorNameMensaje('Nombre Completo Requerido')
            }
            if (formData.username.length === 0) {
                setErrorUserName(true)
                setErrorNameMensaje('Usuario Requerido')
            }

            if (formData.password.length > 8)
                setErrorPassword(true)

            if (formData.password !== formData.password_confirmation) {
                setErrorPassword(true)
                setErrorPasswordMensaje('Contraseñas NO coinciden')
            }

            setTimeout(() => {
                SetFormData(formInit)
                setErrorName(false)
                setErrorNameMensaje('')
                setErrorUserName(false)
                setErrorUserNameMensaje('')
                setErrorPassword(false)
                setErrorPasswordMensaje('Identificador único')


            }, 2000)
            return
        }

        //#endregion Validaciones

        setOpenPopup(false)
        setData(data.concat(formData))


        var uri = '/users'

        if (formData.id && editingValue.current) {// Editing....
            uri = uri + '/' + formData.id


        }

        const user = {
            role: formData.role,
            name: formData.name,
            username: formData.username,
            password: formData.password,
            password_confirmation: formData.password_confirmation
        }

        postRequest(uri, user).then((res) => {



            if (res && res.statusText && res.statusText === "Created") {

                cargaData()

            }

        })

    }

    //#endregion SAVE 

    //#region  CARGA  ----------------------------------


    const cargaData = () => {

        SetFormData(formInit)

        getRequest('/users')
            .then(request => {

                if (request && request.data && request.data[0] && request.data[0].username) {

                    var newData = request.data.map(dataRequested => {

                        let instantData = {}

                        campos.forEach(item => {
                            instantData[item[0]] = dataRequested[item[0]]
                        })

                        return { ...instantData, id: dataRequested.id }

                    })

                    setData(newData)

                }


            })
    }
    //#endregion CARGA 

    //#region  EDIT  ----------------------------------

    const editData = item => {
        editingValue.current = item

        var temp = data.filter(it => it.id !== item.id)


        setData(temp)

        SetFormData(item)
        setOpenPopup(true)
    }

    //#endregion EDIT 

    //#region  DELETE  ----------------------------------

    const deleteData = itemDelete => {
        setData(data.filter(it => it.id !== itemDelete.id))

        clearform()

        deleteRequest('/users/' + itemDelete.id, formData)
            .then(() => {
                cargaData()

            })
    }

    //#endregion DELETE 
    //#endregion CRUD functions


    //#region  Other Funtions   ----------------------------------

    const handlerOpenPopup = (value) => {

        setOpenPopup(value)
    }


    const clearform = () => {
        SetFormData(formInit)
    }

    const recolocaEditItem = () => {
        setData(data.concat(editingValue.current))
    }
    //#endregion Other Funtions


    //#region  return ----------------------------------


    return (

        <>
            <Button variant="contained" color="primary"
                startIcon={<AddIcon />}
                endIcon={<GroupAddIcon />} onClick={e => {
                    clearform()
                    handlerOpenPopup(true)
                }}>Añadir Usuario </Button>

            <Datatable data={data} sinDatos={false} campos={campos} handleDelete={deleteData} handleEdit={editData} />

            <Popup
                openPopup={openPopup}
                clearform={clearform}
                setOpenPopup={value => handlerOpenPopup(value)}
                title={(formData.id) ? 'Editar Usuario' : 'Añadir Usuario'}
                logo={logo}
                saveData={saveData}
                recolocaEditItem={recolocaEditItem}
            >


                <Grid justify={'space-around'} container spacing={4}>
                    <Grid item xs={12} lg={4}>

                        <TextField

                            select
                            label="Perfil"
                            value={formData.role}
                            onChange={e => { SetFormData({ ...formData, role: e.target.value }) }}
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Nivel de acceso al sistema"
                            variant="outlined" >

                            <option value={"vendedor"}>Vendedor(a)</option>
                            <option value={"cobrador"}>Cobrador</option>

                            <option value={"admin"}>Administrador</option>

                        </TextField>



                    </Grid>

                    <Grid item xs={12} lg={8}>

                        <TextField fullWidth
                            value={formData.name || ''}
                            error={errorName}
                            helperText={errorNameMensaje}
                            onChange={e => { SetFormData({ ...formData, name: e.target.value }) }}
                            label="Nombre completo" variant="outlined" />

                    </Grid>

                    <Grid item xs={12} lg={4}>

                        <TextField
                            value={formData.username || ''}
                            error={errorUserName}
                            helperText={errorUserNameMensaje}
                            onChange={e => { SetFormData({ ...formData, username: e.target.value }) }}
                            fullWidth label="Usuario" variant="outlined" />

                    </Grid>

                    <Grid item xs={12} lg={4}>

                        <TextField
                            value={formData.password || ''}
                            onChange={e => { SetFormData({ ...formData, password: e.target.value }) }}
                            fullWidth
                            type='password'
                            error={errorPassword}
                            helperText={errorPasswordMensaje}
                            label="Contraseña" variant="outlined" />

                    </Grid>

                    <Grid item xs={12} lg={4}>

                        <TextField
                            value={formData.password_confirmation || ''}
                            onChange={e => { SetFormData({ ...formData, password_confirmation: e.target.value }) }}
                            fullWidth
                            type='password'
                            error={errorPassword}
                            helperText={errorPasswordMensaje}
                            label="Repetir Contraseña" variant="outlined" />

                    </Grid>

                </Grid>
            </Popup>


        </>

    )
    //#endregion return
}

export default Users