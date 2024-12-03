import { makeReq } from "@/makeReq";

export interface VisaInterface {
  id?: string | undefined;
  visaApplicationStatus?: string;
  requiredDocumentsRequested?: boolean;
  requiredDocumentsReceived?: boolean;
  interviewTrainingScheduleComplete?: boolean;
  visaFeeFileUri?: string | undefined;
  visaFeePaymentStatus?: string | undefined;
  interviewSchedule?: string | undefined;
  interviewAttended?: boolean;
  serviceFeeDepositPaymentStatus?: string;
  serviceFeeDepositDate?: string;
  sevisPaymentStatus?: string | undefined;
  visaAccepted?: boolean;
  visaStatusNotificationSent?: boolean;
  visaStatusNotificationSentAt?: string | undefined;
  application?: {
    id: string;
    country: string;
    educationalLevel: string;
    fieldOfStudy: string;
  };
  interviewTrainingSchedules?: interviewTrainingSchedules[];
}

export interface interviewTrainingSchedules {
  unitedStatesVisaId?: string;
  id?: string;
  date?: string;
  status?: string;
}

export interface interviewScheduleInterface {
  id: string;
  interviewSchedule?: string;
  interviewAttended?: boolean;
}

export interface sevisPaymentStatusInterface {
  id: string;
  sevisPaymentStatus?: string;
}

export interface notifyUserInterface {
  id: string;
  visaAccepted?: boolean;
}

export const getRequiredVisaDocument = async (id: string) => {
  const res = await makeReq.get(`/united-states-visa/${id}`);
  return res.data;
};

export const getInterviewTrainingSchedule = async (id: string) => {
  const res = await makeReq.get(
    `/united-states-visa/interviewTrainingSchedule/${id}`
  );
  return res.data;
};

export const addInterviewTrainingSchedule = async (
  data: interviewTrainingSchedules
) => {
  const res = await makeReq.post(
    `/united-states-visa/interviewTrainingSchedule`,
    data
  );
  return res.data;
};

export const updateInterviewTrainingScheduleStatus = async (
  data: interviewTrainingSchedules
) => {
  const res = await makeReq.patch(
    `/united-states-visa/interviewTrainingSchedule`,
    data
  );
  return res.data;
};

export const updateVisaStatus = async (data: interviewTrainingSchedules) => {
  const res = await makeReq.patch(
    `/united-states-visa/visaApplicationStatus`,
    data
  );
  return res.data;
};

export const editRequiredVisaDocuments = async (data: VisaInterface) => {
  const res = await makeReq.patch(
    "/united-states-visa/editRequiredVisaDocuments",
    data
  );
  return res.data;
};

export const uploadVisaFeeFiles = async (id: string, file: FormData) => {
  const res = await makeReq.patch(
    `united-states-visa/uploadVisaFeeFile/${id}`,
    file
  );
  return res.data;
};

export const uploadVisaFeeStatus = async (file: VisaInterface) => {
  const res = await makeReq.patch(
    `/united-states-visa/editVisaFeePaymentStatus`,
    file
  );
  return res.data;
};

export const updateInterviewTrainingStatus = async (file: VisaInterface) => {
  const res = await makeReq.patch(
    `/united-states-visa/interviewTrainingScheduleStatus`,
    file
  );
  return res.data;
};

export const confirmDeposit = async (file: VisaInterface) => {
  const res = await makeReq.patch(
    `/united-states-visa/editServiceFeeDepositPaymentStatus`,
    file
  );
  return res.data;
};

export const ediInterviewStatus = async (file: interviewScheduleInterface) => {
  const res = await makeReq.patch(
    `/united-states-visa/editInterviewScheduleStatus`,
    file
  );
  return res.data;
};

export const ediInterviewSchedule = async (
  file: interviewScheduleInterface
) => {
  const res = await makeReq.patch(
    `/united-states-visa/interviewSchedule`,
    file
  );
  return res.data;
};

export const updateSevisPaymentStatus = async (
  file: interviewScheduleInterface
) => {
  const res = await makeReq.patch(`/united-states-visa/sevisPayment`, file);
  return res.data;
};

export const notifyUser = async (file: interviewScheduleInterface) => {
  const res = await makeReq.patch(`/united-states-visa/visaStatus`, file);
  return res.data;
};
