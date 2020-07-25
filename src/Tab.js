import React, { Component } from 'react'
import { Button, Header } from 'semantic-ui-react'

import EditItem from "./EditItem";
import ResultsList from "./ResultsList";
import ViewItem from "./ViewItem";

import eventBus from "./lib/eventBus";

class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewItem: null,
            editData: null,
            data: []
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        // To-do: Switch out with Axios?
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
            fetch(`http://localhost:8000/api/${this.props.type}/${id}/edit`)
                .then(response => response.json())
                .then(data => this.setState({ editData: data }))
                .catch(() => eventBus.emit('errorFlashMsg', 'A system error occurred. Please try again.'));

            evt.preventDefault();
        }
    }

    deleteRow(evt, id) {
        return (evt, id) => {
            console.log('deleteRow', this.props.type, id);
            const type = this.props.type;

            // To-do: Better package up and abstract out to make easier to use.
            eventBus.emit('showModal', {
                msg: type === 'people' ? 'Are you sure you remove this person?' : 'Are you sure you want to remove this group?',
                callback: () => {
                    fetch(`http://localhost:8000/api/${type}/${id}`, {
                            method: 'delete'
                        })
                        .then(response => response.json())
                        .then(data => {
                            eventBus.emit('successFlashMsg', (type === 'people' ? 'Person' : 'Group') + ' successfully deleted.');
                            this.getData();
                        })
                        .catch(() => eventBus.emit('errorFlashMsg', 'A system error occurred. Please try again.'));
                }
            });

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
        } else 
        if (this.state.editData) {
            return (
                <EditItem
                    type={this.props.type}
                    editData={this.state.editData}
                    goBack={() => {
                        this.setState({ editData: null });
                        this.getData();
                    }}
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
                <Button onClick={() => document.querySelector('.importFile').click()}>Import File</Button>
                <Button onClick={this.props.viewBtn.action}>View {this.props.viewBtn.label}</Button>
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
                        eventBus.emit('successFlashMsg', 'Data successfully imported.');
                    } else if (data.error) {
                        eventBus.emit('errorFlashMsg', data.msg);
                    }
                });

            document.querySelector('.importFile').value = '';
        }
    }

}

export default Tab
