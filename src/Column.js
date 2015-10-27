
import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import gridContext from './util/context';
import {isInteger, isFraction} from './util/types';
import {gridUnitFraction} from './util/validators';
import {COL, GRID} from './util/constants';
import cellblock from 'cellblock';
import {
 fractionToDecimal,
 decimalToPercent,
 numberToPercent,
 stringToPercent,
 computeSpan,
 computeMinWidth,
 computeMaxWidth,
 computeWidth
} from './util/colMath';

export default class Column extends Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    isRoot: PropTypes.bool,
    offset: gridUnitFraction,
    viewport: PropTypes.array,
    width: gridUnitFraction
  };

  static contextTypes = gridContext;

  static childContextTypes = gridContext;

  getChildContext() {
    return {
      cellblockViewport: this.props.isRoot ? this.props.viewport : this.context.cellblockViewport,
      cellblockColumn: this.grid,

      // deprecated
      colWidth: 10
    };
  }

  componentWillMount() {
    if (this.context.cellblockColumn) {
      this.grid = cellblock(this.context.cellblockColumn, this.props.width);
      console.log('attatch: [%s] %s to [%s]', this.grid.getId(), this.grid.getFraction().join('/'), this.context.cellblockColumn.getId());
    } else {
      this.grid = cellblock();
    }
  }

  componentWillUpdate() {
  }

  componentWillUnmount() {
    console.log('detach:', this.grid.getId());
    this.grid.detach();
  }

  getPropForBreak(prop) {
    if (this.props.isRoot) return this.props[prop];
    const breakProp = ['at' + this.context.breakpoint, prop].join('-');
    return typeof this.props[breakProp] === 'undefined' ? this.props[prop] : this.props[breakProp];
  }

  render() {
    if (this.props.isRoot) {
      return (
        <div className={classnames(GRID, this.props.className)}>
          {this.props.children}
        </div>
      );
    }

    const style = {};
    const width = this.getPropForBreak('width');
    const offset = this.getPropForBreak('offset');
    const className = classnames(COL, this.props.className);

    if (isFraction(width)) {
      style.width = stringToPercent(width);
    } else if (isInteger(width)) {
      style.width = numberToPercent(width, this.context.colWidth);
    }

    if (isFraction(offset)) {
      style.marginLeft = stringToPercent(offset);
    } else if (isInteger(offset)) {
      style.marginLeft = numberToPercent(offset, this.context.colWidth);
    }

    return (
      <div className={className} style={style}>
        {this.props.children}
      </div>
    );
  }
}

