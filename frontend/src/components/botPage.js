import React, { Component } from "react";
import { api } from "../api/apiFetch";
import Comment from "./addComment";
import jwt from "jsonwebtoken";
import Like from "./Like";

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
      count: "",
    };
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
  }

  handleCreateClick(event) {
    this.setState({
      withComment: true,
    });
  }

  handleUpdateClick(commentID) {
    this.setState({
      withComment: true,
      commentID: commentID,
    });
  }

  updateData = (value) => {
    this.setState({
      withComment: value,
    });
  };

  updateStatus = (value) => {
    this.setState({
      commentID: value,
    });
  };

  handleDelete(commentId) {
    const urlDel = process.env.REACT_APP_URL_AWS + `/api/comment/${commentId}`;
    api("DELETE", urlDel, true).then((res) => {
      if (res.ok === true) {
        this.setState({
          deleted: true,
        });
        const url =
          process.env.REACT_APP_URL_AWS +
          `/api/bot/${this.state.botId}/comments`;
        api("GET", url, false)
          .then((res) => res.json())
          .then(
            (result) => {
              this.setState({
                comments: result.results,
                prevLink: result.previous,
                nextLink: result.next,
                count: result.count,
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
    if (localStorage.getItem("access_token")) {
      const token = localStorage.getItem("access_token");
      const decodedToken = jwt.decode(token);
      const userId = decodedToken.user_id;
      const url = process.env.REACT_APP_URL_AWS + `/api/user/${userId}/info`;
      api("GET", url, false)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            username: result.username,
          });
        });
    }
    const url =
      process.env.REACT_APP_URL_AWS + `/api/detail/${this.state.botId}`;
    const urlForComments =
      process.env.REACT_APP_URL_AWS + `/api/bot/${this.state.botId}/comments`;
    api("GET", urlForComments, false)
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          count: result.count,
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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.withComment !== this.state.withComment) {
      const urlForComments =
        process.env.REACT_APP_URL_AWS + `/api/bot/${this.state.botId}/comments`;
      api("GET", urlForComments, false)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            count: result.count,
            prevLink: result.previous,
            nextLink: result.next,
            comments: result.results,
          });
        });
    } else if (prevState.count !== this.state.count) {
      const urlForComments =
        process.env.REACT_APP_URL_AWS + `/api/bot/${this.state.botId}/comments`;
      api("GET", urlForComments, false)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            count: result.count,
            prevLink: result.previous,
            nextLink: result.next,
            comments: result.results,
          });
        });
    } else if (prevState.commentID !== this.state.commentID) {
      const urlForComments =
        process.env.REACT_APP_URL_AWS + `/api/bot/${this.state.botId}/comments`;
      api("GET", urlForComments, false)
        .then((res) => res.json())
        .then((result) => {
          this.setState({
            count: result.count,
            prevLink: result.previous,
            nextLink: result.next,
            comments: result.results,
          });
        });
    }
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
      commentID,
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
      if (withComment && !commentID) {
        toComment = (
          <Comment botId={this.state.botId} updateData={this.updateData} />
        );
      } else if (withComment && commentID) {
        toComment = (
          <Comment
            botId={this.state.botId}
            commentId={commentID}
            updateData={this.updateData}
            updateStatus={this.updateStatus}
          />
        );
      } else {
        if (this.state.username) {
          toComment = (
            <button
              className="btn btn-primary mx-3"
              onClick={this.handleCreateClick}
            >
              Add comment
            </button>
          );
        }
      }
      return (
        <div className="h-100 w-100">
          <div className="d-flex justify-content-center container-md w-75 p-3 h-75">
            <div className="card text-center my-4 w-100 h-100">
              <div className="card-header">{category}</div>
              <div className="card-body w-100 h-100">
                <h4 className="card-title">
                  <a href={link}>{name}</a>{" "}
                  <Like botId={this.state.botId} botName={name} />
                </h4>
                <div className="font-italic pb-4"> by {author}</div>
                <p className="card-text my-4">{description}</p>
                <br />
                <p className="text-left">
                  <h4>Comments:</h4>
                </p>
                <div className="text-center container-md w-75 h-75">
                  <div className="container-md">
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
                              <a
                                className="card-link"
                                onClick={() =>
                                  this.handleUpdateClick(comment.id)
                                }
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
