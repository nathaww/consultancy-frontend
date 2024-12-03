import { makeReq } from "@/makeReq";

export interface CanadaVisaInterface {
  confirmationReceived?: boolean;
  biometricSubmissionDate?: string;
  visaApplicationAndBiometricSubmitted?: string;
  serviceFeeDepositDate?: string;
  serviceFeeDepositPaymentStatus?: string;
  confirmationSent?: boolean;
  id?: string;
  requiredDocumentsReceived?: boolean;
  requiredDocumentsRequested?: boolean;
  visaAccepted?: boolean;
  visaApplicationAndBiometricFee?: "Unpaid" | "Paid";
  visaApplicationAndBiometricFeeAmount?: number;
  visaApplicationStatus?:
    | "Pending"
    | "DocumentsReceived"
    | "VisaApplicationAndBiometricFeeAmountSet"
    | "VisaApplicationAndBiometricFeePaid"
    | "ConfirmationSent"
    | "NotifiedUser";
  visaStatusNotificationSent?: boolean;
  visaStatusNotificationSentAt?: null;
  application?: {
    id: string;
    country: string;
    educationalLevel: string;
    fieldOfStudy: string;
  };
}

export interface NotifyUserInterface {
  id?: string;
  visaAccepted?: boolean;
  visaStatusNotificationSent?: boolean;
}

export const getCanadaVisa = async (applicationId: string) => {
  const res = await makeReq.get(`/canada-visa/${applicationId}`);
  return res.data;
};

export const requestDocument = async (data: CanadaVisaInterface) => {
  const res = await makeReq.patch(
    "/canada-visa/editRequiredVisaDocuments",
    data
  );
  return res.data;
};

export const confirmRequestedDocument = async (data: CanadaVisaInterface) => {
  const res = await makeReq.patch(
    "/canada-visa/editRequiredVisaDocuments",
    data
  );
  return res.data;
};

export const editVisaApplicationAndBiometricFeeAmount = async (
  file: CanadaVisaInterface
) => {
  const res = await makeReq.patch(
    `/canada-visa/editVisaApplicationAndBiometricFeeAmount`,
    file
  );
  return res.data;
};

export const editVisaApplicationAndBiometricFeeStatus = async (
  file: CanadaVisaInterface
) => {
  const res = await makeReq.patch(
    `/canada-visa/editVisaApplicationAndBiometricFeePaymentStatus`,
    file
  );
  return res.data;
};

export const editBiometricSubmissionDate = async (
  file: CanadaVisaInterface
) => {
  const res = await makeReq.patch(
    `/canada-visa/editBiometricSubmissionDate`,
    file
  );
  return res.data;
};
export const editServicePaymentStatus = async (file: CanadaVisaInterface) => {
  const res = await makeReq.patch(
    `/canada-visa/editServiceFeeDepositPaymentStatus`,
    file
  );
  return res.data;
};

export const uploadCanadaVisaDocuments = async (id: string, file: FormData) => {
  const res = await makeReq.patch(
    `/canada-visa/editVisaConfirmationFiles/${id}`,
    file
  );
  return res.data;
};

export const notifyUserCanada = async (file: NotifyUserInterface) => {
  const res = await makeReq.patch(`/canada-visa/visaStatus`, file);
  return res.data;
};
