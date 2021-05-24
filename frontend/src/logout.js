import React, { Component } from "react";

class Logout extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.props.updateData(false);
  }
  render() {
    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={this.handleClick}
      >
        Log Out
      </button>
    );
  }
}

export default Logout;
