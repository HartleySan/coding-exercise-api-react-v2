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
                <input type="file" style={{ display: 'none' }} className="importFile" onChange={(evt) => this.uploadFile(evt, this.props.type)} />
                <button className="ui button" onClick={() => document.querySelector('.importFile').click()}>Import Data</button>
                <button className="ui button" onClick={this.props.viewBtn.action}>View {this.props.viewBtn.label}</button>
                <ResultsList
                    type={this.props.type}
                />
            </div>
        );
    }

    uploadFile(evt, type) {
        const files = evt.target.files;

        if (files.length) {
            let formData = new FormData();

            formData.append('file', files[0]);

            fetch(`http://localhost:8000/api/${type}`, {
                    method: 'post',
                    body: formData
                })
                .then(response => response.json())
                .then(data => console.log('server response', data));

            document.querySelector('.importFile').value = '';
        }
    }

}

export default Tab
