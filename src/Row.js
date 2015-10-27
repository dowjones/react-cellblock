
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

  render() {
    const {cellblockGet, cellblockViewport} = this.context;

    console.log(cellblockViewport);

    const style = {
      maxWidth: 1000
    };

    return (
      <div className={classnames(ROW, this.props.className)} style={style}>
        {this.props.children}
      </div>
    );
  }
}
