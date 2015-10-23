
/*
 * This is a temporary fix for when shouldComponentUpdate()
 * makes stale context
 * for reference check out react routers issue https://github.com/rackt/react-router/issues/470
 */
export default function handleStaleContext(Component) {
  const {prototype} = Component;

  prototype.componentDidMount = function () {
    this.update = function (newbreakpoint) {
      if (this.context.breakpoint !== newbreakpoint) {
        dirtyForceContextUpdate(this._reactInternalInstance, this.context.breakpoint);
      }
    }.bind(this);

    this.context.addGridObserver(this.update);
  }

  prototype.componentWillUnmount = function () {
    this.context.removeGridObserver(this.update);
  }

  return Component;
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