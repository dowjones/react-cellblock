
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

    update() {
      console.log('observer!', this.context.colWidth);
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
