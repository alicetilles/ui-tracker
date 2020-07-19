import React from 'react';

// Conversion function that take in a number and converts to a string
function format(num) {
  return num != null ? num.toString() : '';
}

// Conversion function that take in a string and converts to a number
function unformat(str) {
  const val = parseInt(str, 10);
  return Number.isNaN(val) ? null : val;
}

export default class NumInput extends React.Component {
  constructor(props) {
    super(props);

    // Will be used as value of <input> element
    this.state = {value: format(props.value)};
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  // Check for input containing valid digits & set the state if valid
  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({value: e.target.value});
    }
  }

  // Handle losing of focus
  onBlur(e) {
    const {onChange} = this.props;
    const {value} = this.state;
    onChange(e, unformat(value));
  }

  // Render  an <input> element w/ the value set  to the state's variable, and onChange and
  //  onBlur handlers of component. Copy over all properties as part of props.
  render() {
    const {value} = this.state;
    return (
        <input
            type="text"
            {...this.props}
            value={value}
            onBlur={this.onBlur}
            onChange={this.onChange}
        />
    );
  }
}
