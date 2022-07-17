import React, { useState } from "react";
import logo from "../../static/img/edrop_logo_inverted.png";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserIcon } from "@heroicons/react/solid";
import { signout } from "../lib/auth";

function NavTop() {
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);

  function handleLogout() {
    signout().then(() => navigate("/home"));
  }

  const notLoggedIn = Cookies.get("username") === undefined;
  return (
    <div className="">
      <header className="flex flex-row items-center bg-sky-800 h-[80px] w-full text-white px-4 justify-between">
        <div id="navLeft">
          <NavLink to="/" className="flex flex-row items-center justify-center">
            <h1 className="text-2xl">eDrops Community</h1>
            <img src={logo} alt="eDrops Logo" className="max-h-[50px]" />
          </NavLink>
        </div>
        <div
          id="navRight"
          className="flex flex-row items-center justify-center space-x-8"
        >
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/forum">Forum</NavLink>
          {notLoggedIn ? (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <NavLink to="/signup">Sign up</NavLink>
            </>
          ) : (
            <>
              <button
                onClick={() => setDropdown(!dropdown)}
                className="flex flex-row space-x-2"
              >
                <UserIcon className="h-5 w-5" />
                <p>{Cookies.get("username")}</p>
              </button>
              {dropdown && (
                <div className="absolute top-24 right-4 flex flex-col bg-sky-800 text-white p-4 rounded-lg shadow-lg">
                  <NavLink to="/profile">Profile</NavLink>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default NavTop;
