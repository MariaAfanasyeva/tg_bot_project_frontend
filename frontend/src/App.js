import React from "react";
import BotsList from "./components/BotsList";
import Navbar from "./components/Navbar";
import Register from "./auth/register";
import SignIn from "./auth/login";
import UserPage from "./components/UserPage";
import Create from "./components/createBot";
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
          <Route path="/user/:id/info" exact component={UserPage} />
          <Route path="/user/:id/create/bot" exact component={Create} />
          <Route path="/user/:id/update/bot/:bot_id" exact component={Create} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
