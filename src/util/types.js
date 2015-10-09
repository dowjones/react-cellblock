
const FRACTION_RE = /^\d+\/\d+$/;

export function isString(v) {
  return typeof v === 'string';
}

export function isNumber(v) {
  return typeof v === 'number';
}

export function isFraction(v) {
  return isString(v) && FRACTION_RE.test(v);
}

export function isInteger(v) {
  return isNumber(v) && (v % 1) === 0;
}
