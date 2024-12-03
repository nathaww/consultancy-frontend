import {
  CanadaVisaInterface,
  editVisaApplicationAndBiometricFeeStatus,
} from "@/api/canadaVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface Props {
  visaId: string | undefined;
  visaApplicationAndBiometricFee: string;
}
const ConfirmApplicationAndBiometricFee: React.FC<Props> = ({
  visaId,
  visaApplicationAndBiometricFee,
}) => {
  const queryClient = useQueryClient();
  const visaApplicationAndBiometricFeeMutation = useMutation<
    CanadaVisaInterface,
    Error,
    CanadaVisaInterface
  >({
    mutationKey: ["VisaApplicationAndBiometricFeeMutation"],
    mutationFn: (data) => editVisaApplicationAndBiometricFeeStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CanadaVisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });

      const notify = toast.success("Payment confirmed requested successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleRequest = async () => {
    visaApplicationAndBiometricFeeMutation.mutateAsync({
      id: visaId,
      visaApplicationAndBiometricFee: "Paid",
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 ${
          visaApplicationAndBiometricFee === "Paid" ? "text-green-600" : ""
        }`}
      >
        4.3 Visa Application and Biometric Fee Confirmation
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full flex items-center p-2 gap-1 ${
            visaApplicationAndBiometricFee === "Paid" ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>
      <div
        className={`w-full ${
          visaApplicationAndBiometricFee === "Paid" ? "hidden" : "flex"
        }`}
      >
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center gap-1">
            <p>Did the student pay application and biometric fee?</p>
          </div>
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              handleRequest();
            }}
            className="btn btn-anim bg-primaryColor text-white w-40"
          >
            {visaApplicationAndBiometricFeeMutation.isPending
              ? "Submitting..."
              : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmApplicationAndBiometricFee;
