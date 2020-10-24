import React, { useState, useEffect } from 'react'
import { makeStyles, MenuItem, Button, Grid, FormControl, Select, InputLabel } from "@material-ui/core"

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'

import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'

import RadioDiaSemana from './DiasSelect/RadioDiaSemana'
import SelectDiaDelMes from './DiasSelect/SelectDiaDelMes'
import SelectsDiaQuincena from './DiasSelect/SelectsDiaQuincena'
import RadioWeekEnd from './DiasSelect/RadioWeekEnd'


registerLocale('es', es)
setDefaultLocale('es')


const formater = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
});



//#region JSS
const useStyle = makeStyles((theme) => ({

    inputLittle: {
        padding: '5px 0px 3px',
        fontSize: '0.9rem',
        textAlign: 'center'
    },
    preciosCuotas: {
        margin: '5px',
        padding: '5px',
        borderRadius: '10px',
        backgroundImage: 'linear-gradient(40deg, #9f93ff 0%, #b5d8ff 74%);',
        textTransform: 'none'
    },
    entrada: {
        margin: '5px',
        padding: '5px',
        borderRadius: '10px',
        backgroundImage: 'linear-gradient(50deg, #ff4444 0%, #ffcfce 74%);',
    }
}))
//#endregion

const FormVentasCuotas = ({ productoSeleccionado, addCartCUOTAS }) => {
    const classes = useStyle()




    //#region STATE

    const [cuotas, setCuotas] = useState(3)
    const [frecuencia, setFrecuencia] = useState("diario")
    const [weekDay, setWeekDay] = useState(1)
    const [diaDelMes, setDiaDelMes] = useState(1)
    const [sab, setSab] = useState(true)
    const [dom, setDom] = useState(true)
    const [diaPrimerPago, setDiaPrimerPago] = useState(new Date())
    const [listaDeDiasDePago, setListaDeDiasDePago] = useState([])
    //#endregion

    //#region useEffect


    useEffect(() => {
        let dias = []
        dias[0] = diaPrimerPago

        let diaCursor = addDays(diaPrimerPago, 1)

        switch (frecuencia) {
            case 'diario':
                for (let cuotasAsignadas = 1; cuotasAsignadas < cuotas; diaCursor = addDays(diaCursor, 1)) {

                    if (!((diaCursor.getDay() === 6 && !sab) || (diaCursor.getDay() === 0 && !dom))) {
                        dias[cuotasAsignadas] = diaCursor
                        cuotasAsignadas++
                    }
                }

                break

            case 'semanal':
                for (let cuotasAsignadas = 1; cuotasAsignadas < cuotas; diaCursor = addDays(diaCursor, 1)) {
                    if (diaCursor.getDay() === weekDay) {
                        dias[cuotasAsignadas] = diaCursor
                        cuotasAsignadas++
                    }
                }
                break

            case 'quincenal':
                for (let i = 0; i < cuotas; i++)
                    dias[i] = new Date(diaPrimerPago.getTime() + i * 1000 * 60 * 60 * 24 * 7 * 2)
                break

            case 'quincenal+':
                let OtherDay = diaDelMes > 15 ? (parseInt(diaDelMes) - 15) : (parseInt(diaDelMes) + 15)


                let PrimerDia = null
                let SegundoDia = null
                for (let i = 0; i < 32; i++) {
                    if (diaCursor.getDate() === diaDelMes || diaCursor.getDate() === OtherDay) {
                        if (!PrimerDia)
                            PrimerDia = diaCursor
                        else if (!SegundoDia)
                            SegundoDia = diaCursor


                    }

                    diaCursor = addDays(diaCursor, 1)
                }


                for (let i = 0; dias.length < cuotas; i++) {

                    dias[dias.length] = addMonths(PrimerDia, i)
                    if (dias.length < cuotas)
                        dias[dias.length] = addMonths(SegundoDia, i)

                }

                break

            case 'mensual':
                for (let i = 0; i < 32; i++) {
                    if (diaCursor.getDate() === diaDelMes)
                        break

                    diaCursor = addDays(diaCursor, 1)
                }

                for (let cuotasAsignadas = 1; cuotasAsignadas < cuotas; diaCursor = addMonths(diaCursor, 1)) {
                    dias[cuotasAsignadas] = diaCursor
                    cuotasAsignadas++
                }
                break

            default:
                break
        }



        setListaDeDiasDePago(dias)

    }, [cuotas, frecuencia, weekDay, diaDelMes, sab, dom, diaPrimerPago])

    //#endregion

    const VerDias = React.forwardRef(({ onClick }, ref) => <Button ref={ref} fullWidth color='primary' variant='contained' onClick={onClick}>Días de Pago</Button>)
    const PrimerPago = React.forwardRef(({ onClick }, ref) => <Button ref={ref} fullWidth color='primary' variant='contained' onClick={onClick}>{getDia()}</Button>)



    const getDia = () => {
        let d = diaPrimerPago
        let n = new Date()

        if (d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear())
            return 'INICIO HOY'
        else
            return 'INICIO ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
    }

    return (
        <div style={{ padding: '5px', alignItems: 'stretch' }}>
            <Grid container spacing={1}>
                {
                    //#region 1 Fila
                }
                <Grid item xs={3}>

                    {localStorage.UserRole === 'admin' ? <DatePicker
                        selected={diaPrimerPago}
                        onChange={val => { setDiaPrimerPago(val) }}
                        minDate={new Date()}
                        maxDate={new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)}
                        customInput={<PrimerPago />}
                        fixedHeight


                    /> : <Button fullWidth color='primary' variant='contained' >{getDia()}</Button>
                    }
                </Grid>
                <Grid item xs={3}>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="cuotasLabel">CUOTAS</InputLabel>
                        <Select
                            labelId="cuotasLabel"
                            label="CUOTAS"
                            value={cuotas}
                            onChange={e => { setCuotas(e.target.value) }}
                        >
                            {productoSeleccionado.PrecioVenta3Cuotas && <MenuItem value={3}>3</MenuItem>}
                            {productoSeleccionado.PrecioVenta6Cuotas && <MenuItem value={6}>6</MenuItem>}
                            {productoSeleccionado.PrecioVenta12Cuotas && <MenuItem value={12}>12</MenuItem>}
                            {productoSeleccionado.PrecioVenta18Cuotas && <MenuItem value={18}>18</MenuItem>}
                            {productoSeleccionado.PrecioVenta24Cuotas && <MenuItem value={24}>24</MenuItem>}
                        </Select>
                    </FormControl>
                </Grid>


                <Grid item xs={3}>

                    <DatePicker
                        minDate={diaPrimerPago}
                        maxDate={listaDeDiasDePago[listaDeDiasDePago.length - 1]}
                        highlightDates={listaDeDiasDePago}
                        customInput={<VerDias />}
                        shouldCloseOnSelect={false}
                        fixedHeight
                        style={{ backgroundColor: 'white' }}
                    />
                </Grid>
                <Grid item xs={3}>


                    <Button variant='contained' fullWidth color='secondary' onClick={e => {
                        addCartCUOTAS(listaDeDiasDePago)

                    }}>Confirmar Selección</Button>
                </Grid>

                {
                    //#endregion
                }
                {
                    //#region 2 Fila
                }

                <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="cuotasLabel">Frecuencia</InputLabel>
                        <Select
                            labelId="cuotasLabel"
                            label="Frecuencia"
                            value={frecuencia}
                            renderValue={val => val.toUpperCase()}
                            classes={{ root: classes.inputLittle }}
                            onChange={(e) => { setFrecuencia(e.target.value) }}

                        >
                            <MenuItem value={'diario'}>Diario</MenuItem>
                            <MenuItem value={'semanal'}>Semanal</MenuItem>
                            <MenuItem value={'quincenal'}>Quincenal (Dia de semana)</MenuItem>
                            <MenuItem value={'quincenal+'}>Quincenal (Dia del mes)</MenuItem>
                            <MenuItem value={'mensual'}>Mensual</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>


                {(frecuencia === 'diario') && <Grid item xs={8}><RadioWeekEnd sab={sab} dom={dom} setSab={setSab} setDom={setDom} />  </Grid>}


                {(frecuencia === 'semanal') && <Grid item xs={8}><RadioDiaSemana semanal={true} weekDay={weekDay} setWeekDay={setWeekDay} />  </Grid>}

                {(frecuencia === 'quincenal') && <Grid item xs={8}><RadioDiaSemana semanal={false} weekDay={weekDay} setWeekDay={setWeekDay} />  </Grid>}


                {(frecuencia === 'quincenal+') && <Grid item xs={8}><SelectsDiaQuincena diaDelMes={diaDelMes} setDiaDelMes={setDiaDelMes} />  </Grid>}

                {(frecuencia === 'mensual') && <Grid item xs={8}> <SelectDiaDelMes diaDelMes={diaDelMes} setDiaDelMes={setDiaDelMes} />  </Grid>}


                {
                    //#endregion
                }

                {
                    //#region 3 fila Precios de CUOTAS
                }
                <Grid item xs={12}  >
                    <div style={{ textAlign: 'center', backgroundColor: '#bfffff', borderRadius: '5px', margin: '0px' }}>Precios ventas por CUOTAS</div>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>

                        {productoSeleccionado.EntradaInicial && <div className={classes.entrada}>{'ENTRADA: ' + formater.format(productoSeleccionado.EntradaInicial)}</div>}
                        {productoSeleccionado.PrecioVenta3Cuotas && <Button onClick={()=>{setCuotas(3)}} className={classes.preciosCuotas} style={{ border: cuotas === 3 ? '2px solid red' : '' }}>3x<br/>{ formater.format(productoSeleccionado.PrecioVenta3Cuotas)}</Button>}
                        {productoSeleccionado.PrecioVenta6Cuotas && <Button onClick={() => { setCuotas(6) }} className={classes.preciosCuotas} style={{ border: cuotas === 6 ? '2px solid red' : '' }}>6x<br />{ formater.format(productoSeleccionado.PrecioVenta6Cuotas)}</Button>}
                        {productoSeleccionado.PrecioVenta12Cuotas && <Button onClick={() => { setCuotas(12) }} className={classes.preciosCuotas} style={{ border: cuotas === 12 ? '2px solid red' : '' }}>12x<br />{ formater.format(productoSeleccionado.PrecioVenta12Cuotas)}</Button>}
                        {productoSeleccionado.PrecioVenta18Cuotas && <Button onClick={() => { setCuotas(18) }} className={classes.preciosCuotas} style={{ border: cuotas === 18 ? '2px solid red' : '' }}>18x<br />{formater.format(productoSeleccionado.PrecioVenta18Cuotas)}</Button>}
                        {productoSeleccionado.PrecioVenta24Cuotas && <Button onClick={() => { setCuotas(24) }} className={classes.preciosCuotas} style={{ border: cuotas === 24 ? '2px solid red' : '' }}>24x<br />{formater.format(productoSeleccionado.PrecioVenta24Cuotas)}</Button>}
                    
                    </div>
                </Grid>
                {
                    //#endregion
                }
            </Grid>
        </div >)

}

export default FormVentasCuotas
