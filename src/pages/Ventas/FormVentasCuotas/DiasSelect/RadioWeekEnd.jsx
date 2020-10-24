import React from 'react'

import { FormGroup, FormControlLabel, Checkbox } from "@material-ui/core"


function RadioWeekEnd({ sab, dom, setSab, setDom }) {

    const texto = () => {

        let text = 'Todos los días'

        if (!sab && dom)
            text = text + ', excepto los SABADOS'
        if (sab && !dom)
            text = text + ', excepto los DOMINGOS'
        if (!sab && !dom)
            text = text + ', excepto los SABADOS Y DOMINGOS'

        return text

    }
    return (
     <>
            <FormGroup style={{display:'flex',flexDirection:'row',flexWrap:'nowrap'}}>
                
                <span style={{fontSize:'1rem'}}>Incluir:</span>
                <FormControlLabel
                    style={{ margin: '0px' }}
                    control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={sab}
                        onChange={e => { setSab(e.target.checked) }} />} 
                    label="Sábados"
                />
                <FormControlLabel
                style={{ margin: '0px' }}
                    control={<Checkbox style={{ padding: '0px' }} color="secondary" checked={dom}
                        onChange={e => { setDom(e.target.checked) }} />}
                    label="Domingos"
                />

            </FormGroup>
            <h4 style={{ margin: '2px', textAlign: 'center',width:'100%' }}> {texto()}</h4>
     </>
    )
}

export default RadioWeekEnd
