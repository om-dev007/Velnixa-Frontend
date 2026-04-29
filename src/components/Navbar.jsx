import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Menu,
  X,
  UserRound,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const Navbar = () => {

  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
        <div className="flex items-center justify-between h-16">

          <NavLink to="/" className="flex items-center">
            <span className="font-serif text-4xl sm:text-5xl text-[#1F3D2B]">V</span>
            <span className="font-semibold text-xl sm:text-2xl text-[#1F3D2B]">elnixa</span>
          </NavLink>

          <div className="hidden sm:flex gap-8 text-sm sm:text-base font-medium">
            <NavItem to="/" label="Home" />
            <NavItem to="/mens" label="Men" />
            <NavItem to="/womens" label="Women" />
            <NavItem to="/kids" label="Kids" />
          </div>

          <div className="hidden sm:flex items-center gap-5">

            <NavIcon to="/like" icon={<Heart />} />

            {loading ? (
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
            ) : !user ? (
              <NavIcon to="/login" icon={<UserRound />} />
            ) : (
              <NavIcon to="/user" icon={<LayoutDashboard />} />
            )}

            <NavIcon to="/cart" icon={<ShoppingCart />} />

          </div>

          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden text-[#1F3D2B]"
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>
      </nav>

      <div
        className={`
        sm:hidden fixed top-0 left-0 w-full h-screen bg-white z-40
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-y-0" : "-translate-y-full"}
      `}
      >

        <div className="flex items-center justify-between px-5 h-16 border-b">

          <div className="flex items-center">
            <span className="font-serif text-3xl text-[#1F3D2B]">V</span>
            <span className="font-semibold text-lg text-[#1F3D2B]">elnixa</span>
          </div>

          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>

        </div>

        <div className="px-6 pt-8 flex flex-col gap-6 text-base font-medium">
          <MobileNavItem to="/" label="Home" onClick={() => setOpen(false)} />
          <MobileNavItem to="/mens" label="Men" onClick={() => setOpen(false)} />
          <MobileNavItem to="/womens" label="Women" onClick={() => setOpen(false)} />
          <MobileNavItem to="/kids" label="Kids" onClick={() => setOpen(false)} />
        </div>

        <div className="mt-10 px-6 pt-6 border-t flex gap-8">

          <NavIcon to="/like" icon={<Heart size={22} />} />

          {loading ? (
            <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
          ) : !user ? (
            <NavIcon to="/login" icon={<UserRound size={22} />} />
          ) : (
            <NavIcon to="/dashboard" icon={<LayoutDashboard size={22} />} />
          )}

          <NavIcon to="/cart" icon={<ShoppingCart size={22} />} />

        </div>

      </div>
    </header>
  );
};

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      relative pb-1 transition
      ${isActive ? "text-[#1F3D2B] font-semibold" : "text-[#6B7280]"}
      hover:text-[#2F6B4F]
      after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full
      after:bg-[#1F3D2B] after:transition-transform
      ${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}
    `}
  >
    {label}
  </NavLink>
);


const MobileNavItem = ({ to, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `py-2 ${isActive ? "text-[#1F3D2B] font-semibold" : "text-gray-600"}`
    }
  >
    {label}
  </NavLink>
);

const NavIcon = ({ to, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${isActive ? "text-[#1F3D2B]" : "text-[#6B7280]"} hover:text-[#2F6B4F]}`
    }
  >
    {icon}
  </NavLink>
);

export default Navbar;