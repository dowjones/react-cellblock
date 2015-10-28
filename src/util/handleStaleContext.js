
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
    this.observerId = observerId++;

    observers[this.observerId] = function (newBreak) {
      const breakpoint = this.props.isRoot ? 
        this.props.breakpoint : this.context.cellblockBreakpoint;

      if (breakpoint !== newBreak) {
        console.log('somethings up!');
      }

      this.forceUpdate();

    }.bind(this);

    if (componentDidMount) componentDidMount.apply(this, arguments);
  }

  Component.prototype.componentWillUnmount = function() {
    delete observers[this.observerId];

    // console.log('removed observer');

    if (componentWillUnmount) componentWillUnmount.apply(this, arguments);
  }

  return Component;
}

export function updateObservers(newBreakpoint) {
  console.log(Object.keys(observers).length)
  for (let o in observers) {
    observers[o](newBreakpoint);
  }
}