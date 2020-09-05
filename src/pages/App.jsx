import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'




import NavBar from '../components/NavBar/NavBar'
import LandingPage from './LandingPage';
import SecureRoute from '../auth/SecureRoute'
import Dashboard from './Dashboard';
import Register from '../components/Register/Register';
import Productos from './Productos';

export default function App() {



  return (
    <Router>
      <div className='wrapper'>
        <NavBar />

        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/register" component={Register} />
          <SecureRoute path='/dashboard' component={Dashboard} />
          <SecureRoute path='/productos' component={Productos} />



          {/* <Route exact path='/:project/admin' render={(props)=>(<WebPage admin {...props}/>)} />
                  <Route exact path='/:project/:pagina' component={WebPage} /> */}


          <Route path="*" component={LandingPage} />
        </Switch>


      </div>
    </Router>



  );
}
