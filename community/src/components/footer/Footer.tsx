import { NavLink } from 'react-router-dom';
import { ROUTES, idRoute } from '@/router/routes';

function FooterPage() {
  return (
    <footer className="grid grid-cols-3 md:grid-cols-3 justify-items-center mx-4 md:mx-[16%] text-[12px] border-t py-8 gap-2 md:gap-8" style={{ height: '200px' }}>
      <div className="flex flex-col items-center space-y-2">
        <img className="max-h-[50px] mr-[10px]" src="img/edroplets-logo.png" alt="" />
        <h3 className="text-[26px] font-bold">eDroplets</h3>
        <p>
          &copy; eDroplets 2018-2023
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <h3 className="pt-[6px] text-[18px] font-bold">Contact</h3>
        <div className="flex flex-col text-center items-center">
          {/* <p>Phone: +1 234-567-8999</p> */}
          <a href="mailto:info@edroplets.org" className="text-primary">Email: info@edroplets.org</a>
        </div>
        <div className="flex flex-col items-center">
          <p>420 Westwood Plaza</p>
          <p>Los Angeles, CA 90095</p>
          <p>United States</p>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4 w-full">
        <h3 className="pt-[6px] text-[18px] font-bold">About Us</h3>
        <p className="px-10">
          This is a community networking site for the EWOD cybermanufacturing 
          ecosystem, which is still under construction. We're working hard to
          build a fully-functional site that can help grow
          the field of digital microfluidics.
        </p>
      </div>
    </footer>
  );
}

export default FooterPage;