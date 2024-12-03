import { uploadTranscript } from "@/api/school";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { FaFileDownload, FaUpload } from "react-icons/fa";

type Props = {
  id: string;
  transcriptFileUri: string;
};

const Transcript: React.FC<Props> = ({ id, transcriptFileUri }) => {
  const queryClient = useQueryClient();
  const fileInputRefTranscript = useRef<HTMLInputElement>(null);

  const uploadTranscriptMutation = useMutation({
    mutationKey: ["transcript"],
    mutationFn: async (data: FormData) => uploadTranscript(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      const notify = toast.success("Transcript added successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleFileInputChangeTranscript = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    const formData = new FormData();
    formData.append("transcript", selectedFile!);
    uploadTranscriptMutation.mutate(formData);
  };

  const openFileExplorerTranscript = () => {
    fileInputRefTranscript.current?.click();
  };

  return (
    <div>
      <p className="text-black font-semibold mt-2">Transcript</p>

      <div>
        <input
          ref={fileInputRefTranscript}
          style={{ display: "none" }}
          onChange={handleFileInputChangeTranscript}
          type="file"
          className="input-style my-2"
        />
        {transcriptFileUri && (
          <div className="bg-primaryColor w-max p-2 rounded mt-2">
            <a
              target="_blank"
              href={`import.meta.env.VITE_BASE_AWS_URL${transcriptFileUri}`}
              className="flex items-center justify-center gap-2"
            >
              <FaFileDownload className="text-xl cursor-pointer text-white" />
              <p className="text-white text-center">Download Transcript</p>
            </a>
          </div>
        )}
        <button
          onClick={openFileExplorerTranscript}
          className="btn btn-anim bg-primaryColor text-white mt-2 flex items-center justify-center gap-2"
        >
          <FaUpload />
          {uploadTranscriptMutation.isPending
            ? "Uploading..."
            : `${
                transcriptFileUri
                  ? "Update Transcript"
                  : "Upload/Update Transcript"
              }`}
        </button>
      </div>
    </div>
  );
};

export default Transcript;
