import {
  ediInterviewSchedule,
  ediInterviewStatus,
  interviewScheduleInterface,
} from "@/api/usVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";

interface props {
  visaId: string;
  interviewAttended: boolean;
  interviewSchedule: string;
  serviceFeeDepositPaymentStatus: string;
}

const InterviewSchedule: React.FC<props> = ({
  visaId,
  interviewSchedule,
  interviewAttended,
  serviceFeeDepositPaymentStatus,
}) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const InterviewScheduleMutation = useMutation<
    interviewScheduleInterface,
    Error,
    interviewScheduleInterface
  >({
    mutationKey: ["addTrainingSchedule"],
    mutationFn: (data: interviewScheduleInterface) =>
      ediInterviewSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      toast.success("Interview Schedule added successfully");
      setSelectedDate(null); // Clear the selected date
    },
    onError: (error: any) => {
      toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
    },
  });

  const InterviewStatusMutation = useMutation<
    interviewScheduleInterface,
    Error,
    interviewScheduleInterface
  >({
    mutationKey: ["addTrainingSchedule"],
    mutationFn: (data: interviewScheduleInterface) => ediInterviewStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      toast.success("Interview Schedule added successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
    },
  });

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleAddSchedule = async () => {
    if (selectedDate) {
      InterviewScheduleMutation.mutateAsync({
        id: visaId,
        interviewSchedule: selectedDate,
      });
    }
  };

  const handleUpdateStatus = async () => {
    InterviewStatusMutation.mutateAsync({
      id: visaId,
      interviewAttended: true,
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 
           ${interviewSchedule && interviewAttended ? "text-green-600" : ""}
          `}
      >
        4.4 Interview Schedule
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full items-center p-2 gap-1 ${
            interviewSchedule && interviewAttended ? "flex" : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>

      {!interviewAttended && (
        <>
          {!interviewSchedule ? (
            <div className="flex items-center mt-3 gap-2">
              <p>Add Interview Schedule</p>
              <div className="flex gap-1">
                <input
                  type="date"
                  className="bg-green-600 text-white rounded p-2"
                  onChange={handleDateChange}
                  value={selectedDate || ""}
                />
                <button
                  onClick={handleAddSchedule}
                  className="btn btn-anim bg-primaryColor text-white"
                >
                  {InterviewScheduleMutation.isPending ? "Loading..." : "Add"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-3 bg-gray-200 p-2 rounded w-max">
              <p className="p-2 w-max bg-primaryColor rounded text-white">
                Interview
              </p>
              <p>{format(new Date(interviewSchedule), "dd/MM/yyyy")}</p>
            </div>
          )}
          {serviceFeeDepositPaymentStatus === "Paid" && (
            <>
              <p className="my-2">Did the student attend the interview?</p>
              <button
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  handleUpdateStatus();
                }}
                className="btn btn-anim bg-primaryColor text-white"
              >
                {InterviewScheduleMutation.isPending ? "Loading..." : "Yes"}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InterviewSchedule;
