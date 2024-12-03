import { useUser } from "@/Context/UserContext";
import { FaLeftLong } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

const Header = () => {
  const { user } = useUser();
  const { id } = useParams();

  return (
    <>
      <div className="flex w-full">
        {user?.user.roles.includes("Admission") ||
        user?.user.roles.includes("Visa") ? (
          <Link
            className="inline-flex items-center gap-2 mb-4"
            to={`${"/applications"}`}
          >
            <FaLeftLong className="text-primaryColor" /> Back to Application
            List
          </Link>
        ) : (
          <Link
            className="inline-flex items-center gap-2 mb-4"
            to={`${
              user?.user.roles.includes("Agent")
                ? "/agentStudents"
                : "/students"
            }`}
          >
            <FaLeftLong className="text-primaryColor" /> Back to Student List
          </Link>
        )}
      </div>
      <div className="card-shadow w-auto flex justify-between gap-x-2 transition-all duration-200 p-1 bg-white">
        <Link
          className={
            ` py-2 px-2 sm:px-3 md:px-3 lg:px-3 sm:py-3 lg:py-3  rounded text-sm sm:text-sm md:text-base lg:text-base font-semibold w-max text-center  ` +
            (location.pathname.startsWith(
              user?.user.roles.includes("Agent")
                ? `/agentStudents/detail/${id}/moredetail/family`
                : `/students/detail/${id}/moredetail/family`
            ) && "bg-primaryColor  text-white")
          }
          to={`${
            user?.user.roles.includes("Agent")
              ? `/agentStudents/detail/${id}/moredetail/family`
              : `/students/detail/${id}/moredetail/family`
          }`}
        >
          Family Information
        </Link>
        <Link
          className={
            ` py-2 px-2 sm:px-3 md:px-3 lg:px-3 sm:py-3 lg:py-3  rounded text-sm sm:text-sm md:text-base lg:text-base font-semibold w-max text-center  ` +
            (location.pathname.startsWith(
              user?.user.roles.includes("Agent")
                ? `/agentStudents/detail/${id}/moredetail/school`
                : `/students/detail/${id}/moredetail/school`
            ) && "bg-primaryColor  text-white")
          }
          to={`${
            user?.user.roles.includes("Agent")
              ? `/agentStudents/detail/${id}/moredetail/school`
              : `/students/detail/${id}/moredetail/school`
          }`}
        >
          Student Information
        </Link>
        <Link
          className={
            ` py-2 px-2 sm:px-3 md:px-3 lg:px-3 sm:py-3 lg:py-3  rounded text-sm sm:text-sm md:text-base lg:text-base font-semibold w-max text-center  ` +
            (location.pathname.startsWith(
              user?.user.roles.includes("Agent")
                ? `/agentStudents/detail/${id}/moredetail/additionalFiles`
                : `/students/detail/${id}/moredetail/additionalFiles`
            ) && "bg-primaryColor  text-white")
          }
          to={`${
            user?.user.roles.includes("Agent")
              ? `/agentStudents/detail/${id}/moredetail/additionalFiles`
              : `/students/detail/${id}/moredetail/additionalFiles`
          }`}
        >
          Additional Files
        </Link>
      </div>
    </>
  );
};

export default Header;
