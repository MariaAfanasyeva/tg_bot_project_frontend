import React, { Component } from 'react'

class CategoryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bots: []
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        fetch(`http://127.0.0.1:8000/api/category/${id}`).then(res => res.json()).then(
            (result) => {
                this.setState({
                    bots: result.bots
                });
            }
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            const id = this.props.match.params.id;
            fetch(`http://127.0.0.1:8000/api/category/${id}`).then(res => res.json()).then(
            (result) => {
                this.setState({
                    bots: result.bots
                    });
                }
            );
        }
        console.log('Updated')

    }

    render() {
        const {bots} = this.state;
        return (
            <ul>
                {bots.map(bot =>
                        <li key={bot.id}>
                            <a id={bot.id}>{bot.name}</a>
                        </li>
                    )}
            </ul>
        );
    }
}

export default CategoryDetail;