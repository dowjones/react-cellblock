import {PropTypes} from 'react';

const exports = {
  cellblock: PropTypes.bool,
  cellblockGet: PropTypes.func,
  cellblockColumn: PropTypes.object,
  cellblockBreak: PropTypes.number // purely to identify staleness
};

const {
  cellblock,
  cellblockGet,
  cellblockColumn,
  cellblockBreak
} = exports;

export {
  cellblock,
  cellblockGet,
  cellblockColumn,
  cellblockBreak
};

export default exports;