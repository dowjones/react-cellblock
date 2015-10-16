
import React from 'react';
import {Row, Column, observeGrid} from '../../src';

export default observeGrid(function Nav({colWidth, examples, changeExample}) {
  let rows;
  if (colWidth < 5) {
    rows = split(examples, 3);
  } else if (colWidth < 9) {
    rows = split(examples, 2);
  } else {
    rows = split(examples, 1);
  }

  return (
    <div className="example-nav">
      {rows.map((buttons, idx) => (
        <Row className="nav-buttons" key={idx}>
          {buttons.map((name, idx) => (
            <Column key={idx} width={[1, buttons.length].join('/')}>
              <div className="example-button" onClick={changeExample.bind(null, name)}>
                {name}
              </div>
            </Column>
          ))}
        </Row>
      ))}
    </div>
  );
});

// A function to arrange the buttons
// into a certain number of rows no matter the number
function split(arr, size) {
  var out = [];
  var sizes = [];
  var where = size - 1;
  var ptr = 0;
  var i, j;

  for (i = arr.length - 1; i >= 0; i--) {
    sizes[where] = (sizes[where] || 0) + 1;
    if (--where === -1) where = size - 1;
  }

  for (i = 0; i < size; i++) {
    for (j = 0; j < sizes[i]; j++) {
      if (j === 0) out[i] = [arr[ptr]];
      else out[i].push(arr[ptr]);
      ptr++;
    }
  }

  return out;
}