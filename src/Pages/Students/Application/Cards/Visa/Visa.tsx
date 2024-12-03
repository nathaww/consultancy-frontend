import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import UsVisa from "./UsVisa";
import CanadaVisa from "./CanadaVisa";
import { getApplication } from "@/api/application";
import { ApplicationListInterface } from "@/api/applicationList";

const Visa = () => {
  const { id } = useParams();

  const { data } = useQuery<ApplicationListInterface>({
    queryKey: ["getApplication"],
    queryFn: () => getApplication(id!),
  });

  return (
    <div className="w-full min-h-40 card-shadow border rounded mt-8">
      <div className="w-full min-h-40 bg-white flex justify-between h-full rounded p-4 gap-2">
        <div className="flex flex-col gap-y-2 w-full">
          <div className="flex w-full justify-between">
            <p className="text-base md:text-lg lg:text-lg font-semibold">
              4. Visa
            </p>
            <div className="flex justify-center items-center gap-2 rounded-full bg-blue-100 px-3 py-1">
              <div className="w-10 h-6">
                {data?.country === "UnitedStates" && (
                  <img
                    src={"/Images/us.png"}
                    alt="consultancy application country flag"
                    className="w-full h-full object-contain object-center"
                  />
                )}
                {data?.country === "Canada" && (
                  <img
                    src={"/Images/canada.png"}
                    alt="consultancy application country flag"
                    className="w-full h-full object-contain object-center"
                  />
                )}
                {data?.country === "Italy" && (
                  <img
                    src={"/Images/italy.png"}
                    alt="consultancy application country flag"
                    className="w-full h-full object-contain object-center"
                  />
                )}
                {data?.country === "Hungary" && (
                  <img
                    src={"/Images/hungary.png"}
                    alt="consultancy application country flag"
                    className="w-full h-full object-contain object-center"
                  />
                )}
              </div>
              <p className="text-primaryColor">
                {data?.country === "UnitedStates" ? "USA" : ""}
                {data?.country === "Canada" ? "Canada" : ""}
                {data?.country === "Italy" ? "Italy" : ""}
                {data?.country === "Hungary" ? "Hungary" : ""}
              </p>
            </div>
          </div>

          {data?.admissionStatus !== "Accepted" || !data ? (
            <p className="text-base text-gray-500">
              (Make sure previous steps are completed and the student is accepted before you can load visa
              information)
            </p>
          ) : (
            <>
              {data?.country === "UnitedStates" ? <UsVisa /> : <CanadaVisa />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Visa;
