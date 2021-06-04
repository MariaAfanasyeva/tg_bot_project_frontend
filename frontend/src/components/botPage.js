import React, { Component } from "react";
import { api } from "../api/apiFetch";
import Comment from "./addComment";
import jwt from "jsonwebtoken";

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
      botId: this.props.match.params.id,
      withComment: false,
      comments: [],
      nextLink: "",
      prevLink: "",
      username: "",
    };
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleCreateClick(event) {
    this.setState({
      withComment: true,
    });
  }

  updateData = (value) => {
    this.setState({
      withComment: value,
    });
  };

  handleDelete(commentId) {
    const urlDel = `http://127.0.0.1:8000/api/comment/${commentId}`;
    api("DELETE", urlDel, true).then((res) => {
      if (res.ok === true) {
        this.setState({
          deleted: true,
        });
        const url = `http://127.0.0.1:8000/api/bot/${this.state.botId}/comments`;
        api("GET", url, false)
          .then((res) => res.json())
          .then(
            (result) => {
              this.setState({
                comments: result.results,
                prevLink: result.previous,
                nextLink: result.next,
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.deleted !== this.state.deleted) {
      console.log(this.state);
    } else if (prevState.withComment !== this.state.withComment) {
      const urlForComments = `http://127.0.0.1:8000/api/bot/${this.state.botId}/comments`;
      api("GET", urlForComments, false)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            comments: result.results,
            prevLink: result.previous,
            nextLink: result.next,
          });
        });
    }
  }

  componentDidMount() {
    if (localStorage.getItem("access_token")) {
      const token = localStorage.getItem("access_token");
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.user_id;
      const url = `http://127.0.0.1:8000/api/user/${userId}/info`;
      api("GET", url, false)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            username: result.username,
          });
        });
    }
    const url = `http://127.0.0.1:8000/api/detail/${this.state.botId}`;
    const urlForComments = `http://127.0.0.1:8000/api/bot/${this.state.botId}/comments`;
    api("GET", urlForComments, false)
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          comments: result.results,
          prevLink: result.previous,
          nextLink: result.next,
        });
      });
    api("GET", url, false)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            category: result.category,
            name: result.name,
            description: result.description,
            link: result.link,
            author: result.author,
            addByUser: result.addByUser,
            withComment: false,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
  }

  prevPage = () => {
    if (this.state.prevLink !== null) {
      const link = this.state.prevLink;
      fetch(link)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            comments: result.results,
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
            comments: result.results,
            prevLink: result.previous,
            nextLink: result.next,
          });
        });
    }
  };

  render() {
    const {
      category,
      name,
      description,
      link,
      author,
      addByUser,
      error,
      withComment,
      comments,
      nextLink,
      prevLink,
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
      let toComment;
      if (withComment) {
        toComment = (
          <Comment botId={this.state.botId} updateData={this.updateData} />
        );
      } else {
        toComment = (
          <button
            className="btn btn-primary mx-3"
            onClick={this.handleCreateClick}
          >
            Add comment
          </button>
        );
      }
      return (
        <div className="h-100 w-100">
          <div className="d-flex justify-content-center container-md w-75 p-3 h-75">
            <div className="card text-center my-4 w-100 h-100">
              <div className="card-header">{category}</div>
              <div className="card-body">
                <h4 className="card-title">
                  <a href={link}>{name}</a>
                </h4>
                <div className="font-italic pb-4"> by {author}</div>
                <p className="card-text my-4">{description}</p>
                <br />
                <p className="text-left">
                  <h4>Comments:</h4>
                </p>
                <div className="container align-self-lg-end">
                  <div className="container w-75">
                    <div className="row">
                      {comments.map((comment) =>
                        comment.author === this.state.username ? (
                          <div
                            className="card mx-3 py-3 col"
                            style={{ width: "18rem" }}
                          >
                            <div className="card-body">
                              <h5 className="card-title">{comment.author}</h5>
                              <h6 className="card-subtitle mb-2 text-muted">
                                {comment.creation_date}
                              </h6>
                              <p className="card-text">{comment.content}</p>
                              <a
                                className="card-link"
                                onClick={() => this.handleDelete(comment.id)}
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
                            </div>
                          </div>
                        ) : (
                          <div
                            className="card mx-3 py-3 col"
                            style={{ width: "18rem" }}
                          >
                            <div className="card-body">
                              <h5 className="card-title">{comment.author}</h5>
                              <h6 className="card-subtitle mb-2 text-muted">
                                {comment.creation_date}
                              </h6>
                              <p className="card-text">{comment.content}</p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
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
                  <div>{toComment}</div>
                </div>
              </div>
              {isByUser}
            </div>
          </div>
        </div>
      );
    }
  }
}
