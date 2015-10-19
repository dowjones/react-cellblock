
import proxyquire from 'proxyquire';
import {stub} from 'sinon';
import React from 'react';
import Dom, {render, findDOMNode} from 'react-dom';
import {renderToStaticMarkup} from 'react-dom/server';

import {
  findRenderedDOMComponentWithTag,
  findRenderedComponentWithType,
  scryRenderedComponentsWithType,
  findRenderedDOMComponentWithClass,
  renderIntoDocument
} from 'react-addons-test-utils';

import {Row, Column, observeGrid} from '../src';

describe('Grid', () => {
  let Grid, options, eventlistener, rootNode, Module, Observer;

  beforeEach(() => {
    setWindowWidth(1280);

    eventlistener = {
      add: stub(),
      remove: stub()
    };

    Grid = proxyquire('../src/Grid', {eventlistener: eventlistener});

    rootNode = document.createElement('div');
    document.documentElement.appendChild(rootNode);

    Module = React.createClass({
      render() { return <div/>; }
    });

    options = {
      columnWidth: 80,
      gutterWidth: 20,
      breakpoints: [5, 10, 15]
    };

    Observer = observeGrid(Module);
  });

  afterEach(() => {
    delete document.documentElement.clientWidth;
    rootNode.parentNode.removeChild(rootNode);
  });

  describe('Breakpoints', () => {
    it('should attach event listener', () => {
      render((<Grid/>), rootNode);
      eventlistener.add.calledWith(window, 'resize').should.be.true();
    });

    it('should clean up event listener', () => {
      render((<Grid/>), rootNode);
      Dom.unmountComponentAtNode(rootNode);
      eventlistener.remove.calledWith(window, 'resize').should.be.true();
    });

    it('should change breakpoints based on window width', () => {
      const grid = render((
        <Grid {... options}>
          <Row>
            <Column>
              <Observer/>
            </Column>
          </Row>
        </Grid>
      ), rootNode);

      const listener = eventlistener.add.firstCall.args[2];
      let breakpoint;

      options.breakpoints.forEach((point, idx) => {
        const min = getThreshold(point, options.columnWidth, options.gutterWidth);
        const max = options.breakpoints[idx + 1] ?
          getThreshold(options.breakpoints[idx + 1], options.columnWidth, options.gutterWidth) - 1 : Infinity;

        setWindowWidth(min);
        listener();
        breakpoint = findRenderedComponentWithType(grid, Module).props.breakpoint;
        breakpoint.should.eql(point);

        setWindowWidth(max);
        listener();
        breakpoint = findRenderedComponentWithType(grid, Module).props.breakpoint;
        breakpoint.should.eql(point);
      });
    });
  });

  describe('Applying Width', () => {
    it('should apply correct width for fixed unit widths', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options}>
          <Row>
            <Column width={5}/>
            <Column width={10}>
              <Row>
                <Column width={4}/>
                <Column width={6}/>
              </Row>
            </Column>
          </Row>
        </Grid>
      ), rootNode);

      const cols = scryRenderedComponentsWithType(grid, Column);
      const widths = cols.filter(removeRoot).map(c => findDOMNode(c).style.width);
      widths.should.eql([
        '33.3333%',
        '66.6667%',
        '40%',
        '60%'
      ]);
    });

    it('should apply correct width for fractional widths', () => {
      setWindowWidth(2000);
      const grid = renderIntoDocument((
        <Grid {... options}>
          <Row>
            <Column width="1/3"/>
            <Column width="2/3">
              <Row>
                <Column width="1/2"/>
                <Column width="1/2"/>
              </Row>
            </Column>
          </Row>
        </Grid>
      ));

      const cols = scryRenderedComponentsWithType(grid, Column);
      const widths = cols.filter(removeRoot).map(c => findDOMNode(c).style.width);
      widths.should.eql([
        '33.3333%',
        '66.6667%',
        '50%',
        '50%'
      ]);
    });

    it('should handle columns with no width', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options}>
          <Row>
            <Column/>
            <Column width={5}/>
            <Column width={10}/>
          </Row>
        </Grid>
      ), rootNode);

      const cols = scryRenderedComponentsWithType(grid, Column);
      const widths = cols.filter(removeRoot).map(c => findDOMNode(c).style.width);

      widths.should.eql([
        '',
        '33.3333%',
        '66.6667%'
      ]);
    });

    it('should handle at- widths', () => {
      setWindowWidth(2000);

      const grid = render((
        <Grid {... options}>
          <Row>
            <Column at15-width={5} at10-width={2}/>
          </Row>
        </Grid>
      ), rootNode);

      const listener = eventlistener.add.firstCall.args[2];

      let cols = scryRenderedComponentsWithType(grid, Column);
      let widths = cols.filter(removeRoot).map(c => findDOMNode(c).style.width);
      widths.should.eql(['33.3333%']);

      setWindowWidth(1200);
      listener();

      cols = scryRenderedComponentsWithType(grid, Column);
      widths = cols.filter(removeRoot).map(c => findDOMNode(c).style.width);
      widths.should.eql(['20%']);
    });
  });

  describe('Applying offsets', () => {
    it('should support unit offsets', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options}>
          <Row>
            <Column offset={10} width={5}/>
          </Row>
        </Grid>
      ), rootNode);

      const cols = scryRenderedComponentsWithType(grid, Column);
      const offsets = cols.filter(removeRoot).map(c => findDOMNode(c).style.marginLeft);
      offsets.should.eql(['66.6667%']);
    });

    it('should support fractional ofsets', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options}>
          <Row>
            <Column offset="1/3" width="2/3"/>
          </Row>
        </Grid>
      ), rootNode);

      const cols = scryRenderedComponentsWithType(grid, Column);
      const offsets = cols.filter(removeRoot).map(c => findDOMNode(c).style.marginLeft);
      offsets.should.eql(['33.3333%']);
    });

    it('should support at- offsets', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options}>
          <Row>
            <Column offset={10} at10-offset={5} width={5}/>
          </Row>
        </Grid>
      ), rootNode);

      const listener = eventlistener.add.firstCall.args[2];

      let cols = scryRenderedComponentsWithType(grid, Column);
      let offsets = cols.filter(removeRoot).map(c => findDOMNode(c).style.marginLeft);
      offsets.should.eql(['66.6667%']);

      setWindowWidth(1200);
      listener();

      cols = scryRenderedComponentsWithType(grid, Column);
      offsets = cols.filter(removeRoot).map(c => findDOMNode(c).style.marginLeft);
      offsets.should.eql(['50%']);
    });
  });

  describe('classnames', () => {
    let testgrid;

    beforeEach(() => {
      testgrid = render((
        <Grid {... options} className="a">
          <Row className="b">
            <Column className="c"/>
          </Row>
        </Grid>
      ), rootNode);
    });

    it('should apply grid root class correctly', () => {
      findDOMNode(testgrid).className.should.eql('cb-grid a');
    });

    it('should apply row class correctly', () => {
      const {className} = findRenderedDOMComponentWithClass(testgrid, 'b');
      className.should.match(/\bcb-row\b/);
    });

    it('should apply column class correctly', () => {
      const {className} = findRenderedDOMComponentWithClass(testgrid, 'c');
      className.should.match(/\bcb-col\b/);
    });
  });

  describe('Flexibility', () => {
    it('should set maximum widths of rows', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options}>
          <Row>
            <Column width={5}/>
            <Column width={10}>
              <Row>
                <Column/>
              </Row>
            </Column>
          </Row>
        </Grid>
      ), rootNode);

      const rows = scryRenderedComponentsWithType(grid, Row);
      rows.map(r => findDOMNode(r).style.maxWidth).should.eql([
        '1500px',
        '1000px'
      ]);
    });

    it('should allow rows to flex', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options} flexible>
          <Row>
            <Column width={5}/>
            <Column width={10}>
              <Row>
                <Column/>
              </Row>
            </Column>
          </Row>
        </Grid>
      ), rootNode);

      const rows = scryRenderedComponentsWithType(grid, Row);
      rows.map(r => findDOMNode(r).style.maxWidth).should.eql(['','']);
    });

    it('should allow rows to flex on some breakpoints', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options} flexible={[5]}>
          <Row>
            <Column width="1/2"/>
            <Column width="1/2">
              <Row>
                <Column/>
              </Row>
            </Column>
          </Row>
        </Grid>
      ), rootNode);

      let rows = scryRenderedComponentsWithType(grid, Row);
      rows.map(r => findDOMNode(r).style.maxWidth).should.eql([
        '1500px',
        '750px'
      ]);

      const listener = eventlistener.add.firstCall.args[2];
      setWindowWidth(200);
      listener();

      rows = scryRenderedComponentsWithType(grid, Row);
      rows.map(r => findDOMNode(r).style.maxWidth).should.eql([
        '1000px',
        '500px'
      ]);
    });
  });

  describe('Observing Grid', () => {
    it('should observe column widths', () => {
      const grid = render((
        <Grid {... options} flexible>
          <Row>
            <Column width="1/5">
              <Observer extraProp/>
            </Column>
            <Column width="4/5">
              <Observer/>
              <Column width="1/2">
                <Observer/>
              </Column>
            </Column>
          </Row>
        </Grid>
      ), rootNode);
      const observers = scryRenderedComponentsWithType(grid, Module);

      observers.map(o => o.props).should.eql([
        { breakpoint: 10,
          colWidth: 2,
          colMinPixelWidth: 180,
          colMaxPixelWidth: 280,
          extraProp: true },
        { breakpoint: 10,
          colWidth: 8,
          colMinPixelWidth: 780,
          colMaxPixelWidth: 1180 },
        { breakpoint: 10,
          colWidth: 4,
          colMinPixelWidth: 380,
          colMaxPixelWidth: 580 }
      ]);

      const listener = eventlistener.add.firstCall.args[2];
      setWindowWidth(2000);
      listener();

      observers.map(o => o.props).should.eql([
        { breakpoint: 15,
          colWidth: 3,
          colMinPixelWidth: 280,
          colMaxPixelWidth: Infinity,
          extraProp: true },
        { breakpoint: 15,
          colWidth: 12,
          colMinPixelWidth: 1180,
          colMaxPixelWidth: Infinity },
        { breakpoint: 15,
          colWidth: 6,
          colMinPixelWidth: 580,
          colMaxPixelWidth: Infinity }
      ]);
    });
  });

  describe('Styles', () => {
    it('should create styles in a style tag', () => {
      const grid = render((<Grid {... options} gutterWidth={100}/>), rootNode);
      const {textContent} = findRenderedDOMComponentWithTag(grid, 'style');
      textContent.should.match(/padding-left:50px/);
      textContent.should.match(/padding-right:50px/);
      textContent.should.match(/margin-left:-50px/);
      textContent.should.match(/margin-right:-50px/);
    });
  });

  describe('Server Rendering', () => {
    let win;

    beforeEach(() => {
      win = global.window;
      delete global.window;
    });

    afterEach(() => {
      global.window = win;
    });

    it('should use initialBreakPoint', () => {
      const grid = renderToStaticMarkup((
        <Grid {... options} initialBreakPoint={5}>
          <Row/>
        </Grid>
      ), rootNode);
      grid.should.match(/style="max-width:500px;"/);
    });

    it('should use default to infinite screen size', () => {
      const grid = renderToStaticMarkup((
        <Grid {... options}>
          <Row/>
        </Grid>
      ), rootNode);
      grid.should.match(/style="max-width:1500px;"/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle non react elements as children', () => {
      const {textContent} = findDOMNode(render(<Grid {... options}>hello</Grid>, rootNode));
      textContent.should.match(/hello/);
    });

    it('should handle ie window exception', () => {
      var c = document.documentElement.clientWidth;
      delete document.documentElement.clientWidth;
      document.getElementsByTagName('body')[0].clientWidth = 800;

      const grid = render(<Grid {... options}><Observer/></Grid>, rootNode);
      const mod = findRenderedComponentWithType(grid, Module);

      mod.props.breakpoint.should.equal(5);

      document.documentElement.clientWidth = c;
    });

    it('should not let child columns be wider than their parent', () => {
      const grid = render((
        <Grid {... options} flexible={[10]}>
          <Column width={2}>
            <Column width={5} className="too-big">
              <Observer/>
            </Column>
          </Column>
        </Grid>
      ), rootNode);

      const {props} = findRenderedComponentWithType(grid, Module);

      props.should.eql({
        breakpoint: 10,
        colWidth: 2,
        colMinPixelWidth: 180,
        colMaxPixelWidth: 280
      });

      const {style} = findRenderedDOMComponentWithClass(grid, 'too-big');
      style.width.should.eql('');
    });
  });

  describe('On change support', () => {
    it('should not update unless the breakpoint changes', () => {
      const onChange = stub();
      const onUpdate = stub();
      const Module = observeGrid(React.createClass({
        componentWillReceiveProps: onUpdate,
        render() { return <div/>; }
      }));

      const grid = render((
        <Grid {... options} onChange={onChange} initialBreakPoint={5}><Module/></Grid>
      ), rootNode);

      const listener = eventlistener.add.firstCall.args[2];

      onChange.calledOnce.should.be.true();
      onUpdate.calledOnce.should.be.true();

      setWindowWidth(5000);
      listener();
      setWindowWidth(2000); // a change that doesnt cross break
      listener();

      onChange.calledTwice.should.be.true();
      onUpdate.calledTwice.should.be.true();
    });

    it('should trigger the onChange once even if initialBreakPoint matches', () => {
      const onChange = stub();
      const onUpdate = stub();
      const Module = observeGrid(React.createClass({
        componentWillReceiveProps: onUpdate,
        render() { return <div/>; }
      }));

      const grid = render((
        <Grid {... options} onChange={onChange} initialBreakPoint={10}><Module/></Grid>
      ), rootNode);

      const listener = eventlistener.add.firstCall.args[2];

      onChange.calledOnce.should.be.true();
      onUpdate.notCalled.should.be.true();
    });
  });
});

function getThreshold(breakpoint, col, gutter) {
  return (breakpoint * col) + (breakpoint * gutter);
}

function setWindowWidth(width) {
  document.documentElement.clientWidth = width;
}

function removeRoot(col) {
  return !col.props.isRoot;
}
