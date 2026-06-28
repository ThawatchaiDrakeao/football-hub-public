import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
