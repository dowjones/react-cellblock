
import React from 'react';
import {Column, Row, observeGrid} from '../../src';
import Module from '../modules/TypeSize';

const LeftSection = observeGrid(function (props) {
  if (props.colWidth <= 4) {
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
});

export default function CopyFit() {
  return (
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
            <LeftSection/>
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
}
