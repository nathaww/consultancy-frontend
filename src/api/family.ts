import { makeReq } from "@/makeReq";

export interface FamilyInterface {
  id?: string;
  studentId?: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  phoneNumber: string | undefined;
  educationalLevel: string | undefined;
  dateOfBirth: string | Date | undefined;
  relationship: string | undefined;
}

export const getFamily = async (id: string) => {
  const res = await makeReq.get(`/relation/student/${id}`);
  return res.data;
};

export const getFamilyById = async (id: string) => {
  const res = await makeReq.get(`/relation/${id}`);
  return res.data;
};

export const postFamily = async (data: FamilyInterface) => {
  const res = await makeReq.post(`/relation`, data);
  return res.data;
};

export const updateFamily = async (id: string, data: FamilyInterface) => {
  const res = await makeReq.patch(`/relation/${id}`, data);
  return res.data;
};

export const deleteFamily = async (id: string) => {
  const res = await makeReq.delete(`/relation/${id}`);
  return res.data;
}