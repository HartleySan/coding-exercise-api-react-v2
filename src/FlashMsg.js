import React, { Component } from 'react'

import eventBus from "./lib/eventBus";

class FlashMsg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: null
        };
    }

    componentDidMount() {
        eventBus.on('errorFlashMsg', (msg) => {
            this.setState({ msg: msg });
        });
    }

    render() {
        if (this.state.msg) {
            return (
                <p className="flashMsg" onClick={() => this.setState({ msg: null })}>{this.state.msg}</p>
            );
        }

        return null;
    }

}

export default FlashMsg
