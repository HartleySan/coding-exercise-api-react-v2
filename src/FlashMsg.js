import React, { Component } from 'react'

import eventBus from "./lib/eventBus";

class FlashMsg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null,
            msg: null
        };
    }

    componentDidMount() {
        eventBus.on('errorFlashMsg', (msg) => {
            this.setState({
                type: 'error',
                msg: msg
            });
        });

        eventBus.on('successFlashMsg', (msg) => {
            this.setState({
                type: 'success',
                msg: msg
            });
        });
    }

    render() {
        if (this.state.type &&
            this.state.msg) {
            return (
                <p className={`flashMsg ${this.state.type}`} onClick={() => this.setState({ type: null, msg: null })}>{this.state.msg}</p>
            );
        }

        return null;
    }

}

export default FlashMsg
