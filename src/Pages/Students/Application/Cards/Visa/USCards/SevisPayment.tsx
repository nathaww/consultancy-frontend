import {
  sevisPaymentStatusInterface,
  updateSevisPaymentStatus,
} from "@/api/usVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface props {
  visaId: string;
  sevisPaymentStatus: string;
}
const SevisPayment: React.FC<props> = ({ visaId, sevisPaymentStatus }) => {
  const queryClient = useQueryClient();

  const InterviewScheduleMutation = useMutation<
    sevisPaymentStatusInterface,
    Error,
    sevisPaymentStatusInterface
  >({
    mutationKey: ["SEVIS"],
    mutationFn: (data: sevisPaymentStatusInterface) =>
      updateSevisPaymentStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("Sevis payment confirmed");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleUpdateStatus = async () => {
    InterviewScheduleMutation.mutateAsync({
      id: visaId,
      sevisPaymentStatus: "Paid",
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 
           ${sevisPaymentStatus === "Paid" ? "text-green-600" : ""}
          `}
      >
        4.5 SEVIS Payment
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full items-center p-2 gap-1 ${
            sevisPaymentStatus === "Paid" ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>

      {sevisPaymentStatus === "Unpaid" && (
        <>
          <p className="my-2">Did the student pay the SEVIS payments? Status: {sevisPaymentStatus}</p>
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              handleUpdateStatus();
            }}
            className="btn btn-anim bg-primaryColor text-white"
          >
            {InterviewScheduleMutation.isPending ? "Loading..." : "Yes"}
          </button>
        </>
      )}
    </div>
  );
};

export default SevisPayment;
