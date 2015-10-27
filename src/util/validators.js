
import {PropTypes} from 'react';

const FRACTION_RE = /^\d+\/\d+$/;

export function gridFraction(props, propName, componentName) {
  const value = props[propName];
  if (props[propName] && !isFraction(value)) {
    return createError(props, propName, componentName, 'expected a fraction string `a/b` (ie: 2/3)');
  }
}

export function validBreakpoint(props, propName) {
  if (typeof window === 'undefined' && !props[propName]) {
    return new Error('Isomorphic grids require an initialBreakpoint');
  }
  return PropTypes.oneOf(props.breakpoints).apply(null, arguments);
}

export function validBreakpoints(props, propName, componentName) {
  switch (true) {
    case !Array.isArray(props[propName]) || !isAllIntegers(props[propName]):
      return createError(props, propName, componentName, 'expected an array of integers');
    case !isSorted(props[propName]):
      return createError(props, propName, componentName, 'expected ascending order');
  }
}

function createError(props, propName, componentName, message) {
  const str = `Invalid prop ${propName} of value ${props[propName]} supplied to ${componentName}`;
  return new Error(str + ', ' + message);
}

function isString(v) {
  return typeof v === 'string';
}

function isNumber(v) {
  return typeof v === 'number';
}

function isFraction(v) {
  return isString(v) && FRACTION_RE.test(v);
}

function isInteger(v) {
  return isNumber(v) && (v % 1) === 0;
}

function isSorted(arr) {
  for(let i = 0; i < arr.length - 1; i += 1) {
    if(arr[i] > arr[i + 1]) return false;
  }
  return true;
}

function isAllIntegers(arr) {
  for(let i = 0; i < arr.length; i += 1) {
    if(!isInteger(arr[i])) return false;
  }
  return true;
}
