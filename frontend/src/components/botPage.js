import React, { Component } from "react";
import { api } from "../api/apiFetch";

export default class BotPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "",
      name: "",
      description: "",
      link: "",
      author: "",
      addByUser: "",
      error: null,
    };
    console.log(this.props);
  }

  componentDidMount() {
    const botId = this.props.match.params.id;
    const url = `http://127.0.0.1:8000/api/detail/${botId}`;
    api("GET", url, false)
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            category: result.category,
            name: result.name,
            description: result.description,
            link: result.link,
            author: result.author,
            addByUser: result.addByUser,
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
    console.log(this.state);
    const {
      category,
      name,
      description,
      link,
      author,
      addByUser,
      error,
    } = this.state;
    let isByUser;
    if (addByUser) {
      isByUser = (
        <div className="card-footer text-muted">Added by {addByUser}</div>
      );
    } else {
      isByUser = <div></div>;
    }
    if (error) {
      return <p>Error: {error.message}</p>;
    } else {
      return (
        <div className="h-100 w-100">
          <div className="d-flex justify-content-center container-md w-75 p-3 h-75">
            <div className="card text-center my-4 w-100 h-100">
              <div className="card-header">{category}</div>
              <div className="card-body">
                <h4 className="card-title py-4">{name}</h4>
                <p className="card-text my-4">{description}</p>
                <a href="#" className="btn btn-primary">
                  Go somewhere
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
