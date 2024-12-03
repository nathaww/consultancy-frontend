import {
  CanadaVisaInterface,
  editBiometricSubmissionDate,
} from "@/api/canadaVisa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import { CgCheck } from "react-icons/cg";
import { FaCalendar } from "react-icons/fa";

type Props = {
  visaId: string;
  biometricSubmissionDate: string;
  visaApplicationAndBiometricSubmitted: string;
};
const BiometricSubmissionDate: React.FC<Props> = ({
  visaId,
  biometricSubmissionDate,
  visaApplicationAndBiometricSubmitted,
}) => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const biometricSubmissionScheduleMutation = useMutation<
    CanadaVisaInterface,
    Error,
    CanadaVisaInterface
  >({
    mutationKey: ["addTrainingSchedule"],
    mutationFn: (data: CanadaVisaInterface) =>
      editBiometricSubmissionDate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CanadaVisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      toast.success("Biometric submission date added successfully");
      setSelectedDate(null);
    },
    onError: (error: any) => {
      toast.error(error?.response.data.message || "An unknown error occurred");
    },
  });

  const biometricStatusMutation = useMutation<
    CanadaVisaInterface,
    Error,
    CanadaVisaInterface
  >({
    mutationKey: ["addTrainingSchedule"],
    mutationFn: (data: CanadaVisaInterface) =>
      editBiometricSubmissionDate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["CanadaVisaDocument"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      toast.success("Biometric submission date added successfully");
      setSelectedDate(null);
    },
    onError: (error: any) => {
      toast.error(error?.response.data.message || "An unknown error occurred");
    },
  });

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleAddSchedule = async () => {
    if (selectedDate) {
      biometricSubmissionScheduleMutation.mutateAsync({
        id: visaId,
        biometricSubmissionDate: selectedDate,
      });
    }
  };

  const handleUpdateBiometricStatus = async () => {
    biometricStatusMutation.mutateAsync({
      id: visaId,
      visaApplicationAndBiometricSubmitted: "Attended",
    });
  };

  return (
    <div>
      <p
        className={`flex items-center gap-2 ${
          visaApplicationAndBiometricSubmitted === "Attended"
            ? "text-green-600"
            : ""
        }`}
      >
        {"4.4 Biometric Submission Date"}
        <span
          className={`px-3 bg-green-200 text-green-600 rounded-full flex items-center p-2 gap-1 ${
            visaApplicationAndBiometricSubmitted === "Attended"
              ? "flex"
              : "hidden"
          }`}
        >
          <CgCheck className="text-white text-3xl bg-green-600 w-5 h-5 rounded-full" />
          Complete
        </span>
      </p>
      <div
        className={`w-full ${
          visaApplicationAndBiometricSubmitted === "Attended"
            ? "hidden"
            : "flex"
        }`}
      >
        {biometricSubmissionDate ? (
          <div>
            <div className="bg-gray-100 p-3 rounded flex items-center gap-2 mt-2">
              <div className="bg-green-200 p-2 rounded">
                <FaCalendar className="text-green-600" />
              </div>
              <p>
                Submission Date:{" "}
                {format(new Date(biometricSubmissionDate), "dd/MM/yyyy")}
              </p>
            </div>
            <div className="mt-4">
              <p>Did the student submit biometric? Status: {visaApplicationAndBiometricSubmitted}</p>
              <button
                onClick={handleUpdateBiometricStatus}
                className="btn btn-anim bg-primaryColor text-white mt-1"
              >
                {biometricStatusMutation.isPending ? "Loading..." : "Yes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center mt-3 gap-2">
            <p>Add Biometric Submission Date</p>
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
                {biometricSubmissionScheduleMutation.isPending
                  ? "Loading..."
                  : "Add"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiometricSubmissionDate;
