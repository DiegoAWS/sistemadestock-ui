import React from 'react';
import { withRouter, Link } from 'react-router-dom'

import { logout } from '../../API/apiFunctions'
import { Menu, MenuItem, Button } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
const ControlLinks = ({ history, loggout }) => {


    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        if (options[index][1] === 'logout')
            logoutHandler(event)

        setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const logoutHandler = e => {

        handleClose()
        document.getElementById('menuButton').innerText = 'Saliendo...'



        localStorage.removeItem('UserOficialName')
        localStorage.removeItem('UserRole')



        logout().then(() => {
            localStorage.removeItem('usertoken')

            //Update NavBar
            loggout()

            history.push('/')

        })




    }


    const options = [
        ['Dashboard', '/dashboard'],
        ['Productos', '/productos'],
        ['Control de Usuarios', '/register'],
        ['Cerrar Session', 'logout']
    ];
    return (


        <ul className="navbar-nav ml-auto">

            <li>

                <Button id='menuButton' variant="outlined" color="primary"
                    onClick={handleClickListItem} startIcon={<ArrowDropDownIcon />}>  {options[selectedIndex][0]} </Button>

                <Menu
                    id="lock-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {options.map((option, index) => (
                        <MenuItem key={option[1]} selected={index === selectedIndex} onClick={(event) => handleMenuItemClick(event, index)} >

                            <Button color="primary" component={Link} to={option[1]}> {option[0]}</Button>

                        </MenuItem>
                    ))}
                </Menu>
            </li>

        </ul>


    )

}
export default withRouter(ControlLinks)