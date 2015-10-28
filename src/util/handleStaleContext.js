
const observers = [];

/*
 * This is a temporary fix for when shouldComponentUpdate()
 * makes the context stale.
 * For reference check out react routers issue https://github.com/facebook/react/issues/2517
 */
export function forceContext(Component) {
  const {
    componentDidMount, componentWillUnmount
  } = Component.prototype;

  Component.prototype.componentDidMount = function() {
    // console.log('mount:', this.props.width);
    if (componentDidMount) componentDidMount.apply(this, arguments);
  }

  Component.prototype.componentWillUnmount = function() {
    // console.log('unmount:', this.props.width);
    if (componentWillUnmount) componentWillUnmount.apply(this, arguments);
  }

  return Component;
}

export function updateObservers(newBreakpoint) {
  console.log('new', newBreakpoint);
}