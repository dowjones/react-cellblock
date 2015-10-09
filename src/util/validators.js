
import {isNumber, isString, isFraction, isInteger} from './types';
import {PropTypes} from 'react';

export function gridUnitFraction(props, propName, componentName) {
  const value = props[propName];
  if (!isFraction(value)) {
    return createError(props, propName, componentName, 'expected a fraction string `a/b` (ie: 2/3)');
  }
}

export function gridUnitInteger(props, propName, componentName) {
  const value = props[propName];
  if (!isInteger(value))
    return createError(props, propName, componentName, 'expected an integer');
}

export function gridUnit(props, propName, componentName) {
  switch (true) {
    case isString(props[propName]):
      return gridUnitFraction(props, propName, componentName);
    case isNumber(props[propName]):
      return gridUnitInteger(props, propName, componentName);
    case props.hasOwnProperty(propName):
      return createError(props, propName, componentName, 'expected a fraction string or integer');
  }
}

export function validBreakPoint(props, propName) {
  if (typeof window === 'undefined' && !props[propName]) {
    return new Error('Isomorphic grids require an initialBreakPoint');
  }
  return PropTypes.oneOf(props.breakPoints).apply(null, arguments);
}

export function validBreakPoints(props, propName, componentName) {
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
