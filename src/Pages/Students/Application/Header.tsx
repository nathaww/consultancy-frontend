import { useUser } from "@/Context/UserContext";
import { FaLeftLong } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";

const Header = () => {
  const { user } = useUser();
  const { id } = useParams();
  return (
    <>
      <div className="flex w-full">
        {user?.user.roles.includes("Admin") ? (
          <Link
            className="inline-flex items-center gap-2 mb-4"
            to={`/students`}
          >
            <FaLeftLong className="text-primaryColor" /> Back to Student List
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="card-shadow w-auto flex justify-between sm:gap-x-1 gap-x-2 transition-all duration-200 p-1 bg-white">
        {user?.user.roles.includes("Finance") ||
        user?.user.roles.includes("Admin") ? (
          <Link
            className={
              ` py-2 px-2 sm:px-3 md:px-3 lg:px-3 sm:py-3 lg:py-3  rounded text-sm sm:text-sm md:text-base lg:text-base font-semibold md:w-36 lg:w-40 text-center ` +
              (location.pathname.startsWith(
                user?.user.roles.includes("Agent")
                  ? `/agentStudents/application/${id}/deposit`
                  : `/students/application/${id}/deposit`
              ) && "bg-primaryColor  text-white")
            }
            to={
              user?.user.roles.includes("Agent")
                ? `/agentStudents/application/${id}/deposit`
                : `/students/application/${id}/deposit`
            }
          >
            Deposit
          </Link>
        ) : (
          ""
        )}
        {user?.user.roles.includes("Admission") ||
        user?.user.roles.includes("Admin") ? (
          <Link
            className={
              ` py-2 px-2 sm:px-3 md:px-3 lg:px-3 sm:py-3 lg:py-3  rounded text-sm sm:text-sm md:text-base lg:text-base font-semibold md:w-36 lg:w-40 text-center ` +
              (location.pathname.startsWith(
                user?.user.roles.includes("Agent")
                  ? `/agentStudents/application/${id}/englishTest`
                  : `/students/application/${id}/englishTest`
              ) && "bg-primaryColor  text-white")
            }
            to={
              user?.user.roles.includes("Agent")
                ? `/agentStudents/application/${id}/englishTest`
                : `/students/application/${id}/englishTest`
            }
          >
            English Test
          </Link>
        ) : (
          ""
        )}

        {user?.user.roles.includes("Admission") ||
        user?.user.roles.includes("Admin") ? (
          <Link
            className={
              ` py-2 px-2 sm:px-3 md:px-3 lg:px-3 sm:py-3 lg:py-3  rounded text-sm sm:text-sm md:text-base lg:text-base font-semibold md:w-36 lg:w-40 text-center ` +
              (location.pathname.startsWith(
                user?.user.roles.includes("Agent")
                  ? `/agentStudents/application/${id}/admission`
                  : `/students/application/${id}/admission`
              ) && "bg-primaryColor  text-white")
            }
            to={
              user?.user.roles.includes("Agent")
                ? `/agentStudents/application/${id}/admission`
                : `/students/application/${id}/admission`
            }
          >
            Admission
          </Link>
        ) : (
          ""
        )}
        {user?.user.roles.includes("Visa") ||
        user?.user.roles.includes("Admin") ? (
          <Link
            className={
              ` py-2 px-2 sm:px-3 md:px-3 lg:px-3 sm:py-3 lg:py-3  rounded text-sm sm:text-sm md:text-base lg:text-base font-semibold md:w-36 lg:w-40 text-center ` +
              (location.pathname.startsWith(
                user?.user.roles.includes("Agent")
                  ? `/agentStudents/application/${id}/visa`
                  : `/students/application/${id}/visa`
              ) && "bg-primaryColor  text-white")
            }
            to={
              user?.user.roles.includes("Agent")
                ? `/agentStudents/application/${id}/visa`
                : `/students/application/${id}/visa`
            }
          >
            Visa
          </Link>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Header;
