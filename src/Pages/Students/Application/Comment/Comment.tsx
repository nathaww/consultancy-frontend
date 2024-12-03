import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import { CommentInterface, deleteComment, getComment } from "@/api/comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import AddCommentModal from "./AddCommentModal";
import toast from "react-hot-toast";
import CommentComponent from "./CommentComponet";

const Comment = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const { data, isLoading, isError } = useQuery<CommentInterface[]>({
    queryKey: ["comments", id],
    queryFn: () => getComment(id!),
  });

  const deleteCommentMutation = useMutation({
    mutationKey: ["DeleteComment"],
    mutationFn: async (id: string) => deleteComment(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      toast.success("Comment deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
    },
  });

  const handleDelete = async (id: string | undefined) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutateAsync(id!);
    }
  };

  const getReplies = (parentId: string, comments: CommentInterface[]): CommentInterface[] => {
    return comments.filter(comment => comment.parent?.id === parentId);
  };

  return (
    <div className="card-shadow p-4 border flex-1 sm:mt-8 lg:mt-8 mt-2 rounded">
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg">Comments</p>
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            onOpenModal();
          }}
          className="btn btn-anim bg-primaryColor text-white"
        >
          Add
        </button>
      </div>
      <div>
        <AddCommentModal open={open} onCloseModal={onCloseModal} />

        {isLoading && <Loading />}

        {isError && <Error />}

        {data && data?.length < 1 && !isError && <NoData text="No Comments" />}

        {data && data?.length > 0 && !isError && (
          <div className="h-96 overflow-y-auto mt-2">
            {data
              .filter(comment => comment.parent === null)
              .map(mainComment => (
                <CommentComponent
                  key={mainComment.id}
                  comment={mainComment}
                  replies={getReplies(mainComment.id, data)}
                  handleDelete={handleDelete}
                  comments={data}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
