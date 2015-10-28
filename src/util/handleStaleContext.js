/*
 * This is a temporary fix for when shouldComponentUpdate()
 * makes the context stale.
 * For reference check out react routers issue https://github.com/facebook/react/issues/2517
 */
let observerId = 0;
const observers = {};

export function forceContext(Component) {
  const {
    componentDidMount, componentWillUnmount
  } = Component.prototype;

  Component.prototype.componentDidMount = function() {
    if (componentDidMount) componentDidMount.apply(this, arguments);

    this.observerId = observerId++;
    let breakpoint;

    observers[this.observerId] = function (newBreak) {
      if (!breakpoint) breakpoint = getBreakpoint(this);

      /*
       * If the context appears stale
       * force an update
       */
      if (breakpoint !== newBreak) {
        this.forceUpdate();
        breakpoint = newBreak;
        console.log('force')
      } else {
        breakpoint = null;
      }
    }.bind(this);
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

function getBreakpoint(inst) {
  return inst.props.isRoot ? inst.props.breakpoint : inst.context.cellblockBreakpoint;
}