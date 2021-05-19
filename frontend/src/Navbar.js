import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logout from "./logout";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      error: null,
      inputValue: "",
    };
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  updateInputValue(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  componentDidMount() {
    fetch("http://127.0.0.1:8000/api/category")
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

  render() {
    const { error, categories } = this.state;
    if (error) {
      return <p>Error {error.message}</p>;
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
                <Link to={{ pathname: "/register", fromDashboard: false }}>
                  Register
                </Link>
                <Link to={{ pathname: "/login", fromDashboard: false }}>
                  Log In
                </Link>
                <Logout />
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
              <Link to={{ pathname: `/bots/search=${this.state.inputValue}` }}>
                <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="submit"
                >
                  Search
                </button>
              </Link>
            </form>
          </nav>
        </div>
      );
    }
  }
}

export default Navbar;
