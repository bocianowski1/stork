import React from "react";
import { Link } from "react-router-dom";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { scrollToElementById } from "../../lib/utils";

export function Header({
  showSideNavbar,
  setShowSideNavbar,
}: {
  showSideNavbar: boolean;
  setShowSideNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const list = ["features", "contact", "FAQs"];
  return (
    <header className="bg-radial flex justify-between items-center h-[100px]">
      <Link to="/">
        <h1>BEER</h1>
      </Link>
      <div
        className="md:hidden z-50 p-1 lg:z-0 cursor-pointer 
                  hover:text-primary transition-colors duration-300"
        onClick={() => setShowSideNavbar((s: boolean) => !s)}
      >
        {showSideNavbar ? <IoIosClose size={40} /> : <IoIosMenu size={40} />}
      </div>
      <nav className="top-nav">
        <ul className="flex justify-between items-center font-semibold text-lg">
          {list.map((li) => (
            <li key={li} onClick={() => scrollToElementById(li)}>
              <a role="button" className="capitalize py-3 px-6 lg:px-12">
                {li}
              </a>
            </li>
          ))}
          <li>
            <Link to="/dashboard">
              <p className="hover:underline text-dark capitalize py-3 px-6 lg:px-12">
                Dashboard
              </p>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
