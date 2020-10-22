import React from 'react'
import {  FormGroup, FormControlLabel, Checkbox } from "@material-ui/core"


function RadioDiaSemana({ weekDay, setWeekDay}) {
   


    return (
        <FormGroup aria-label="position" row style={{ justifyContent: 'space-around' }}>
            <FormControlLabel
                style={{ margin: '0px' }}
                control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={weekDay === 1}
                    onChange={e => {
                        if (e.target.checked)
                            setWeekDay(1)
                    }} />}
                label="L"
                labelPlacement="bottom"
            />
            <FormControlLabel
                style={{ margin: '0px' }}
                control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={weekDay === 2}
                    onChange={e => {
                        if (e.target.checked)
                            setWeekDay(2)
                    }} />}
                label="M"
                labelPlacement="bottom"
            />
            <FormControlLabel
                style={{ margin: '0px' }}
                control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={weekDay === 3}
                    onChange={e => {
                        if (e.target.checked)
                            setWeekDay(3)
                    }} />}
                label="X"
                labelPlacement="bottom"
            />
            <FormControlLabel
                style={{ margin: '0px' }}
                control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={weekDay === 4}
                    onChange={e => {
                        if (e.target.checked)
                            setWeekDay(4)
                    }} />}
                label="J"
                labelPlacement="bottom"
            />
            <FormControlLabel
                style={{ margin: '0px' }}
                control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={weekDay === 5}
                    onChange={e => {
                        if (e.target.checked)
                            setWeekDay(5)
                    }} />}
                label="V"
                labelPlacement="bottom"
            />
            <FormControlLabel
                style={{ margin: '0px' }}
                control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={weekDay === 6}
                    onChange={e => {
                        if (e.target.checked)
                            setWeekDay(6)
                    }} />}
                label="S"
                labelPlacement="bottom"
            />
            <FormControlLabel
                style={{ margin: '0px' }}
                control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={weekDay === 0}
                    onChange={e => {
                        if (e.target.checked)
                            setWeekDay(0)
                    }} />}
                label="D"
                labelPlacement="bottom"
            />

        </FormGroup>
    )
}

export default RadioDiaSemana
