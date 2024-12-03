import { makeReq } from "@/makeReq";

export interface PassportInterface {
  passportNumber: string;
  issueDate: Date;
  expiryDate: Date;
  passportAttachment?: string | null;
}

export const getPassport = async (id: string) => {
  const res = await makeReq.get(`/students/passport/${id}`);
  return res.data;
};
export const postPassport = async (data: FormData) => {
  const res = await makeReq.patch(`/students/passport`, data);
  return res.data;
};
export const updatePassportImage = async (data: FormData) => {
  const res = await makeReq.patch(`/students/passport`, data);
  return res.data;
};
export const updatePassport = async (data: FormData) => {
  const res = await makeReq.patch(`/students/passport`, data);
  return res.data;
};
export const getPassportImage = async (img: string) => {
  const res = await makeReq.get(`/uploads/${img}`, { responseType: "blob" });
  const imageUrl = URL.createObjectURL(res.data);
  return imageUrl;
};
