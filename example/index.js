
import './style/reset.scss';
import './style/style.scss';
import React from 'react';
import {render} from 'react-dom';
import Layout from './Layout';

render(<Layout onChange={function (breakpoint) {
  console.log('[Grid] breakpoint:', breakpoint);
}}/>, document.getElementById('container'));
