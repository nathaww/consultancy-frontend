import { makeReq } from "@/makeReq";


export const getGenderCount = async () => {
  const res = await makeReq.get(`/dashboard/studentGenderCount`);
  return res.data;
};

export const getEmployeeRoleCount = async () => {
  const res = await makeReq.get(`/dashboard/employeeRoleCount`);
  return res.data;
};

export const getApplicationCount = async () => {
  const res = await makeReq.get(`/dashboard/applicationCount`);
  return res.data;
};
