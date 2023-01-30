import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import SEO from '../../component/header/seo';
import { controlSysId, pcbChipId, testBoardId } from '../../lib/constants/products';
import { metadata } from './metadata';

function Home() {
  const controlSysPageLink = `/product?id=${controlSysId}`;
  const pcbChipPageLink = `/product?id=${pcbChipId}`;
  const testBoardPageLink = `/product?id=${testBoardId}`;

  const [cookies] = useCookies(['userType']);

  return (
    <div className="flex flex-col space-y-16 mb-16">
      <SEO title="eDrops | Home"
        description=""
        metadata={metadata} />
      <div className="grid grid-cols-3 text-black">
        <div className="bg-[url('/img/EWOD-CAD.png')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3]" >
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold text-center">DMF<br />CAD</h1>
          <a href="http://cad.edrops.org" target="_blank" rel="noopener noreferrer" className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold">
            DESIGN CHIP
          </a>
        </div>
        <div className="bg-[url('/img/EWOD-chip-compressed.png')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3]">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold text-center">Foundry<br />Service</h1>
          <NavLink to={cookies.userType === 'customer' ? "/upload" : "/login"} className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold">UPLOAD FILE</NavLink>
        </div>
        <div className="bg-[url('/img/control-system-compressed.png')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3]">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold text-center">DMF<br />Control System</h1>
          <NavLink to={controlSysPageLink} className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold">VIEW DETAILS</NavLink>
        </div>
      </div>

      <div className="flex flex-col space-y-10 items-center">
        <NavLink to="/allItems" className="border-b-2 border-secondary w-1/4 text-center py-4">
          <h1 className="text-secondary text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl">Products</h1>
        </NavLink>
        <div className="grid grid-cols-3 gap-10 w-2/3">
          <NavLink to={controlSysPageLink} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <img src="/img/controlsystem.jpg" alt="Digital Microfluidics Control System" className="pointer-events-none" />
            </figure>
            <h4 className="text-primary_light text-lg border-t-2 py-8 text-center">Digital Microfluidics Control System</h4>
          </NavLink>
          <NavLink to={pcbChipPageLink} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <img src="/img/pcb_chip_compressed.jpg" alt="PCB-based Digital Microfluidics Chip" className="pointer-events-none" />
            </figure>
            <h4 className="text-primary_light text-lg border-t-2 py-8 text-center">PCB-based Digital Microfluidics Chip</h4>
          </NavLink>
          <NavLink to={testBoardPageLink} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <img src="/img/control_board_compressed.jpg" alt="Control System Inspection Board" className="pointer-events-none" />
            </figure>
            <h4 className="text-primary_light text-lg border-t-2 py-8 text-center">Control System Inspection Board</h4>
          </NavLink>
        </div>
      </div>
    </div >
  );
}

export default Home;