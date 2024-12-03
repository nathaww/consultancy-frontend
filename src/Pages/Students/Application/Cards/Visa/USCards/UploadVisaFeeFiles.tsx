import {
  VisaInterface,
  uploadVisaFeeFiles,
  uploadVisaFeeStatus,
} from "@/api/usVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface Props {
  visaId: string | undefined;
  visaFeePaymentStatus: string;
  visaFeeFileUri: string | null;
}
const UploadVisaFeeFiles: React.FC<Props> = ({
  visaId,
  visaFeeFileUri,
  visaFeePaymentStatus,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visaPaymentMutation = useMutation<VisaInterface, Error, VisaInterface>({
    mutationKey: ["VisaPaymentMutation"],
    mutationFn: (data) => uploadVisaFeeStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      const notify = toast.success("Payment confirmed successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const uploadVisaFeeFileMutation = useMutation<FormData, Error, FormData>({
    mutationKey: ["uploadVisaFeeFileMutation"],
    mutationFn: (data: FormData) => uploadVisaFeeFiles(visaId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });

      const notify = toast.success("Document uploaded successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    const formData = new FormData();
    formData.append("file", selectedFile!);
    uploadVisaFeeFileMutation.mutateAsync(formData);
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };
  
  const handleRequest = async () => {
    visaPaymentMutation.mutateAsync({
      id: visaId,
      visaFeePaymentStatus: "Paid",
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 ${
          visaFeePaymentStatus === "Paid" ? "text-green-600" : ""
        }`}
      >
        {visaFeePaymentStatus === "Paid"
          ? "4.3 Visa Fee Payment status"
          : "4.3 Request for the student to download the fee document"}
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full flex items-center p-2 gap-1 ${
            visaFeePaymentStatus === "Paid" && visaFeeFileUri !== null
              ? "flex"
              : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>
      <div
        className={`flex flex-col gap-1 mt-2 ${
          visaFeePaymentStatus === "Paid" ? "hidden" : "flex"
        }`}
      >
        <p className="bg-blue-200 p-2 rounded w-max text-primaryColor">
          Visa fee payment status:{" "}
          <span
            className={`${
              visaFeePaymentStatus === "Paid"
                ? "text-primaryColor"
                : "text-red-600"
            }`}
          >
            {visaFeePaymentStatus}
          </span>
        </p>
        <p className="bg-blue-200 p-2 rounded w-max text-primaryColor">
          File upload status:{" "}
          <span
            className={`${
              visaFeeFileUri === null ? "text-red-600" : "text-primaryColor"
            }`}
          >
            {visaFeeFileUri === null ? "No file" : "Uploaded"}
          </span>
        </p>
      </div>
      <div
        className={`w-full ${
          visaFeePaymentStatus === "Paid" ? "hidden" : "flex"
        }`}
      >
        {visaFeeFileUri === null && (
          <div>
            <button
              disabled={uploadVisaFeeFileMutation.isPending}
              className="btn btn-anim bg-primaryColor text-white mt-2"
              onClick={openFileExplorer}
            >
              {uploadVisaFeeFileMutation.isPending
                ? "Loading..."
                : " Upload file"}
            </button>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </div>
        )}

        {visaFeeFileUri !== null && (
          <div className="mt-3">
            <p>Did the student pay the visa fee ?</p>
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                handleRequest();
              }}
              className="btn btn-anim bg-primaryColor text-white mt-2 w-40"
            >
              {visaPaymentMutation.isPending ? "Submitting..." : "Yes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadVisaFeeFiles;
