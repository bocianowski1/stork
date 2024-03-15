import { useState } from "react";
import { useApp } from "../context/app";
import { scrollToElementById } from "../lib/utils";
import { CheckBox } from "./CheckBox";

export function SubmitForm() {
  const { order, deleteOrderFromLS, setToast, deselectAllFeatures } = useApp();

  const [fullName, setFullName] = useState(order.fullName);
  const [email, setEmail] = useState(order.email);
  const [phoneNumber, setPhoneNumber] = useState(order.phoneNumber);
  const [company, setCompany] = useState(order.company);
  const [message, setMessage] = useState(order.message);

  const [checkPrivacy, setCheckPrivacy] = useState(false);
  const [checkPromotion, setCheckPromotion] = useState(true);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setCompany("");
    setMessage("");
    setCheckPrivacy(false);
    setCheckPromotion(true);
  };

  async function postOrder() {
    if (!order) {
      setToast({
        title: "Empty order",
        message: "No order",
        type: "error",
      });
      return;
    }

    if (!fullName || !email) {
      setToast({
        title: "Missing information",
        message: "Please fill in your full name and email",
        type: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({
        title: "Invalid email",
        message: "Invalid email",
        type: "error",
      });
      return;
    }

    // validate phone number with regex
    // const phoneRegex = /^\d{8}$/;
    // if (phoneNumber && !phoneRegex.test(phoneNumber)) return;

    const selectedFeatures = order.features.filter(
      (f) => f.options.filter((o) => o.isSelected).length > 0
    );

    if (selectedFeatures.length === 0) {
      setToast({
        title: "No selected features",
        message: "Please select at least one feature",
        type: "error",
      });
      return;
    }

    const protocol = location.protocol === "https:" ? "https://" : "http://";
    const host =
      process.env.ENV === "development" ? "localhost:8080" : location.host;

    try {
      const resp = await fetch(protocol + host + "/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          company,
          phoneNumber,
          message,
          features: selectedFeatures,
        }),
      });

      if (resp.status !== 201) {
        setToast({
          title: "Internal error",
          message: "Something went wrong. Please try again later.",
          type: "error",
        });
        console.log("Error posting order", resp.status, resp.statusText);
        return;
      }

      try {
        deleteOrderFromLS();
      } catch (e) {
        console.error("Error deleting order from local storage", e);
      }

      setToast({
        title: "Order submitted",
        message: "Thank you for your order. We will be in touch soon.",
        type: "success",
      });

      deselectAllFeatures();
      resetForm();
    } catch (e) {
      console.error("Error posting order", e);
      setToast({
        title: "Internal error",
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    }
  }
  return (
    <form onSubmit={postOrder} className="ml-auto flex flex-col gap-4 lg:w-1/2">
      <h3>Contact Information</h3>
      <div>
        <label htmlFor="fullName">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          name="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="company">
          Company <span className="text-red-500">*</span>
        </label>
        <input
          name="company"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          name="phoneNumber"
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="message">Message</label>
        <textarea
          name="message"
          id=""
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          cols={30}
          rows={5}
        ></textarea>
      </div>

      <div className="flex gap-2 items-center">
        <CheckBox
          state={checkPrivacy}
          setState={setCheckPrivacy}
          bg="primary"
          textColor="white"
          border="white"
        />
        <label htmlFor="privacy">
          I agree to the{" "}
          <span
            onClick={() => scrollToElementById("FAQs")}
            className="underline cursor-pointer hover:text-black transition-all duration-300"
          >
            Privacy Policy.
          </span>
          <span className="text-red-500 ml-1">*</span>
        </label>
      </div>
      <div className="flex gap-2 items-center">
        <CheckBox
          state={checkPromotion}
          setState={setCheckPromotion}
          bg="primary"
          textColor="white"
          border="white"
          defaultChecked
        />
        <label htmlFor="promotion">
          I agree to receive marketing and promotional materials.
        </label>
      </div>
      <button
        type="submit"
        className="w-fit bg-dark text-offwhite mt-3"
        disabled={!fullName || !email || !company || !checkPrivacy}
      >
        Apply now
      </button>
    </form>
  );
}
