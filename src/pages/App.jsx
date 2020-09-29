import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


import CssBaseline from "@material-ui/core/CssBaseline"

import NavBar from '../components/NavBar/NavBar'
import LandingPage from './Landing/LandingPage'
import SecureRoute from './SecureRoute'


import Users from './Users/Users'

import SkeletonSideBar from './SkeletonSideBar'
import SideBar from '../components/SideBar/SideBar'





import Dashboard from './Dashboard/Dashboard'



import Ventas from './Ventas/Ventas'

import Stock from './Stock/Stock'

import Productos from './Productos/Productos'

import Clientes from './Clientes/Clientes'

import Proveedores from './Proveedores/Proveedores'

import Codebars from './Codebars/Codebars'

import Ajustes from './Ajustes/Ajustes'



export default function App ()
{



  return (
    <Router>


      <CssBaseline />

      <SkeletonSideBar
        ToolbarContent={ NavBar }
        SideBar={ <SideBar /> }
      >




        <Switch>
          <Route exact path="/" component={ LandingPage } />

          <SecureRoute path='/dashboard' component={ Dashboard } />

          <SecureRoute path='/ventas' component={ Ventas } />
          <SecureRoute path='/stock' component={ Stock } />

          <SecureRoute path='/productos' component={ Productos } />
          <SecureRoute path='/clientes' component={ Clientes } />

          <SecureRoute path='/proveedores' component={ Proveedores } />

          <SecureRoute path='/codebars' component={ Codebars } />

          <SecureRoute exact path="/users" component={ Users } />

          <SecureRoute exact path="/ajustes" component={ Ajustes } />

          <Route path="*" component={ LandingPage } />
        </Switch>
      </SkeletonSideBar>

    </Router>



  )
}
