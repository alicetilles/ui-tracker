import React from 'react';
import {Panel, Table} from 'react-bootstrap';

import IssueFilter from './IssueFilter.jsx';
import withToast from './withToast.jsx';
import graphQLFetch from './graphQLFetch.js';
import store from './store.js';

// These will be the header columns
const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];

class IssueReport extends React.Component {
  /*
      Data fetching static method.
       */
  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) vars.status = params.get('status');

    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMax = effortMax;

    /*
            Getting issues within a certain range of effort
             */
    const query = `query issueList(
          $status: StatusType
          $effortMin: Int
          $effortMax: Int
        ) {
          issueCounts(
            status: $status
            effortMin: $effortMin
            effortMax: $effortMax
          ) {
            owner New Assigned Fixed Closed
          }
        }`;
    const data = await graphQLFetch(query, vars, showError);
    return data;
  }

  /*
      Fetch the initial data from the store and delete it after consumption.
       */
  constructor(props) {
    super(props);
    const stats = store.initialData ? store.initialData.issueCounts : null;
    delete store.initialData;
    this.state = {stats};
  }

  /*
      Load the data in case it has not been loaded yet
       */
  componentDidMount() {
    const {stats} = this.state;
    if (stats == null) this.loadData();
  }

  /*
      Check if the search string has changed, and if so, reload the data
       */
  componentDidUpdate(prevProps) {
    const {location: {search: prevSearch}} = prevProps;
    const {location: {search}} = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  /*
      Called by two lifecycle methods to load and set the state
       */
  async loadData() {
    const {location: {search}, match, showError} = this.props;
    const data = await IssueReport.fetchData(match, search, showError);
    if (data) {
      this.setState({stats: data.issueCounts});
    }
  }

  render() {
    const {stats} = this.state;
    if (stats == null) return null;

    const headerColumns = (
        statuses.map(status => (
            <th key={status}>{status}</th>
        ))
    );
    const statRows = stats.map(counts => (
        <tr key={counts.owner}>
          <td>{counts.owner}</td>
          {statuses.map(status => (
              <td key={status}>{counts[status]}</td>
          ))}
        </tr>
    ));

    return (
        <>
          <Panel>
            <Panel.Heading>
              <Panel.Title toggle>Filter</Panel.Title>
            </Panel.Heading>
            <Panel.Body collapsible>
              <IssueFilter urlBase="/report"/>
            </Panel.Body>
          </Panel>
          <Table bordered condensed hover responsive>
            <thead>
            <tr>
              <th/>
              {headerColumns}
            </tr>
            </thead>
            <tbody>
            {statRows}
            </tbody>
          </Table>
        </>
    );
  }
}

const IssueReportWithToast = withToast(IssueReport);
IssueReportWithToast.fetchData = IssueReport.fetchData;
export default IssueReportWithToast;
