import { Outlet } from 'react-router-dom';
import CartContextProvider from '../../context/CartContext';
import Footer from '../footer/Footer';
import SEO from '../header/SEO';
import NavTop from '../nav/NavTop';
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
        <CartContextProvider>
          <NavTop />
          <Outlet />
        </CartContextProvider>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
