import { makeReq } from "@/makeReq";

export const verifyToken = async (token: string) => {
  const res = await makeReq.post(`/auth/verifyToken/${token}`);
  return res;
};
