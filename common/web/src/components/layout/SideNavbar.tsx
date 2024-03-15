// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState } from "react";
import { scrollToElementById } from "../../lib/utils";

export function SideNavbar({
  showSideNavbar,
  setShowSideNavbar,
}: {
  showSideNavbar: boolean;
  setShowSideNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isRightSwipe) setShowSideNavbar(false);
  };
  const list = ["product", "features", "contact", "FAQs"];
  const delays = ["delay-75", "delay-150", "delay-200", "delay-300"];
  return (
    <nav
      className={`md:hidden bg-gradient-to-l from-purple-100 to-offwhite 
          z-40 absolute top-0 bottom-0 right-0 overflow-y-hidden
          w-full sm:w-1/3 bg-white border-l border-dark shadow-lg
          transition-transform duration-500 transform ${
            showSideNavbar ? "translate-x-0" : "translate-x-[600px]"
          }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: showSideNavbar ? "none" : "auto" }}
    >
      <ul className="flex flex-col h-full gap-6 pt-16 font-semibold sm:text-lg">
        <li
          className={`${
            showSideNavbar
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-20"
          } transition-all duration-500 delay-75 ease-in
          py-3 px-6 -mb-6`}
        >
          {showSideNavbar && <h2>Menu</h2>}
        </li>
        {list.map((li, i) => (
          <li
            key={li}
            onClick={() => {
              scrollToElementById(li);
              setShowSideNavbar(false);
            }}
            className={`${
              showSideNavbar ? "translate-x-0" : "translate-x-96"
            } py-2 transition-transform duration-500 ${
              delays[i]
            } transform hover:cursor-pointer`}
          >
            {showSideNavbar && (
              <a href="#" className="capitalize py-3 px-6 lg:px-12">
                {li}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
