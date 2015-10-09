
import React, {PropTypes} from 'react';
import {Column, Row, observeGrid} from '../src';

export default observeGrid(React.createClass({
  propTypes: {
    colWidth: PropTypes.number,
    rows: PropTypes.number
  },

  getDefaultProps() {
    return {
      rows: 5
    };
  },

  render() {
    const {rows, colWidth} = this.props;
    const Rows = [];

    for (let r = 0; r <= rows; r += 1) {
      const Columns = [];
      const i = (r % colWidth) + 1;
      const cols = i % 2 ? [colWidth - i, i] : [i, colWidth - i];
      cols.forEach((c, idx) => {
        if (c > 0) {
          Columns.push((
            <Column key={r + '.' + idx} width={c}>
              <div className="wave-module">{c}</div>
            </Column>
          ));
        }
      });
      Rows.push(<Row key={r}>{Columns}</Row>);
    }
    return <div>{Rows}</div>;
  }
}));
