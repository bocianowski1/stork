import { useApp } from "../context/app";

export function Toast() {
  const { toast, setToast } = useApp();
  return (
    <div
      onClick={() => setToast(null)}
      className={`${toast?.message ? "translate-y-0" : "translate-y-40"} ${
        toast?.type === "success"
          ? "border-green-400 bg-green-900/80"
          : "border-red-400 bg-red-900/80"
      } fixed bottom-12 sm:bottom-24 left-1/2 -translate-x-1/2 transition-transform duration-300 
      rounded-md w-fit border-2 cursor-pointer z-50 shadow-md`}
    >
      {toast?.message && (
        <p
          className={`${
            toast.type === "success" ? "text-green-400" : "text-red-400"
          } md:text-lg py-4 px-8`}
        >
          <span className="capitalize font-semibold">
            {toast.title ? toast.title : toast.type}
          </span>
          <br />
          {toast.message}
        </p>
      )}
    </div>
  );
}
