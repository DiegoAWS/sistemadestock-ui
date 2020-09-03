import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import NavBar from '../components/NavBar/NavBar'
import LandingPage from './LandingPage';
import SecureRoute from './SecureRoute';
import Dashboard from './Dashboard';


export default function App() {



  return (
    <Router>
      <div>
        <NavBar />
        <section id='MainSection' className='container-fluid d-flex justify-content-center text-primary'>
          <Switch>
            <Route exact path="/" component={LandingPage} />

            <SecureRoute path='/dashboard' redirect='/' component={Dashboard} />

            {/* <Route exact path='/:project/admin' render={(props)=>(<WebPage admin {...props}/>)} />
                  <Route exact path='/:project/:pagina' component={WebPage} /> */}


            <Route path="*" render={() => (<h1 syle={'textAlign=center'}>404</h1>)} />
          </Switch>
        </section>

      </div>
    </Router>



  );
}
