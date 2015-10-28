
import React, {PropTypes} from 'react';
import {Grid} from '../src';
import examples from './examples';
import Banner from './modules/Banner';
import Nav from './modules/Nav';

import Optimized from './modules/Optimized';
import Blocker from './modules/Blocker';

const DEFAULT = Object.keys(examples)[0];

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func
  },

  getInitialState() {
    const initialExample = window.location.hash.replace('#',''); // lame routing
    return {
      example: examples.hasOwnProperty(initialExample) ? initialExample : DEFAULT
    };
  },

  changeExample(newExample) {
    this.setState({
      example: newExample
    });
    window.location.hash = newExample;
  },

  render() {
    const Example = examples[this.state.example];
    return (
      <Grid onChange={this.props.onChange}>
        <Banner className="header">Cellblock</Banner>
        <Nav
          examples={Object.keys(examples)}
          changeExample={this.changeExample}
          activeExample={this.state.example}/>
        <Blocker>
          <Example/>
        </Blocker>
        <Optimized/>
        <Banner className="footer">Footer</Banner>
      </Grid>
    );
  }
});
