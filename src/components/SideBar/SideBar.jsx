import React from 'react'

import List from '@material-ui/core/List'

import Divider from '@material-ui/core/Divider'


import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'


import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered'


// import PrintIcon from '@material-ui/icons/Print'

import AssessmentIcon from '@material-ui/icons/Assessment'
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import ContactMailIcon from '@material-ui/icons/ContactMail'
import PeopleIcon from '@material-ui/icons/People'
import SettingsIcon from '@material-ui/icons/Settings'


import { withRouter } from 'react-router-dom'

const SideBar = ({ history }) => {


    const page = history.location.pathname

    const to = (where) => {
        history.push(where)
    }


    const lista = [
        {
            ruta: '/dashboard',
            icon: AssessmentIcon,
            texto: 'Dashboard'
        }, {
            ruta: '/ventas',
            icon: MonetizationOnIcon,
            texto: 'Ventas'
        },
        {
            ruta: '/stock',
            icon: FormatListNumberedIcon,
            texto: 'Stock'
        },
        {
            ruta: '/productos',
            icon: ImportantDevicesIcon,
            texto: 'Productos'
        },

        {
            ruta: '/clientes',
            icon: ContactMailIcon,
            texto: 'Clientes'
        },

        {
            ruta: '/users',
            icon: PeopleIcon,
            texto: 'Control de Usuarios'
        }, {
            ruta: '/ajustes',
            icon: SettingsIcon,
            texto: 'Ajustes'
        },


    ]
    return (

        <>
            < List >

                {
                    lista.map(item => (
                        <ListItem button key={item.ruta} onClick={e => { to(item.ruta) }} selected={page === item.ruta}>

                            <ListItemIcon >  <item.icon color={page === item.ruta ? 'secondary' : 'primary'} />  </ListItemIcon>

                            <ListItemText primary={item.texto} />
                            <Divider light variant={'middle'} />
                        </ListItem>

                    ))
                }



            </List>

        </>
    )

}
export default withRouter(SideBar)