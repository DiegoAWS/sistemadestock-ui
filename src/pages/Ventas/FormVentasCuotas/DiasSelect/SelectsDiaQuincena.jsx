import React from 'react'
import { makeStyles, TextField, MenuItem } from "@material-ui/core"


//#region JSS
const useStyle = makeStyles((theme) => ({

    inputLittle: {
        padding: '5px 0px 3px',
        fontSize: '0.9rem',
        textAlign: 'center'
    }
}))
//#endregion




function SelectsDiaQuincena({ diaDelMes, setDiaDelMes }) {
    const classes = useStyle()

    const dias = new Array(31).fill('x', 0, 31)

    const OtherDay = diaDelMes > 15 ? parseInt(diaDelMes) - 15 : 15 + parseInt(diaDelMes)

    const texto = diaDelMes > 15 ? OtherDay + ' y ' + diaDelMes : diaDelMes + ' y ' + OtherDay

    return (
        <>

            <div style={{ display: 'flex' }}>
                <TextField
                    fullWidth
                    variant='outlined'
                    label='Dia'
                    value={diaDelMes}
                    select
                    SelectProps={{ classes: { root: classes.inputLittle } }}
                    onChange={e => { setDiaDelMes(e.target.value) }}

                >
                    {dias.map((i, option) => (
                        <MenuItem key={option} value={option + 1}>
                            {option + 1}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    variant='outlined'
                    label='Dia'
                    inputProps={{
                        style: { padding: '5px 0px 3px', fontSize: '0.9rem', textAlign: 'center' }
                    }}
                    value={OtherDay}
                />
            </div>
            <h4 style={{ margin: '2px', textAlign: 'center', }}> {'Todos los dias ' + texto + ' de cada mes'}</h4>


        </>
    )
}

export default SelectsDiaQuincena
