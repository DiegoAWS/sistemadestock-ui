import React, { PureComponent } from 'react'
import
{
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine,
} from 'recharts'

const data = [
    {
        name: 'Lunes', Ventas: 400000000, Compras: 240000000, amt: 240000000,
    },
    {
        name: 'Martes', Ventas: -300000000, Compras: 139000000, amt: 221000000,
    },
    {
        name: 'Miercoles', Ventas: -200000000, Compras: -980000000, amt: 229000000,
    },
    {
        name: 'Jueves', Ventas: 278000000, Compras: 390000000, amt: 200000000,
    },
    {
        name: 'Viernes', Ventas: -189000000, Compras: 480000000, amt: 218000000,
    }

]

export default class Barras extends PureComponent
{

    render ()
    {
        return (
            <BarChart
                width={ 500 }
                height={ 300 }
                data={ data }
                margin={ {
                    top: 5, right: 30, left: 20, bottom: 5,
                } }
            >

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend style={ { color: 'black' } } />
                <ReferenceLine y={ 0 } stroke="gold" />
                <Bar dataKey="Compras" fill="red" />
                <Bar dataKey="Ventas" fill="violet" />
            </BarChart>
        )
    }
}
