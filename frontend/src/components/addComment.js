import React, { Component } from "react";
import { api } from "../api/apiFetch";
import jwt from "jsonwebtoken";

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      userId: "",
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const data = {
      content: this.state.content,
    };
    let postResult;
    if (this.props.botId && !this.props.commentId) {
      const url =
        process.env.REACT_APP_URL_AWS + `/bot/${this.props.botId}/comment`;
      postResult = api("POST", url, true, data);
    } else if (this.props.commentId) {
      const url =
        process.env.REACT_APP_URL_AWS + `/comment/${this.props.commentId}`;
      postResult = api("PUT", url, true, data);
    }
    const urlForComments =
      process.env.REACT_APP_URL_AWS + `/bot/${this.props.botId}/comment`;
    postResult
      .then(
        api("GET", urlForComments, false)
          .then((res) => res.json())
          .then((result) => {
            this.setState({
              count: result.totalElements,
              prevLink: result.prev,
              nextLink: result.next,
              comments: result.results,
            });
          })
      )
      .then(() => {
        if (this.props.commentId) {
          this.props.updateData(false);
          this.props.updateStatus(false);
        } else {
          this.props.updateData(false);
        }
      });
  }

  updateInputValue(event) {
    if (event.target.id === "content") {
      this.setState({
        content: event.target.value,
      });
    }
  }

  componentDidMount() {
    if (localStorage.getItem("access_token")) {
      const token = localStorage.getItem("access_token");
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.sub;
      this.setState({
        userId: userId,
      });
    }
    if (this.props.commentId) {
      const url =
        process.env.REACT_APP_URL_AWS + `/comment/${this.props.commentId}`;
      api("GET", url, true)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            content: result.content,
          });
        });
    }
  }
  render() {
    const commentId = this.props.commentId;
    if (commentId) {
      return (
        <div>
          <div className="input-group mb-3">
            <input
              type="text"
              id="content"
              className="form-control"
              placeholder="Comment"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={this.updateInputValue}
              value={this.state.content}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                onClick={this.onSubmit}
              >
                Update comment
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="input-group mb-3">
            <input
              type="text"
              id="content"
              className="form-control"
              placeholder="Comment"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={this.updateInputValue}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                id="button-addon2"
                onClick={this.onSubmit}
              >
                Post comment
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
}
