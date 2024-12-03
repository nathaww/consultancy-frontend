import { makeReq } from "@/makeReq";

export interface EducationBackgroundInterface {
  id?: string | undefined;
  studentId?: string | undefined;
  institution: string | undefined;
  degree: string | undefined;
  fieldOfStudy: string | undefined;
  startDate: string | Date | undefined;
  endDate: string | Date | undefined;
  gpa: string | undefined;
  rank: number | undefined;
  transcriptFileUri?: string;
  certificateFileUri?: string
}

export const getEducationBackgrounds = async (id: string) => {
  const res = await makeReq.get(`/education-background/student/${id}`);
  return res.data;
};

export const getEducationBackground = async (id: string) => {
  const res = await makeReq.get(`/education-background/${id}`);
  return res.data;
};

export const postEducationBackgrounds = async (
  data: EducationBackgroundInterface
) => {
  const res = await makeReq.post(`/education-background`, data);
  return res.data;
};

export const updateEducationBackgrounds = async (
  data: EducationBackgroundInterface
) => {
  const res = await makeReq.patch(`/education-background`, data);
  return res.data;
};

export const deleteEducationBackground = async (id: string) => {
  const res = await makeReq.delete(`/education-background/${id}`);
  return res.data;
};

export const uploadTranscript = async (id: string, data: FormData) => {
  const res = await makeReq.patch(
    `/education-background/transcript/${id}`,
    data
  );
  return res.data;
};

export const uploadCertificate = async (id: string, data: FormData) => {
  const res = await makeReq.patch(
    `/education-background/certificate/${id}`,
    data
  );
  return res.data;
};
