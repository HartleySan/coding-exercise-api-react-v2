import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

class ResultsList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var data = this.props.data || [];
        const cols = this.getCols();

        return (
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                    {cols.map((col, index) => {
                        return (
                            <Table.HeaderCell singleLine key={index}>{col.label}</Table.HeaderCell>
                        );
                    })}
                </Table.Row>
              </Table.Header>

              <Table.Body>

              {
                  data.map((item, index) => {
                      return (
                          <Table.Row key={index}>
                            {cols.map((col, colIndex) => {
                                return (
                                    <Table.Cell singleLine key={colIndex}>{ item[col.id] }</Table.Cell>
                                );
                            })}
                          </Table.Row>
                      );
                    })
              }

              </Table.Body>
            </Table>
        );
    }

    getCols() {
        switch (this.props.type) {
            case 'people':
                return [
                    {
                        id: 'first_name',
                        label: 'First Name'
                    },
                    {
                        id: 'last_name',
                        label: 'Last Name'
                    },
                    {
                        id: 'email_address',
                        label: 'Email'
                    },
                    {
                        id: 'status',
                        label: 'Status'
                    },
                    {
                        id: 'group_name',
                        label: 'Group Name'
                    }
                ];
            case 'groups':
                return [
                    {
                        id: 'group_name',
                        label: 'Group Name'
                    },
                    {
                        id: 'active_people',
                        label: 'Active People'
                    }
                ];
            default:
                return [];
        }
    }

}

export default ResultsList
