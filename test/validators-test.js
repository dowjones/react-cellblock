
import proxyquire from 'proxyquire';
import {stub} from 'sinon';

describe('Grid Type Validation', () => {
  let Types;

  beforeEach(() => {
    Types = proxyquire('../src/util/validators', {});
  });

  it('gridUnitFraction', () => {
    (Types.gridUnitFraction({prop: '10/300'}, 'prop') instanceof Error).should.be.false();
    (Types.gridUnitFraction({prop: 'a/1'}, 'prop') instanceof Error).should.be.true();
  });

  it('gridUnitInteger', () => {
    (Types.gridUnitInteger({prop: 1}, 'prop') instanceof Error).should.be.false();
    (Types.gridUnitInteger({prop: 1/4}, 'prop') instanceof Error).should.be.true();
  });

  it('gridUnit', () => {
    (Types.gridUnit({prop: '10/300'}, 'prop') instanceof Error).should.be.false();
    (Types.gridUnit({prop: 'a/1'}, 'prop') instanceof Error).should.be.true();
    (Types.gridUnit({prop: 1}, 'prop') instanceof Error).should.be.false();
    (Types.gridUnit({prop: 1/4}, 'prop') instanceof Error).should.be.true();
    (Types.gridUnit({prop: {}}, 'prop') instanceof Error).should.be.true();
    (Types.gridUnit({a: null}, 'prop') instanceof Error).should.be.false();
  });

  it('validBreakpoint', () => {
    (Types.validBreakpoint({
      prop: 1,
      breakpoints: [1, 3, 5],
    }, 'prop') instanceof Error).should.be.false();
    (Types.validBreakpoint({
      prop: 2,
      breakpoints: [1, 3, 5],
    }, 'prop') instanceof Error).should.be.true();
    (Types.validBreakpoint({
      prop: 2,
      breakpoints: null,
    }, 'prop') instanceof Error).should.be.true();
    (Types.validBreakpoint({
      breakpoints: null,
    }, 'prop') instanceof Error).should.be.false();
  });

  it('validBreakpoint server', () => {
    let win = global.window;
    delete global.window;
    (Types.validBreakpoint({
      breakpoints: null,
    }, 'prop') instanceof Error).should.be.true();
    global.window = win;
  });

  it('validBreakpoints', () => {
    (Types.validBreakpoints({
      prop: [1, 3, 5]
    }, 'prop') instanceof Error).should.be.false();
    (Types.validBreakpoints({
      prop: [1, 7, 5]
    }, 'prop') instanceof Error).should.be.true();
    (Types.validBreakpoints({
      prop: [1, '3', 5]
    }, 'prop') instanceof Error).should.be.true();
    (Types.validBreakpoints({
      prop: null
    }, 'prop') instanceof Error).should.be.true();
  });
});
