import { useUser } from "@/Context/UserContext";
import { getNotificationCount } from "@/api/notification";
import { makeReq } from "@/makeReq";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { CgMenu } from "react-icons/cg";
import { FaBell } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { LuAlignLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to track sidebar status
  const nav = useNavigate();
  const { user, setUser } = useUser();
  const signOut = useSignOut();

  const { data: count } = useQuery({
    queryKey: ["count"],
    queryFn: () => getNotificationCount(),
    refetchOnWindowFocus: true,
  });

  const handleSidebarToggle = () => {
    toggleSidebar();
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar status
  };

  return (
    <header>
      <div className="w-full px-3 sm:px-8 lg:px-8 flex justify-between items-center h-16 mt-2">
        <button onClick={handleSidebarToggle}>
          {isSidebarOpen ? (
            <CgMenu className="text-primaryColor text-2xl sm:text-3xl lg:text-3xl transition-transform transform rotate-180" />
          ) : (
            <LuAlignLeft className="text-primaryColor text-2xl sm:text-3xl lg:text-3xl transition-transform transform rotate-0" />
          )}
        </button>
        <div className="flex items-center gap-2">
          {user?.user.roles.includes("Admission") ||
          user?.user.roles.includes("Agent") ||
          user?.user.roles.includes("Finance") ||
          user?.user.roles.includes("Visa") ? (
            <button
              className="relative"
              onClick={() => {
                nav("/incomingNotification");
              }}
            >
              <FaBell className="text-primaryColor text-2xl sm:text-2xl lg:text-2xl" />
              {count > 0 && (
                <p className="absolute right-0 -top-1 text-xs px-1 text-white rounded-full bg-red-600">
                  {count > 99 ? "99+" : count}
                </p>
              )}
            </button>
          ) : (
            ""
          )}
          <div className="flex justify-center items-center gap-2">
            <div className="flex-col text-xs sm:text-sm lg:text-sm">
              <p className="text-black font-bold">
                {user?.user.employee.firstName}
              </p>
            </div>
          </div>
          <button
            className="flex justify-center items-center btn w-full bg-primaryColor text-white"
            onClick={() => {
              signOut();
              setUser(null);
              makeReq.defaults.headers.common["Authorization"] = ``;
              nav("/auth/login");
            }}
          >
            Sign Out
            <IoMdLogOut className="text-white text-lg ml-2" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
