import { IconImage } from "../IconImage";
import { useApp } from "../../context/app";
import { OrderFeature, FeatureOption } from "../../lib/types";
import { CheckBox } from "../CheckBox";

export function FeatureSelection() {
  const { toggleFeatureOption, isFeatureSelected, features } = useApp();

  return (
    <div className="bg-offwhite text-dark">
      <h2>Feature Selection</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla,
        necessitatibus! Mollitia dolore tempora labore. Nisi vitae minus modi
        doloribus quasi enim velit error tempore voluptate temporibus magnam quo
        delectus provident atque optio, cupiditate nam reiciendis dignissimos
        ipsum facere earum, illo aliquam. Quasi tenetur impedit delectus,
        pariatur, esse nesciunt eaque ut ipsam id consequuntur facere odit enim
        expedita sint repellat at accusantium molestiae doloremque ullam
        incidunt. Blanditiis minima quia alias quos explicabo vitae assumenda
        delectus ipsa fugiat atque esse ex, culpa, harum ullam voluptatum odio
        optio magnam quaerat, architecto officiis!
      </p>

      <div className="my-12 w-full flex flex-col items-center gap-12 md:gap-20 lg:pl-8 lg:pr-20 xl:pl-12 xl:pr:24">
        {features &&
          features.map((feature: OrderFeature) => (
            <div
              id={feature.name}
              key={feature.name}
              className={`flex flex-col gap-6 lg:grid lg:grid-cols-3 w-full xl:w-[95%] lg:divide-x lg:divide-gray 
                        px-6 md:px-8 pt-8 pb-12 transition-all duration-200
                        rounded-md hover:border hover:border-gray hover:shadow-xl
                        ${
                          isFeatureSelected(feature.name)
                            ? "border border-primary shadow-xl bg-selected"
                            : "shadow-none"
                        }`}
            >
              <div className="lg:col-span-1 mr-8">
                <p className="capitalize">{feature.category}</p>
                <h3>{feature.fullName}</h3>
                <p>{feature.description}</p>
              </div>
              <div className="lg:px-24 lg:col-span-2 space-y-3">
                <h3>
                  Select <span className="capitalize">{feature.name}</span>
                </h3>
                <ul className="space-y-4">
                  {feature.options &&
                    feature.options.map((option: FeatureOption) => (
                      <li
                        key={option.name}
                        className="group flex items-center gap-2 hover:cursor-pointer"
                        onClick={() =>
                          toggleFeatureOption(
                            feature,
                            option.name,
                            !option.isSelected
                          )
                        }
                      >
                        <CheckBox
                          state={option.isSelected}
                          setState={() =>
                            toggleFeatureOption(
                              feature,
                              option.name,
                              !option.isSelected
                            )
                          }
                          textColor="dark"
                          bg="white"
                          border="primary"
                        />

                        <div className="ml-2 flex items-center justify-center">
                          <IconImage name={option.name} />
                        </div>
                        <span className="capitalize group-hover:font-medium transition-all duration-200">
                          {option.fullName}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
