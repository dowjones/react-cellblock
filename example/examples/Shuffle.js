
import React, {Children} from 'react';
import {Column, Row, observeGrid} from '../../src';

export default observeGrid(function Shuffle({colWidth}) {
  const fragment = [];
  for (let i = 0; i < 19; i += 1) {
    fragment.push(<RandomNest key={i}/>)
  }
  return <div>{fragment}</div>;
});

const Terminal = observeGrid(function({children, colWidth}) {
  return <div className={colWidth < 1 ? 'terminal small' : 'terminal'}/>
});

const RandomNest = observeGrid(function ({colWidth}) {
  const divisions = randomBool() ? 3 : 2;
  if (colWidth / divisions < .6) return <Terminal/>;

  const Split = (divisions === 3) ? ThreeUp : TwoUp;
  return <Split>{RandomFragment(divisions, Split)}</Split>;
});

function RandomFragment(length, Component) {
  const fragment = [];
  for (let i = 0; i < length; i += 1) {
    fragment.push(randomBool() ? <RandomNest key={i}/> : undefined)
  }
  return fragment;
}

function randomBool() {
  return Math.random() < .5;
}

function ThreeUp({children}) {
  children = Children.toArray(children);
  return (
    <Row className="three-up">
      <Column width="1/3">
        {getChild(children, 0)}
      </Column>
      <Column width="1/3">
        {getChild(children, 1)}
      </Column>
      <Column width="1/3">
        {getChild(children, 2)}
      </Column>
    </Row>
  );
}

function TwoUp({children}) {
  children = Children.toArray(children);
  return (
    <Row className="two-up">
      <Column width="1/2">
        {getChild(children, 0)}
      </Column>
      <Column width="1/2">
        {getChild(children, 1)}
      </Column>
    </Row>
  );
}

function getChild(children, idx) {
  return children[idx] || <Terminal/>;
}