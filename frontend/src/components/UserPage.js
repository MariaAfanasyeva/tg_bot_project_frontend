import React, { Component } from "react";
import {api} from "../api/api_fetch"

export default class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
        bots: [],
        nextLink: '',
        prevLink: ''
    };
  };

  componentDidMount() {
    const userId = this.props.match.params.id;
    const url = `http://127.0.0.1:8000/api/user/${userId}/bots`;
    api("GET", url, false).then((res) => res.json()).then((result) => {
        this.setState({
            bots: result
        });
    });
    console.log(this.state);
  };

  render() {
    const {bots, nextLink, prevLink} = this.state;
    if (!bots.results) {
        return (
            <div>
                <h2 className="text-center"> Your bots</h2>
                <h3 className="text-center">You haven't any bots yet</h3>
            </div>
        );
    } else {
        return (
            <div className="card" style={{width: '18rem'}}>
                <div className="card-body">
                    <h5 className="card-title">{bots.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of
                        the card's content.</p>
                    <a href="#" className="card-link">Card link</a>
                    <a href="#" className="card-link">Another link</a>
                </div>
            </div>
        );
    };
  }
}
