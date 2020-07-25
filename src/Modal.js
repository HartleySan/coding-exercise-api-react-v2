import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import eventBus from "./lib/eventBus";

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: null,
            callback: null
        };
    }

    componentDidMount() {
        eventBus.on('showModal', (data) => {
            this.setState({
                msg: data.msg,
                callback: data.callback
            });
        });
    }

    hideModal() {
        this.setState({
            msg: null,
            callback: null
        });
    }

    confirmModal() {
        this.state.callback();
        this.hideModal();
    }

    render() {
        if (this.state.msg &&
            this.state.callback) {
            return (
                <div className="modal">
                    <p>{this.state.msg}</p>
                    <div className="btns">
                        <Button onClick={this.hideModal.bind(this)}>Cancel</Button>
                        <Button primary onClick={this.confirmModal.bind(this)}>Okay</Button>
                    </div>
                </div>
            );
        }

        return null;
    }

}

export default Modal
