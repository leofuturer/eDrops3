import { NavLink } from 'react-router-dom';
import { controlSysId, pcbChipId } from '../../lib/constants/products';

function FooterPage() {
  const controlSysPageLink = `/product?id=${controlSysId}`;
  const pcbChipPageLink = `/product?id=${pcbChipId}`;
  
  return (
    <footer className="grid grid-cols-4 justify-items-center mx-[16%] text-[12px] border-t py-10 gap-8">
      <div className="flex flex-col items-center space-y-4">
        <img className="max-h-[50px] mr-[10px]" src="/img/edrop_logo.png" alt="" />
        <h3 className="text-[26px] font-bold">eDrops</h3>
        {/* <p className="i-p"> */}
        {/* <i className="fa fa-twitter"></i> */}
        {/* <i className="fa fa-facebook"></i> */}
        {/* <i className="fa fa-youtube"></i> */}
        {/* </p> */}
        <p>
          &copy; eDrops 2018-2022
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <h3 className="pt-[6px] text-[18px] font-bold">Contact</h3>
        <div className="flex flex-col items-center">
          {/* <p>Phone: +1 234-567-8999</p> */}
          <a href="mailto:service@edrops.org" className="text-primary">Email: service@edrops.org</a>
        </div>
        <div className="flex flex-col items-center">
          <p>420 Westwood Plaza</p>
          <p>Los Angeles, CA 90095</p>
          <p>United States</p>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-4 w-full">
        <h3 className="pt-[6px] text-[18px] font-bold">About Us</h3>
        <p className="text-justify px-8">
          This is a portal site for the EWOD cybermanufacturing ecosystem,
          which is still under construction. We're working hard to
          building a fully-functional site that can help grow
          the field of digital microfluidics.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4 w-full">
        <h3 className="pt-[6px] text-[18px] font-bold">Featured Products</h3>
        <div className="w-full">
          <NavLink to={controlSysPageLink} className="flex flex-row justify-between border-b items-center py-2">
            <p className="text-primary">Digital Microfluidics Control System</p>
            <img
              className="h-10 w-10 aspect-square"
              src="/img/controlsystem.jpg"
              alt="Digital Microfluidics Control System"
            />
          </NavLink>
          <NavLink to={pcbChipPageLink} className="flex flex-row justify-between border-b items-center py-2">
            <p className="text-primary">PCB-based Digital Microfluidics Chip</p>
            <img
              className="h-10 w-10 aspect-square"
              src="/img/pcb_chip_compressed.jpg"
              alt="PCB-based Digital Microfluidics Chip"
            />
          </NavLink>
        </div>

      </div>
    </footer>
  );
}

export default FooterPage;