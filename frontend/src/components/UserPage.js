import React, { Component } from "react";
import { api } from "../api/api_fetch";
import { Link } from "react-router-dom";

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bots: "",
      nextLink: "",
      prevLink: "",
      error: null,
      botToDelete: "",
    };
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(bot_id) {
    const userId = this.props.match.params.id;
    const urlDel = `http://127.0.0.1:8000/api/delete/${bot_id}`;
    const url = `http://127.0.0.1:8000/api/user/${userId}/bots`;
    api("DELETE", urlDel, false);
    this.props.history.push(this.props.match.url);
  }

  componentDidMount() {
    const userId = this.props.match.params.id;
    const url = `http://127.0.0.1:8000/api/user/${userId}/bots`;
    api("GET", url, false)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            bots: result.results,
            nextLink: result.next,
            prevLink: result.previous,
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
    if (prevState.bots !== this.state.bots) {
      console.log("updated");
      console.log(prevState);
      console.log(this.state);
    }
  }

  prevPage = () => {
    if (this.state.prevLink !== null) {
      const link = this.state.prevLink;
      fetch(link)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            bots: result.results,
            prevLink: result.previous,
            nextLink: result.next,
          });
        });
    }
  };

  nextPage = () => {
    if (this.state.nextLink !== null) {
      const link = this.state.nextLink;
      fetch(link)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            bots: result.results,
            prevLink: result.previous,
            nextLink: result.next,
          });
        });
    }
  };

  render() {
    const { bots, nextLink, prevLink, error } = this.state;
    console.log(bots);
    if (error) {
      return <p>Error {error.message}</p>;
    } else {
      if (bots.length !== 0) {
        return (
          <div>
            <h2 className="text-center">Your bots</h2>
            <div className="d-flex justify-content-center">
              {bots.map((bot) => (
                <div className="card" style={{ width: "18rem" }}>
                  <div className="card-body">
                    <div>
                      <h5 className="card-title">{bot.name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {bot.category}
                      </h6>
                      <p className="card-text">{bot.description}</p>
                      <Link
                        to={{
                          pathname: `/user/${this.props.match.params.id}/info`,
                        }}
                        className="card-link"
                        onClick={() => this.handleDelete(bot.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-trash"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                          <path
                            fill-rule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                      </Link>
                      <a href="#" className="card-link">
                        Another link
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination">
              <button disabled={prevLink === null} onClick={this.prevPage}>
                Previous
              </button>
              <button disabled={nextLink === null} onClick={this.nextPage}>
                Next
              </button>
            </div>
            <Link
              className="nav-item nav-link"
              to={{ pathname: `create/bot`, fromDashboard: false }}
            >
              Add new bot
            </Link>
          </div>
        );
      } else {
        return (
          <div>
            <h2 className="text-center">You haven't any bots yet</h2>
            <Link
              className="nav-item nav-link"
              to={{ pathname: `create/bot`, fromDashboard: false }}
            >
              Add new bot
            </Link>
          </div>
        );
      }
    }
  }
}
