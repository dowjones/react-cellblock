import React, {Component, PropTypes} from 'react';
import {ROW, COL} from './constants';

export default class Style extends Component {
  static propTypes() {
    return {
      gutter: PropTypes.number
    };
  }

  render() {
    const gutter = this.props.gutter / 2;
    const style = `
      .${ROW}:after, .${COL}:after{content:'';display:block;height:0;visibility:hidden;clear:both;}
      .${ROW}{margin-left:auto;margin-right:auto;width:100%;}
      .${COL}{box-sizing:border-box;-ms-box-sizing:border-box;-moz-box-sizing:border-box;width:100%;max-width:100%;float:left;min-height:1px;}
      .${COL}{padding-left:${gutter}px;padding-right:${gutter}px;}
      .${COL} .${ROW}{margin-left:-${gutter}px;margin-right:-${gutter}px;width:auto;}
    `;
    return <style dangerouslySetInnerHTML={{__html: style}}/>;
  }
}
