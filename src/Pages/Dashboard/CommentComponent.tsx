import React, { useState } from "react";
import {
  AddCommentInterface,
  CommentInterface,
  postComment,
} from "@/api/comment";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

interface CommentComponentProps {
  comment: CommentInterface;
  // replies: CommentInterface[];
  comments: CommentInterface[];
}

// const getReplies = (
//   parentId: string,
//   comments: CommentInterface[]
// ): CommentInterface[] => {
//   return comments.filter((comment) => comment.parent?.id === parentId);
// };

const CommentComponent: React.FC<CommentComponentProps> = ({
  comment,
  // comments,
}) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [replyText, setReplyText] = useState("");
  const [isReply, setIsReply] = useState(false);

  const commentMutation = useMutation<
    AddCommentInterface,
    Error,
    AddCommentInterface
  >({
    mutationKey: ["commentMutation"],
    mutationFn: async (data) => postComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      const notify = toast.success("Comment added successfully");
      notify;
      setReplyText("");
      setIsReply(false);
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleReplyClick = () => {
    commentMutation.mutateAsync({
      applicationId: id!,
      text: replyText,
      parentId: comment.id,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(event.target.value);
  };

  return (
    <div className="my-2 border-l-2 pl-4 border-gray-300">
      <div className="bg-gray-100 p-4 rounded">
        <div className="flex justify-between">
          <p className="text-base">{comment?.text}</p>
        </div>
        <span className="text-xs text-right text-primaryColor my-1">
          {comment?.user?.firstName} commented on{" "}
          {comment?.application?.student?.firstName}{" "}
          {comment?.application?.student?.lastName}'s {" "}
          {comment.application.educationalLevel} application to{" "}
          {comment.application.country}
        </span>
        <p className="text-xs text-right text-gray-500 my-1">
          {format(comment?.createdAt, "hh:mm a, dd/MM/yy")}
        </p>
        {isReply && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="input-style w-full"
              onChange={handleChange}
            />
            <button
              onClick={handleReplyClick}
              className="btn btn-sm btn-anim bg-primaryColor text-white mt-1"
            >
              {commentMutation.isPending ? "..." : "Reply"}
            </button>
          </div>
        )}
      </div>
      {/* {replies?.length > 0 && (
        <div className="ml-4">
          {replies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              replies={getReplies(reply.id, comments)}
              comments={comments}
            />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default CommentComponent;
