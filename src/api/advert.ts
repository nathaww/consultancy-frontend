import { makeReq } from "@/makeReq";
export interface AdvertInterface {
  id: string;
  image: string;
}

export const getAdvert = async () => {
  const res = await makeReq.get(`/content`);
  return res.data;
};

export const addAdvert = async (data: FormData) => {
  const res = await makeReq.post(`/content`, data);
  return res.data;
};

export const deleteAdvert = async (id: string) => {
  const res = await makeReq.delete(`/content/${id}`);
  return res.data;
};
