import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

import ResultsList from "./ResultsList";

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <Header as="h4">{this.props.label}</Header>
                <button className="ui button">Import {this.props.label}</button>
                <button className="ui button" onClick={this.props.viewBtn.action}>View {this.props.viewBtn.label}</button>
                <ResultsList
                    type={this.props.type}
                />
            </div>
        );
    }

}

export default Tab
