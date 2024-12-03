import { uploadCanadaVisaDocuments } from "@/api/canadaVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface Props {
  visaId: string | undefined;
  confirmationSent: boolean;
  confirmationReceived: boolean;
}
const UploadVisaFeeFiles: React.FC<Props> = ({
  visaId,
  confirmationSent,
  confirmationReceived,
}) => {
  const queryClient = useQueryClient();
  const [appConfirm, setAppConfirm] = useState<File | undefined>();
  const [paymentConfirm, setPaymentConfirm] = useState<File | undefined>();

  const CanadaFileUploadMutation = useMutation<FormData, Error, FormData>({
    mutationKey: ["CanadaFileUploadMutation"],
    mutationFn: (data: FormData) => uploadCanadaVisaDocuments(visaId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CanadaVisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("Documents uploaded successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleClick = () => {
    const formData = new FormData();
    formData.append("applicationConfirmation", appConfirm!);
    formData.append("paymentConfirmation", paymentConfirm!);
    CanadaFileUploadMutation.mutateAsync(formData);
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAppConfirm(event.target.files?.[0]);
  };

  const handleFileInputChange2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentConfirm(event.target.files?.[0]);
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 ${
          confirmationSent && confirmationReceived ? "text-green-600" : ""
        }`}
      >
        4.6 Submit files for the student to print
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full flex items-center p-2 gap-1 ${
            confirmationSent && confirmationReceived ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>

      {!confirmationSent && (
        <div>
          <div className="flex flex-col bg-gray-300 p-4 rounded md:flex-row lg:flex-row justify-center items-center gap-4 mt-3 w-max">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-semibold">
                Application Confirmation
              </label>
              <input type="file" onChange={handleFileInputChange} />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="font-semibold">
                Payment Confirmation
              </label>
              <input type="file" onChange={handleFileInputChange2} />
            </div>
          </div>
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              handleClick();
            }}
            className="btn btn-anim bg-primaryColor text-white mt-2 w-40"
          >
            {CanadaFileUploadMutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {!confirmationReceived && confirmationSent && (
        <div className="mt-4">
          <p className="text-sm bg-gray-500 w-max text-white p-1.5 rounded">
            Waiting for the student to confirm Visa Fee Files
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadVisaFeeFiles;
