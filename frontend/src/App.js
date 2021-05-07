import React from "react";
import BotsList from "./BotsList";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/category/:id/bots" exact component={BotsList} />
          <Route path="/" exact component={BotsList} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
