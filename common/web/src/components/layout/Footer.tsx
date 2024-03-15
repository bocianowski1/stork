import { scrollToElementById } from "../../lib/utils";

export function Footer() {
  const thisYear = new Date().getFullYear();
  const product = [
    {
      name: "features",
      id: "features",
    },
    {
      name: "security",
      id: "FAQs",
    },
    {
      name: "pricing",
      id: "contact",
    },
  ];

  const support = [
    {
      name: "contact",
      id: "contact",
    },
    {
      name: "support",
      id: "FAQs",
    },
    {
      name: "availability",
      id: "FAQs",
    },
  ];

  const company = [
    {
      name: "customer stories",
      id: "",
    },
    {
      name: "about",
      id: "FAQs",
    },
  ];
  return (
    <footer className="bg-dark text-white pt-16 pb-12 space-y-12 border-t-[0.5px] border-gray">
      <div className="flex flex-col lg:flex-row justify-between gap-8 xl:gap-24">
        <div className="space-y-3 sm:space-y-6">
          <h3 className="font-bold text-3xl">BEER</h3>
          <form>
            <h4 className="font-bold">Subscribe to the newsletter</h4>
            <p>
              Get tips, technical guides, and best practices.
              <br /> Twice a month. Right in your inbox.
            </p>
            <button className="mt-6">Subscribe</button>
          </form>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-6 pr-4 lg:mt-0 lg:gap-20 xl:gap-32 text-neutral-400">
          <ul className="space-y-3">
            <li>
              <h4 className="font-semibold underline">Product</h4>
            </li>
            {product.map((li) => (
              <li
                key={li.name}
                onClick={() => scrollToElementById(li.id)}
                className="hover:cursor-pointer"
              >
                <a role="button" className="capitalize">
                  {li.name}
                </a>
              </li>
            ))}
          </ul>
          <ul className="space-y-3">
            <li>
              <h4 className="font-semibold underline">Support</h4>
            </li>
            {support.map((li) => (
              <li
                key={li.name}
                onClick={() => scrollToElementById(li.id)}
                className="hover:cursor-pointer"
              >
                <a role="button" className="capitalize">
                  {li.name}
                </a>
              </li>
            ))}
          </ul>
          <ul className="space-y-3">
            <li>
              <h4 className="font-semibold underline">Company</h4>
            </li>
            {company.map((li) => (
              <li
                key={li.name}
                onClick={() => scrollToElementById(li.id)}
                className="hover:cursor-pointer"
              >
                <a role="button" className="capitalize">
                  {li.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-neutral-500 py-2">© {thisYear} Beer</p>
    </footer>
  );
}
