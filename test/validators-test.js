
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

  it('validBreakPoint', () => {
    (Types.validBreakPoint({
      prop: 1,
      breakPoints: [1, 3, 5],
    }, 'prop') instanceof Error).should.be.false();
    (Types.validBreakPoint({
      prop: 2,
      breakPoints: [1, 3, 5],
    }, 'prop') instanceof Error).should.be.true();
    (Types.validBreakPoint({
      prop: 2,
      breakPoints: null,
    }, 'prop') instanceof Error).should.be.true();
    (Types.validBreakPoint({
      breakPoints: null,
    }, 'prop') instanceof Error).should.be.false();
  });

  it('validBreakPoint server', () => {
    let win = global.window;
    delete global.window;
    (Types.validBreakPoint({
      breakPoints: null,
    }, 'prop') instanceof Error).should.be.true();
    global.window = win;
  });

  it('validBreakPoints', () => {
    (Types.validBreakPoints({
      prop: [1, 3, 5]
    }, 'prop') instanceof Error).should.be.false();
    (Types.validBreakPoints({
      prop: [1, 7, 5]
    }, 'prop') instanceof Error).should.be.true();
    (Types.validBreakPoints({
      prop: [1, '3', 5]
    }, 'prop') instanceof Error).should.be.true();
    (Types.validBreakPoints({
      prop: null
    }, 'prop') instanceof Error).should.be.true();
  });
});
