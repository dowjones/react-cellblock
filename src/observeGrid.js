
import React, {Component} from 'react';
import gridContext from './util/context';

export default function observeGrid(DumbComponent) {
  return class extends Component {
    static displayName = 'observeGrid(' + (DumbComponent.displayName || DumbComponent.name) + ')';

    static contextTypes = gridContext;

    render() {
      return (<DumbComponent
        breakpoint={this.context.breakpoint}
        colWidth={this.context.colWidth}
        colMinPixelWidth={this.context.colMinPixelWidth}
        colMaxPixelWidth={this.context.colMaxPixelWidth}
        {... this.props}
      />);
    }
  };
}
