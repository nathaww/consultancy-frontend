import { TbDatabaseOff } from "react-icons/tb";

const Error = () => {
  return (
    <div className="row mt-2 flex flex-row items-center gap-2 card-shadow w-full  rounded p-3">
      <TbDatabaseOff className="text-2xl font-bold text-red-600"/>
      <h4 className="text-red-600 font-bold my-2">Failed to get data.</h4>
    </div>
  );
};

export default Error;
