import React from 'react'
import { TextField, Grid } from '@material-ui/core'


import { postRequest } from '../../API/apiFunctions'

import Popup from './Popup'

const FormAddCliente = ({

    data, setData,
    formData, SetFormData,

    openPopup, setOpenPopup,//Del PopUP
    recolocaEditItem,
    cargaData
}) => {




    const saveData = () => {
        setOpenPopup(false)

        var uri = '/clientes'

        if (formData.id)// Editing....
            uri = uri + '/' + formData.id


        if (data.length === 0) //Si ningun Dato 
            setData([formData])
        else//Ya hay datos
            setData(data.concat(formData))


        postRequest(uri, formData).then(() => { cargaData() })

    }



    return (

        <Popup
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}


            title={(formData.id) ? 'Editar Cliente' : 'Añadir Cliente'}

            recolocaEditItem={recolocaEditItem}
            saveData={saveData}>

            <Grid container spacing={3}>


                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Cliente'} variant="outlined" margin='normal' size="small"
                        value={formData.Nombre || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Nombre: e.target.value }) }} />

                </Grid>
                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Id'} variant="outlined" margin='normal' size="small"
                        value={formData.Telefono || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Telefono: e.target.value }) }} />

                </Grid>
                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Email'} variant="outlined" margin='normal' size="small"
                        value={formData.Email || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Email: e.target.value }) }} />

                </Grid>
                <Grid item xs={12} >

                    <TextField label={'Direccion'} variant="outlined" margin='normal' size="small"
                        value={formData.Direccion || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Direccion: e.target.value }) }} />

                </Grid>
                <Grid item xs={12} >

                    <TextField label={'Otros Datos'} variant="outlined" margin='normal' size="small"
                        value={formData.OtrosDatos || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, OtrosDatos: e.target.value }) }} />

                </Grid>



            </Grid>



        </Popup>


    )

}
export default FormAddCliente