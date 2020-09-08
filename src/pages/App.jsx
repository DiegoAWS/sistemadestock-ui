import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'



import CssBaseline from "@material-ui/core/CssBaseline";

import NavBar from '../components/NavBar/NavBar'
import LandingPage from './LandingPage';
import SecureRoute from './SecureRoute'
import Dashboard from './Dashboard';


import Register from '../components/Register/Register';
import Productos from './Productos';
import SkeletonSideBar from './SkeletonSideBar'
import SideBar from '../components/SideBar/SideBar';


export default function App() {



  return (
    <Router>
      <div className='wrapper'>
      <CssBaseline />
        <SkeletonSideBar
          ToolbarContent={NavBar}
          SideBar={<SideBar/>}
        >




          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/register" component={Register} />
            <SecureRoute path='/dashboard' component={Dashboard} />
            <SecureRoute path='/productos' component={Productos} />



            {/* <Route exact path='/:project/admin' render={(props)=>(<WebPage admin {...props}/>)} />
                  <Route exact path='/:project/:pagina' component={WebPage} /> */}


            <Route path="*" component={LandingPage} />
          </Switch>
        </SkeletonSideBar>

      </div>
    </Router>



  );
}
