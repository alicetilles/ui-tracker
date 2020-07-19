import React from 'react';
import SelectAsync from 'react-select/lib/Async'; // eslint-disable-line
import {withRouter} from 'react-router-dom';

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

/*
This component displays a React Select and implements methods required to fetch the documents
using the search filter from the API.
 */

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  /*
    Action when user selects one of the displayed values.
    Display the edit page for that issue when that happens.
     */
  onChangeSelection({value}) {
    const {history} = this.props;
    history.push(`/edit/${value}`);
  }

  /*
    Fetches  a list of issues that match the search term using the graphQL fetch function.
    Limit the API fired only for words > 2 letters.
     */
  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query issueList($search: String) {
            issueList(search: $search) {
            issues {id title}
            }
        }`;

    const {showError} = this.props;
    const data = await graphQLFetch(query, {search: term}, showError);
    return data.issueList.issues.map(issue => ({
      label: `#${issue.id}: ${issue.title}`, value: issue.id,
    }));
  }

  render() {
    return (
        <SelectAsync
            instanceId="search-select"
            value=""
            loadOptions={this.loadOptions}
            filterOption={() => true}
            onChange={this.onChangeSelection}
            components={{DropdownIndicator: null}}
        />
    );
  }
}

export default withRouter(withToast(Search));
