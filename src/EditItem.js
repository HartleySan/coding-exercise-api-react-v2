import React, { Component } from 'react'
import { Button, Container, Form, Header } from 'semantic-ui-react'

import eventBus from "./lib/eventBus";

class EditItem extends Component {
    constructor(props) {
        super(props);

        const editItem = props.editData.editItem;

        if (props.type === 'people') {
            this.state = {
                id: editItem.id,
                first_name: editItem.first_name,
                last_name: editItem.last_name,
                email_address: editItem.email_address,
                status: editItem.status,
                group_id: editItem.group_id
            };
        } else if (props.type === 'groups') {
            this.state = {
                id: editItem.id,
                group_name: editItem.group_name
            };
        } else {
            this.state = {};
        }
    }

    save(type, goBack) {
        fetch(`http://localhost:8000/api/${type}/${this.state.id}`, {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
            .then(response => response.json())
            .then((data) => {
                if (data.success) {
                    eventBus.emit('successFlashMsg', 'Successfully edited.');
                    goBack();
                } else if (data.error) {
                    eventBus.emit('errorFlashMsg', data.msg);
                }
            })
            .catch(() => eventBus.emit('errorFlashMsg', 'A system error occurred. Please try again.'));
    }

    render() {
        const editItem = this.props.editData.editItem;

        if (this.props.type === 'people') {
            const options = this.props.editData.options;

            return (
                <Container style={{ marginTop: 20 }}>
                    <Header as="h5">Edit: {`${editItem.first_name} ${editItem.last_name}`}</Header>
                    <Form>
                        <Form.Field style={{ marginBottom: 15 }}>
                            <label>First Name</label>
                            <input value={this.state.first_name} onChange={(evt) => this.setState({ first_name: evt.target.value })} placeholder='First Name' />
                        </Form.Field>
                        <Form.Field style={{ marginBottom: 15 }}>
                            <label>Last Name</label>
                            <input value={this.state.last_name} onChange={(evt) => this.setState({ last_name: evt.target.value })} placeholder='Last Name' />
                        </Form.Field>
                        <Form.Field style={{ marginBottom: 15 }}>
                            <label>Email</label>
                            <input value={this.state.email_address} onChange={(evt) => this.setState({ email_address: evt.target.value })} placeholder='Email' />
                        </Form.Field>
                        <Form.Field style={{ marginBottom: 15 }}>
                            <label>Status</label>
                            <select value={this.state.status} onChange={(evt) => this.setState({ status: evt.target.value })}>
                                {options.statuses.map((status, idx) => {
                                    return (
                                        <option value={status.id} key={idx}>{status.name}</option>
                                    );
                                })}
                            </select>
                        </Form.Field>
                        <Form.Field style={{ marginBottom: 15 }}>
                            <label>Group</label>
                            <select value={this.state.group_id || 0} onChange={(evt) => this.setState({ group_id: evt.target.value })}>
                                <option value={0}>—</option>
                                {options.groups.map((group, idx) => {
                                    return (
                                        <option value={group.id} key={idx}>{group.name}</option>
                                    );
                                })}
                            </select>
                        </Form.Field>
                    </Form>
                    <div>
                        <Button primary onClick={() => this.save(this.props.type, this.props.goBack)}>Save</Button>
                        <Button onClick={this.props.goBack}>Go Back</Button>
                    </div>
                </Container>
            );
        } else if (this.props.type === 'groups') {
            return (
                <Container style={{ marginTop: 20 }}>
                    <Header as="h5">Edit: {editItem.group_name}</Header>
                    <Form>
                        <Form.Field style={{ marginBottom: 15 }}>
                            <label>Group Name</label>
                            <input value={this.state.group_name} onChange={(evt) => this.setState({ group_name: evt.target.value })} placeholder='Group Name' />
                        </Form.Field>
                    </Form>
                    <div>
                        <Button primary onClick={() => this.save(this.props.type, this.props.goBack)}>Save</Button>
                        <Button onClick={this.props.goBack}>Go Back</Button>
                    </div>
                </Container>
            );
        }

        return null;
    }

}

export default EditItem
