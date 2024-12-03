import {
  CanadaVisaInterface,
  editVisaApplicationAndBiometricFeeAmount,
} from "@/api/canadaVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface Props {
  visaId: string | undefined;
  visaApplicationAndBiometricFeeAmount: number;
}
const ApplicationAndBiometricFee: React.FC<Props> = ({
  visaId,
  visaApplicationAndBiometricFeeAmount,
}) => {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number>(0);
  const visaApplicationAndBiometricFeeMutation = useMutation<
    CanadaVisaInterface,
    Error,
    CanadaVisaInterface
  >({
    mutationKey: ["VisaApplicationAndBiometricFeeMutation"],
    mutationFn: (data) => editVisaApplicationAndBiometricFeeAmount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CanadaVisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("Fee requested successfully");
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
      visaApplicationAndBiometricFeeAmount: amount,
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 ${
          visaApplicationAndBiometricFeeAmount > 0 ? "text-green-600" : ""
        }`}
      >
        4.3 Visa Application and Biometric Fee
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full flex items-center p-2 gap-1 ${
            visaApplicationAndBiometricFeeAmount > 0 ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>
      <div
        className={`w-full ${
          visaApplicationAndBiometricFeeAmount > 0 ? "hidden" : "flex"
        }`}
      >
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center gap-1">
            <p>Total Amount:</p>
            <input
              type="number"
              className="input-style"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(Number(e.target.value))
              }
            />
          </div>
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              handleRequest();
            }}
            className="btn btn-anim bg-primaryColor text-white w-40"
          >
            {visaApplicationAndBiometricFeeMutation.isPending
              ? "Requesting..."
              : "Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationAndBiometricFee;
