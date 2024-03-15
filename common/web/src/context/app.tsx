// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { Order, OrderFeature, Toast } from "../lib/types";

const Context = createContext({
  toast: null as Toast | null,
  setToast: (toast: Toast) => {},
  loading: false,
  setLoading: (loading: boolean) => {},
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Context.Provider
      value={{
        toast,
        setToast,
        loading,
        setLoading,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  return useContext(Context);
};
