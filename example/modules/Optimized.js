import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
      <Row testing>
        <Column width="1/2" testing>
          <TypeSize/>
        </Column>
        <Column width="1/2" testing>
          <TypeSize/>
        </Column>
      </Row>
    )
  }
}