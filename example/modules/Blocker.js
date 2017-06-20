import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';

/*
 * Example of what happens if someone uses pure render mixin
 */
export default React.createClass({
  propTypes: {
    children: PropTypes.any
  },

  mixins: [PureRenderMixin],

  render: function() {
    return this.props.children;
  }
});