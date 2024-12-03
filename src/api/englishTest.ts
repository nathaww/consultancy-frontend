import { makeReq } from "@/makeReq";

export interface EnglishTestInterface {
  englishTestRequired?: string;
  englishTest: {
    applicationId?: string;
    practiceLink: string | undefined;
    practiceLink2: string | undefined;
    testDate: string | undefined;
    score?: string;
    email: string | undefined;
    password: string | undefined;
    application?: Application;
    hasPassed?: string;
  };
}
export interface AddEnglishTestInterface {
  applicationId?: string;
  practiceLink: string | undefined;
  practiceLink2: string | undefined;
  testDate: string | undefined;
  score?: string;
  email: string | undefined;
  password: string | undefined;
  application?: Application;
}

interface Application {
  id: string;
  country: string;
  educationalLevel: string;
  fieldOfStudy: string;
}

export interface ScoreDataInterface {
  applicationId?: string;
  score?: string;
}

export interface AddInstituteInterface {
  applicationId?: string;
  name: string;
}

export interface AddCommentInstituteInterface {
  id?: string;
  comment: string;
}

export interface updateInstituteStatusInterface {
  id?: string;
  admissionStatus: string;
}

export interface IsRequiredInterface {
  id: string;
  englishTestRequired: string;
}

export interface PassOrFailInterface {
  applicationId: string;
  hasPassed: string;
}

export const getEnglishTest = async (id: string) => {
  const res = await makeReq.get(`/english-test/${id}`);
  return res.data;
};

export const getEnglishTestById = async (id: string) => {
  const res = await makeReq.get(`/english-test/${id}`);
  return res.data;
};

export const postEnglishTest = async (data: AddEnglishTestInterface) => {
  const res = await makeReq.post(`/english-test`, data);
  return res.data;
};

export const updateEnglishTest = async (data: AddEnglishTestInterface) => {
  const res = await makeReq.patch(`/english-test`, data);
  return res.data;
};

export const addScore = async (score: ScoreDataInterface) => {
  const res = await makeReq.patch(`/english-test`, score);
  return res.data;
};

export const addInstitute = async (data: AddInstituteInterface) => {
  const res = await makeReq.post(`/applications/institute`, data);
  return res.data;
};

export const updateInstituteStatus = async (
  data: updateInstituteStatusInterface
) => {
  const res = await makeReq.patch(`/applications/institute`, data);
  return res.data;
};

export const addCommentInstitute = async (
  data: AddCommentInstituteInterface
) => {
  const res = await makeReq.patch(`/applications/institute`, data);
  return res.data;
};

export const passOrFail = async (data: PassOrFailInterface) => {
  const res = await makeReq.patch(`/english-test`, data);
  return res.data;
};

export const isRequiredEnglishTest = async (data: IsRequiredInterface) => {
  const res = await makeReq.patch(`/applications/editEnglishTestRequired`, data);
  return res.data;
};

export const deleteInstitute = async (id: string) => {
  const res = await makeReq.delete(`/applications/institute/${id}`);
  return res.data;
};
