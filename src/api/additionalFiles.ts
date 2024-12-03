import { makeReq } from "@/makeReq";

export interface AdditionalFileInterface {
  id: string;
  studentId: string;
  fileType: string;
  fileUri: string;
}

export const getAdditionalFiles = async () => {
  const res = await makeReq.get("/additional-student-files");
  return res.data;
};

export const postAdditionalFiles = async (data: FormData) => {
  const res = await makeReq.post("/additional-student-files", data);
  return res.data;
};

export const deleteAdditionalFiles = async (id: string) => {
  const res = await makeReq.delete(`/additional-student-files/${id}`);
  return res.data;
};
