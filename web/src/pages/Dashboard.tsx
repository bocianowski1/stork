import { useEffect, useState } from "react";
import { Header, Toast, PasswordPrompt } from "../components";
import { useApp } from "../context/app";
import type { Order } from "../lib/types";
import { IconImage } from "../components/IconImage";

export function Dashboard() {
  const { toast, setToast, loading, onAuthenticate, isAuthenticated } =
    useApp();
  const [processing, setProcessing] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);

  const protocol = location.protocol === "https:" ? "https://" : "http://";
  const host =
    process.env.ENV === "development" ? "localhost:8080" : location.host;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(protocol + host + "/api/v1/orders");

        if (res.status === 404) {
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
        setToast({
          message: "Failed to fetch orders",
          type: "error",
        });
      }
    };

    void fetchOrders();
  }, [host, protocol, setToast]);

  useEffect(() => {
    if (toast) {
      const timeout = toast.type === "success" ? 4000 : 2000;
      setTimeout(() => {
        setToast(null);
      }, timeout);
    }
  }, [toast, setToast]);

  const acceptOrder = async (order: Order) => {
    setProcessing(true);
    try {
      const res = await fetch(protocol + host + "/api/v1/build", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 201) {
        const data = await res.json();
        setToast({
          title: "Order Accepted",
          message: `Repo URL: ${data.url}`,
          type: "success",
        });
      } else {
        setToast({
          message: "Failed to accept order",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Failed to accept order",
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  const rejectOrder = async (order: Order) => {
    setProcessing(true);
    try {
      const res = await fetch(protocol + host + "/api/v1/orders/" + order._id, {
        method: "DELETE",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 204) {
        setToast({
          message: "Order Rejected",
          type: "success",
        });
      } else {
        setToast({
          message: "Failed to reject order" + res.status,
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Failed to reject order",
        type: "error",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return <PasswordPrompt onAuthenticate={onAuthenticate} />;
  }

  return (
    <main className="bg-slate-950 relative flex flex-col justify-between min-h-screen overflow-clip">
      <Header showSideNavbar={false} setShowSideNavbar={() => {}} />

      <div className="w-full flex-1 flex flex-col items-center justify-center">
        <section>
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div
                  key={i}
                  className="bg-radial text-white rounded-md border border-offwhite 
                            w-full h-48 p-6 flex justify-between 
                            animate-pulse transition-colors duration-300"
                />
              ))}
            </div>
          )}
        </section>
        <section>
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${
              loading ? "translate-y-full" : "translate-y-0"
            } transition-transform transform duration-700`}
          >
            {orders && orders.length > 0 ? (
              orders.map((order: Order, i) => {
                return (
                  <div
                    key={`${order.fullName}-${order.company}-${order.email}-${i}`}
                    className="bg-dark text-white rounded-md border border-offwhite 
                            h-fit p-6 flex justify-between w-fit
                            transition-colors duration-300 hover:bg-slate-900"
                  >
                    <div className="flex flex-col gap-1">
                      <h3>
                        {order.fullName} - {order.company}
                      </h3>
                      <a
                        href={order.email ? `mailto:${order.email}` : "#"}
                        className="text-blue-400 hover:underline"
                      >
                        {order.email}
                      </a>
                      <a
                        href={
                          order.phoneNumber ? `tel:${order.phoneNumber}` : "#"
                        }
                        className="text-blue-400 hover:underline"
                      >
                        {order.phoneNumber}
                      </a>
                      <p>{order.message}</p>
                      <ul className="space-y-6 mt-6">
                        {order.features.map((feature) => {
                          return (
                            <li key={feature.name}>
                              <div className="space-y-2">
                                <h4>
                                  ({feature.options.length}) {feature.fullName}
                                </h4>
                                <ul className="space-y-3">
                                  {feature.options.map((option) => {
                                    return (
                                      <li
                                        key={option.name}
                                        className="flex gap-2 items-center ml-4"
                                      >
                                        <IconImage name={option.name} />
                                        {option.fullName}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <div className="-space-y-2 -mt-2">
                        <p className="text-right">Total</p>
                        <h3 className="text-green-400">{order.totalPrice}</h3>
                      </div>
                      <div className="flex flex-col gap-2 lg:flex-row ml-12">
                        <button
                          onClick={() => acceptOrder(order)}
                          disabled={processing}
                          className="text-green-400 border-2 scale-90 sm:scale-95 md:scale-100 border-green-400 bg-green-900/90
                      hover:bg-green-700 hover:text-green-300 hover:border-green-300
                      transition-colors duration-300"
                        >
                          {processing ? "Building..." : "Accept"}
                        </button>
                        <button
                          onClick={() => rejectOrder(order)}
                          className="text-red-400 border-2 scale-90 sm:scale-95 md:scale-100 border-red-400 bg-red-900/90
                      hover:bg-red-700 hover:text-red-300 hover:border-red-300
                      transition-colors duration-300"
                        >
                          {processing ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h2 className="text-white">No orders</h2>
            )}
          </div>
        </section>
      </div>

      <Toast />
    </main>
  );
}
