import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'




import NavBar from '../components/NavBar/NavBar'
import LandingPage from './LandingPage';
import SecureRoute from '../auth/SecureRoute'
import DashBoard from './DashBoard';
import Register from '../components/Register/Register';


export default function App() {



  return (
    <Router>
      <div>
        <NavBar />
        <section id='MainSection' className='container-fluid d-flex justify-content-center text-primary'>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/register" component={Register} />
            <SecureRoute path='/dashboard' redirect='/' component={DashBoard} />

            {/* <Route exact path='/:project/admin' render={(props)=>(<WebPage admin {...props}/>)} />
                  <Route exact path='/:project/:pagina' component={WebPage} /> */}


            <Route path="*" component={LandingPage} />
          </Switch>
        </section>

      </div>
    </Router>



  );
}
