import { useEffect, useState } from "react";
import { Footer, Navbar, Header, SideNavbar, Toast } from "./components";
import { useApp } from "./context/app";

export default function App() {
  const { toast, setToast } = useApp();
  const [showSideNavbar, setShowSideNavbar] = useState(false);

  useEffect(() => {
    if (toast) {
      const timeout = toast.type === "success" ? 4000 : 2000;
      setTimeout(() => {
        setToast(null);
      }, timeout);
    }
  }, [toast, setToast]);

  return (
    <main className="relative flex flex-col justify-between min-h-screen overflow-clip">
      <Header
        showSideNavbar={showSideNavbar}
        setShowSideNavbar={setShowSideNavbar}
      />

      <Navbar show={true} />

      <SideNavbar
        showSideNavbar={showSideNavbar}
        setShowSideNavbar={setShowSideNavbar}
      />

      <div className="w-full mx-auto flex-1"></div>

      <Footer />

      <Toast />
    </main>
  );
}
