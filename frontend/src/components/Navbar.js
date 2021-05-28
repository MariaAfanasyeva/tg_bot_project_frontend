import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logout from "../auth/Logout";
import jwt from "jsonwebtoken";
import { api } from "../api/ApiFetch";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      error: null,
      inputValue: "",
      currentUserName: "",
      currentUserID: "",
      isAuthenticatedUser: false,
    };
    this.updateInputValue = this.updateInputValue.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  handleLogOut(event) {
    this.setState({
      isAuthenticatedUser: false,
    });
  }
  updateData = (value) => {
    this.setState({
      isAuthenticatedUser: value,
    });
  };

  componentDidMount() {
    if (localStorage.getItem("access_token")) {
      const token = localStorage.getItem("access_token");
      const decodedToken = jwt.decode(token);
      const url = `http://127.0.0.1:8000/api/user/${decodedToken.user_id}/info`;
      api("GET", url, false)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            currentUserName: result.username,
            currentUserID: result.id,
            isAuthenticatedUser: true,
          });
        });
    }
    const url = "http://127.0.0.1:8000/api/category";
    api("GET", url, false)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            categories: result,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.isAuthenticatedUser !== this.state.isAuthenticatedUser) {
      if (localStorage.getItem("access_token")) {
        const token = localStorage.getItem("access_token");
        const decodedToken = jwt.decode(token);
        const url = `http://127.0.0.1:8000/api/user/${decodedToken.user_id}/info`;
        api("GET", url, false)
          .then((res) => res.json())
          .then((result) => {
            this.setState({
              currentUserName: result.username,
              currentUserID: result.id,
              isAuthenticatedUser: true,
            });
          });
      }
    }
  }

  render() {
    const {
      error,
      categories,
      currentUserName,
      currentUserID,
      isAuthenticatedUser,
    } = this.state;
    if (error) {
      return <p>Error {error.message}</p>;
    } else {
      if (isAuthenticatedUser === false) {
        return (
          <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <Link
                className="nav-item nav-link"
                to={{ pathname: `/`, fromDashboard: false }}
              >
                Home
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  {categories.map((category) => (
                    <Link
                      className="nav-item nav-link"
                      to={{
                        pathname: `/category/${category.id}/bots`,
                        fromDashboard: false,
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <form className="form-inline">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={this.updateInputValue}
                />
                <Link
                  to={{ pathname: `/bots/search=${this.state.inputValue}` }}
                >
                  <button
                    className="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                  >
                    Search
                  </button>
                </Link>
              </form>
              <Link
                className="nav-item nav-link"
                to={{ pathname: "/register", fromDashboard: false }}
              >
                Register
              </Link>
              <Link
                className="nav-item nav-link"
                to={{
                  pathname: "/login",
                  fromDashboard: false,
                  updateData: this.updateData,
                }}
                is_auth={false}
              >
                Log In
              </Link>
            </nav>
          </div>
        );
      } else {
        return (
          <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <Link
                className="nav-item nav-link"
                to={{ pathname: `/`, fromDashboard: false }}
              >
                Home
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  {categories.map((category) => (
                    <Link
                      className="nav-item nav-link"
                      to={{
                        pathname: `/category/${category.id}/bots`,
                        fromDashboard: false,
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <form className="form-inline">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={this.updateInputValue}
                />
                <Link
                  to={{ pathname: `/bots/search=${this.state.inputValue}` }}
                >
                  <button
                    className="btn btn-outline-success my-2 my-sm-0"
                    type="submit"
                  >
                    Search
                  </button>
                </Link>
              </form>
              <Link
                className="nav-item nav-link"
                to={{
                  pathname: `/user/${currentUserID}/info`,
                  fromDashboard: false,
                }}
              >
                Welcome, {currentUserName}
              </Link>
              <Link to={{ pathname: "/" }}>
                <div onClick={this.handleLogOut}>
                  <Logout updateData={this.updateData} />
                </div>
              </Link>
            </nav>
          </div>
        );
      }
    }
  }
}

export default Navbar;
