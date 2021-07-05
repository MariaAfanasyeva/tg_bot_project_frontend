import React, { Component } from "react";
import { api } from "../api/apiFetch";
import { Link } from "react-router-dom";

export default class BotsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      isSelected: false,
      selectedItems: [],
      prev_link: "",
      next_link: "",
    };

    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const inpVal = this.props.match.params.inputValue;
    if (id === undefined || id === null) {
      let url = process.env.REACT_APP_URL_AWS + "/api/bots";
      api("GET", url, false)
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result);
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: process.env.REACT_APP_URL_AWS + result.next,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    } else if (id !== undefined) {
      let url = process.env.REACT_APP_URL_AWS + `/api/category/${id}/bots`;
      api("GET", url, true)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: process.env.REACT_APP_URL_AWS + result.next,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    } else {
      let url = process.env.REACT_APP_URL_AWS + `/api/bots?search=${inpVal}`;
      api("GET", url, false)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: process.env.REACT_APP_URL_AWS + result.next,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.match.params.id !== this.props.match.params.id &&
      this.props.match.params.id !== undefined
    ) {
      const id = this.props.match.params.id;
      let url = process.env.REACT_APP_URL_AWS + `/api/category/${id}/bots`;
      api("GET", url, true)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: process.env.REACT_APP_URL_AWS + result.next,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    } else if (
      prevProps.match.params !== this.props.match.params &&
      this.props.match.params.id === undefined &&
      this.props.match.params.inputValue === undefined
    ) {
      let url = process.env.REACT_APP_URL_AWS + `/api/bots`;
      api("GET", url, false)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: process.env.REACT_APP_URL_AWS + result.next,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    } else if (
      prevProps.match.params.inputValue !==
        this.props.match.params.inputValue &&
      this.props.match.params.inputValue !== undefined
    ) {
      const inpVal = this.props.match.params.inputValue;
      let url = process.env.REACT_APP_URL_AWS + `/api/bots?search=${inpVal}`;
      api("GET", url, false)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: process.env.REACT_APP_URL_AWS + result.next,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
    }
  }

  prevPage = () => {
    if (this.state.prev_link !== null) {
      const link = this.state.prev_link;
      fetch(link)
        .then((res) => res.json())
        .then((result) => {
          let prev_page;
          if (result.prev === undefined) {
            prev_page = null;
          } else {
            prev_page = process.env.REACT_APP_URL_AWS + result.prev;
          }
          this.setState({
            items: result.results,
            prev_link: prev_page,
            next_link: process.env.REACT_APP_URL_AWS + result.next,
          });
        });
    }
  };

  nextPage = () => {
    if (this.state.next_link !== null) {
      const link = this.state.next_link;
      fetch(link)
        .then((res) => res.json())
        .then((result) => {
          let next_page;
          if (result.next === undefined) {
            next_page = null;
          } else {
            next_page = process.env.REACT_APP_URL_AWS + result.next;
          }
          this.setState({
            items: result.results,
            prev_link: process.env.REACT_APP_URL_AWS + result.prev,
            next_link: next_page,
          });
        });
    }
  };

  render() {
    const { error, isLoaded, items, prev_link, next_link } = this.state;
    if (error) {
      return <p>Error {error.message}</p>;
    } else if (!isLoaded) {
      return <p>Loading...</p>;
    } else {
      return (
        <div>
          <div className="d-flex justify-content-center container-md">
            {items.map((bot) => (
              <div
                className="card mx-auto"
                style={{ width: "18rem", height: "20rem" }}
              >
                <div className="card-body">
                  <div>
                    <Link
                      to={{
                        pathname: `/bot/${bot.id}/detail`,
                        fromDashboard: false,
                      }}
                    >
                      <h5 className="card-title">{bot.name}</h5>
                    </Link>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {bot.category}
                    </h6>
                    <p className="card-text">{bot.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination d-flex justify-content-center my-3">
            <button
              className="btn btn-primary mx-3"
              disabled={prev_link === null}
              onClick={this.prevPage}
            >
              Previous
            </button>
            <button
              className="btn btn-primary mx-3"
              disabled={next_link === null}
              onClick={this.nextPage}
            >
              Next
            </button>
          </div>
        </div>
      );
    }
  }
}
