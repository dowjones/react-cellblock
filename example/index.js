
import './style/reset.scss';
import './style/style.scss';
import React from 'react';
import {render} from 'react-dom';
import Layout from './Layout';

const listeners = [];

const TestComponent = class extends React.Component {
  state = {
    a: 0
  }

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    listeners.push(this.update);
  }

  componentDidUpdate() {
    console.log('update', this.props.id)
  }

  update() {
    this.setState({
      a: this.state.a + 1
    });
  }

  render() {
    // console.log('render', this.props.id)
    return <div id={'n' + this.props.id} className={'a' + this.state.a}>{this.props.children}</div>;
  }
};

// Create a tree of test components
const tree = React.createElement(TestComponent, {id: 1},
             React.createElement(TestComponent, {id: 2},
             React.createElement(TestComponent, {id: 3},
             React.createElement(TestComponent, {id: 4},
             React.createElement(TestComponent, {id: 5})))));

setTimeout(() => {
  listeners.forEach(fn => fn());
}, 1000);

setTimeout(() => {
  listeners.forEach(fn => fn());
}, 2000);

render(tree, document.getElementById('container'));


// select the target node
var target = document.querySelector('#n1');

console.log(target);

// create an observer instance
var observer = new MutationObserver(function(mutations) {
  console.log('Mutations');
  mutations.forEach(function(mutation, idx) {
    console.log('mutation', idx, mutation.type);
  });
});

// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true };

// pass in the target node, as well as the observer options
observer.observe(target, config);

// var i = 0;
// setInterval(() => {
//   target.setAttr('data-mine', i++)
// }, 1000)

// later, you can stop observing
// observer.disconnect();
