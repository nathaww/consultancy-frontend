import {
  CanadaVisaInterface,
  editServicePaymentStatus,
} from "@/api/canadaVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface Props {
  visaId: string;
  serviceFeeDepositDate: string;
  serviceFeeDepositPaymentStatus: string;
}
const ServiceFeeDeposit: React.FC<Props> = ({
  visaId,
  serviceFeeDepositDate,
  serviceFeeDepositPaymentStatus,
}) => {
  const queryClient = useQueryClient();

  const confirmServiceFeeDepositMutation = useMutation<
    CanadaVisaInterface,
    Error,
    CanadaVisaInterface
  >({
    mutationKey: ["confirmDeposit"],
    mutationFn: (data: CanadaVisaInterface) => editServicePaymentStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CanadaVisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("Deposit Confirmed");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const calculateDaysLeft = (): number => {
    const depositDate = new Date(serviceFeeDepositDate);
    const currentDate = new Date();
    const timeDifference = depositDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return daysLeft;
  };

  const daysLeft = calculateDaysLeft();

  const handleConfirmClick = async () => {
    confirmServiceFeeDepositMutation.mutate({
      id: visaId,
      serviceFeeDepositPaymentStatus: "Paid",
    });
  };
  return (
    <>
      <p
        className={`flex items-center gap-2 ${
          serviceFeeDepositPaymentStatus === "Paid" ? "text-green-600" : ""
        }`}
      >
        4.5 Deposit Service Payment
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full flex items-center p-2 gap-1 ${
            serviceFeeDepositPaymentStatus === "Paid" ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>

      <div
        className={`${
          serviceFeeDepositPaymentStatus === "Paid" ? "hidden" : "flex"
        } bg-gray-100 p-3 w-max flex-col rounded mt-2`}
      >
        <div
          className={`${
            daysLeft <= 0 ? "bg-red-300" : "bg-green-300"
          } h-32 my-auto w-32 flex flex-col justify-center items-center rounded mx-auto mb-4`}
        >
          <p
            className={`text-center font-extrabold text-3xl ${
              daysLeft <= 0 ? "text-red-700" : "text-green-700"
            }`}
          >
            {daysLeft <= 0 ? "Expired" : daysLeft || "-"}
          </p>
          <span className="text-center font-bold text-2xl text-green-600">
            {daysLeft <= 0 ? "" : "Days Left" || "-"}
          </span>
        </div>
        <p>Student has to deposit the service fee.</p>
        <div className="flex items-center gap-2 mt-2">
          <p
            className={`${
              serviceFeeDepositPaymentStatus === "Unpaid"
                ? "text-yellow-200 bg-yellow-600"
                : "text-green-200 bg-green-700"
            } p-2  rounded`}
          >
            Service Fee Deposit Status: {serviceFeeDepositPaymentStatus}
          </p>
        </div>

        <p className="my-2">
          If the student deposited, please confirm completion below.
        </p>
        <button
          onClick={handleConfirmClick}
          className="btn btn-anim bg-primaryColor text-white"
        >
          {confirmServiceFeeDepositMutation.isPending
            ? "Confirming..."
            : "Confirm Completion"}
        </button>
      </div>
    </>
  );
};

export default ServiceFeeDeposit;
