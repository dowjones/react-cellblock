
import React, {Component} from 'react';
import gridContext from './util/context';

export default function observeGrid(DumbComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.update = this.update.bind(this);
    }

    static displayName = 'Grid' + (DumbComponent.displayName || DumbComponent.name);

    static contextTypes = gridContext;

    componentDidMount() {
      this.context.addGridObserver(this.update);
    }

    componentWillUnmount() {
      this.context.removeGridObserver(this.update);
    }

    /*
     * If an ansestor blocks with shouldComponentUpdate
     * the context breakpoint will not match the new breakpoint
     */
    update(newbreakpoint) {
      if (this.context.breakpoint !== newbreakpoint) {
        dirtyForceContextUpdate(this._reactInternalInstance, this.context.breakpoint);
      }
    }

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


/*
 * even if you identify WHEN your context is stale
 * you need a way to know what it should be
 * so this is a crazy function to find the element that stopped the update
 * and force it to update
 */
function dirtyForceContextUpdate(internalInstance, staleBreakpoint) {
  const owner = internalInstance._currentElement._owner;
  if (!owner) return;

  if (owner._context.breakpoint !== staleBreakpoint) {
    owner._instance.updater.enqueueForceUpdate(owner._instance);
  } else {
    return dirtyForceContextUpdate(owner, staleBreakpoint);
  }
}