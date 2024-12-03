import { FaArrowLeft, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const nav = useNavigate();
  return (
    <div className="rounded w-full py-36 flex justify-center items-center">
      <div className="mx-auto  px-4 md:px-8">
        <div className="relative mx-auto flex h-96 w-full items-center justify-center overflow-hidden bg-red-100 card-shadow rounded sm:w-96">
          <div className="relative flex flex-col items-center justify-center p-8 md:p-16">
            <h1 className="mb-2 text-center text-6xl font-bold text-red-600">
              404
            </h1>

            <p className="mb-8 text-center text-black md:text-lg">
              You are not authorized to access this page or the page you’re
              looking for doesn’t exist.
            </p>

            <Link
              to="/"
              className="btn btn-anim bg-red-600 text-white flex gap-2 items-center"
            >
              <FaHome />
              Back to home
            </Link>
            <button
              onClick={() => {
                nav(-1);
              }}
              className="btn btn-anim bg-red-600 text-white mt-2 flex gap-2 items-center"
            >
              <FaArrowLeft />
              Back to previous Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
