import React from "react";
import BotsList from "./components/botsList";
import Navbar from "./components/navbar";
import Register from "./auth/register";
import SignIn from "./auth/login";
import UserPage from "./components/userPage";
import Create from "./components/createBot";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import BotPage from "./components/botPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App h-100 w-100">
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
          <Route path="/bot/:id/detail" exact component={BotPage} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
