/*
 * The top level Grid component
 * Only used once per page
 */
import React, {Component, PropTypes} from 'react';
import Column from './Column';
import Style from './util/Style';
import eventListener from 'eventlistener';
import gridContext from './util/context';
import getThreshold from './util/getThreshold';
import {validBreakpoint, validBreakpoints} from './util/validators';

/*
 * A patch:
 * shouldComponentUpdate() can block context updates
 * so we need to add a fallback method for
 * updating interested components.
 * When React offers a better way, this should be removed
 */
let breakCount = 0; // everytime grid changes, increment so we can check for staleness
import {updateObservers} from './util/handleStaleContext';

class Grid extends Component {
  static get propTypes() {
    return {
      breakpoints: validBreakpoints,
      children: PropTypes.any,
      className: PropTypes.string,
      columnWidth: PropTypes.number,
      flexible: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
      gutterWidth: PropTypes.number,
      initialBreakpoint: validBreakpoint,
      onChange: PropTypes.func
    };
  }

  static get defaultProps() {
    return {
      onChange() {},
      columnWidth: 60,
      gutterWidth: 20,
      breakpoints: [4, 8, 12, 16],
      flexible: [4]
    };
  }

  constructor(props) {
    super(props);
    this.syncGrid = this.syncGrid.bind(this);
    this.updateGrid = this.updateGrid.bind(this);
    this._eventListener = Grid._eventListener || eventListener;

    this.state = {
      breakpoint: this.props.initialBreakpoint
    };
  }

  getChildContext() {
    const {props} = this;

    const getViewport = function () {
      return [this.state.breakpoint, this.getMaxBreatPoint(this.state.breakpoint)];
    }.bind(this);

    return {
      cellblockGet(key) {
        switch (key) {
          case 'gutterWidth':
            return props.gutterWidth;
          case 'columnWidth':
            return props.columnWidth;
          case 'viewport':
            return getViewport();
        }
      }
    };
  }

  componentWillMount() {
    const {breakpoints, columnWidth, gutterWidth} = this.props;
    const thresholds = breakpoints.map(p => (p * columnWidth) + (p * gutterWidth));
    const breakpoint = this.state.breakpoint || this.props.breakpoints[getThreshold(thresholds)];

    this.setState({
      breakpoint: breakpoint,
      thresholds: thresholds,
      breakCount: 0, // for patch
    });
  }

  componentDidMount() {
    this.syncGrid(true);
    this._eventListener.add(global.window, 'resize', this.syncGrid);
  }

  componentWillUnmount() {
    this._eventListener.remove(global.window, 'resize', this.syncGrid);
  }

  getMaxBreatPoint(minBreakpoint) {
    const {breakpoints, flexible} = this.props;

    if (!flexible ||
      (Array.isArray(flexible) && flexible.indexOf(minBreakpoint) === -1)) {
      return minBreakpoint;
    } else {
      const nextPoint = breakpoints[breakpoints.indexOf(minBreakpoint) + 1];
      return nextPoint || breakpoints[breakpoints.length - 1];
    }
  }

  syncGrid(triggerChange) {
    const b =  this.props.breakpoints[getThreshold(this.state.thresholds)];
    const isChange = (b !== this.state.breakpoint);
    if (isChange) this.updateGrid(b);
    if (isChange || triggerChange === true) this.props.onChange(b);
  }

  updateGrid(b) {
    breakCount = breakCount += 1; // This is for the patch

    this.setState({
      breakpoint: b,
      breakCount: breakCount // This is for the patch
    });

    updateObservers(breakCount); // This is for the patch
  }

  render() {
    const {breakpoint, breakCount} = this.state;
    const {className, gutterWidth, children} = this.props;
    const breakPointRange = [breakpoint, this.getMaxBreatPoint(breakpoint)];
    return (
      <Column isRoot viewport={breakPointRange} breakCount={breakCount} className={className}>
        <Style gutter={gutterWidth}/>
        {children}
      </Column>
    );
  }
}

Grid.childContextTypes = gridContext;
export default Grid;