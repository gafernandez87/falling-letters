import React from 'react';
import Landing from './components/Landing'
import Game from './components/Game'
import GameOver from './components/GameOver'
import Ranking from './components/Ranking'
import NotFound from './components/NotFound'
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import { Menu } from 'antd'

import './App.css';
import "antd/dist/antd.css";

class App extends React.Component{


  render() {
    return (
      <Router>
          <Menu
            className="header"
            theme="dark"
            mode="horizontal"
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1"><Link to={"/"}>Home</Link></Menu.Item>
            <Menu.Item key="2"><Link to={"/game"}>Play</Link></Menu.Item>
            <Menu.Item key="3"><Link to={"/ranking"}>Ranking</Link></Menu.Item>
          </Menu>
          <div style={{ padding: 24, minHeight: 280 }}>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/game" component={Game} />
              <Route exact path="/ranking" render={() => <Ranking max="0" />} />
              <Route exact path="/gameOver" render={(props) => {return <GameOver {...props} />}} />
              <Route component={NotFound} />
            </Switch>
          </div>
      </Router>

    );
  }
}

export default App;
