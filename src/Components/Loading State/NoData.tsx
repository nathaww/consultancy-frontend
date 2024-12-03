import React from "react";
import { TbDatabaseExclamation } from "react-icons/tb";
interface NoDataProps {
  text: string;
}
export const NoData: React.FC<NoDataProps> = ({ text }) => {
  return (
    <div className="row mt-2 flex flex-row items-center gap-2 card-shadow w-full rounded p-3">
      <TbDatabaseExclamation className="text-2xl font-bold text-primaryColor"/>
      <h4 className="text-primaryColor font-bold my-2">{text}.</h4>
    </div>
  );
};
