import { makeReq } from "@/makeReq";

export interface SalesInterface {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  admissionEmail: string;
  branch: string;
  isActive: boolean;
  image: string;
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  passportAttachment: string;
  user: User;
  futureStudentInfo: {
    level: string;
    country: string;
    field: string;
  };
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  access_token: string;
  calendarId: string;
  roles: string[];
}
export interface SalesAPIResponse {
  pages: number;
  students: SalesInterface[];
  totalCount: number;
}

export interface SearchSalesInterface {
  pageCount?: number;
  keyword: string;
}

export interface AddSalesInterface {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  kebele: string;
  houseNumber: string;
}

export const getSales = async (pageCount: number) => {
  const res = await makeReq.get(`/students/non-client?page=${pageCount}`);
  return res.data;
};

export const searchSales = async (searchParam: SearchSalesInterface) => {
  const res = await makeReq.get(
    `/students/non-client?query=${searchParam.keyword}&page=${searchParam.pageCount}`
  );
  return res.data;
};

export const postSales = async (student: AddSalesInterface) => {
  const res = await makeReq.post(`/students/non-client`, student);
  return res.data;
};

export const deleteSales = async (id: string) => {
  const res = await makeReq.delete(`/students/non-client/${id}`);
  return res.data;
};

export const convertSales = async (id: string) => {
  const res = await makeReq.patch(`/students/non-client/${id}`);
  return res.data;
};
