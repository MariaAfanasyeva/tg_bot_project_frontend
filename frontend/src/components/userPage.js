import React, { Component } from "react";
import { api } from "../api/apiFetch";
import { Link } from "react-router-dom";

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bots: [],
      nextLink: "",
      prevLink: "",
      error: null,
      deleted: false,
    };
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  handleDelete(bot_id) {
    const urlDel = process.env.REACT_APP_URL_AWS + `/api/delete/${bot_id}`;
    api("DELETE", urlDel, true).then((res) => {
      if (res.ok === true) {
        this.setState({
          deleted: true,
        });
        const userId = this.props.match.params.id;
        const url = process.env.REACT_APP_URL_AWS + `/api/user/${userId}/bots`;
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
    });
  }

  componentDidMount() {
    const userId = this.props.match.params.id;
    const url = process.env.REACT_APP_URL_AWS + `/api/user/${userId}/bots`;
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
    if (prevState.deleted !== this.state.deleted) {
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
    if (error) {
      return <p>Error {error.message}</p>;
    } else if (bots.length === 0) {
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
    } else if (bots.length !== 0) {
      return (
        <div>
          <h2 className="text-center">Your bots</h2>
          <div className="d-flex justify-content-center container-md">
            {bots.map((bot) => (
              <div className="card mx-auto" style={{ width: "18rem" }}>
                <div className="card-body">
                  <div>
                    <h5 className="card-title">{bot.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {bot.category}
                    </h6>
                    <p className="card-text">{bot.description}</p>
                    <a
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
                    </a>
                    <Link
                      className="card-link"
                      to={{
                        pathname: `update/bot/${bot.id}`,
                        fromDashboard: false,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-pencil"
                        viewBox="0 0 16 16"
                      >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination d-flex justify-content-center my-3">
            <button
              className="btn btn-primary mx-3"
              disabled={prevLink === null}
              onClick={this.prevPage}
            >
              Previous
            </button>
            <button
              className="btn btn-primary mx-3"
              disabled={nextLink === null}
              onClick={this.nextPage}
            >
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
      return null;
    }
  }
}
