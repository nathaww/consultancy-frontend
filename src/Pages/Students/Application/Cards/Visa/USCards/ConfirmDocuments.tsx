import { VisaInterface, editRequiredVisaDocuments } from "@/api/usVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface Props {
  visaId: string | undefined;
  requiredDocumentsReceived: boolean;
}
const ConfirmDocuments: React.FC<Props> = ({
  visaId,
  requiredDocumentsReceived,
}) => {
  const queryClient = useQueryClient();
  const visaDocumentMutation = useMutation<VisaInterface, Error, VisaInterface>(
    {
      mutationKey: ["VisaDocumentMutation"],
      mutationFn: (data) => editRequiredVisaDocuments(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
        const notify = toast.success("Documents confirmed successfully");
        notify;
      },
      onError: (error: any) => {
        const notify = toast.error(
          error.response.data.message || "An unknown error occurred"
        );
        notify;
      },
    }
  );

  const handleRequest = async () => {
    visaDocumentMutation.mutateAsync({
      id: visaId,
      requiredDocumentsReceived: true,
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 ${
          requiredDocumentsReceived ? "text-green-600" : ""
        }`}
      >
        {requiredDocumentsReceived
          ? "4.2 Confirm documents"
          : "4.2 Have you received the requested documents ?"}
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full flex items-center p-2 gap-1 ${
            requiredDocumentsReceived ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>
      <div
        className={`w-full ${requiredDocumentsReceived ? "hidden" : "flex"}`}
      >
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            handleRequest();
          }}
          className="btn btn-anim bg-primaryColor text-white mt-3 w-40"
        >
          {visaDocumentMutation.isPending ? "Submitting..." : "Yes"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDocuments;
