import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';
import SEO from '@/component/header/seo';
import { controlSysId, pcbChipId, testBoardId } from '@/lib/constants/products';
import { metadata } from './metadata';
import { ROUTES, idRoute } from '@/router/routes';
import { ROLES } from '@/lib/constants/roles';
import IMG from '@/lib/constants/images';
import Image from '@/component/ui/Image';

export function Home() {
  const [cookies] = useCookies(['userType']);

  return (
    <div className="flex flex-col space-y-4 md:space-y-10 lg:space-y-16 mb-16">
      <SEO title="eDroplets | Home"
        description=""
        metadata={metadata} />
      <div className="grid grid-cols-3 text-black">
        <div className="bg-[url('assets/ewod_cad.avif')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3] py-2" >
          <h1 className="text-md sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-semibold text-center">DMF<br />CAD</h1>
          <a href="http://cad.edroplets.org" target="_blank" rel="noopener noreferrer" className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold">
            DESIGN CHIP
          </a>
        </div>
        <div className="bg-[url('assets/ewod_chip.avif')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3] py-2">
          <h1 className="text-md sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-semibold text-center">Foundry<br />Service</h1>
          <NavLink to={"/fab"} className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold">FABRICATE CHIP</NavLink>
        </div>
        <div className="bg-[url('assets/control_system.avif')] bg-cover bg-no-repeat bg-center flex flex-col space-y-4 justify-center items-center w-full aspect-[4/3] py-2">
          <h1 className="text-md sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-semibold text-center">Hardware<br />Marketplace</h1>
          <NavLink to={ROUTES.Products} className="text-center py-2 lg:py-6 px-2 md:px-4 xl:px-10 bg-accent w-min md:w-max text-base md:text-lg xl:text-xl font-semibold">GET HARDWARE</NavLink>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:space-y-10 items-center">
        <NavLink to={ROUTES.Products} className="border-b-2 border-primary w-1/4 text-center sm:py-4">
          <h1 className="text-primary text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl">Products</h1>
        </NavLink>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 xl:gap-10 w-3/4 xl:w-2/3">
          <NavLink to={idRoute(ROUTES.Product, controlSysId)} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <Image src={IMG.control_system_chip} alt="Digital microfluidics control system picture" className="pointer-events-none aspect-auto" loading="lazy" />
            </figure>
            <p className="text-primary text-lg border-t-2 py-8 text-center">Digital Microfluidics Control System</p>
          </NavLink>
          <NavLink to={idRoute(ROUTES.Product, pcbChipId)} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <Image src={IMG.pcb_chip} alt="PCB-based digital microfluidics chip picture" className="pointer-events-none aspect-auto" loading="lazy"/>
            </figure>
            <p className="text-primary text-lg border-t-2 py-8 text-center">PCB-based Digital Microfluidics Chip</p>
          </NavLink>
          <NavLink to={idRoute(ROUTES.Product, testBoardId)} className="flex flex-col">
            <figure className="scale-90 hover:scale-100 duration-500 ease-in-out">
              <Image src={IMG.inspection_board} alt="Control system inspection board picture" className="pointer-events-none aspect-auto" loading="lazy"/>
            </figure>
            <p className="text-primary text-lg border-t-2 py-8 text-center">Control System Inspection Board</p>
          </NavLink>
        </div>
      </div>
    </div >
  );
}

export default Home;