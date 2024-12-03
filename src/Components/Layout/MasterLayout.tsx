import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { makeReq } from "@/makeReq";
import toast from "react-hot-toast";
import { useUser } from "@/Context/UserContext";
import useSignOut from "react-auth-kit/hooks/useSignOut";

const MasterLayout = () => {
  const nav = useNavigate();
  const signOut = useSignOut();
  const { setUser } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await makeReq.post("/auth/verifyToken");
        if (res.status === 200) {
          makeReq.interceptors.request.use(
            (config) => {
              const token = localStorage.getItem("_auth");
              if (token) {
                config.headers.Authorization = `Bearer ${token}`;
              }
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );
        }
      } catch (error) {
        signOut();
        setUser(null);
        const notify = () => toast.error("Session expired");
        notify();
        nav("/auth/login");
      }
    };
    checkToken();
  }, [localStorage.getItem("token")]);

  return (
    <div className="relative w-full min-h-screen flex mx-auto bg-[#f8fcfd]">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`pl-0 ${isSidebarOpen ? "md:pl-80" : "md:pl-0"} ${
          isSidebarOpen ? "lg:pl-80" : "lg:pl-0"
        } w-full min-h-screen transition-all duration-200`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-col justify-center items-center w-full p-4 sm:p-10 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
