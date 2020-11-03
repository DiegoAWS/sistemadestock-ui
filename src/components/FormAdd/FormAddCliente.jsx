import React from 'react'
import { TextField, Grid, MenuItem } from '@material-ui/core'
import es from 'date-fns/locale/es'


import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { postRequest } from '../../API/apiFunctions'

import Popup from './Popup'

registerLocale('es', es)
setDefaultLocale('es')


const FormAddCliente = ({

    data, setData,
    formData, SetFormData,

    openPopup, setOpenPopup,//Del PopUP
    recolocaEditItem,
    cargaData, showLoading = () => { }
}) => {




    const saveData = () => {
        setOpenPopup(false)
        showLoading()

        var uri = '/clientes'

        if (formData.id)// Editing....
            uri = uri + '/' + formData.id


        if (data.length === 0) //Si ningun Dato 
            setData([formData])
        else//Ya hay datos
            setData(data.concat(formData))


        postRequest(uri, formData).then(() => { cargaData() })

    }

    //#region return
    const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (<TextField ref={ref} label='Fecha de Nacimiento' variant="outlined" margin='normal' size="small" value={value} fullWidth onClick={onClick} />))


    return (

        <Popup
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}


            title={(formData.id) ? 'Editar Cliente' : 'Añadir Cliente'}

            recolocaEditItem={recolocaEditItem}
            saveData={saveData}>

            <Grid container spacing={3}>
                {
                    //#region Campos Principales
                }

                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Nombre y Apellidos'} variant="outlined" margin='normal' size="small"
                        value={formData.Nombre || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Nombre: e.target.value }) }} />

                </Grid>

                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Cédula de Identidad o Ruc'} variant="outlined" margin='normal' size="small"
                        value={formData.Cedula || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Cedula: e.target.value }) }} />

                </Grid>

                <Grid item xs={12} >

                    <TextField label={'Direccion'} variant="outlined" margin='normal' size="small"
                        value={formData.Direccion || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Direccion: e.target.value }) }} />

                </Grid>

                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Barrio'} variant="outlined" margin='normal' size="small"
                        value={formData.Barrio || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Barrio: e.target.value }) }} />

                </Grid>

                <Grid item xs={12} sm={6} lg={4}>

                    <TextField label={'Ciudad'} variant="outlined" margin='normal' size="small"
                        value={formData.Ciudad || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Ciudad: e.target.value }) }} />

                </Grid>

                <Grid item xs={12} sm={6} lg={4}>
                    <TextField label={'Teléfono o Celular'} variant="outlined" margin='normal' size="small"
                        value={formData.Telefono || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Telefono: e.target.value }) }} />
                </Grid>


                {
                    //#endregion
                }

                {
                    //#region OPCIONALES
                }
                <Grid item xs={12} sm={6} lg={4}>
                    <TextField label={'Email'} variant="outlined" margin='normal' size="small"
                        value={formData.Email || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Email: e.target.value }) }} />
                </Grid>

                <Grid item xs={12} sm={6} lg={4}>
                    <TextField label={'Referencia de Cliente'} variant="outlined" margin='normal' size="small"
                        value={formData.Referencia || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Referencia: e.target.value }) }} />
                </Grid>

                <Grid item xs={12} sm={6} lg={4}>
                    <DatePicker
                        selected={isNaN(Date.parse(formData.FNacimiento)) ? new Date('1990-5-1') : new Date(formData.FNacimiento)}
                        onChange={val => { SetFormData({ ...formData, FNacimiento: val.getFullYear() + '-' + (1 + val.getMonth()) + '-' + val.getDate() }) }}
                        showMonthDropdown
                        showYearDropdown
                        dateFormat="dd/MM/yyyy"
                        fixedHeight

                        customInput={<CustomDateInput />}
                    />
                </Grid>

                <Grid item xs={12} sm={6} lg={4}>
                    <TextField label={'Género'} variant="outlined" margin='normal' size="small"
                        value={formData.Genero || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Genero: e.target.value }) }}
                        select

                    >
                        <MenuItem value={'Hombre'}>Hombre</MenuItem>
                        <MenuItem value={'Mujer'}>Mujer</MenuItem>
                        <MenuItem value={'Otro'}>Otro</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6} lg={4}>
                    <TextField label={'Recomendado por'} variant="outlined" margin='normal' size="small"
                        value={formData.Recomendado || ''} fullWidth
                        onChange={e => { SetFormData({ ...formData, Recomendado: e.target.value }) }} />
                </Grid>


                {
                    //#endregion
                }


            </Grid>



        </Popup>


    )
    //#endregion

}
export default FormAddCliente