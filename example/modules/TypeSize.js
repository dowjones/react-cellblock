
import React from 'react';
import {observeGrid} from '../../src/index';
import classnames from 'classnames';

console.log('OBSERVE GRID IS', observeGrid);


export default observeGrid(function TypeSize({
  className,
  colMaxPixelWidth,
  colWidth
}) {
  const padding = 15;
  const headlineSize = (colMaxPixelWidth - (2 * padding)) * (1/11);
  const lineHeight = getLineHeight(headlineSize, colMaxPixelWidth, 1.2);
  const baselineDiscrepancy = getbaselineDiscrepancy(headlineSize, lineHeight, 0.10);

  const style = {
    fontSize: headlineSize,
    lineHeight: lineHeight + 'px',
    marginTop: - baselineDiscrepancy
  };

  return (
    <div className={classnames('module', className)}>
      <h2 style={style}>
        It’s About Finding the Perfect Fit.
      </h2>
      <div className="token">
        {colWidth.toFixed(2).replace('.00', '')}
      </div>
    </div>
  );
});


// a helper to decide line height based on font size and column width
// based on http://www.pearsonified.com/2011/12/golden-ratio-typography.php

const phi = (1 + Math.sqrt(5)) / 2;

function getLineHeight(f, w, bias = 1) {
  // f is font size
  // w is column width
  const ratio = phi - (
    (1 / 2 * phi) *
    (1 - (w / Math.pow(f * phi, 2)))
  );
  return Math.ceil(f * ratio * bias);
}

// a helper for getting baselineDiscrepancy
// see more at http://www.bbc.co.uk/gel/web/building-blocks/typography/css-discrepancy

function getbaselineDiscrepancy(size, lineHeight, familyConstant) {
  return familyConstant * size + ((lineHeight - size) / 2);
}
