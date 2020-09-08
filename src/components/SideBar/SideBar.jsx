import React from 'react';

import List from '@material-ui/core/List';

import Divider from '@material-ui/core/Divider';


import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import { withRouter } from 'react-router-dom'

const SideBar = ({ history }) => {

    const to = (where) => {
        history.push(where)
    }

    return (

        <>
            <Divider />
            <List>

                <ListItem button onClick={e => { to('/dashboard') }}>

                    <ListItemIcon> <LocalAtmIcon />  </ListItemIcon>

                    <ListItemText primary='Dashboard' />

                </ListItem>

                <ListItem button onClick={e => { to('/productos') }}>

                    <ListItemIcon> <FormatListNumberedIcon /></ListItemIcon>

                    <ListItemText primary='Productos' />

                </ListItem>
                <Divider />
                <ListItem button onClick={e => { to('/register') }}>

                    <ListItemIcon> <AssignmentIndIcon />  </ListItemIcon>

                    <ListItemText primary='Registrar Usuario' />

                </ListItem>
                <Divider />
            </List>

        </>
    )

}
export default withRouter(SideBar)