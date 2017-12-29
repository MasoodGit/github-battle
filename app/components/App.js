import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import Popular from './Popular';
import Nav from './Nav'
import Home from './Home'
import Battle from './Battle'

class App extends Component {
  render() {
    return (
    <div className='container'>
      <Nav />
      <Switch>
        <Route  exact path="/"        component={Home}/>
        <Route  path="/battle"  component={Battle}/>
        <Route  path="/popular" component={Popular}/>
        <Route render = {() => {
          return <p> Not found </p>
        }} />
      </Switch>
    </div>
    )
  }
}

export default App;