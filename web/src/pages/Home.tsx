import { useEffect, useState } from "react";
import {
  ContactAndPricing,
  FeatureSelection,
  Footer,
  Hero,
  Navbar,
  Header,
  FAQ,
  SideNavbar,
  Toast,
} from "../components";
import { IoIosArrowRoundUp } from "react-icons/io";
import { useApp } from "../context/app";

export function Home() {
  const { toast, setToast } = useApp();
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [showSideNavbar, setShowSideNavbar] = useState(false);

  useEffect(() => {
    const heroSection = document.querySelector("#product");
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.2,
      }
    );

    if (heroSection) {
      observer.observe(heroSection);
    }

    return () => {
      if (heroSection) {
        observer.unobserve(heroSection);
      }
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timeout = toast.type === "success" ? 4000 : 2000;
      setTimeout(() => {
        setToast(null);
      }, timeout);
    }
  }, [toast, setToast]);

  // after 24 hours, clear the local storage
  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    if (!lastVisit) {
      localStorage.setItem("lastVisit", new Date().toISOString());
    } else {
      const lastVisitDate = new Date(lastVisit);
      const currentDate = new Date();
      const diff = currentDate.getTime() - lastVisitDate.getTime();
      const diffInHours = diff / (1000 * 3600);
      if (diffInHours > 24) {
        localStorage.clear();
      }
    }
  }, []);

  return (
    <main className="relative flex flex-col justify-between min-h-screen overflow-clip">
      <Header
        showSideNavbar={showSideNavbar}
        setShowSideNavbar={setShowSideNavbar}
      />

      <Navbar show={!isHeroVisible} />

      {/* Scroll to top button */}
      <div
        onClick={() => window.scrollTo({ top: -40, behavior: "smooth" })}
        className={`${
          !isHeroVisible ? "translate-x-0" : "translate-x-40"
        } transition-transform duration-500 delay-300 p-2 rounded-full shadow-md fixed bottom-24 right-12 
          bg-offwhite border border-dark cursor-pointer z-50`}
      >
        <IoIosArrowRoundUp
          size={40}
          className={`${
            !isHeroVisible ? "rotate-0" : "rotate-90"
          } transition-transform duration-300 text-darkgray`}
        />
      </div>

      <SideNavbar
        showSideNavbar={showSideNavbar}
        setShowSideNavbar={setShowSideNavbar}
      />

      <div className="w-full mx-auto flex-1">
        <section id="product" className="mb-4">
          <Hero />
        </section>
        <section id="features">
          <FeatureSelection />
        </section>
        <section id="contact">
          <ContactAndPricing />
        </section>
        <section id="FAQs">
          <FAQ />
        </section>
      </div>

      <Footer />

      <Toast />
    </main>
  );
}
