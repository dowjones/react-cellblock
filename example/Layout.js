
import React, {PropTypes} from 'react';
import {Grid} from '../src';
import examples from './examples';
import Banner from './modules/Banner';
import Nav from './modules/Nav';

const DEFAULT = Object.keys(examples)[0];

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func
  },

  getInitialState() {
    const initialExample = window.location.hash.replace('#',''); // lame routing
    return {
      Example: examples.hasOwnProperty(initialExample) ? examples[initialExample] : examples[DEFAULT]
    };
  },

  changeExample(newExample) {
    this.setState({
      Example: examples[newExample]
    });
    window.location.hash = newExample;
  },

  render() {
    return (
      <Grid onChange={this.props.onChange}>
        <Banner className="header">Cellblock</Banner>
        <Nav examples={Object.keys(examples)} changeExample={this.changeExample}/>
        <this.state.Example/>
        <Banner className="footer">Footer</Banner>
      </Grid>
    );
  }
});
