import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router, Switch, Redirect, Route, Link,
} from 'react-router-dom';

import NavLeft from '../nav/NavLeft';

// This component is currently unused, page/manage/index.jsx directly uses
// nav-left instead
function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="left-nav">
        <NavLeft />
      </div>
      <div className="right-content">
        {children}
      </div>
    </div>
  );
}

export default ManageLayout;
