import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'

import ResultsList from "./ResultsList";
import ViewItem from "./ViewItem";

import eventBus from "./lib/eventBus";

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewItem: null,
            editItem: null,
            deleteItem: null,
            data: []
        };
    }

    componentDidMount() {
        fetch(`http://localhost:8000/api/${this.props.type}`)
          .then(response => response.json())
          .then(data => this.setState({ data: data.data }));
    }

    viewRow() {
        return (evt, id) => {
            fetch(`http://localhost:8000/api/${this.props.type}/${id}`)
                .then(response => response.json())
                .then(data => this.setState({ viewItem: data.data }))
                .catch(() => eventBus.emit('errorFlashMsg', 'A system error occurred. Please try again.'));

            evt.preventDefault();
        };
    }

    editRow(evt, id) {
        return (evt, id) => {
            console.log('editRow', this.props.type, id);

            evt.preventDefault();
        }
    }

    deleteRow(evt, id) {
        return (evt, id) => {
            console.log('deleteRow', this.props.type, id);

            evt.preventDefault();
        };
    }

    renderContent() {
        if (this.state.viewItem) {
            return (
                <ViewItem
                    type={this.props.type}
                    viewItem={this.state.viewItem}
                    goBack={() => this.setState({ viewItem: null })}
                />
            );
        }

        // To-do: Only show table when there is at least one row of data? Otherwise, show some message.
        return (
            <ResultsList
                type={this.props.type}
                data={this.state.data}
                viewRow={this.viewRow()}
                editRow={this.editRow()}
                deleteRow={this.deleteRow()}
            />
        );
    }

    render() {
        return (
            <div>
                <Header as="h4">{this.props.label}</Header>
                <input type="file" style={{ display: 'none' }} className="importFile" onChange={(evt) => this.uploadFile(evt, this.props.type)} />
                <button className="ui button" onClick={() => document.querySelector('.importFile').click()}>Import File</button>
                <button className="ui button" onClick={this.props.viewBtn.action}>View {this.props.viewBtn.label}</button>
                {this.renderContent()}
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
