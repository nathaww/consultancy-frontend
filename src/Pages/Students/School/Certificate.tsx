import { uploadCertificate } from "@/api/school";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { FaFileDownload, FaUpload } from "react-icons/fa";

type Props = {
  id: string;
  certificateFileUri: string;
};

const Certificate: React.FC<Props> = ({ id, certificateFileUri }) => {
  const queryClient = useQueryClient();
  const fileInputRefCertificate = useRef<HTMLInputElement>(null);

  const uploadCertificateMutation = useMutation({
    mutationKey: ["certificate"],
    mutationFn: async (data: FormData) => uploadCertificate(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      const notify = toast.success("Certificate added successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleFileInputChangeCertificate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    const formData = new FormData();
    formData.append("certificate", selectedFile!);
    uploadCertificateMutation.mutate(formData);
  };

  const openFileExplorerCertificate = () => {
    fileInputRefCertificate.current?.click();
  };

  return (
    <div>
      <p className="text-black font-semibold mt-2">Certificate</p>

      <div>
        <input
          ref={fileInputRefCertificate}
          style={{ display: "none" }}
          onChange={handleFileInputChangeCertificate}
          type="file"
          className="input-style my-2"
        />
        {certificateFileUri && (
          <div className="bg-primaryColor w-max p-2 rounded mt-2">
            <a
              target="_blank"
              href={`import.meta.env.VITE_BASE_AWS_URL${certificateFileUri}`}
              className="flex items-center justify-center gap-2"
            >
              <FaFileDownload className="text-xl cursor-pointer text-white" />
              <p className="text-white text-center">Download Certificate</p>
            </a>
          </div>
        )}
        <button
          onClick={openFileExplorerCertificate}
          className="btn btn-anim bg-primaryColor text-white mt-2 flex items-center gap-2"
        >
          <FaUpload />
          {uploadCertificateMutation.isPending
            ? "Uploading..."
            : `${
                certificateFileUri
                  ? "Update certificate"
                  : "Upload/Update Certificate"
              }`}
        </button>
      </div>
    </div>
  );
};

export default Certificate;
