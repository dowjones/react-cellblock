
import React, {PropTypes} from 'react';
import {Grid, Column, Row, observeGrid} from '../src';
import Module from './Module';
import Nav from './Nav';
import Banner from './Banner';
import Wave from './Wave';
import Chess from './Chess';

const DEFAULT = 'A';
const examples = {};

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

examples.A = () => (
  <Row>
    <Column>
      <Row>
        <Column width="2/3">
          <Module/>
        </Column>
        <Column className="dark" width="1/3">
          <Module/>
        </Column>
      </Row>
      <Row>
        <Column width="1/2">
          <LeftChunk/>
        </Column>
        <Column width="1/2">
          <Module/>
          <Module/>
          <Module/>
        </Column>
      </Row>
    </Column>
    <Column width="1/3"><Module/></Column>
    <Column width="1/3"><Module/></Column>
    <Column width="1/3"><Module/></Column>
  </Row>
);

examples.B = () => {
  return <LeftChunk/>;
}

examples['B 2'] = () => {
  return <LeftChunk/>;
}

const LeftChunk = observeGrid(React.createClass({
  displayName: 'LeftChunk',

  propTypes: {
    colWidth: PropTypes.number
  },

  render() {
    if (this.props.colWidth <= 4) {
      return (
        <Row className="left-set">
          <Column>
            <Module/>
            <Module/>
            <Module/>
          </Column>
        </Row>
      );
    }

    return (
      <Row className="left-set">
        <Column width="1/3"><Module/></Column>
        <Column width="1/3"><Module/></Column>
        <Column width="1/3"><Module/></Column>
        <Column width="1/3"><Module/></Column>
        <Column width="1/3"><Module/></Column>
        <Column width="1/3"><Module/></Column>
        <Column width="1/3"><Module/></Column>
        <Column width="1/3"><Module/></Column>
        <Column width="1/3"><Module/></Column>
      </Row>
    );
  }
}));
