import React, { useState, useEffect } from 'react'
import { makeStyles, MenuItem, Button, Grid, FormControl, Select, InputLabel } from "@material-ui/core"

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'


import addDays from 'date-fns/addDays'
import addMonths from 'date-fns/addMonths'
import format from 'date-fns/format'
import es from 'date-fns/locale/es'

import swal from 'sweetalert';

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

const FormVentasCuotas = ({ productoSeleccionado, addCartCUOTAS, cuotas, setCuotas }) => {
    const classes = useStyle()




    //#region STATE


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
            <Grid container spacing={1} justify='space-between'>

                {
                    //#region 0 fila Precios de CUOTAS
                }
                <Grid item xs={12}  >
                    <div style={{
                        textAlign: 'center', backgroundColor: '#bfffff', margin: '10px 0px 0px',
                        border: '1px solid black', borderBottom: 'none', borderRadius: '10px 10px 0px 0px'
                    }}>Seleccione las cuotas CUOTAS</div>

                    <div style={{
                        display: 'flex', justifyContent: 'space-evenly',
                        flexWrap: 'wrap', border: '1px solid black',
                        borderTop: 'none', borderRadius: '0px 0px 10px 10px'
                    }}>

                        {productoSeleccionado.EntradaInicial && <div className={classes.entrada}>{'ENTRADA: ' + formater.format(productoSeleccionado.EntradaInicial)}</div>}
                        {productoSeleccionado.PrecioVenta3Cuotas && <Button onClick={() => { setCuotas(3) }} className={classes.preciosCuotas} style={{ border: cuotas === 3 ? '2px solid red' : '' }}>3 x<br />{formater.format(productoSeleccionado.PrecioVenta3Cuotas)}</Button>}
                        {productoSeleccionado.PrecioVenta6Cuotas && <Button onClick={() => { setCuotas(6) }} className={classes.preciosCuotas} style={{ border: cuotas === 6 ? '2px solid red' : '' }}>6 x<br />{formater.format(productoSeleccionado.PrecioVenta6Cuotas)}</Button>}
                        {productoSeleccionado.PrecioVenta12Cuotas && <Button onClick={() => { setCuotas(12) }} className={classes.preciosCuotas} style={{ border: cuotas === 12 ? '2px solid red' : '' }}>12 x<br />{formater.format(productoSeleccionado.PrecioVenta12Cuotas)}</Button>}
                        {productoSeleccionado.PrecioVenta18Cuotas && <Button onClick={() => { setCuotas(18) }} className={classes.preciosCuotas} style={{ border: cuotas === 18 ? '2px solid red' : '' }}>18 x<br />{formater.format(productoSeleccionado.PrecioVenta18Cuotas)}</Button>}
                        {productoSeleccionado.PrecioVenta24Cuotas && <Button onClick={() => { setCuotas(24) }} className={classes.preciosCuotas} style={{ border: cuotas === 24 ? '2px solid red' : '' }}>24 x<br />{formater.format(productoSeleccionado.PrecioVenta24Cuotas)}</Button>}

                    </div>
                </Grid>
                {
                    //#endregion
                }

                <Grid container item xs={12} justify='space-between'>
                    <Grid item xs={12} style={{ textAlign: 'center' }}> Detalles</Grid>

                    <Grid container item xs={12} spacing={3} justify='space-between' style={{ margin: '5px', border: '1px solid black', borderRadius: '10px' }}>
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



                        <Grid item xs={5}>

                            <Button fullWidth color='primary' variant='contained' onClick={() => {
                                let pagoRegular = 0
                                switch (listaDeDiasDePago.length) {
                                    case 3:
                                        pagoRegular = productoSeleccionado.PrecioVenta3Cuotas
                                        break
                                    case 6:
                                        pagoRegular = productoSeleccionado.PrecioVenta6Cuotas
                                        break
                                    case 12:
                                        pagoRegular = productoSeleccionado.PrecioVenta12Cuotas
                                        break
                                    case 18:
                                        pagoRegular = productoSeleccionado.PrecioVenta18Cuotas
                                        break
                                    case 24:
                                        pagoRegular = productoSeleccionado.PrecioVenta24Cuotas
                                        break

                                    default:
                                        throw new Error("Error Cantidada de CUOTAS")



                                }


                                let Texto = ''

                                listaDeDiasDePago.forEach((item, i) => {
                                    let pagar = 0
                                    if (i === 0 && productoSeleccionado.EntradaInicial)
                                        pagar = productoSeleccionado.EntradaInicial
                                    else
                                        pagar = pagoRegular

                                    Texto = Texto + '\n' + formater.format(pagar) + ' - ' + format(item, "iiii d 'de' MMMM 'del' yyyy", { locale: es })
                                })




                                swal({
                                    title: "Fechas de Pago",
                                    text: Texto,
                                    icon: "info",
                                })
                            }}>VER Días de Pago</Button>
                        </Grid>

                        <Grid item xs={3}>


                            <Button variant='contained' fullWidth color='secondary' onClick={e => {
                                addCartCUOTAS(listaDeDiasDePago, diaPrimerPago)

                            }}>Añadir</Button>
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

                    </Grid>
                </Grid>
            </Grid>
        </div >)

}

export default FormVentasCuotas
