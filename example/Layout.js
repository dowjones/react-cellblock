
import React, {PropTypes} from 'react';
import {Grid, Column, Row, observeGrid} from '../src';
import Module from './Module';
import Banner from './Banner';
import Wave from './Wave';
import Chess from './Chess';

const LeftChunk = observeGrid(React.createClass({
  displayName: 'LeftChunk',

  propTypes: {
    colWidth: PropTypes.number
  },

  render() {
    if (this.props.colWidth <= 4) {
      return (
        <div className="left-set">
          <Module/>
          <Module/>
          <Module/>
        </div>
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

export default React.createClass({
  propTypes: {
    onChange: PropTypes.func
  },

  render() {
    return (
      <Grid onChange={this.props.onChange}>
        <Banner>
          Header
        </Banner>
        <Row>
          <Column>
            <Module/>
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
        <Wave rows={16}/>
        <Chess/>
        <Banner className="footer">
          Footer
        </Banner>
      </Grid>
    );
  }
});
