import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  AdditionalFileInterface,
  deleteAdditionalFiles,
  getAdditionalFiles,
} from "@/api/additionalFiles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaFileDownload, FaPlus, FaTrash } from "react-icons/fa";
import AddAdditionalFilesModal from "./AddAdditionalFilesModal";
import toast from "react-hot-toast";

const AdditionalFiles = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const { data, isLoading, isError } = useQuery<AdditionalFileInterface[]>({
    queryKey: ["additionalFiles"],
    queryFn: () => getAdditionalFiles(),
  });

  const deleteFileMutation = useMutation({
    mutationKey: ["deleteAdditionalFiles"],
    mutationFn: async (id: string) => deleteAdditionalFiles(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["additionalFiles"] });
      const notify = toast.success("File deleted successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      await deleteFileMutation.mutateAsync(id);
    }
  };

  return (
    <div className="mt-8 w-full">
      <AddAdditionalFilesModal open={open} onCloseModal={onCloseModal} />

      <div className="bg-white shadow w-full rounded p-4">
        <div className="flex justify-between items-center">
          <h1 className="font-bold">Additional Files</h1>
          <button
            onClick={onOpenModal}
            className="btn btn-anim bg-primaryColor text-white flex items-center gap-2"
          >
            <FaPlus />
            Add Files
          </button>
        </div>

        {isLoading && <Loading />}

        {isError && <Error />}

        {data?.length === 0 && !isLoading && !isError && (
          <NoData text="No Additional files found" />
        )}

        {data && !isError && (
          <div className="flex flex-wrap items-center gap-x-4">
            {data?.map((item) => (
              <div key={item.id} className="flex flex-col gap-3">
                <div className="bg-primaryColor px-3 py-4 w- rounded text-white flex flex-col items-center justify-center gap-2 mt-4">
                  <a
                    target="_blank"
                    href={`import.meta.env.VITE_BASE_AWS_URL${item.fileUri}`}
                  >
                    <FaFileDownload className="text-5xl cursor-pointer" />
                  </a>
                  <p className="text-center text-sm">{item.fileType}</p>
                </div>
                <button
                  onClick={() => {
                    handleDeleteClick(item.id);
                  }}
                  className="bg-red-600 flex btn-anim items-center justify-center text-white gap-2 p-2 rounded text-sm"
                >
                  Delete
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalFiles;
