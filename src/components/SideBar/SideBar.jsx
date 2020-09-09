import React from 'react';

import List from '@material-ui/core/List';

import Divider from '@material-ui/core/Divider';


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import PrintIcon from '@material-ui/icons/Print';

import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import { withRouter } from 'react-router-dom'

const SideBar = ({ history }) => {
    console.log()
    const page = history.location.pathname

    const to = (where) => {
        history.push(where)
    }
    const espaciado = (value) => {

        const EstilizaString = (s) => {
            var re = '\\d(?=(\\d{3})+$)';
            return s.toString().replace(new RegExp(re, 'g'), '$& ');
        }



        return EstilizaString(value)
    }

    const lista = [
        {
            ruta: '/dashboard',
            icon: LocalAtmIcon,
            texto: 'Dashboard'
        }, {
            ruta: '/productos',
            icon: FormatListNumberedIcon,
            texto: 'Productos'
        },
        {
            ruta: '/codebars',
            icon: PrintIcon,
            texto: 'Codigos de Barra'
        }, {
            ruta: '/register',
            icon: AssignmentIndIcon,
            texto: 'Registrar Usuario'
        },


    ]
    return (

        <>
            <Divider />
            <List>

                {
                    lista.map(item => (
                        <ListItem button key={item.ruta} onClick={e => { to(item.ruta) }} selected={page === item.ruta}>

                            <ListItemIcon >  <item.icon color={page === item.ruta ? 'secondary' : 'action'} />  </ListItemIcon>

                            <ListItemText primary={espaciado(item.texto)} />

                        </ListItem>
                    ))
                }



            </List>

        </>
    )

}
export default withRouter(SideBar)