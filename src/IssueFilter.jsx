/* eslint "react/prefer-stateless-function": "off" */

import React from 'react';
import {withRouter} from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import {
  ButtonToolbar, Button, FormGroup, FormControl,
  ControlLabel, InputGroup, Row, Col,
} from 'react-bootstrap';

class IssueFilter extends React.Component {
  constructor({location: {search}}) {
    super();
    const params = new URLSearchParams(search);

    // Inputs for the new filter fields
    this.state = {
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || '',
      changed: false,
    };

    /*
      Ensure that the  handlers are bound  to 'this' so we can access
      this.props.history later on.
       */
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
  }

  // Look  for changes to properties via componentDidUpdate
  componentDidUpdate(prevProps) {
    const {location: {search: prevSearch}} = prevProps;
    const {location: {search}} = this.props;
    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e) {
    //  Set the state variable to the new value, which is supplied as part of the
    // event argument to the handler, as event.target.value
    this.setState({status: e.target.value, changed: true});
  }

  onChangeEffortMin(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({effortMin: e.target.value, changed: true});
    }
  }

  onChangeEffortMax(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({effortMax: e.target.value, changed: true});
    }
  }

  showOriginalFilter() {
    const {location: {search}} = this.props;
    const params = new URLSearchParams(search);
    this.setState({
      status: params.get('status') || '',
      changed: false,
    });
  }

  // The value of the dropdown can be accessed by this.state.status to revert
  // Use the history to push the new status filter and bind this new method
  //  to -this- in the constructor
  applyFilter() {
    // Use the state variable as  the value of the dropdown input during render()
    const {status, effortMin, effortMax} = this.state;
    const {history, urlBase} = this.props;

    // Use state variables to set the new location in the history

    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (effortMin) params.set('effortMin', effortMin);
    if (effortMax) params.set('effortMax', effortMax);

    // Constructing the query string with URLSearchParams
    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({pathname: urlBase, search});
  }

  // The bottons give user an option to reset the filter to  how it was before
  render() {
    const {status, changed} = this.state;
    const {effortMin, effortMax} = this.state;
    return (
        <Row>
          <Col xs={6} sm={4} md={3} lg={2}>
            <FormGroup>
              <ControlLabel>Status:</ControlLabel>
              <FormControl componentClass="select" value={status} onChange={this.onChangeStatus}>
                <option value="">(All)</option>
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Fixed">Fixed</option>
                <option value="Closed">Closed</option>
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={6} sm={4} md={3} lg={2}>
            <FormGroup>
              <ControlLabel>Effort between:</ControlLabel>
              <InputGroup>
                <FormControl value={effortMin} onChange={this.onChangeEffortMin}/>
                <InputGroup.Addon>-</InputGroup.Addon>
                <FormControl value={effortMax} onChange={this.onChangeEffortMax}/>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={6} sm={4} md={3} lg={2}>
            <ButtonToolbar>
              <Button bsStyle="primary" type="button" onClick={this.applyFilter}>
                Apply
              </Button>
              <Button
                  type="button"
                  onClick={this.showOriginalFilter}
                  disabled={!changed}
              >
                Reset
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
    );
  }
}

/*
withRouter is  a wrapper function provided by react. Argument = component class.
Returns  a new component class that includes history, location,  and match in props.
Instead of exporting the component, export the WRAPPED component!
 */
export default withRouter(IssueFilter);
