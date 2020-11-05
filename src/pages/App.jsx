import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


import CssBaseline from "@material-ui/core/CssBaseline"


import LandingPage from './Landing/LandingPage'
import SecureRoute from './SecureRoute'


import Users from './Users/Users'

import Skeleton from './Skeleton'





import RealDashboard from './Dashboard/RealDashboard'



import Ventas from './Ventas/Ventas'

import Stock from './Stock/Stock'

import Clientes from './Clientes/Clientes'

import Proveedores from './Proveedores/Proveedores'


import Ajustes from './Ajustes/Ajustes'
import Registros from './Registros/Registros'



export default function App() {

  const ventas = 'VENTAS'
  const creditos = 'CREDITOS'
  const garantia = 'GARANTIA'

  return (
    <Router>


      <CssBaseline />

      <Skeleton >

        <Switch>
          <Route exact path="/" component={LandingPage} />

          <SecureRoute path='/dashboard' component={RealDashboard} />
          <SecureRoute path='/facturacion' component={Ventas} />

          <SecureRoute path='/ventas' component={Registros} view={ventas} />
          <SecureRoute path='/creditos' component={Registros} view={creditos} />
          <SecureRoute path='/garantia' component={Registros} view={garantia} />

          <SecureRoute path='/stock' component={Stock} />

          <SecureRoute path='/proveedores' component={Proveedores} />
          <SecureRoute path='/clientes' component={Clientes} />



          <SecureRoute exact path="/users" component={Users} />

          <SecureRoute exact path="/ajustes" component={Ajustes} />

          <Route path="*" component={LandingPage} />
        </Switch>
      </Skeleton>

    </Router>



  )
}
