import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../hooks/theme";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
