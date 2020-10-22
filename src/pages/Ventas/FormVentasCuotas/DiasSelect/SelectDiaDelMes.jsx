import React from 'react'
import { TextField } from "@material-ui/core"

function SelectDiaDelMes({diaDelMes, setDiaDelMes}) {
 
    return (
        <TextField
            variant='outlined'
            label='Dia del mes'
            value={diaDelMes.toString()}
            onChange={e => {

                let dia = e.target.value.toString().replace(/\D/, '')
                if (dia.length===0||(dia > 0 && dia < 32))
                    setDiaDelMes(dia)
            }}
            onBlur={e=>{

                if(e.target.value.toString().length===0)
                 setDiaDelMes(1)
            }}
        />
    )
}

export default SelectDiaDelMes
