import { scrollToElementById } from "../../lib/utils";

export function Navbar({ show }: { show: boolean }) {
  const list = ["product", "features", "contact", "FAQs"];
  return (
    <nav
      className={`${
        show ? "translate-y-0" : "-translate-y-44"
      } z-50 fixed top-0 left-0 right-0 h-[80px] bg-dark text-white transition-transform duration-500 ease-in-out`}
    >
      <ul className="flex items-center justify-center py-6 px-4 lg:px-20 xl:px-32 2xl:px-64 font-semibold sm:text-lg">
        {list.map((li) => {
          return (
            <li
              key={li}
              onClick={() => {
                if (li === "product") {
                  window.scrollTo(0, 0);
                } else scrollToElementById(li);
              }}
              className="hover:cursor-pointer"
            >
              <a
                role="button"
                className="capitalize py-3 px-4 sm:px-12 md:px-16 lg:px-24"
              >
                {li}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
