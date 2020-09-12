import React from "react";
import { ResponsiveContainer, AreaChart, XAxis, CartesianGrid, Tooltip, Area, YAxis } from 'recharts'
export default function Dashboard() {



    const data = [
        {
            "name": "Enero",
            "Inversiones": 4000,
            "Ganancia Neta": 2400,
            "amt": 2400
        },
        {
            "name": "Febrero",
            "Inversiones": 3000,
            "Ganancia Neta": 1398,
            "amt": 2210
        },
        {
            "name": "Marzo",
            "Inversiones": 2000,
            "Ganancia Neta": 6800,
            "amt": 2290
        },
        {
            "name": "Abril",
            "Inversiones": 2780,
            "Ganancia Neta": 3908,
            "amt": 2000
        },
        {
            "name": "Mayo",
            "Inversiones": 1890,
            "Ganancia Neta": 4800,
            "amt": 2181
        },
        {
            "name": "Junio",
            "Inversiones": 2390,
            "Ganancia Neta": 3800,
            "amt": 2500
        },
        {
            "name": "Julio",
            "Inversiones": 3490,
            "Ganancia Neta": 4300,
            "amt": 2100
        }, {
            "name": "Agosto",
            "Inversiones": 4000,
            "Ganancia Neta": 2400,
            "amt": 2400
        },
        {
            "name": "Septiembre",
            "Inversiones": 3000,
            "Ganancia Neta": 1398,
            "amt": 2210
        },
        {
            "name": "Octubre",
            "Inversiones": 2000,
            "Ganancia Neta": 9800,
            "amt": 2290
        },
        {
            "name": "Noviembre",
            "Inversiones": 2780,
            "Ganancia Neta": 3908,
            "amt": 2000
        },
        {
            "name": "Diciembre",
            "Inversiones": 1890,
            "Ganancia Neta": 4800,
            "amt": 2181
        }
    ]
    return (
        <>


            <div style={{ color: 'white', backgroundColor: 'blue', fontSize: '2rem', textAlign: 'center' }}>Análisis de las ventas 2021 ( en G 1 000 000)</div>
            <div style={{ width: '80vw', height: '70vh', backgroundColor: 'darkblue', margin: '10px auto' }}>

                <ResponsiveContainer>
                    <AreaChart data={data}
                        margin={{ top: 30, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="yellow" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="yellow" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="red" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="white" angle={20} />
                        <YAxis stroke="white" />
                        <CartesianGrid stroke="gray" strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="Inversiones" stroke="yellow" fillOpacity={1} fill="url(#colorUv)" />
                        <Area type="monotone" dataKey="Ganancia Neta" stroke="red" fillOpacity={1} fill="url(#colorPv)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
