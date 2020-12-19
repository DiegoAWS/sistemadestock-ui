import React, { PureComponent } from 'react'
import { PieChart, Pie, Sector } from 'recharts'

const data = [
    { name: 'Televisores', value: 40000000 },
    { name: 'Laptops y PC', value: 70000000 },
    { name: 'Teléfonos', value: 90000000 },
    { name: 'Accesorios', value: 20000000 },
]

const renderActiveShape = ( props ) =>
{
    const RADIAN = Math.PI / 180
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        payload, percent, value,
    } = props
    const fill = 'black'
    const sin = Math.sin( -RADIAN * midAngle )
    const cos = Math.cos( -RADIAN * midAngle )
    const sx = cx + ( outerRadius + 10 ) * cos
    const sy = cy + ( outerRadius + 10 ) * sin
    const mx = cx + ( outerRadius + 30 ) * cos
    const my = cy + ( outerRadius + 30 ) * sin
    const ex = mx + ( cos >= 0 ? 1 : -1 ) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
        <g>
            <text x={ cx } y={ cy } dy={ 8 } textAnchor="middle" fill={ fill }>{ payload.name }</text>
            <Sector
                cx={ cx }
                cy={ cy }
                innerRadius={ innerRadius }
                outerRadius={ outerRadius }
                startAngle={ startAngle }
                endAngle={ endAngle }
                fill={ 'red' }
            />
            <Sector
                cx={ cx }
                cy={ cy }
                startAngle={ startAngle }
                endAngle={ endAngle }
                innerRadius={ outerRadius + 6 }
                outerRadius={ outerRadius + 10 }
                fill={ 'greenlemon' }
            />
            <path d={ `M${ sx },${ sy }L${ mx },${ my }L${ ex },${ ey }` } stroke={ fill } fill="none" />
            <circle cx={ ex } cy={ ey } r={ 2 } fill={ fill } stroke="none" />
            <text x={ ex + ( cos >= 0 ? 1 : -1 ) * 12 } y={ ey } textAnchor={ textAnchor } fill="black">{ `Ganancias ${ value }` }</text>
            <text x={ ex + ( cos >= 0 ? 1 : -1 ) * 12 } y={ ey } dy={ 18 } textAnchor={ textAnchor } fill="black">
                { `(Ganancias ${ ( percent * 100 ).toFixed( 2 ) }%)` }
            </text>
        </g>
    )
}


export default class CategoriasAnalisis extends PureComponent
{

    state = {
        activeIndex: 0,
    };

    onPieEnter = ( data, index ) =>
    {
        this.setState( {
            activeIndex: index,
        } )
    };

    render ()
    {
        return (
            <PieChart width={ 400 } height={ 400 }>
                <Pie
                    activeIndex={ this.state.activeIndex }
                    activeShape={ renderActiveShape }
                    data={ data }
                    cx={ 200 }
                    cy={ 200 }
                    innerRadius={ 60 }
                    outerRadius={ 80 }
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={ this.onPieEnter }
                />
            </PieChart>
        )
    }
}
