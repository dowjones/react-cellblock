
import {PropTypes} from 'react';

export default {
  cellblock: PropTypes.bool,
  cellblockGet: PropTypes.func,
  cellblockColumn: PropTypes.object,
  cellblockViewport: PropTypes.array,



  // deprecated
  addGridObserver: PropTypes.func,
  removeGridObserver: PropTypes.func,
  maxColWidth: PropTypes.number,
  colUnitWidth: PropTypes.number,
  gutterWidth: PropTypes.number,
  colWidth: PropTypes.number,
  colMinPixelWidth: PropTypes.number,
  colMaxPixelWidth: PropTypes.number,
  breakpoint: PropTypes.number
};
