import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ROW, COL} from './constants';

const Style = (props) => {
  const ctx = props.ctx;
  const gutter = props.gutter / 2;
  const style = `
    .${ctx} .${ROW}:after, .${ctx} .${COL}:after{content:'';display:block;height:0;visibility:hidden;clear:both;}
    .${ctx} .${ROW}{margin-left:auto;margin-right:auto;width:100%;}
    .${ctx} .${COL}{box-sizing:border-box;width:100%;max-width:100%;float:left;min-height:1px;}
    .${ctx} .${COL}{padding-left:${gutter}px;padding-right:${gutter}px;}
    .${ctx} .${COL} .${ROW}{margin-left:-${gutter}px;margin-right:-${gutter}px;width:auto;}
  `;
  return <style dangerouslySetInnerHTML={{__html: style}}/>;
}

Style.propTypes = {
  ctx: PropTypes.string,
  gutter: PropTypes.number
}

export default Style;
