/*
 * Higher order component
 * allows you to build your responsive components
 */

import React, {Component} from 'react';
import gridContext from './util/context';

export default function observeGrid(DumbComponent) {
  return class extends Component {
    static displayName = 'observeGrid(' + (DumbComponent.displayName || DumbComponent.name) + ')';

    static contextTypes = gridContext;

    render() {
      const {cellblockColumn, cellblockViewport, cellblockGet} = this.context;
      const v = cellblockViewport;
      const c = cellblockGet('columnWidth');
      const g = cellblockGet('gutterWidth');

      return (<DumbComponent
        breakpoint={this.context.breakpoint}
        colWidth={cellblockColumn.getWidth(cellblockViewport[0], 0)}
        colMinPixelWidth={cellblockColumn.getWidth((v[0] * c) + (v[0] * g), g)}
        colMaxPixelWidth={cellblockColumn.getWidth((v[1] * c) + (v[1] * g), g)}
        {... this.props}
      />);
    }
  };
}
