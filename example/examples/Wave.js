
import React, {PropTypes} from 'react';
import {Column, Row, observeGrid} from '../../src';

export default observeGrid(function Wave({colWidth, rows = 12}) {
  const Rows = [];

  for (let r = 0; r < rows; r += 1) {
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
});