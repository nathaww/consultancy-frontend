import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import Loading from "@/Components/Loading State/Loading";
import Error from "@/Components/Loading State/Error";
import { NoData } from "@/Components/Loading State/NoData";
import { PostInterface, deletePost, getPosts } from "@/api/post";
import { format } from "date-fns";
import AddPostModal from "./AddPostModal";
import { useState } from "react";
import { CgTrash } from "react-icons/cg";

const Post = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const { data, isLoading, isError } = useQuery<PostInterface[]>({
    queryKey: ["post"],
    queryFn: () => getPosts(),
  });

  const handleDeleteClick = async (id: string | undefined) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePostMutation.mutateAsync(id!);
    }
  };

  const deletePostMutation = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: async (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      const notify = toast.success("Post deleted successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  return (
    <>
      <AddPostModal open={open} onCloseModal={onCloseModal} />
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-base sm:text-xl lg:tex-xl font-bold">Posts</h1>
        <button
          onClick={onOpenModal}
          className="btn btn-anim bg-primaryColor text-white flex gap-2 items-center sm:w-36 lg:w-36"
        >
          <FaPlus />
          Add Post
        </button>
      </div>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data?.length === 0 && !isError && <NoData text="No Posts" />}

      {data && data?.length > 0 && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 min-w-full">
          {data?.map((item) => (
            <div
              key={item.id}
              className="card-shadow p-3 mb-3 h-max min-w-full"
            >
              <div
                className="flex flex-col sm:flex-row lg:flex-row gap-2"
                key={item.id || "-"}
              >
                <div className=" mx-auto md:w-56 lg:w-56 h-60 rounded">
                  <img
                    src={`import.meta.env.VITE_BASE_AWS_URL${item.image}`}
                    alt="post image"
                    loading="lazy"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="w-full flex-1">
                  <div className="w-full flex flex-col gap-y-3">
                    <p className="text-base font-semibold sm:text-xl lg:text-xl">
                      {item.title}
                    </p>
                    <p className="text-xs sm:text-sm lg:text-sm text-left text-gray-500">
                      {" "}
                      {item?.createdAt
                        ? format(new Date(item.createdAt), "hh:mm dd/MM/yyyy")
                        : "-"}
                    </p>
                    <p className="text-sm">{item.description}</p>
                    <a href={item.videoLink} className="text-sm underline">
                      {item.videoLink}
                    </a>
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        handleDeleteClick(item?.id!);
                      }}
                      className="btn-anim"
                    >
                      <CgTrash className="text-2xl text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Post;
