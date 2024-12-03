import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  AdvertInterface,
  addAdvert,
  deleteAdvert,
  getAdvert,
} from "@/api/advert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

const Advert = () => {
  const { data, isError, isLoading } = useQuery<AdvertInterface[]>({
    queryKey: ["advert"],
    queryFn: () => getAdvert(),
  });

  const queryClient = useQueryClient();
  const fileInputRefAdvert = useRef<HTMLInputElement>(null);

  const uploadAdvertMutation = useMutation({
    mutationKey: ["transcript"],
    mutationFn: async (data: FormData) => addAdvert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advert"] });
      const notify = toast.success("Advert added successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const deleteAdvertMutation = useMutation({
    mutationKey: ["deleteAdvert"],
    mutationFn: async (id: string) => deleteAdvert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advert"] });
      const notify = toast.success("Advert deleted successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response?.data?.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this advert?")) {
      await deleteAdvertMutation.mutateAsync(id);
    }
  };

  const handleFileInputChangeAdvert = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    const formData = new FormData();
    formData.append("image", selectedFile!);
    uploadAdvertMutation.mutate(formData);
  };

  const openFileExplorerTranscript = () => {
    fileInputRefAdvert.current?.click();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 w-full">
        <p className="font-bold text-lg">Advertisement</p>
        <button
          onClick={openFileExplorerTranscript}
          className="btn btn-anim bg-primaryColor text-white mt-2 flex items-center justify-center gap-2"
        >
          <FaPlus />
          {uploadAdvertMutation.isPending ? "Adding..." : `Add Advert`}
        </button>
        <input
          ref={fileInputRefAdvert}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileInputChangeAdvert}
          type="file"
          className="input-style my-2"
        />
      </div>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data?.length === 0 && !isError && !isLoading && (
        <NoData text="No adverts" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4 w-full">
        {data?.map((item) => (
          <div key={item?.id} className="mb-4">
            <a
              className=" w-full cursor-pointer rounded"
              target="_blank"
              href={`import.meta.env.VITE_BASE_AWS_URL${item?.image}`}
            >
              <img
                src={`import.meta.env.VITE_BASE_AWS_URL${item?.image}`}
                alt="student profile img"
                loading="lazy"
                className="w-full h-56 rounded object-cover object-center"
              />
            </a>
            <button
              onClick={() => {
                handleDeleteClick(item.id);
              }}
              className="btn btn-anim bg-red-600 mt-2 w-full text-white"
            >
              {deleteAdvertMutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Advert;
