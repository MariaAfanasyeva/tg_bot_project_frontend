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
    if (this.props.botId) {
      const url = `http://0.0.0.0:8000/api/bot/${this.props.botId}/comment`;
      api("POST", url, true, data).then(this.props.updateData(false));
    } else {
      const url = `http://127.0.0.1:8000/api/comment/${this.props.match.params.commentId}`;
      api("PUT", url, true, data).then((result) => {
        this.props.history.push(`/user/${this.state.userId}/info`);
      });
    }
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
      const userId = decodedToken.user_id;
      this.setState({
        userId: userId,
      });
    }
    // if (this.props.match.params.commentId) {
    //   const url = `http://127.0.0.1:8000/api/comment/${this.props.match.params.commentId}`;
    // }
  }
  render() {
    // const commentId = this.props.match.params.commentId;
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
