import React, { Component } from "react";
import { api } from "../api/api_fetch";
import jwt from "jsonwebtoken";

export default class Create extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.params.bot_id !== undefined) {
      this.state = {
        categories: [],
        name: "",
        category: "",
        description: "",
        author: "",
        link: "",
        userId: "",
        creation: false,
        modification: true,
        bot_id: this.props.match.params.bot_id,
      };
    } else {
      this.state = {
        categories: [],
        name: "",
        category: "",
        description: "",
        author: "",
        link: "",
        userId: "",
        creation: true,
        modification: false,
      };
    }

    this.updateInputValue = this.updateInputValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const data = {
      name: this.state.name,
      category: this.state.category,
      description: this.state.description,
      author: this.state.author,
      link: this.state.link,
    };
    if (this.state.creation === true) {
      const url = "http://127.0.0.1:8000/api/create";
      api("POST", url, true, data)
        .then((res) => res.json())
        .then((result) => {
          this.props.history.push(`/user/${this.state.userId}/info`);
        });
    } else {
      const url = `http://127.0.0.1:8000/api/update/${this.state.bot_id}`;
      api("PUT", url, true, data).then((result) => {
        this.props.history.push(`/user/${this.state.userId}/info`);
      });
    }
  }

  updateInputValue(event) {
    if (event.target.id === "name") {
      this.setState({
        name: event.target.value,
      });
    } else if (event.target.id === "category") {
      this.setState({
        category: event.target.value,
      });
    } else if (event.target.id === "description") {
      this.setState({
        description: event.target.value,
      });
    } else if (event.target.id === "author") {
      this.setState({
        author: event.target.value,
      });
    } else if (event.target.id === "link") {
      this.setState({
        link: event.target.value,
      });
    }
  }

  componentDidMount() {
    const url = "http://127.0.0.1:8000/api/category";
    if (localStorage.getItem("access_token")) {
      const token = localStorage.getItem("access_token");
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.user_id;
      this.setState({
        userId: userId,
      });
    }
    if (this.state.modification === true) {
      const url = `http://127.0.0.1:8000/api/detail/${this.state.bot_id}`;
      api("GET", url, false)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              name: result.name,
              category: result.category,
              description: result.description,
              author: result.author,
              link: result.link,
            });
          },
          (error) => {
            this.setState({
              error,
            });
          }
        );
    }
    api("GET", url, false)
      .then((res) => res.json())
      .then(
        (result) => {
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
    const { categories, creation, modification } = this.state;
    if (creation === true) {
      return (
        <div className="container">
          <form>
            <div className="form-group">
              <label>Bot name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="bot name"
                onChange={this.updateInputValue}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                onChange={this.updateInputValue}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                id="category"
                onChange={this.updateInputValue}
              >
                <option></option>
                {categories.map((category) => {
                  return <option value={category.name}>{category.name}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              <label>Bot author</label>
              <input
                type="text"
                className="form-control"
                id="author"
                placeholder="bot author"
                onChange={this.updateInputValue}
              />
            </div>
            <div className="form-group">
              <label>Link</label>
              <input
                type="url"
                className="form-control"
                id="link"
                placeholder="https://t.me/your_bot"
                onChange={this.updateInputValue}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onSubmit}
            >
              Create
            </button>
          </form>
        </div>
      );
    } else if (modification === true) {
      return (
        <div className="container">
          <form>
            <div className="form-group">
              <label>Bot name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="bot name"
                onChange={this.updateInputValue}
                value={this.state.name}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                onChange={this.updateInputValue}
                value={this.state.description}
              ></textarea>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                id="category"
                onChange={this.updateInputValue}
                value={this.state.category}
              >
                <option></option>
                {categories.map((category) => {
                  return <option value={category.name}>{category.name}</option>;
                })}
              </select>
            </div>
            <div className="form-group">
              <label>Bot author</label>
              <input
                type="text"
                className="form-control"
                id="author"
                placeholder="bot author"
                onChange={this.updateInputValue}
                value={this.state.author}
              />
            </div>
            <div className="form-group">
              <label>Link</label>
              <input
                type="url"
                className="form-control"
                id="link"
                placeholder="https://t.me/your_bot"
                onChange={this.updateInputValue}
                value={this.state.link}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onSubmit}
            >
              Update
            </button>
          </form>
        </div>
      );
    }
  }
}
