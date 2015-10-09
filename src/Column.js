
import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import gridContext from './util/context';
import {isInteger, isFraction} from './util/types';
import {gridUnit} from './util/validators';
import {COL, GRID} from './util/constants';
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
    maxColWidth: PropTypes.number,
    offset: gridUnit,
    width: gridUnit
  };

  static contextTypes = gridContext;

  static childContextTypes = gridContext;

  getChildContext() {
    const rawWidth = this.getPropForBreak('width') || this.context.colWidth;
    const maxColWidth = this.props.isRoot ? this.props.maxColWidth : this.context.maxColWidth;

    return {
      maxColWidth: maxColWidth,
      breakPoint: this.props.isRoot ? this.props.width : this.context.breakPoint,
      colWidth: computeSpan(rawWidth, this.context),
      colMinPixelWidth: computeMinWidth(rawWidth, this.context),
      colMaxPixelWidth: computeMaxWidth(rawWidth, this.context, maxColWidth)
    };
  }

  getPropForBreak(prop) {
    if (this.props.isRoot) return this.props[prop];
    const breakProp = ['at' + this.context.breakPoint, prop].join('-');
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

