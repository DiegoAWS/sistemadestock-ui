import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'



import CssBaseline from "@material-ui/core/CssBaseline";

import NavBar from '../components/NavBar/NavBar'
import LandingPage from './Landing/LandingPage';
import SecureRoute from './SecureRoute'




import Users from './Users/Users'

import SkeletonSideBar from './SkeletonSideBar'
import SideBar from '../components/SideBar/SideBar';






import Dashboard from './Dashboard/Dashboard';



import Ventas from './Ventas/Ventas'

import Stock from './Stock/Stock'

import Productos from './Productos/Productos';

import Clientes from './Clientes/Clientes'

import Proveedores from './Proveedores/Proveedores'

import Codebars from './Codebars/Codebars'





export default function App() {



  return (
    <Router>
      <div className='wrapper'>
       
        <CssBaseline />

        <SkeletonSideBar
          ToolbarContent={NavBar}
          SideBar={<SideBar />}
        >




          <Switch>
            <Route exact path="/" component={LandingPage} />

            <SecureRoute path='/dashboard' component={Dashboard} />

            <SecureRoute path='/ventas' component={Ventas} />
            <SecureRoute path='/stock' component={Stock} />

            <SecureRoute path='/productos' component={Productos} />
            <SecureRoute path='/clientes' component={Clientes} />

            <SecureRoute path='/proveedores' component={Proveedores} />

            <SecureRoute path='/codebars' component={Codebars} />

            <Route exact path="/users" component={Users} />






            {/* <Route exact path='/:project/admin' render={(props)=>(<WebPage admin {...props}/>)} />
                  <Route exact path='/:project/:pagina' component={WebPage} /> */}


            <Route path="*" component={LandingPage} />
          </Switch>
        </SkeletonSideBar>

      </div>
    </Router>



  );
}
