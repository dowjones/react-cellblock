
import React from 'react';
import {Column, Row, observeGrid} from '../../src';

export default function Chess () {
  const Rows = [];

  for (let r = 0; r < 8; r += 1) {
    const Columns = [];

    for (let c = 0; c < 8; c += 1) {
      Columns.push(
        <Column width="1/8" key={c}>
          <Cell dark={!!((r + c) % 2)}/>
        </Column>
      );
    }

    Rows.push(<Row key={r}>{Columns}</Row>);
  }

  return <div>{Rows}</div>;
};

function Cell({dark}) {
  const style = {
    position: 'relative',
    height: 0,
    paddingBottom: '100%',
    background: dark ? '#113300' : '#ffaa00',
    marginBottom: 20
  };
  return <div style={style}/>
}

