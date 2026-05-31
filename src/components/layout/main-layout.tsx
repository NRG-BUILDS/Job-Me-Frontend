import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

const MainLayout = () => {
  return (
    <div className="relative">
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
