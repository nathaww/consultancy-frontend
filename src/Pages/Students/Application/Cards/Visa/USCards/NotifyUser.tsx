import { notifyUser, notifyUserInterface } from "@/api/usVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface props {
  visaId: string;
  visaStatusNotificationSent: boolean;
}
const NotifyUser: React.FC<props> = ({
  visaId,
  visaStatusNotificationSent,
}) => {
  const queryClient = useQueryClient();

  const notifyUserMutation = useMutation<
    notifyUserInterface,
    Error,
    notifyUserInterface
  >({
    mutationKey: ["notifyUser"],
    mutationFn: (data: notifyUserInterface) => notifyUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("The student will be notified");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleUpdateStatus = async (status: boolean) => {
    notifyUserMutation.mutateAsync({
      id: visaId,
      visaAccepted: status,
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 
             ${visaStatusNotificationSent ? "text-green-600" : ""}
            `}
      >
        4.6 Notify User
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full items-center p-2 gap-1 ${
            visaStatusNotificationSent ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>

      {!visaStatusNotificationSent && (
        <>
          <p className="my-2">Is the student accepted?</p>
          <div className="flex items-center gap-2">
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                handleUpdateStatus(true);
              }}
              className="btn btn-anim bg-primaryColor text-white"
            >
              {notifyUserMutation.isPending ? "Loading..." : "Yes"}
            </button>

            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                handleUpdateStatus(false);
              }}
              className="btn btn-anim bg-red-600 text-white"
            >
              {notifyUserMutation.isPending ? "Loading..." : "No"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NotifyUser;
