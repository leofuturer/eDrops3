import React, { useState } from 'react';

import NavTop from '../nav-top/index';
import Footer from '../footer/index';
import CartContextProvider from '../../context/CartContext';

import './index.css';
import SEO from '../header/seo';
import { metadata } from './metadata';

function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <SEO
        title="eDrops"
        description=""
        metadata={metadata}
      />
      <div className="min-h-full h-full">
        <CartContextProvider
        >
          <NavTop />
          {children}
        </CartContextProvider>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
