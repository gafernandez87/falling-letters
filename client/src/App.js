import React from 'react';
import Landing from './components/Landing'
import Game from './components/Game'
import GameOver from './components/GameOver'
import NotFound from './components/NotFound'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import './App.css';

class App extends React.Component{

  componentDidMount(){
    fetch("/api/letters")
      .then(res => {console.log(res); return res.json()})
      .then(data => {
        console.log(data)
      })
      .catch(e => {
        console.error(e)
      })
  } 

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/game" component={Game} />
            <Route exact path="/gameOver" render={(props) => {return <GameOver {...props} />}} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
