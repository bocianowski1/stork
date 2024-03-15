export function CheckBox({
  state,
  setState,
  bg,
  textColor,
  border,
  defaultChecked,
}: {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  bg: "white" | "dark" | "primary";
  textColor: "white" | "dark" | "primary";
  border: "white" | "dark" | "primary";
  defaultChecked?: boolean;
}) {
  bg = "bg-" + bg;
  border = "border-" + border;
  return (
    <>
      <input
        type="checkbox"
        onChange={(e) => setState(e.target.checked)}
        checked={state}
        className={`relative peer shrink-0 appearance-none w-4 h-4
                    hover:cursor-pointer border-[1.5px] ${border} rounded-md z-10`}
        defaultChecked={defaultChecked}
      />
      <svg
        className="absolute w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={`var(--color-${textColor})`}
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="16 8 10 16 6 12"></polyline>
      </svg>
      <div
        className={`${
          !state
            ? "translate-x-0 translate-y-0 w-4"
            : "translate-x-4 -translate-y-4 w-0"
        } ${bg} absolute h-4 rounded-md transition-all duration-700 ease-out`}
      ></div>
    </>
  );
}
