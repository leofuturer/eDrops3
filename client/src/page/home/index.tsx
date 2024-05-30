import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import SEO from '@/component/header/seo';
import { controlSysId, pcbChipId, testBoardId } from '@/lib/constants/products';
import { metadata } from './metadata';
import { ROUTES, idRoute } from '@/router/routes';
import { ROLES } from '@/lib/constants/roles';

export function Home() {
  const [cookies] = useCookies(['userType']);

  //For hyperlink transitions
  const handleMouseOver = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const target = e.target as HTMLAnchorElement;
    target.style.opacity = '1';
    target.style.fontSize = '1.5rem';
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const target = e.target as HTMLAnchorElement;
    target.style.opacity = '0.74';
    target.style.fontSize = '1.3rem';
  };

  return (
    <div className="flex flex-col space-y-4 md:space-y-10 lg:space-y-16 mb-16">
      <SEO title="eDroplets | Home"
        description=""
        metadata={metadata} />
      <div className="grid grid-cols-3 text-black">
        <div className="bg-[url('/img/EWOD-CAD.png')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3] py-2" >
          <h1 className="text-md sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-semibold text-center">DMF<br />CAD</h1>
          <a href="http://cad.edroplets.org" target="_blank" rel="noopener noreferrer" className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold" style={{ transition: "0.3s ease", opacity: 0.74}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            DESIGN CHIP
          </a>
        </div>
        <div className="bg-[url('/img/EWOD-chip-compressed.png')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3] py-2">
          <h1 className="text-md sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-semibold text-center">Foundry<br />Service</h1>
          <NavLink to={cookies.userType === ROLES.Customer ? "/upload" : "/login"} className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold" style={{ transition: "0.3s ease", opacity: 0.74}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>UPLOAD FILE</NavLink>
        </div>
        <div className="bg-[url('/img/control-system-compressed.png')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3] py-2">
          <h1 className="text-md sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-semibold text-center">DMF<br />Control System</h1>
          <NavLink to={idRoute(ROUTES.Product, controlSysId)} className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold" style={{ transition: "0.3s ease", opacity: 0.74}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>VIEW DETAILS</NavLink>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:space-y-10 items-center">
        <NavLink to={ROUTES.Products} className="border-b-2 border-secondary w-1/4 text-center sm:py-4">
          <h1 className="text-secondary text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl">Products</h1>
        </NavLink>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-10 w-3/4 xl:w-2/3">
          <NavLink to={idRoute(ROUTES.Product, controlSysId)} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <img src="/img/control-system.webp" alt="Digital Microfluidics Control System" className="pointer-events-none" />
            </figure>
            <h4 className="text-primary_light text-lg border-t-2 py-8 text-center">Digital Microfluidics Control System</h4>
          </NavLink>
          <NavLink to={idRoute(ROUTES.Product, pcbChipId)} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <img src="/img/pcb_chip.webp" alt="PCB-based Digital Microfluidics Chip" className="pointer-events-none" />
            </figure>
            <h4 className="text-primary_light text-lg border-t-2 py-8 text-center">PCB-based Digital Microfluidics Chip</h4>
          </NavLink>
          <NavLink to={idRoute(ROUTES.Product, testBoardId)} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <img src="/img/inspection_board.webp" alt="Control System Inspection Board" className="pointer-events-none" />
            </figure>
            <h4 className="text-primary_light text-lg border-t-2 py-8 text-center">Control System Inspection Board</h4>
          </NavLink>
        </div>
      </div>
    </div >
  );
}

export default Home;