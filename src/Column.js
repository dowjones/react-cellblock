/*
 * The Column component
 * divides Rows into fractions
 */
import React, {Component, PropTypes} from 'react';
import {gridFraction} from './util/validators';
import {COL, GRID} from './util/constants';
import gridContext from './util/context';
import classnames from 'classnames';
import cellblock from 'cellblock';

/*
 * A patch:
 * shouldComponentUpdate() can block context updates
 * so we need to add a fallback method for
 * updating interested components.
 * When React offers a better way, this should be removed
 */
import {forceContext} from './util/handleStaleContext';

@forceContext // apply patch

export default class Column extends Component {
  static propTypes = {
    breakpoint: PropTypes.number,
    children: PropTypes.any,
    className: PropTypes.string,
    isRoot: PropTypes.bool,
    offset: gridFraction,
    viewport: PropTypes.array,
    width: gridFraction
  };

  static contextTypes = gridContext;
  static childContextTypes = gridContext;

  getChildContext() {
    return {
      cellblockColumn: this.grid,
      cellblockBreakpoint: this.props.isRoot ?
        this.props.breakpoint : this.context.cellblockBreakpoint
    };
  }

  componentWillMount() {
    const {cellblockColumn} = this.context;

    if (cellblockColumn) {
      this.grid = cellblock(cellblockColumn, this.props.width);
    } else {
      this.grid = cellblock();
    }
  }

  componentWillUpdate({width}) {
    this.grid.setWidth(width);
  }

  componentWillUnmount() {
    this.grid.detach();
  }

  render() {
    if (this.props.isRoot) {
      return (
        <div className={classnames(GRID, this.props.className)}>
          {this.props.children}
        </div>
      );
    }

    const className = classnames(COL, this.props.className);
    const width = this.grid.getFraction();
    const {offset}= this.props;
    const style = {};

    if (offset) style.marginLeft = fractionToPercent(offset);
    style.width = decimalToPercent(width[0] / width[1]);

    return (
      <div className={className} style={style}>
        {this.props.children}
      </div>
    );
  }
}

function fractionToPercent(v) {
  const f = v.split('/');
  return decimalToPercent(parseInt(f[0]) / parseInt(f[1]));
}

function decimalToPercent(v) {
  return parseFloat((v * 100).toFixed(4)) + '%';
}