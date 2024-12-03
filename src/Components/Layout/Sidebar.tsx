import { Link, useLocation } from "react-router-dom";
import { MdEditDocument } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useUser } from "@/Context/UserContext";
import { CgBell } from "react-icons/cg";
import { RiAdvertisementLine } from "react-icons/ri";
import { BsGraphUp, BsPostcardHeart } from "react-icons/bs";
import { IoChatbubblesOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { PiUserListLight } from "react-icons/pi";
import { IoCalendarClearOutline } from "react-icons/io5";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useUser();

  const activeLink = (path: string) => {
    return location.pathname === path || location.pathname.includes(`${path}/`)
      ? "bg-darkPrimaryColor"
      : "";
  };

  const handleCloseSideBar = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed sidebar rounded-r-3xl z-30 w-60 md:w-80 lg:w-80 flex flex-col justify-between min-h-screen py-3 px-4 transition-all duration-300 bg-primaryColor `}
        >
          <div>
            <div className="w-4/5 bg-whit rounded hidden flex-col items-center md:flex lg:flex mx-auto h-28">
              <img
                src="/Images/luminousBigLogo.png"
                alt="luminous logo mobile"
                className="w-full h-full object-contain object-center bg-white rounded"
              />
            </div>
            <div className="w-full flex flex-row justify-evenly gap-2 items-center px-0 md:px-3 lg:px-3 mb-6 sm:mb-8 lg:mb-8">
              <img
                src="/Images/luminous.png"
                alt="luminous logo mobile"
                className="w-12 bg-white rounded-full md:w-full lg:w-full md:hidden lg:hidden object-contain object-center"
              />
              <p className="text-white md:hidden lg:hidden">Consultancy</p>
              <button
                className="md:hidden lg:hidden bg-darkPrimaryColor shadow-sm p-2 rounded-full"
                onClick={toggleSidebar}
              >
                <FaChevronLeft className="text-white " />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex-1 sm:overflow-y-scroll md:overflow-y-scroll lg:overflow-y-scroll xl:overflow-y-auto sm:h-96 md:h-96 lg:h-96 xl:h-auto">
                <ul className="pt-2 pb-4 space-y-2 text-sm">
                  <li>
                    <Link
                      onClick={() => {
                        handleCloseSideBar();
                      }}
                      to={"/"}
                      className={`${activeLink(
                        "/"
                      )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                    >
                      <BsGraphUp className="text-xl" />
                      <span>Analytics</span>
                    </Link>
                  </li>
                  {user?.user.roles.includes("Admin") ? (
                    <li>
                      <Link
                        onClick={() => {
                          handleCloseSideBar();
                        }}
                        to={"/students"}
                        className={`${activeLink(
                          "/students"
                        )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                      >
                        <PiStudentFill className="text-xl" />
                        <span>Students</span>
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  {user?.user.roles.includes("Agent") ? (
                    <li>
                      <Link
                        onClick={() => {
                          handleCloseSideBar();
                        }}
                        to={"/agentStudents"}
                        className={`${activeLink(
                          "/agentStudents"
                        )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                      >
                        <PiStudentFill className="text-xl" />
                        <span>My Students</span>
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  {user?.user.roles.includes("Finance") ||
                  user?.user.roles.includes("Admission") ||
                  user?.user.roles.includes("Visa") ? (
                    <li>
                      <Link
                        onClick={() => {
                          handleCloseSideBar();
                        }}
                        to={"/applications"}
                        className={`
                        ${activeLink("/applications")} 
                        ${activeLink("/students/application")}
                        ${activeLink("/students/detail")} 
                        flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                      >
                        <MdEditDocument className="text-xl" />
                        <span>Applications</span>
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}
                  {user?.user.roles.includes("Admin") ||
                  user?.user.roles.includes("Finance") ||
                  user?.user.roles.includes("Visa") ? (
                    <li>
                      <Link
                        onClick={() => {
                          handleCloseSideBar();
                        }}
                        to={"/calendar"}
                        className={`${activeLink(
                          "/calendar"
                        )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                      >
                        <IoCalendarClearOutline className="text-xl" />
                        <span>Calendar</span>
                      </Link>
                    </li>
                  ) : (
                    ""
                  )}

                  <li>
                    <Link
                      onClick={() => {
                        handleCloseSideBar();
                      }}
                      to={"/messages"}
                      className={`${activeLink(
                        "/messages"
                      )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                    >
                      <IoChatbubblesOutline className="text-xl" />
                      <span>Messages</span>
                    </Link>
                  </li>

                  {user?.user.roles.includes("Admin") ? (
                    <>
                      <li>
                        <Link
                          onClick={() => {
                            handleCloseSideBar();
                          }}
                          to={"/employees"}
                          className={`${activeLink(
                            "/employees"
                          )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                        >
                          <FiUsers className="text-xl" />
                          <span>Employees</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => {
                            handleCloseSideBar();
                          }}
                          to={"/advert"}
                          className={`${activeLink(
                            "/advert"
                          )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                        >
                          <RiAdvertisementLine className="text-xl" />
                          <span>Advert</span>
                        </Link>
                      </li>
                    </>
                  ) : (
                    ""
                  )}
                  {user?.user.roles.includes("Admin") ||
                  user?.user.roles.includes("Agent") ? (
                    <>
                      <li>
                        <Link
                          onClick={() => {
                            handleCloseSideBar();
                          }}
                          to={"/posts"}
                          className={`${activeLink(
                            "/posts"
                          )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                        >
                          <BsPostcardHeart className="text-xl" />
                          <span>Post</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => {
                            handleCloseSideBar();
                          }}
                          to={"/sales"}
                          className={`${activeLink(
                            "/sales"
                          )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                        >
                          <PiUserListLight className="text-xl" />
                          <span>Sales</span>
                        </Link>
                      </li>
                    </>
                  ) : (
                    ""
                  )}
                  <li>
                    <Link
                      onClick={() => {
                        handleCloseSideBar();
                      }}
                      to={"/notifications"}
                      className={`${activeLink(
                        "/notifications"
                      )} flex items-center gap-3 py-3 px-3 sm:px-6 lg:px-6 text-white text-sm sm:text-base lg:text-base rounded-xl hover:text-white hover:bg-darkPrimaryColor transition-all duration-300 transform active:scale-95`}
                    >
                      <CgBell className="text-xl" />
                      <span>Notifications</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
