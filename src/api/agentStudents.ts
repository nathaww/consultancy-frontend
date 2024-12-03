import { makeReq } from "@/makeReq";

export interface AgentStudentInterface {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string | undefined;
  admissionEmail: string;
  branch: string;
  image?: string;
  passportNumber: string;
  issueDate: string;
  expiryDate: string;
  passportAttachment: string;
  isActive: boolean;
  applications: [
    {
      id: string;
      country: string;
      educationalLevel: string;
      fieldOfStudy: string;
    }
  ];
  studentAddress: {
    region: string;
    subCity: string;
    woreda: string;
    kebele: string;
    houseNumber: string;
  };
  user: {
    id: string;
    email: string;
    roles: string[];
    isDeactivated: boolean;
    isDeleted: boolean;
    phoneNumber: string;
  };
}

export interface AgentStudentAPIResponse {
  pages: number;
  students: AgentStudentInterface[];
  totalCount: number;
}

export interface SearchStudentInterface {
  pageCount?: number;
  keyword: string;
}

export type FilterState = {
  gender?: string;
  country?: string;
  intake?: string;
  status?: string;
};

export const getAgentStudents = async (
  pageCount: number,
  filter?: FilterState
) => {
  const res = await makeReq.get(
    `/students/agent?${
      filter &&
      `gender=${filter.gender || ""}&country=${filter.country || ""}&intake=${
        filter.intake || ""
      }&isActive=${filter.status || ""}&`
    }page=${pageCount}`
  );
  return res.data;
};

export const searchAgentStudents = async (
  searchParam: SearchStudentInterface
) => {
  const res = await makeReq.get(
    `/students/agent?search?page=${searchParam.pageCount}&query=${searchParam.keyword}`
  );
  return res.data;
};
