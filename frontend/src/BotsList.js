import React, { Component } from "react";

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

    this.handleClick = this.handleClick.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
  }
  handleClick(item, event) {
    event.preventDefault();
    if (this.state.selectedItems.includes(item.id)) {
      const index = this.state.selectedItems.indexOf(item.id);
      delete this.state.selectedItems[index];
      this.setState((state) => {
        return {
          isSelected: !this.state.isSelected,
          selectedItems: this.state.selectedItems,
        };
      });
    } else {
      this.setState((state) => {
        return {
          isSelected: !this.state.isSelected,
          selectedItems: [this.state.selectedItems, item.id],
        };
      });
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    const inpVal = this.props.match.params.inputValue;
    if (id === undefined || id === null) {
      fetch("http://127.0.0.1:8000/api/bots")
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: result.next,
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
      fetch(`http://127.0.0.1:8000/api/category/${id}/bots`)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: result.next,
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
      fetch(`http://127.0.0.1:8000/api/bots?search=${inpVal}`)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: result.next,
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
      console.log("with id");
      const id = this.props.match.params.id;
      fetch(`http://127.0.0.1:8000/api/category/${id}/bots`)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: result.next,
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
      console.log("without id");
      fetch(`http://127.0.0.1:8000/api/bots`)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: result.next,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            });
          }
        );
      console.log(this.props);
    } else if (
      prevProps.match.params.inputValue !==
        this.props.match.params.inputValue &&
      this.props.match.params.inputValue !== undefined
    ) {
      console.log("with search");
      const inpVal = this.props.match.params.inputValue;
      fetch(`http://127.0.0.1:8000/api/bots?search=${inpVal}`)
        .then((res) => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              items: result.results,
              prev_link: null,
              next_link: result.next,
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
          this.setState({
            items: result.results,
            prev_link: result.previous,
            next_link: result.next,
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
          this.setState({
            items: result.results,
            prev_link: result.previous,
            next_link: result.next,
          });
        });
    }
  };

  render() {
    const {
      error,
      isLoaded,
      items,
      selectedItems,
      prev_link,
      next_link,
    } = this.state;
    if (error) {
      return <p>Error {error.message}</p>;
    } else if (!isLoaded) {
      return <p>Loading...</p>;
    } else if (!selectedItems) {
      return (
        <div>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  id={item.id}
                  onClick={(event) => this.handleClick(item, event)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button disabled={prev_link === null} onClick={this.prevPage}>
              Previous
            </button>
            <button disabled={next_link === null} onClick={this.nextPage}>
              Next
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <ul>
            {items.map((item) =>
              selectedItems.includes(item.id) ? (
                <li id={item.name}>
                  <a
                    id={item.id}
                    onClick={(event) => this.handleClick(item, event)}
                  >
                    {item.name}
                  </a>
                  <p>{item.description}</p>
                </li>
              ) : (
                <li id={item.name}>
                  <a
                    id={item.id}
                    onClick={(event) => this.handleClick(item, event)}
                  >
                    {item.name}
                  </a>
                </li>
              )
            )}
          </ul>
          <div className="pagination">
            <button disabled={prev_link === null} onClick={this.prevPage}>
              Previous
            </button>
            <button disabled={next_link === null} onClick={this.nextPage}>
              Next
            </button>
          </div>
        </div>
      );
    }
  }
}
