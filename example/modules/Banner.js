
import React from 'react';
import {observeGrid} from '../../src';
import classnames from 'classnames';

export default observeGrid(function Banner({breakPoint, className, children}) {
  return (
    <div className={classnames('banner', className)}>
      <h2>{children}</h2>
      Current breakpoint: {breakPoint}
    </div>
  );
});
