import { makeReq } from "@/makeReq";

export interface DepositInterface {
  isDeposited?: boolean;
  isBlocked?: boolean;
  expiration?: Date | undefined;
  applicationId: string;
  status?: string;
}

export interface AddApplicationInterface {
  country: string;
  educationalLevel: string;
  fieldOfStudy: string;
  studentId: String;
}

export interface ApplicationInterface {
  id: string;
  admissionStatus: string;
  applicationStatus?: string;
  country?: string;
  educationalLevel?: string;
  fieldOfStudy?: string;
  institutes?: [
    {
      id: string;
      name: string;
      comment: string;
      admissionStatus: string;
    }
  ];
  intake?: string;
}

export interface InstituteInterface {
  id: string;
  name: string;
  comment: string;
  admissionStatus: string;
}

export interface RecentActivitiesInterface {
  createdAt: string;
  entity: string;
  id: string;
  operation: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
  detail: string;
}

export const postApplication = async (data: AddApplicationInterface) => {
  const res = await makeReq.post("/applications", data);
  return res.data;
};

export const postDeposit = async (data: DepositInterface) => {
  const res = await makeReq.patch("/deposit", data);
  return res.data;
};

export const updateStatus = async (data: ApplicationInterface) => {
  const res = await makeReq.patch("/applications/admissionStatus", data);
  return res.data;
};
export const updateInstitute = async (data: InstituteInterface) => {
  const res = await makeReq.patch("/applications/institute", data);
  return res.data;
};

export const getDeposit = async (applicationId: string) => {
  const res = await makeReq.get(`/deposit/${applicationId}`);
  return res.data;
};

export const getApplication = async (applicationId: string) => {
  const res = await makeReq.get(`/applications/details/${applicationId}`);
  return res.data;
};

export const getRecentActivities = async (id: string) => {
  const res = await makeReq.get(`/audit/${id}`);
  return res.data;
};

export const deleteApplication = async (id: string) => {
  const res = await makeReq.delete(`/applications/${id}`);
  return res.data;
};
