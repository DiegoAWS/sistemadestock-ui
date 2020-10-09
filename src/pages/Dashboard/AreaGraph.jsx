import React, { PureComponent } from 'react';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Brush, AreaChart, Area, ResponsiveContainer
} from 'recharts';


function getViewPortWidth() {
    var viewportwidth;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerWidth;
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        viewportwidth = document.documentElement.clientWidth;
        // older versions of IE
    } else {
        viewportwidth = document.getElementsByTagName('body')[0].clientWidth;
    }
    return viewportwidth;
}

export default class AreaGraph extends PureComponent {

    render() {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer >
                        <AreaChart
                            width={Math.floor(getViewPortWidth() * 80)}
                            height={200}
                            data={this.props.data}
                            syncId="anyId"
                            margin={{
                                top: 10, right: 30, left: 0, bottom: 0,
                            }}
                        >

                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="Ganancia Neta" stroke="#82ca9d" fill="#82ca9d" />
                            <Area type="monotone" dataKey="Inversiones" stroke="#8884d8" fill="#8884d8" />
                            <Brush />
                        </AreaChart>
                    </ResponsiveContainer></div>

                <LineChart
                    width={400}
                    height={200}
                    data={this.props.data}
                    syncId="anyId"
                    margin={{
                        top: 10, right: 30, left: 0, bottom: 0,
                    }}
                >

                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="Inversiones" stroke="#8884d8" fill="#8884d8" />
                </LineChart>

                <LineChart
                    width={400}
                    height={200}
                    data={this.props.data}
                    syncId="anyId"
                    margin={{
                        top: 10, right: 30, left: 0, bottom: 0,
                    }}
                >

                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="Ganancia Neta" stroke="#82ca9d" fill="#82ca9d" />

                </LineChart>



            </div>
        );
    }
}
