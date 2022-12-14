import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import NavTop from '../nav/NavTop';
import Footer from '../footer/Footer';
import CartContextProvider from '../../context/CartContext';

import SEO from '../header/SEO';
import { metadata } from './metadata';

function Layout() {

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
          <Outlet />
        </CartContextProvider>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
