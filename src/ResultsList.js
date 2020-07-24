import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

class ResultsList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    viewRow(evt, id) {
        console.log('viewRow', this.props.type, id);

        evt.preventDefault();
    }

    editRow(evt, id) {
        console.log('editRow', this.props.type, id);

        evt.preventDefault();
    }

    deleteRow(evt, id) {
        console.log('deleteRow', this.props.type, id);

        evt.preventDefault();
    }

    render() {
        // To-do: Pagination?
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
                    <Table.HeaderCell singleLine></Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>

              {
                  data.map((item, index) => {
                      return (
                          <Table.Row key={index}>
                            {cols.map((col, colIndex) => {
                                if (col.nl2br) {
                                    return (
                                        <Table.Cell singleLine key={colIndex}>{item[col.id].split('\n').map((oneVal, nl2brIndex) => {
                                            return (
                                                <span key={nl2brIndex}>{oneVal}<br /></span>
                                            );
                                        })}</Table.Cell>
                                    );
                                }

                                return (
                                    <Table.Cell singleLine key={colIndex}>{item[col.id]}</Table.Cell>
                                );
                            })}
                            <Table.Cell singleLine>
                                <div className="crudActions">
                                    <a href={`/${this.props.type}/${item.id}`} onClick={(evt) => this.viewRow(evt, item.id)}>View</a>
                                    <a href={`/${this.props.type}/${item.id}/edit`} onClick={(evt) => this.editRow(evt, item.id)}>Edit</a>
                                    <a href={`/${this.props.type}/${item.id}`} onClick={(evt) => this.deleteRow(evt, item.id)}>Delete</a>
                                </div>
                            </Table.Cell>
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
                        id: 'status_name',
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
                        id: 'active_people_string',
                        label: 'Active People',
                        nl2br: true
                    }
                ];
            default:
                return [];
        }
    }

}

export default ResultsList
