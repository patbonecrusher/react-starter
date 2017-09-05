
import React  from 'react';
import LoadTransitionHack from './LoadTransitionHack';

import './App.less';

const App = function () {
  return (
    <LoadTransitionHack>
      <div className='hello'><span>Hello world</span></div>
    </LoadTransitionHack>
  );
};

export default App();
