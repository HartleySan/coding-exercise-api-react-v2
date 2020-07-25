// To-do: Consistently use semicolons, spacing, etc.
import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react'

import Tab from "./Tab";

class SiteContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'people'
        };
    }

    render() {
        // https://semantic-ui.com/elements/button.html
        return (
            <Container style={{ margin: 20 }}>
                <Header as="h3"><span role="img" aria-label="logo">⛵️</span> Breeze Church Management </Header>
                { this.state.activeTab === 'people' && (
                    <Tab
                        type="people"
                        label="People"
                        viewBtn={{
                            label: 'Groups',
                            action: () => this.setState({ activeTab: 'groups' })
                        }}
                    />
                )}
                { this.state.activeTab === 'groups' && (
                    <Tab
                        type="groups"
                        label="Groups"
                        viewBtn={{
                            label: 'People',
                            action: () => this.setState({ activeTab: 'people' })
                        }}
                    />
                )}
            </Container>
        );
    }

}

export default SiteContainer
