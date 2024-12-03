import {
  ApplicationInterface,
  DepositInterface,
  getApplication,
  getDeposit,
  updateStatus,
} from "@/api/application";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import AddInstituteModal from "./AddInstituteModal";
import {
  AddCommentInstituteInterface,
  addCommentInstitute,
  deleteInstitute,
  updateInstituteStatus,
  updateInstituteStatusInterface,
} from "@/api/englishTest";

const Admission = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [replyText, setReplyText] = useState("");
  const [isReply, setIsReply] = useState(false);

  const [admissionData, setAdmissionData] = useState({
    id: id!,
    admissionStatus: "",
  });

  const [instituteStatusData, setInstituteStatusData] = useState({
    id: "",
    admissionStatus: "",
  });

  const { data: depositData } = useQuery<DepositInterface>({
    queryKey: ["getDeposit"],
    queryFn: () => getDeposit(id!),
  });

  const { data } = useQuery<ApplicationInterface>({
    queryKey: ["getApplication"],
    queryFn: () => getApplication(id!),
  });

  const admissionMutation = useMutation<
    ApplicationInterface,
    Error,
    ApplicationInterface
  >({
    mutationKey: ["admission"],
    mutationFn: (data) => updateStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplication"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("Status Updated Successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response?.data?.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const addCommentMutation = useMutation<
    AddCommentInstituteInterface,
    Error,
    AddCommentInstituteInterface
  >({
    mutationKey: ["instituteCOmmentUpdate"],
    mutationFn: (data) => addCommentInstitute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplication"] });
      const notify = toast.success("Comment added Successfully");
      notify;
      setIsReply(false);
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response?.data?.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const updateInstituteStatusMutation = useMutation<
    updateInstituteStatusInterface,
    Error,
    updateInstituteStatusInterface
  >({
    mutationKey: ["updateInstituteStatus"],
    mutationFn: (data) => updateInstituteStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplication"] });
      const notify = toast.success("Status updated Successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response?.data?.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const deleteInstituteMutation = useMutation({
    mutationKey: ["deleteInstitute"],
    mutationFn: async (id: string) => deleteInstitute(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplication"] });
      toast.success("Institute deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response.data.message || "An unknown error occurred");
    },
  });

  const handleDeleteInstitute = async (id: string | undefined) => {
    if (window.confirm("Are you sure you want to delete this institute?")) {
      deleteInstituteMutation.mutateAsync(id!);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAdmissionData({
      id: id!,
      admissionStatus: event.target.value,
    });
  };

  const handleSelectChangeInstitute = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setInstituteStatusData({
      id: "",
      admissionStatus: event.target.value,
    });
  };

  const handleStatusUpdate = async (id: string) => {
    try {
      await updateInstituteStatusMutation.mutateAsync({
        id,
        admissionStatus: instituteStatusData.admissionStatus,
      });
    } catch (error) {}
  };

  const handleUpdate = async () => {
    try {
      await admissionMutation.mutateAsync(admissionData);
    } catch (error) {}
  };

  const handleReplyClick = (id: string) => {
    addCommentMutation.mutateAsync({
      id: id!,
      comment: replyText,
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReplyText(event.target.value);
  };

  return (
    <div className="w-full border min-h-40 card-shadow rounded mt-8">
      <div className="w-full bg-white min-h-40 flex justify-between h-full rounded p-4">
        <div className="flex flex-col gap-y-4 w-full">
          <div className="flex justify-between w-full items-center">
            <p className="text-base md:text-lg lg:text-lg font-semibold">
              3. Admission
            </p>
          </div>

          <AddInstituteModal open={open} onCloseModal={onCloseModal} />

          {depositData?.status === "Pending" ? (
            <p className="text-base text-gray-500">
              (Make sure previous steps are completed before you can load
              admission information)
            </p>
          ) : (
            <div className="flex justify-between w-full">
              <div className="w-1/2 p-4 flex flex-col gap-3">
                <p className="text-base flex items-center gap-1">
                  Status: {data?.admissionStatus || "-"}
                </p>
                <p className="text-base flex items-center gap-1">
                  Educational Level: {data?.educationalLevel || "-"}
                </p>
                <p className="text-base flex items-center gap-1">
                  Country: {data?.country || "-"}
                </p>
                <p className="text-base flex items-center gap-1">
                  Field of study: {data?.fieldOfStudy || "-"}
                </p>
                <p className="text-base flex items-center justify-between gap-1 w-full">
                  Institute(s)
                  <button
                    onClick={onOpenModal}
                    className="w-max btn btn-anim bg-primaryColor text-white"
                  >
                    Add Institute
                  </button>
                </p>
                <div className="h-56 overflow-y-scroll">
                  {data?.institutes &&
                    data?.institutes.map((institute) => (
                      <div
                        key={institute.id}
                        className="bg-gray-100 p-4 rounded mb-2 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-base flex items-center gap-1">
                            {institute?.name}
                          </p>
                          <div className="text-sm flex flex-col bg-[#B6D4E3] p-2 rounded text-primaryColor">
                            Status: {institute?.admissionStatus}
                            <div>
                              <label className="mt-4">Change Status</label>
                              <div className="flex items-center gap-2">
                                <select
                                  required
                                  className={`input-style w-full mt-1 text-black`}
                                  aria-label="Select Status"
                                  onChange={handleSelectChangeInstitute}
                                >
                                  <option>Select Status</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Applying">Applying</option>
                                  <option value="Accepted">Accepted</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                                <button
                                  onClick={() => {
                                    handleStatusUpdate(institute.id);
                                  }}
                                  className="rounded p-2 btn-anim bg-primaryColor text-white"
                                >
                                  {updateInstituteStatusMutation.isPending
                                    ? "Submitting..."
                                    : "Submit"}
                                </button>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm flex items-center gap-1 bg-[#B6D4E3] p-2 rounded mt-2 text-primaryColor">
                            Comment: {institute?.comment || "-"}
                            {!institute?.comment && (
                              <button
                                onClick={(
                                  event: React.MouseEvent<HTMLButtonElement>
                                ) => {
                                  event.preventDefault();
                                  setIsReply(!isReply);
                                }}
                                className="rounded p-2  btn-anim text-xs bg-primaryColor text-white"
                              >
                                {isReply ? "Cancel" : "Add Comment"}
                              </button>
                            )}
                          </p>
                          {isReply && (
                            <div className="flex flex-row items-center gap-x-2 mt-2">
                              <input
                                type="text"
                                className="input-style w-full text-sm"
                                onChange={handleChange}
                              />
                              <button
                                onClick={() => {
                                  handleReplyClick(institute?.id);
                                }}
                                className="rounded p-2 btn-anim bg-primaryColor text-white"
                              >
                                {addCommentMutation.isPending ? "..." : "Add"}
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            handleDeleteInstitute(institute.id);
                          }}
                          className="btn btn-anim"
                        >
                          <FaTrashCan className="text-red-600 text-lg" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className=" flex flex-col w-1/2 gap-y-2 p-4">
                <label className="mt-4">Change Status</label>
                <select
                  required
                  className={`input-style w-full mt-1 `}
                  aria-label="Select Status"
                  onChange={handleSelectChange}
                >
                  <option>Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Applying">Applying</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  onClick={() => {
                    handleUpdate();
                  }}
                  className="btn btn-anim bg-primaryColor text-white"
                >
                  {admissionMutation.isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admission;
