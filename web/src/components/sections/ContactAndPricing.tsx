import { useApp } from "../../context/app";
import { SubmitForm } from "../SubmitForm";

export function ContactAndPricing() {
  const { order, isFeatureSelected, getOrderTotal } = useApp();
  return (
    <div className="bg-primary text-white">
      <h2>Submit Contact and Pricing</h2>
      <p className="text-offwhite mb-8">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim nam,
        repellat libero ratione et quibusdam excepturi beatae! Quo non odit
        magni velit nihil repudiandae quas similique quaerat? Adipisci dolor
        natus veritatis hic obcaecati nemo sunt, dolorem illo. Laudantium
        explicabo omnis blanditiis est! Commodi accusantium odit voluptatem
        necessitatibus cum, tempore corrupti id aliquid earum nisi modi, quidem
        ut impedit libero numquam reprehenderit saepe corporis dolores
        laboriosam ipsum ab facilis explicabo quia. Consequatur, eaque expedita.
        Unde sunt nisi rerum explicabo deleniti ex perferendis ratione
        obcaecati.
      </p>
      <div className="sm:flex sm:flex-col lg:flex-row w-full justify-between gap-x-12 mt-16 xl:px-20">
        {getOrderTotal() > 0 && (
          <div className="mb-20 pr-8 flex flex-col gap-4 lg:w-1/2">
            <div className="flex justify-between border-b border-white">
              <h3>Estimated Total</h3>
              <h3>{getOrderTotal()}</h3>
            </div>

            <div className="space-y-3 divide-y divide-white">
              {order.features.map((feature) => {
                if (!isFeatureSelected(feature.name)) return null;
                return (
                  <div key={feature.name} className="pt-2">
                    <div className="flex justify-between">
                      <h4>{feature.fullName}</h4>
                      <h4>{feature.basePrice}</h4>
                    </div>
                    <ul className="space-y-1">
                      {feature.options.map((option) => {
                        if (!option.isSelected) return null;
                        return (
                          <li
                            key={option.name}
                            className="flex justify-between"
                          >
                            <span>{option.fullName}</span>
                            <span>{option.price}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              <div className="flex justify-between pt-2">
                <h4>Total</h4>
                <h4>{getOrderTotal()}</h4>
              </div>
            </div>
          </div>
        )}
        <SubmitForm />
      </div>
    </div>
  );
}
