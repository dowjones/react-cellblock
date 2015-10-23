import React, {Component, PropTypes} from 'react';
import TypeSize from './TypeSize';
import {Row, Column} from '../../src';

let i = 1;

/*
 * Example of what happens if someone uses shouldComponentUpdate
 */
export default class Optimized extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    console.log('render', i++);
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