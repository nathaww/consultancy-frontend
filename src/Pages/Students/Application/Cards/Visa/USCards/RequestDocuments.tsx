import { VisaInterface, editRequiredVisaDocuments } from "@/api/usVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { CgCheck, CgFileDocument } from "react-icons/cg";

interface Props {
  visaId: string | undefined;
  requiredDocumentsRequested: boolean;
}
const RequestDocuments: React.FC<Props> = ({
  visaId,
  requiredDocumentsRequested,
}) => {
  const queryClient = useQueryClient();
  const visaDocumentMutation = useMutation<VisaInterface, Error, VisaInterface>(
    {
      mutationKey: ["VisaDocumentMutation"],
      mutationFn: (data) => editRequiredVisaDocuments(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
        const notify = toast.success("Documents requested successfully");
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
      requiredDocumentsRequested: true,
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 ${
          requiredDocumentsRequested ? "text-green-600" : ""
        }`}
      >
        {requiredDocumentsRequested
          ? "4.1 Request documents"
          : "4.1 Request the following documents"}
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full flex items-center p-2 gap-1 ${
            requiredDocumentsRequested ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>
      <div
        className={`w-full ${requiredDocumentsRequested ? "hidden" : "flex"}`}
      >
        <div
          className={`w-full flex flex-col gap-2 mt-3 ${
            requiredDocumentsRequested ? "hidden" : "flex"
          }`}
        >
          <p className="flex items-center gap-1">
            <CgFileDocument className="text-2xl" />
            Passport Size 5x5 photo
          </p>
          <p className="flex items-center gap-1">
            <CgFileDocument className="text-2xl" />
            Passport
          </p>
          <p className="flex items-center gap-1">
            <CgFileDocument className="text-2xl" />
            Bank Statement of the sponsor
          </p>
          <p className="flex items-center gap-1">
            <CgFileDocument className="text-2xl" />
            Sponsor full name and address
          </p>
          <p className="flex items-center gap-1">
            <CgFileDocument className="text-2xl" />2 Friends full name, phone
            and address
          </p>
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              handleRequest();
            }}
            className="btn btn-anim bg-primaryColor text-white mt-3 w-40"
          >
            {visaDocumentMutation.isPending ? "Requesting..." : "Request"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDocuments;
