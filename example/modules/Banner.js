
import React from 'react';
import {observeGrid} from '../../src';
import classnames from 'classnames';

export default observeGrid(({breakpoint, className, children}) => {
  return (
    <div className={classnames('banner', className)}>
      <h2>{children}</h2>
      Current breakpoint: {breakpoint}
    </div>
  );
});
