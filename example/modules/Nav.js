
import React, {PropTypes} from 'react';
import {Row, Column, observeGrid} from '../../src';

export default observeGrid(React.createClass({
  displayName: 'Banner',

  propTypes: {
    changeExample: PropTypes.func,
    colWidth: PropTypes.number,
    examples: PropTypes.array
  },

  getDefaultProps() {
    return {
      examples: [1, 2, 3, 4, 5]
    };
  },

  render() {
    const {examples, changeExample, colWidth} = this.props;
    let rows;

    if (colWidth < 5) rows = split(examples, 3);
    else if (colWidth < 9) rows = split(examples, 2);
    else rows = split(examples, 1);

    return (
      <div className="example-nav">
        {rows.map((buttons, idx) => (
          <Row className="nav-buttons" key={idx}>
            {buttons.map((v, idx) => (
              <Column key={idx} width={[1, buttons.length].join('/')}>
                <div className="example-button" onClick={changeExample.bind(null, v)}>
                  Example: {v}
                </div>
              </Column>
            ))}
          </Row>
        ))}
      </div>
    );
  }
}));

function split(arr, size) {
  var out = [];
  var sizes = [];
  var where = size - 1;
  var ptr = 0;
  var i, j;

  // Calculate the sizes of
  // the output arrays.
  // loop size: length of array
  for (i = arr.length - 1; i >= 0; i--) {
    sizes[where] = (sizes[where] || 0) + 1;
    if (--where === -1) where = size - 1;
  }

  // Place the items in the array into
  // the new `out` array in the order
  // dictated by the sizes.
  // Total loop size (for 2): length of array
  for (i = 0; i < size; i++) {
    for (j = 0; j < sizes[i]; j++) {
      if (j === 0) out[i] = [arr[ptr]];
      else out[i].push(arr[ptr]);
      ptr++;
    }
  }

  return out;
}