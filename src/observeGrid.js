/*
 * Higher order component
 * allows you to build your responsive components
 */
import React, {Component} from 'react';
import gridContext from './util/context';

/*
 * A patch:
 * shouldComponentUpdate() can block context updates
 * so we need to add a fallback method for
 * updating interested components.
 * When React offers a better way, this should be removed
 */
import {forceContext} from './util/handleStaleContext';

@forceContext // apply patch
export default function observeGrid(DumbComponent) {
  return class extends Component {
    static displayName = 'observeGrid(' + (DumbComponent.displayName || DumbComponent.name) + ')';

    static contextTypes = gridContext;

    render() {
      const {cellblockColumn, cellblockGet} = this.context;
      const v = cellblockGet('viewport');
      const c = cellblockGet('columnWidth');
      const g = cellblockGet('gutterWidth');

      return (<DumbComponent
        breakpoint={this.context.breakpoint}
        colWidth={cellblockColumn.getWidth(v[0], 0)}
        colMinPixelWidth={cellblockColumn.getWidth((v[0] * c) + (v[0] * g) - g, g)}
        colMaxPixelWidth={cellblockColumn.getWidth((v[1] * c) + (v[1] * g) - g, g)}
        {... this.props}
      />);
    }
  };
}