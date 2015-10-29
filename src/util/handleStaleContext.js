/*
 * This is a temporary fix for when shouldComponentUpdate()
 * makes the context stale.
 * For reference check out react routers issue https://github.com/facebook/react/issues/2517
 */
let observerId = 0;
const observers = {};

export function forceContext(Component) {
  const {
    // componentDidMount, // nothing uses this at the moment
    componentWillUnmount
  } = Component.prototype;

  Component.prototype.componentDidMount = function() {
    // if (componentDidMount) componentDidMount.apply(this, arguments); // nothing uses this at the moment
    if (this.props.isRoot) return;

    this.observerId = observerId++;
    observers[this.observerId] = (newBreak) => {
      /*
       * If the context appears stale
       * force an update
       */
      if (this.context.cellblockBreak !== newBreak) {
        this.forceUpdate();
      }
    };
  }

  Component.prototype.componentWillUnmount = function() {
    if (componentWillUnmount) componentWillUnmount.apply(this, arguments);
    delete observers[this.observerId];
  }

  return Component;
}

export function updateObservers(newBreakpoint) {
  for (let o in observers) {
    observers[o](newBreakpoint);
  }
}