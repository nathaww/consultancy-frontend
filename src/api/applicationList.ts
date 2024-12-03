import { makeReq } from "@/makeReq";

export interface ApplicationListInterface {
  id: string;
  country: string;
  educationalLevel: string;
  fieldOfStudy: string;
  applicationStatus: string;
  institute: string;
  intake: string;
  admissionStatus: string;
  pendingDocuments: any[];
  student: Student;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  admissionEmail: string;
  branch: string;
  image: string;
}

export interface ApplicationListAPIResponse {
  applications: ApplicationListInterface[];
  totalCount: number;
  pages: 1;
}

export interface SearchApplicationListInterface {
  pageCount?: number;
  keyword: string;
}

export type FilterStateApplicationList = {
  gender: string;
  country: string;
  intake: string;
  applicationStatus: string;
  admissionStatus: string;
};

export const getApplicationList = async (
  pageCount: number,
  filter?: FilterStateApplicationList
) => {
  const res = await makeReq.get(
    `/applications/employee?${
      filter &&
      `gender=${filter.gender || ""}&country=${filter.country || ""}&intake=${
        filter.intake || ""
      }&applicationStatus=${filter.applicationStatus || ""}&admissionStatus=${
        filter.admissionStatus || ""
      }&`
    }page=${pageCount}`
  );
  return res.data;
};

export const searchApplicationList = async (
  searchParam: SearchApplicationListInterface
) => {
  const res = await makeReq.get(
    `/applications/employee?query=${searchParam.keyword}&page=${searchParam.pageCount}`
  );
  return res.data;
};
