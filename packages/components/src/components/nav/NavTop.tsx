import Logo from "../brand/Logo";
import { NavLink } from "react-router-dom";
export function NavTop() {
  return (
    <div className="">
      <header className="flex flex-row items-center bg-primary h-[80px] w-full text-white px-32 py-8 justify-between">
        <div>
          <NavLink
            to="/"
            className="flex flex-row items-center justify-center"
          >
            <Logo /><h1 className="text-3xl font-semibold mt-4">Droplets</h1><p className="text-3xl font-normal mt-4 ml-2">Community</p>
          </NavLink>
        </div>
      </header>
    </div>
  );
}

export default NavTop;
