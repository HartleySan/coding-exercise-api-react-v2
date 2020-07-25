import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'

class ResultsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sortCol: 'id',
            sortOrder: 'asc'
        };
    }

    sortData(data) {
        const sortCol = this.state.sortCol;
        const sortOrder = this.state.sortOrder;

        data.sort((a, b) => {
            if (sortOrder === 'asc') {
                if (!a[sortCol]) {
                    return -1;
                } else if (!b[sortCol]) {
                    return 1;
                }

                return a[sortCol] < b[sortCol] ? -1 : 1;
            }

            if (!a[sortCol]) {
                return 1;
            } else if (!b[sortCol]) {
                return -1;
            }

            return a[sortCol] > b[sortCol] ? -1 : 1;
        });

        return data;
    }

    setTableSort(sortCol) {
        let sortOrder = 'asc';

        sortOrder = sortCol === this.state.sortCol && this.state.sortOrder === 'asc' ? 'desc' : 'asc';

        this.setState({
            sortCol: sortCol,
            sortOrder: sortOrder
        });
    }

    renderSortArrow(sortCol) {
        if (sortCol === this.state.sortCol) {
            return this.state.sortOrder === 'asc' ? '▲' : '▼';
        }

        return null;
    }

    render() {
        // To-do: Pagination?
        var data = this.sortData(this.props.data || []);
        const cols = this.getCols();

        return (
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                    {cols.map((col, index) => {
                        return (
                            <Table.HeaderCell singleLine className="sortable" key={index} onClick={() => this.setTableSort(col.id)}>{col.label}{this.renderSortArrow(col.id)}</Table.HeaderCell>
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
                                    <a href={`/${this.props.type}/${item.id}`} onClick={(evt) => this.props.viewRow(evt, item.id)}>View</a>
                                    <a href={`/${this.props.type}/${item.id}/edit`} onClick={(evt) => this.props.editRow(evt, item.id)}>Edit</a>
                                    <a href={`/${this.props.type}/${item.id}`} onClick={(evt) => this.props.deleteRow(evt, item.id)}>Delete</a>
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
