
import React, {Component, PropTypes} from 'react';
import gridContext from './util/context';
import classnames from 'classnames';
import {ROW} from './util/constants';

export default class Row extends Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
  };

  static contextTypes = gridContext;
  static childContextTypes = gridContext;

  getChildContext() {
    return {
      cellblock: true
    };
  }

  render() {
    const {cellblock, cellblockGet, cellblockViewport} = this.context;
    const v = cellblockViewport[1];
    const c = cellblockGet('columnWidth');
    const g = cellblockGet('gutterWidth');

    const style = cellblock ? null : {
      maxWidth: (v * c) + (v * g)
    };

    return (
      <div className={classnames(ROW, this.props.className)} style={style}>
        {this.props.children}
      </div>
    );
  }
}
