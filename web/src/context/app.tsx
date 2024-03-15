// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { Order, OrderFeature, Toast } from "../lib/types";
import Cookies from "js-cookie";

const Context = createContext({
  order: {
    id: "",
    fullName: "",
    company: "",
    email: "",
    features: [],
    totalPrice: 0,
  } as Order,

  toast: null as Toast | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setToast: (toast: Toast) => {},
  loading: false as boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLoading: (loading: boolean) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isFeatureSelected: (id: string) => false as boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleFeatureOption: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    feature: OrderFeature,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    option: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldSelect: boolean
  ) => {},
  getOrderTotal: () => 0 as number,
  deleteOrderFromLS: () => {},
  features: [] as OrderFeature[],
  deselectAllFeatures: () => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orders: [] as Order[],
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAuthenticate: (isAuthenticated: boolean) => {},
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const allCookies = Cookies.get();

  const [order, setOrder] = useState<Order>({
    id: "",
    fullName: "",
    company: "",
    email: "",
    phoneNumber: "",
    features: [],
    totalPrice: 0,
  });
  const [toast, setToast] = useState<Toast | null>(null);
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<OrderFeature[]>([]);

  const onAuthenticate = (isAuthenticated: boolean) => {
    if (!isAuthenticated) {
      Cookies.remove("isAuthenticated");
    } else {
      Cookies.set("isAuthenticated", isAuthenticated);
    }
  };

  const isAuthenticated = allCookies.isAuthenticated === "true";

  useEffect(() => {
    // const orderFromLocalStorage = localStorage.getItem("order");
    // if (orderFromLocalStorage) {
    //   setOrder(JSON.parse(orderFromLocalStorage));
    // }

    const protocol = location.protocol === "https:" ? "https://" : "http://";
    const host =
      process.env.ENV === "development" ? "localhost:8080" : location.host;

    const fetchFeatures = async () => {
      try {
        const resp = await fetch(protocol + host + "/api/v1/features");
        const data = await resp.json();
        setFeatures(data);
        // localStorage.setItem("features", JSON.stringify(data));

        setOrder({
          id: "",
          fullName: "",
          company: "",
          email: "",
          phoneNumber: "",
          features: data,
          totalPrice: 0,
        });
      } catch (error) {
        console.log("Error fetching features", error);
        setToast("Something went wrong. Please try again later.");
      }
    };

    // const featuresFromLocalStorage = localStorage.getItem("features");
    // if (featuresFromLocalStorage) {
    //   setFeatures(JSON.parse(featuresFromLocalStorage));
    // } else {
    // }
    void fetchFeatures();
  }, []);

  // useEffect(() => {
  //   if (order) {
  //     localStorage.setItem("order", JSON.stringify(order));
  //   }
  // }, [order]);

  const toggleFeatureOption = (
    selectedFeature: OrderFeature,
    optionName: string,
    shouldSelect: boolean
  ) => {
    setOrder((currentOrder) => {
      const newOrder = { ...currentOrder };

      const featureIndex = newOrder.features.findIndex(
        (f) => f.name === selectedFeature.name
      );

      if (featureIndex === -1) {
        console.log("Feature not found", currentOrder);
        return currentOrder;
      }

      const newFeature = { ...newOrder.features[featureIndex] };

      newFeature.options = newFeature.options.map((option) => {
        if (option.name === optionName) {
          return { ...option, isSelected: shouldSelect };
        }
        return option;
      });

      newOrder.features[featureIndex] = newFeature;

      return newOrder;
    });
  };

  const isFeatureSelected = (name: string) => {
    if (!order) return false;
    const feature = order.features.find((f) => f.name === name);

    if (!feature) return false;
    return feature.options.some((o) => o.isSelected);
  };

  const deselectAllFeatures = () => {
    setOrder((currentOrder) => {
      const newOrder = { ...currentOrder };
      newOrder.features = newOrder.features.map((f) => {
        const newFeature = { ...f };
        newFeature.options = newFeature.options.map((o) => ({
          ...o,
          isSelected: false,
        }));
        return newFeature;
      });

      return newOrder;
    });
  };

  const getOrderTotal = () => {
    let total = 0;
    if (!order) return total;

    order.features.forEach((feature) => {
      if (!isFeatureSelected(feature.name)) return;
      total += feature.basePrice;
      feature.options.forEach((option) => {
        if (option.isSelected) total += option.price;
      });
    });

    return total;
  };

  const deleteOrderFromLS = () => {
    setOrder({
      id: "",
      fullName: "",
      company: "",
      email: "",
      phoneNumber: "",
      features,
      totalPrice: 0,
    });
    localStorage.removeItem("order");
  };

  return (
    <Context.Provider
      value={{
        order,
        isFeatureSelected,
        toggleFeatureOption,
        getOrderTotal,
        deleteOrderFromLS,
        toast,
        setToast,
        loading,
        setLoading,
        features,
        deselectAllFeatures,
        onAuthenticate,
        isAuthenticated,
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
