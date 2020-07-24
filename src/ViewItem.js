import React, { Component } from 'react'
import { Container, Header, List } from 'semantic-ui-react'

class ViewItem extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const viewItem = this.props.viewItem;

        if (this.props.type === 'people') {
            return (
                <Container style={{ marginTop: 20 }}>
                    <Header as="h5">{`${viewItem.first_name} ${viewItem.last_name}`}</Header>
                    <List bulleted>
                        <List.Item>Email: {viewItem.email_address}</List.Item>
                        <List.Item>Status: {viewItem.status}</List.Item>
                        <List.Item>Group: {viewItem.group_name || '(None)'}</List.Item>
                    </List>
                    <button className="ui button" onClick={this.props.goBack}>Go Back</button>
                </Container>
            );
        } else if (this.props.type === 'groups') {
            return (
                <Container style={{ marginTop: 20 }}>
                    <Header as="h5">{viewItem.group_name}</Header>
                    <List bulleted>
                        <List.Item>Active People: {viewItem.active_people_string.replace(/\n/g, ' | ')}</List.Item>
                    </List>
                    <button className="ui button" onClick={this.props.goBack}>Go Back</button>
                </Container>
            );
        }

        return null;
    }

}

export default ViewItem
