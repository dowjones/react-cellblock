
import React, {PropTypes} from 'react';
import {Row, Column, observeGrid} from '../src';

export default observeGrid(React.createClass({
  displayName: 'Banner',

  propTypes: {
    changeExample: PropTypes.func,
    colWidth: PropTypes.number
  },

  render() {
    var examples = [1, 2, 3];

    return (
      <div className="example-nav">
        <Row>
          {examples.map((v, idx) => (
            <Column key={idx} width={[1, examples.length].join('/')}>
              hello
            </Column>
          ))}
        </Row>
      </div>
    );
  }
}));
