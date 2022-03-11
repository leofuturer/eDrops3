import React from 'react';

import NavTop from 'component/nav-top/index.jsx';
import Footer from 'component/footer/index.jsx';

import './index.css';
import SEO from '../header/seo.jsx';
import { metadata } from './metadata.jsx';

class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="layout">
        <SEO title="eDrops"
          description=""
          metadata={metadata} />
        <div className="content">
          <div className="wrapper">
            <NavTop />
            {this.props.children}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Layout;
