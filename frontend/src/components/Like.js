import React, { Component } from "react";
import { api } from "../api/apiFetch";
import jwt from "jsonwebtoken";
export default class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({
      liked: !this.state.liked,
    });
    const likeUrl =
      process.env.REACT_APP_URL_AWS + `/api/bot/${this.props.botId}/like`;
    api("POST", likeUrl, true, {}).then((res) => console.log(res));
  }
  componentDidMount() {
    if (localStorage.getItem("access_token")) {
      const token = localStorage.getItem("access_token");
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.user_id;
      const likesUrl = process.env.REACT_APP_URL_AWS + `/api/likes`;
      api("GET", likesUrl, true)
        .then((res) => res.json())
        .then((result) => {
          result.map((like) => {
            if (like.to_bot === this.props.botName && like.author === userId) {
              this.setState({
                liked: true,
              });
            }
          });
        });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.liked !== this.state.liked) {
      if (localStorage.getItem("access_token")) {
        const token = localStorage.getItem("access_token");
        const decodedToken = jwt.decode(token);
        const userId = decodedToken.user_id;
        const likesUrl = process.env.REACT_APP_URL_AWS + `/api/likes`;
        api("GET", likesUrl, true)
          .then((res) => res.json())
          .then((result) => {
            result.map((like) => {
              if (
                like.to_bot === this.props.botName &&
                like.author === userId
              ) {
                this.setState({
                  liked: true,
                });
              }
            });
          });
      }
    }
  }

  render() {
    const { liked } = this.state;
    if (!liked) {
      return (
        <span onClick={this.handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-heart"
            viewBox="0 0 16 16"
          >
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
          </svg>
        </span>
      );
    } else {
      return (
        <span onClick={this.handleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-heart-fill"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
            />
          </svg>
        </span>
      );
    }
  }
}
