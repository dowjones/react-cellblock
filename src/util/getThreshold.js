
export default function getThreshold(thresholds) {
  /* eslint-disable no-empty */
  const width = getWindowWidth();
  let b = thresholds.length;
  while (--b && width < thresholds[b]) {}
  return b;
}

// using documentElement because
// clientWidth doesnt subtract the scroll bar
function getWindowWidth() {
  if (typeof window === 'undefined') return Infinity;
  return document.documentElement.clientWidth ||
    document.getElementsByTagName('body')[0].clientWidth;
}