import { makeReq } from "@/makeReq";

export interface EmployeeInterface {
  id?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phoneNumber?: string;
  dateOfBirth?: string | undefined;
  user?: User;
}
export interface EmployeeAPIResponse {
  pages: number;
  employees: EmployeeInterface[];
  totalCount: number;
}

interface User {
  id: string;
  email: string;
  roles: string[];
  isDeactivated: boolean;
  isDeleted: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface SearchEmployeeInterface {
  pageCount?: number;
  keyword: string;
}

export type FilterStateEmployee = {
  gender?: string;
  role?: string;
};

export const getEmployees = async (
  pageCount: number,
  filter?: FilterStateEmployee
) => {
  const res = await makeReq.get(
    `/employees?${
      filter && `gender=${filter.gender || ""}&role=${filter.role || ""}&`
    }page=${pageCount}`
  );
  return res.data;
};

export const searchEmployees = async (searchParam: SearchEmployeeInterface) => {
  const res = await makeReq.get(
    `/employees?query=${searchParam.keyword}&page=${searchParam.pageCount}`
  );
  return res.data;
};

export const getEmployee = async (id: string) => {
  const res = await makeReq.get(`/employees/${id}`);
  return res.data;
};

export const postEmployee = async (employee: EmployeeInterface) => {
  const res = await makeReq.post(`/employees`, employee);
  return res.data;
};

export const updateEmployee = async (employee: EmployeeInterface) => {
  const res = await makeReq.patch(`/employees`, employee);
  return res.data;
};

export const deleteEmployee = async (id: string) => {
  const res = await makeReq.delete(`/employees/${id}`);
  return res.data;
};
