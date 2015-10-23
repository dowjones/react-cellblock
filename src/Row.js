
import React, {Component, PropTypes} from 'react';
import gridContext from './util/context';
import classnames from 'classnames';
import {ROW} from './util/constants';

/*
 * To deal with shouldComponentUpdate bug.
 * this should not be permenant
 */
import handleStaleContext from './util/handleStaleContext';
@handleStaleContext

export default class Row extends Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string
  };

  static contextTypes = gridContext;

  render() {
    const {gutterWidth, colMaxPixelWidth} = this.context;

    const style = {
      maxWidth: colMaxPixelWidth < Infinity ? colMaxPixelWidth + gutterWidth : null
    };

    return (
      <div className={classnames(ROW, this.props.className)} style={style}>
        {this.props.children}
      </div>
    );
  }
}
