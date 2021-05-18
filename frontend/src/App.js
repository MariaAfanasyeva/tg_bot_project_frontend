import React from "react";
import BotsList from "./BotsList";
import Navbar from "./Navbar";
import Register from "./register";
import SignIn from "./login";
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
          <Route path="/bots/search=:inputValue" exact component={BotsList} />
          <Route path="/" exact component={BotsList} />
          <Route path="/register" exact component={Register} />
          <Route path="/login" exact component={SignIn} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
