
import {isInteger, isFraction} from './types';

export function numberToPercent(width, parentSpan) {
  if (width >= parentSpan) return null;
  return decimalToPercent(width / parentSpan);
}

export function stringToPercent(str) {
  return decimalToPercent(fractionToDecimal(str));
}

export function computeSpan(rawWidth, context) {
  if (isInteger(rawWidth)) {
    return smallerIntegerWidth(rawWidth, context);
  } else if (isFraction(rawWidth)) {
    return context.colWidth * fractionToDecimal(rawWidth);
  } else {
    return undefined;
  }
}

export function computeMinWidth(rawWidth, context) {
  const {colMinPixelWidth, colUnitWidth} = context;
  return computeWidth(rawWidth, context, colMinPixelWidth, colUnitWidth);
}

export function computeMaxWidth(rawWidth, context, maxColWidth) {
  const {colMaxPixelWidth, colUnitWidth} = context;
  return computeWidth(rawWidth, context, colMaxPixelWidth, maxColWidth);
}

function fractionToDecimal(v) {
  const f = v.split('/');
  return f[0] / f[1];
}

function decimalToPercent(v) {
  return parseFloat((v * 100).toFixed(4)) + '%';
}

function smallerIntegerWidth(rawWidth, context) {
  return (!context.colWidth || rawWidth < context.colWidth) ? rawWidth : context.colWidth;
}

function computeWidth(rawWidth, context, parentWidth, colWidth) {
  const {
    gutterWidth,
    breakpoint
  } = context;

  if (isInteger(rawWidth)) {
    rawWidth = smallerIntegerWidth(rawWidth, context);
    return (colWidth * rawWidth) + (gutterWidth * (rawWidth - 1));
  } else if (isFraction(rawWidth)) {
    const w = rawWidth.split('/');
    const numerator = w[0];
    const denominator = w[1];
    const childColWidth = (parentWidth - ((denominator - 1) * gutterWidth)) / denominator;
    return (numerator * childColWidth) + ((numerator - 1) * gutterWidth);
  } else {
    return undefined;
  }
}
