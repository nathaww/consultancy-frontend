import { CircleSpinner } from "react-spinners-kit";

const Loading = () => {
  return (
    <div className="flex items-center gap-2 mt-2  w-full card-shadow rounded p-3">
      <CircleSpinner size={25} color="#005F83" />
      <h4 className="text-primaryColor font-bold my-2">Loading, please wait</h4>
    </div>
  );
};

export default Loading;
