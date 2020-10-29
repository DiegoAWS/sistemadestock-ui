import React from 'react'
import { makeStyles, TextField, MenuItem } from "@material-ui/core"


//#region JSS
const useStyle = makeStyles((theme) => ({

    inputLittle: {
        padding: '5px 0px 3px',
        fontSize: '0.9rem',
        textAlign: 'center'
    },
}))
//#endregion

function SelectDiaDelMes({ diaDelMes, setDiaDelMes }) {
    const classes = useStyle()
    const dias = new Array(31).fill('x', 0, 31)
    return (<div>

        <TextField
            fullWidth
            variant='outlined'
            label='Dia'
            value={diaDelMes.toString()}
            select
            SelectProps={{ classes: { root: classes.inputLittle } }}
            onChange={e => {
                let dia = parseInt(e.target.value)
                setDiaDelMes(dia)
            }}

        >
            {dias.map((i, option) => (
                <MenuItem key={option} value={option + 1}>
                    {option + 1}
                </MenuItem>
            ))}
        </TextField>
        <h4 style={{ margin: '2px', textAlign: 'center' }}> {'Todos los dias ' + diaDelMes + ' de cada mes'}</h4>
    </div>
    )
}

export default SelectDiaDelMes
