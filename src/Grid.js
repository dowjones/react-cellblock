
import React, {Component, PropTypes, Children, cloneElement, isValidElement} from 'react';
import Column from './Column';
import Style from './util/Style';
import eventListener from 'eventlistener';
import gridContext from './util/context';
import getThreshold from './util/getThreshold';
import {validBreakPoint, validBreakPoints} from './util/validators';

export default class Grid extends Component {
  static propTypes = {
    breakpoints: validBreakPoints,
    children: PropTypes.any,
    className: PropTypes.string,
    columnWidth: PropTypes.number,
    flexible: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
    gutterWidth: PropTypes.number,
    initialBreakPoint: validBreakPoint,
    onChange: PropTypes.func
  };

  static childContextTypes = gridContext;

  static defaultProps = {
    onChange() {},
    columnWidth: 60,
    gutterWidth: 20,
    breakpoints: [4, 8, 12, 16],
    flexible: [4]
  };

  constructor(props) {
    super(props);
    this.syncGrid = this.syncGrid.bind(this);
  }

  state = {
    maxColWidth: this.props.columnWidth,
    breakpoint: this.props.initialBreakPoint
  };

  getChildContext() {
    return {
      colUnitWidth: this.props.columnWidth,
      gutterWidth: this.props.gutterWidth
    };
  }

  componentWillMount() {
    const {breakpoints, columnWidth, gutterWidth} = this.props;
    const thresholds = breakpoints.map(p => (p * columnWidth) + (p * gutterWidth));
    const breakpoint = this.state.breakpoint || this.props.breakpoints[getThreshold(thresholds)];

    this.setState({
      breakpoint: breakpoint,
      maxColWidth: this.getMaxColWidth(breakpoint),
      thresholds: thresholds
    });
  }

  componentDidMount() {
    this.syncGrid(true);
    eventListener.add(window, 'resize', this.syncGrid);
  }

  componentWillUnmount() {
    eventListener.remove(window, 'resize', this.syncGrid);
  }

  getMaxColWidth(units) {
    const {breakpoints, columnWidth, gutterWidth, flexible} = this.props;

    if (!flexible ||
      (Array.isArray(flexible) && flexible.indexOf(units) === -1)) {
      return columnWidth;
    }

    const nextPoint = breakpoints[breakpoints.indexOf(units) + 1];

    if (!nextPoint) {
      return Infinity;
    } else {
      const largeTotal = (nextPoint * columnWidth) + ((nextPoint - 1) * gutterWidth);
      return (largeTotal - ((units - 1) * gutterWidth)) / units;
    }
  }

  syncGrid(triggerChange) {
    const b =  this.props.breakpoints[getThreshold(this.state.thresholds)];
    const isChange = (b !== this.state.breakpoint);
    if (isChange) this.updateGrid(b);
    if (isChange || triggerChange === true) this.props.onChange(b);
  }

  updateGrid(b) {
    this.setState({
      breakpoint: b,
      maxColWidth: this.getMaxColWidth(b)
    });
  }

  render() {
    return (
      <Column
        isRoot
        width={this.state.breakpoint}
        maxColWidth={this.state.maxColWidth}
        className={this.props.className}>
        <Style gutter={this.props.gutterWidth}/>
        {Children.map(this.props.children, (c) =>
          isValidElement(c) ? cloneElement(c) : c)}
      </Column>
    );
  }
}