
import proxyquire from 'proxyquire';
import {stub} from 'sinon';
import React, {PropTypes} from 'react';
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
            <Column width="1/3"/>
            <Column width="2/3"/>
          </Row>
        </Grid>
      ), rootNode);

      const cols = scryRenderedComponentsWithType(grid, Column);
      const widths = cols.filter(removeRoot).map(c => findDOMNode(c).style.width);

      widths.should.eql([
        '100%',
        '33.3333%',
        '66.6667%'
      ]);
    });
  });

  describe('Applying offsets', () => {
    it('should support fractional offsets', () => {
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
            <Column width="1/3"/>
            <Column width="2/3">
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
        ''
      ]);
    });

    it('should allow rows to flex', () => {
      setWindowWidth(100);
      const grid = render((
        <Grid {... options} flexible>
          <Row>
            <Column width="1/3"/>
            <Column width="2/3">
              <Row>
                <Column/>
              </Row>
            </Column>
          </Row>
        </Grid>
      ), rootNode);

      const rows = scryRenderedComponentsWithType(grid, Row);
      rows.map(r => findDOMNode(r).style.maxWidth).should.eql(['1000px','']);
    });

    it('should not allow infinite flex', () => {
      setWindowWidth(2000);
      const grid = render((
        <Grid {... options} flexible>
          <Row>
            <Column width="1/3"/>
            <Column width="2/3">
              <Row>
                <Column/>
              </Row>
            </Column>
          </Row>
        </Grid>
      ), rootNode);

      const rows = scryRenderedComponentsWithType(grid, Row);
      rows.map(r => findDOMNode(r).style.maxWidth).should.eql(['1500px','']);
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
        ''
      ]);

      const listener = eventlistener.add.firstCall.args[2];
      setWindowWidth(200);
      listener();

      rows = scryRenderedComponentsWithType(grid, Row);
      rows.map(r => findDOMNode(r).style.maxWidth).should.eql([
        '1000px',
        ''
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
          colMaxPixelWidth: 280,
          extraProp: true },
        { breakpoint: 15,
          colWidth: 12,
          colMinPixelWidth: 1180,
          colMaxPixelWidth: 1180 },
        { breakpoint: 15,
          colWidth: 6,
          colMinPixelWidth: 580,
          colMaxPixelWidth: 580 }
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

    it('should use initialBreakpoint', () => {
      const grid = renderToStaticMarkup((
        <Grid {... options} initialBreakpoint={5}>
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
  });

  describe('On change support', () => {
    it('should not update unless the breakpoint changes', () => {
      const onChange = stub();
      const onUpdate = stub();
      const Module = observeGrid(React.createClass({
        componentDidUpdate: onUpdate,
        render() { return <div/>; }
      }));

      const grid = render((
        <Grid {... options} onChange={onChange} initialBreakpoint={5}>
          <Row>
            <Column>
              <Module/>
            </Column>
          </Row>
        </Grid>
      ), rootNode);

      const listener = eventlistener.add.firstCall.args[2];

      onChange.calledOnce.should.be.true();
      onUpdate.calledOnce.should.be.true();

      setWindowWidth(5000);
      listener();
      setWindowWidth(2000); // a change that doesnt cross break
      listener();

      onChange.calledTwice.should.be.true();
      onUpdate.calledTwice.should.be.true(); // breakpoint updated twice
    });

    it('should trigger the onChange once even if initialBreakpoint matches', () => {
      const onChange = stub();
      const onUpdate = stub();
      const Module = observeGrid(React.createClass({
        componentWillReceiveProps: onUpdate,
        render() { return <div/>; }
      }));

      const grid = render((
        <Grid {... options} onChange={onChange} initialBreakpoint={10}><Module/></Grid>
      ), rootNode);

      const listener = eventlistener.add.firstCall.args[2];

      onChange.calledOnce.should.be.true();
      onUpdate.notCalled.should.be.true();
    });
  });

  describe('shouldComponentUpdate', () => {
    it('should get around shouldUpdate when the owner blocks', () => {
      setWindowWidth(2000);

      const Optimized = React.createClass({
        shouldComponentUpdate() {return false},
        render() {
          return (
            <Row>
              <Column width="1/2">
                <Observer/>
              </Column>
            </Row>
          );
        }
      });

      const grid = render((
        <Grid {... options}>
          <Optimized/>
        </Grid>
      ), rootNode);

      const observer = findRenderedComponentWithType(grid, Module);

      // before update
      observer.props.should.eql({
        breakpoint: 15,
        colMaxPixelWidth: 730,
        colMinPixelWidth: 730,
        colWidth: 7.5,
      });

      // change to smaller breakpoint
      const listener = eventlistener.add.firstCall.args[2]
      setWindowWidth(1000);
      listener();

      observer.props.should.eql({
        breakpoint: 10,
        colMaxPixelWidth: 480,
        colMinPixelWidth: 480,
        colWidth: 5,
      });

      // change window back to make sure it works both directions
      setWindowWidth(2000);
      listener();

      // after 2nd update
      observer.props.should.eql({
        breakpoint: 15,
        colMaxPixelWidth: 730,
        colMinPixelWidth: 730,
        colWidth: 7.5,
      });
    });

    it('should get around shouldUpdate when the parent blocks', () => {
      setWindowWidth(2000);

      const Blocker = React.createClass({
        propTypes: {children: PropTypes.any},
        shouldComponentUpdate() {return false},
        render() {
          return <div>{this.props.children}</div>;
        }
      });

      const grid = render((
        <Grid {... options}>
          <Blocker>
            <Row>
              <Column width="1/2">
                <Observer/>
              </Column>
            </Row>
          </Blocker>
        </Grid>
      ), rootNode);

      const observer = findRenderedComponentWithType(grid, Module);

      // before update
      observer.props.should.eql({
        breakpoint: 15,
        colMaxPixelWidth: 730,
        colMinPixelWidth: 730,
        colWidth: 7.5,
      });

      // change to smaller breakpoint
      const listener = eventlistener.add.firstCall.args[2]
      setWindowWidth(1000);
      listener();

      observer.props.should.eql({
        breakpoint: 10,
        colMaxPixelWidth: 480,
        colMinPixelWidth: 480,
        colWidth: 5,
      });

      // change window back to make sure it works both directions
      setWindowWidth(2000);
      listener();

      // after 2nd update
      observer.props.should.eql({
        breakpoint: 15,
        colMaxPixelWidth: 730,
        colMinPixelWidth: 730,
        colWidth: 7.5,
      });
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
