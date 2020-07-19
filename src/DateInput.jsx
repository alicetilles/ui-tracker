import React from 'react';

// Convert from date to string
function displayFormat(date) {
  return (date != null) ? date.toDateString() : '';
}

//  Requires unambiguous YYYY-MM-DD format
function editFormat(date) {
  return (date != null) ? date.toISOString().substr(0, 10) : '';
}

// Convert from string to date
function unformat(str) {
  const val = new Date(str);
  return Number.isNaN(val.getTime()) ? null : val;
}

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: editFormat(props.value),
      focused: false,
      valid: true,
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFocus() {
    this.setState({focused: true});
  }

  onBlur(e) {
    const {value, valid: oldValid} = this.state;
    const {onValidityChange, onChange} = this.props;
    const dateValue = unformat(value);
    const valid = value === '' || dateValue != null;

    // To inform the parent of the new validity, use optional callback onValidityChange
    if (valid !== oldValid && onValidityChange) {
      onValidityChange(e, valid);
    }
    this.setState({focused: false, valid});
    if (valid) onChange(e, dateValue);
  }

  // Validate characters (digits and -)
  onChange(e) {
    if (e.target.value.match(/^[\d-]*$/)) {
      this.setState({value: e.target.value});
    }
  }

  render() {
    const {valid, focused, value} = this.state;
    const {value: origValue, onValidityChange, ...props} = this.props;


    // Display user-typed in value as if it's invalid or if currently being edited
    // Otherwise, display it in editable format
    const displayValue = (focused || !valid) ? value : displayFormat(origValue);
    return (
        <input
            {...props}
            value={displayValue}
            placeholder={focused ? 'yyyy-mm-dd' : null}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChange={this.onChange}
        />
    );
  }
}
