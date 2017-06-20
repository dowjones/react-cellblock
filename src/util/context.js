import PropTypes from 'prop-types';

export default {
  cellblock: PropTypes.bool,
  cellblockGet: PropTypes.func,
  cellblockColumn: PropTypes.object,
  cellblockBreak: PropTypes.number // purely to identify staleness
};
