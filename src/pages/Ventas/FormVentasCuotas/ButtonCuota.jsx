import React from 'react'
// MUI--------------------
import { makeStyles, Button } from "@material-ui/core"



const formater = new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
});

//#region JSS
const useStyle = makeStyles(() => ({
    preciosCuotas: {
        margin: '5px',
    },

    buttonPreciosCuotas: {
        borderRadius: '10px',
        backgroundImage: 'linear-gradient(40deg, #9f93ff 0%, #b5d8ff 74%);',
    },
    precioTotal: {
        textAlign: 'center',
        fontSize: '0.75rem',
        fontWeight: '600'
    }

}))
//#endregion

const ButtonCuota = ({ cuotas, cuotasSel, producto, click }) => {

    const classes = useStyle()

    return (
        <div className={classes.preciosCuotas}>
            <Button onClick={() => { click(cuotasSel) }}
                className={classes.buttonPreciosCuotas}
                style={{ border: cuotas === cuotasSel ? '2px solid red' : '' }}
            >
                {cuotasSel + ' x'}
                <br />
                {formater.format(producto['PrecioVenta' + cuotasSel + 'Cuotas'])}
            </Button>

            <div className={classes.precioTotal}>
                {formater.format(cuotasSel * producto['PrecioVenta' + cuotasSel + 'Cuotas'])}
            </div>

        </div>
    )
}


export default ButtonCuota
