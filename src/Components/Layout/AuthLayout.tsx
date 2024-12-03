import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="bg flex flex-row mx-auto justify-end items-center w-full h-screen">
      <div className="bg-card flex justify-center items-center flex-col w-full sm:w-1/2 lg:w-1/2 h-full">
        <div className="p-4 rounded flex flex-col justify-center items-center">
          <img
            src="/Images/luminousBigLogo.png"
            alt="consultancy logo"
            className="w-60 h-36 mb-2 object-contain object-center"
          />
          <h1 className="text-base text-white sm:text-xl lg:text-xl my-2 font-bold">
          consultancy
          </h1>
          <div className="w-80 mb-8">
            <Outlet />
          </div>
          <p className="text-sm text-white sm:text-base lg:text-base">
          consultancy © 2024 All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
