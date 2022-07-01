import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Game from './pages/Game';
import Header from './components/Header';
import Feedback from './pages/Feedback';
import Ranking from './pages/Ranking';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="page-wrapper">
        <Switch>
          <Route exact path="/" component={() => <Home />} />
          {/* <div className="game-wrapper"> */}
          <Route
            path="/game"
            component={() => (
              <>
                <Header />
                <Game />
              </>
            )}
          />
          {/* </div> */}
          <Route exact path="/settings" component={() => <Settings />} />
          <Route exact path="/" component={Home} />
          <Route
            path="/feedback"
            component={() => (
              <>
                <Header />
                <Feedback />
              </>
            )}
          />
          <Route exact path="/ranking" component={() => <Ranking />} />
        </Switch>
      </div>);
  }
}

export default App;
