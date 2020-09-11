import React from "react";
import { AreaChart, XAxis, CartesianGrid, Tooltip, Area, YAxis } from 'recharts'
export default function Dashboard() {



    const data = [
        {
            "name": "Enero",
            "uv": 4000,
            "pv": 2400,
            "amt": 2400
        },
        {
            "name": "Febrero",
            "uv": 3000,
            "pv": 1398,
            "amt": 2210
        },
        {
            "name": "Marzo",
            "uv": 2000,
            "pv": 6800,
            "amt": 2290
        },
        {
            "name": "Abril",
            "uv": 2780,
            "pv": 3908,
            "amt": 2000
        },
        {
            "name": "Mayo",
            "uv": 1890,
            "pv": 4800,
            "amt": 2181
        },
        {
            "name": "Junio",
            "uv": 2390,
            "pv": 3800,
            "amt": 2500
        },
        {
            "name": "Julio",
            "uv": 3490,
            "pv": 4300,
            "amt": 2100
        }, {
            "name": "Agosto",
            "uv": 4000,
            "pv": 2400,
            "amt": 2400
        },
        {
            "name": "Septiembre",
            "uv": 3000,
            "pv": 1398,
            "amt": 2210
        },
        {
            "name": "Octubre",
            "uv": 2000,
            "pv": 9800,
            "amt": 2290
        },
        {
            "name": "Noviembre",
            "uv": 2780,
            "pv": 3908,
            "amt": 2000
        },
        {
            "name": "Diciembre",
            "uv": 1890,
            "pv": 4800,
            "amt": 2181
        }
    ]
    return (
        <>

<div style={{color:'white',backgroundColor:'blue',fontSize:'2rem',textAlign:'center'}}>Análisis de las ventas 2021 ( en G 1 000 000)</div>

            <AreaChart width={950} height={500} data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                <Area type="monotone" dataKey="pv" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
        </>
    );
}
