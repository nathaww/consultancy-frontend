import {
  VisaInterface,
  addInterviewTrainingSchedule,
  interviewTrainingSchedules,
  updateInterviewTrainingScheduleStatus,
  updateInterviewTrainingStatus,
} from "@/api/usVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaCheck } from "react-icons/fa";

interface Props {
  visaId: string;
  interviewTrainingScheduleComplete: boolean;
  interviewSchedule: string;
  interviewTrainingSchedules: interviewTrainingSchedules[];
}

const TrainingSchedule: React.FC<Props> = ({
  visaId,
  interviewTrainingScheduleComplete,
  interviewTrainingSchedules,
  interviewSchedule,
}) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTrainingScheduleMutation = useMutation<
    interviewTrainingSchedules,
    Error,
    interviewTrainingSchedules
  >({
    mutationKey: ["addTrainingSchedule"],
    mutationFn: (data: interviewTrainingSchedules) =>
      addInterviewTrainingSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VisaDocument"] });
      toast.success("Schedule Added");
      setSelectedDate(null);
    },
    onError: (error: any) => {
      toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
    },
  });

  const updateTrainingScheduleMutation = useMutation<
    interviewTrainingSchedules,
    Error,
    interviewTrainingSchedules
  >({
    mutationKey: ["updateTrainingSchedule"],
    mutationFn: (data: interviewTrainingSchedules) =>
      updateInterviewTrainingScheduleStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["VisaDocument"],
      });
      toast.success("Schedule updated");
    },
    onError: (error: any) => {
      toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
    },
  });

  const updateInterviewTrainingMutation = useMutation<
    VisaInterface,
    Error,
    VisaInterface
  >({
    mutationKey: ["updateVisaStatus"],
    mutationFn: (data: VisaInterface) =>
      updateInterviewTrainingStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["VisaDocument"],
      });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      toast.success("Training Schedule Complete");
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

  const handleAddTrainingSchedule = async () => {
    if (selectedDate) {
      addTrainingScheduleMutation.mutateAsync({
        unitedStatesVisaId: visaId,
        date: selectedDate,
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    updateTrainingScheduleMutation.mutateAsync({
      id: id,
      status: status,
    });
  };

  const handleUpdateVisaApplication = async () => {
    updateInterviewTrainingMutation.mutateAsync({
      id: visaId,
      interviewTrainingScheduleComplete: true,
    });
  };

  return (
    <>
      {interviewTrainingScheduleComplete ? (
        <div className="bg-gray-100 text-black w-max rounded p-4 flex items-center gap-2 mt-2">
          <div className="bg-green-700 p-2 rounded-full">
            <FaCheck className="text-white" />
          </div>
          <p>Training Schedules Complete</p>
        </div>
      ) : (
        ""
      )}
      {!interviewTrainingScheduleComplete && interviewSchedule && (
        <div className={`mt-2 bg-gray-100 p-3 w-max rounded`}>
          <p className={`flex items-center font-bold gap-2`}>
            Training Schedules (
            {interviewTrainingSchedules.length > 0
              ? interviewTrainingSchedules.length
              : 0}
            )
          </p>
          {interviewTrainingSchedules.length === 0 ? (
            <p>
              There are no schedules, please select a date for a training
              schedule below.
            </p>
          ) : (
            ""
          )}
          <div className="my-3">
            {interviewTrainingSchedules?.map((item, index) => (
              <div
                className="p-2 mb-2 text-sm w-max rounded flex items-center gap-2 bg-gray-200"
                key={item.id}
              >
                <div className="flex text-sm md:text-base lg:text-base items-center gap-1 md:gap-2 lg:gap-2 rounded text-white bg-green-600 p-2">
                  <FaCalendarAlt className="text-white" />
                  Schedule {index + 1}
                </div>
                <div className="flex items-center gap-1 md:gap-2 lg:gap-2">
                  <p>{format(new Date(item.date!), "dd/MM/yyyy")}</p>
                  <p>{item.status}</p>
                </div>
                {item.status === "Pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        handleStatusUpdate(item.id!, "Attended");
                      }}
                      className="btn btn-anim bg-primaryColor text-white"
                    >
                      {updateTrainingScheduleMutation.isPending
                        ? "Loading..."
                        : "Attended"}
                    </button>
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        handleStatusUpdate(item.id!, "Missed");
                      }}
                      className="btn btn-anim bg-red-600 text-white"
                    >
                      {updateTrainingScheduleMutation.isPending
                        ? "Loading..."
                        : "Missed"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="font-semibold my-2">
            Add Schedule{" "}
            <span className="text-gray-500 font-normal">
              (You can add multiple)
            </span>
          </p>
          <div className="flex gap-1">
            <input
              type="date"
              className="bg-green-600 text-white rounded p-2"
              ref={fileInputRef}
              onChange={handleDateChange}
            />
            <button
              onClick={handleAddTrainingSchedule}
              className="btn btn-anim bg-primaryColor text-white md:w-40 lg:w-40"
            >
              {addTrainingScheduleMutation.isPending
                ? "Submitting..."
                : "Add Schedule"}
            </button>
            <button
              onClick={handleUpdateVisaApplication}
              className="btn btn-anim bg-primaryColor text-white md:w-40 lg:w-40"
            >
              {updateInterviewTrainingMutation.isPending
                ? "Submitting..."
                : "Finish"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainingSchedule;
