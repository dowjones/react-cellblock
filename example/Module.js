
import React, {PropTypes} from 'react';
import {observeGrid} from '../src';
import classnames from 'classnames';

export default observeGrid(React.createClass({
  displayName: 'Dummy',

  propTypes: {
    children: PropTypes.any,
    className: PropTypes.string,
    colMaxPixelWidth: PropTypes.number,
    colMinPixelWidth: PropTypes.number,
    colWidth: PropTypes.number
  },

  render: function () {
    const padding = 15;
    const headlineSize = (this.props.colMaxPixelWidth - (2 * padding)) * (1/11);
    const lineHeight = headlineSize < 20 ? headlineSize * 1.6 : headlineSize * 1.1;
    const baselineDiscrepancy = 0.10 * headlineSize + ((lineHeight - headlineSize) / 2);

    const style = {
      fontSize: headlineSize,
      lineHeight: lineHeight + 'px',
      marginTop: -baselineDiscrepancy
    };

    return (
      <div className={classnames('module', this.props.className)}>
        <h2 style={style}>It’s About Finding the Perfect Fit?</h2>
        <div className="token">
          {this.props.colWidth.toFixed(2).replace('.00', '')}
        </div>
      </div>
    );
  }
}));
