import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

import ResultsList from "./ResultsList";

import eventBus from "./lib/eventBus";

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        fetch(`http://localhost:8000/api/${this.props.type}`)
          .then(response => response.json())
          .then(data => this.setState({ data: data.data }));
    }

    render() {
        return (
            <div>
                <Header as="h4">{this.props.label}</Header>
                <input type="file" style={{ display: 'none' }} className="importFile" onChange={(evt) => this.uploadFile(evt, this.props.type)} />
                <button className="ui button" onClick={() => document.querySelector('.importFile').click()}>Import File</button>
                <button className="ui button" onClick={this.props.viewBtn.action}>View {this.props.viewBtn.label}</button>
                {/* To-do: Only show table when there is at least one row of data. Otherwise, show some message. */}
                <ResultsList
                    type={this.props.type}
                    data={this.state.data}
                />
            </div>
        );
    }

    uploadFile(evt, type) {
        const files = evt.target.files;

        if (files.length) {
            let formData = new FormData();

            formData.append('importFile', files[0]);

            fetch(`http://localhost:8000/api/${type}`, {
                    method: 'post',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        this.setState({ data: data.data });
                    } else if (data.error) {
                        eventBus.emit('errorFlashMsg', data.msg);
                    }
                });

            document.querySelector('.importFile').value = '';
        }
    }

}

export default Tab
