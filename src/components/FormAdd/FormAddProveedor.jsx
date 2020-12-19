import React from 'react'
import { TextField, Grid } from '@material-ui/core'


import { postRequest } from '../../API/apiFunctions'

import Popup from './Popup'

const FormAddProveedor = ({

    data, setData,
    formData, SetFormData,

    openPopup, setOpenPopup,//Del PopUP
    recolocaEditItem,
    cargaData
}) => {




    const saveData = () => {
        setOpenPopup(false)

        var uri = '/proveedores'

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


            title={(formData.id) ? 'Editar Proveedor' : 'Añadir Proveedor'}

            recolocaEditItem={recolocaEditItem}
            saveData={saveData}>

            <Grid container spacing={3}>


                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Nombre o denominación'} variant="outlined" margin='normal' size="small"
                        value={formData.Proveedor || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Proveedor: e.target.value }) }} />

                </Grid>
                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Numero de RUC'} variant="outlined" margin='normal' size="small"
                        value={formData.Ruc || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Ruc: e.target.value }) }} />

                </Grid>
                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Categoría'} variant="outlined" margin='normal' size="small"
                        value={formData.Categoria || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Categoria: e.target.value }) }} />

                </Grid>
                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Telefono'} variant="outlined" margin='normal' size="small"
                        value={formData.Telefono || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Telefono: e.target.value }) }} />

                </Grid>

                <Grid item xs={12} >

                    <TextField label={'Direccion'} variant="outlined" margin='normal' size="small"
                        value={formData.Direccion || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Direccion: e.target.value }) }} />

                </Grid>

            </Grid>



        </Popup>


    )

}
export default FormAddProveedor