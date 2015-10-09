
import React, {Component, PropTypes, Children, cloneElement, isValidElement} from 'react';
import Column from './Column';
import Style from './util/Style';
import eventListener from 'eventlistener';
import gridContext from './util/context';
import getThreshold from './util/getThreshold';
import {validBreakPoint, validBreakPoints} from './util/validators';

export default class Grid extends Component {
  static propTypes = {
    breakPoints: validBreakPoints,
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
    breakPoints: [4, 8, 12, 16],
    flexible: [4]
  };

  constructor(props) {
    super(props);
    this.syncGrid = this.syncGrid.bind(this);
  }

  state = {
    maxColWidth: this.props.columnWidth,
    breakPoint: this.props.initialBreakPoint
  };

  getChildContext() {
    return {
      colUnitWidth: this.props.columnWidth,
      gutterWidth: this.props.gutterWidth
    };
  }

  componentWillMount() {
    const {breakPoints, columnWidth, gutterWidth} = this.props;
    const thresholds = breakPoints.map(p => (p * columnWidth) + (p * gutterWidth));
    const breakPoint = this.state.breakPoint || this.props.breakPoints[getThreshold(thresholds)];

    this.setState({
      breakPoint: breakPoint,
      maxColWidth: this.getMaxColWidth(breakPoint),
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
    const {breakPoints, columnWidth, gutterWidth, flexible} = this.props;

    if (!flexible ||
      (Array.isArray(flexible) && flexible.indexOf(units) === -1)) {
      return columnWidth;
    }

    const nextPoint = breakPoints[breakPoints.indexOf(units) + 1];

    if (!nextPoint) {
      return Infinity;
    } else {
      const largeTotal = (nextPoint * columnWidth) + ((nextPoint - 1) * gutterWidth);
      return (largeTotal - ((units - 1) * gutterWidth)) / units;
    }
  }

  syncGrid(triggerChange) {
    const b =  this.props.breakPoints[getThreshold(this.state.thresholds)];
    const isChange = (b !== this.state.breakPoint);
    if (isChange) this.updateGrid(b);
    if (isChange || triggerChange === true) this.props.onChange(b);
  }

  updateGrid(b) {
    this.setState({
      breakPoint: b,
      maxColWidth: this.getMaxColWidth(b)
    });
  }

  render() {
    return (
      <Column
        isRoot
        width={this.state.breakPoint}
        maxColWidth={this.state.maxColWidth}
        className={this.props.className}>
        <Style gutter={this.props.gutterWidth}/>
        {Children.map(this.props.children, (c) =>
          isValidElement(c) ? cloneElement(c) : c)}
      </Column>
    );
  }
}