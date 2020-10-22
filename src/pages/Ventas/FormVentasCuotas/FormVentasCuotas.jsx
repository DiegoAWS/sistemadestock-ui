import React, { useState } from 'react'
import { TextField, MenuItem, Button, Grid, FormControl, Select, InputLabel } from "@material-ui/core"

import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'

import RadioDiaSemana from './DiasSelect/RadioDiaSemana'
import SelectDiaDelMes from './DiasSelect/SelectDiaDelMes'

registerLocale('es', es)
setDefaultLocale('es')

const FormVentasCuotas = (props) => {

    //#region STATE

    const [cuotas, setCuotas] = useState('3Cuotas')
    const [frecuencia, setFrecuencia] = useState("diario")
    const [weekDay, setWeekDay] = useState(1)
    const [diaDelMes, setDiaDelMes]=useState(1)
    //#endregion

    const VerDias = React.forwardRef(({ onClick }, ref) => <Button ref={ref} color='primary' variant='contained' onClick={onClick}>Fechas de Pago</Button>)


    return (
        <div style={{ padding: '5px' }}>
            <Grid container spacing={2}>
                {
                    //#region 1 Fila
                }
                <Grid item xs={4}>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="cuotasLabel">CUOTAS</InputLabel>
                        <Select

                            labelId="cuotasLabel"
                            label="CUOTAS"
                            value={cuotas}
                            onChange={e => { setCuotas(e.target.value) }}
                        >
                            <MenuItem value={'3Cuotas'}>3</MenuItem>
                            <MenuItem value={'6Cuotas'}>6</MenuItem>
                            <MenuItem value={'12Cuotas'}>12</MenuItem>
                            <MenuItem value={'18Cuotas'}>18</MenuItem>
                            <MenuItem value={'24Cuotas'}>24</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="cuotasLabel">Frecuencia</InputLabel>
                        <Select
                            labelId="cuotasLabel"
                            label="Frecuencia"
                            value={frecuencia}
                            onChange={(e) => { setFrecuencia(e.target.value) }}

                        >
                            <MenuItem value={'diario'}>Diario</MenuItem>
                            <MenuItem value={'semanal'}>Semanal</MenuItem>
                            <MenuItem value={'quincenal'}>Quincenal (Dia de semana)</MenuItem>
                            <MenuItem value={'quincemensual'}>Quincenal (Dia del mes)</MenuItem>
                            <MenuItem value={'mensual'}>Mensual</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={4}>


                    <Button variant='contained' fullWidth color='secondary' onClick={e => {
                        alert('SUBMIT')
                    }}>OK</Button>
                </Grid>

                {
                    //#endregion
                }
                {
                    //#region 2 Fila
                }
                <Grid item xs={4}>
                    <TextField
                        name="Otro"
                        color='secondary'
                        variant='outlined'
                        fullWidth
                        label="Otro"


                    />
                </Grid>


              

                    {(frecuencia === 'diario') &&<Grid item xs={4}> <SelectDiaDelMes diaDelMes={diaDelMes} setDiaDelMes={setDiaDelMes} />  </Grid>}

                    {(frecuencia === 'semanal') &&   <Grid item xs={8}><RadioDiaSemana weekDay={weekDay} setWeekDay={setWeekDay} />  </Grid>}
                  
                  
              
                {
                    //#endregion
                }
                {
                    //#region 3 Fila
                }
                <Grid item xs={4}>

                    <DatePicker
                        selected={new Date()}
                        highlightDates={[new Date(2020, 9, 25), new Date(2020, 9, 27)]}
                        includeDates={[new Date(2020, 9, 25), new Date(2020, 9, 27)]}
                        customInput={<VerDias />}
                        shouldCloseOnSelect={false}
                        fixedHeight


                    >
                        <div>
                            <div>    Fecha 1</div>
                            <div>    Fecha 2</div>
                        </div>
                    </DatePicker>
                </Grid>

                {
                    //#endregion
                }

            </Grid>
  </div >)

}

export default FormVentasCuotas
