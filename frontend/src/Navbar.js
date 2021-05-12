import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      error: null,
    };
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
              </div>
            </div>
          </nav>
        </div>
      );
    }
  }
}

export default Navbar;
