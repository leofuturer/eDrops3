import { Outlet } from 'react-router-dom';
import { CartContextProvider } from '@/context/CartContext';
import Footer from '../footer/Footer';
import NavTop from '../nav/NavTop';

export function Layout() {
  return (
    <div className="flex flex-col justify-between min-h-screen">
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
