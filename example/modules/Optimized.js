import React, {Component, PropTypes} from 'react';
import TypeSize from './TypeSize';
import {Row, Column} from '../../src';

/*
 * Example of what happens if someone uses shouldComponentUpdate
 */
export default class Optimized extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Row>
        <Column width="1/2">
          <TypeSize/>
        </Column>
        <Column width="1/2">
          <TypeSize/>
        </Column>
      </Row>
    )
  }
}