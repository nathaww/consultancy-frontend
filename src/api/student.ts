import { makeReq } from "@/makeReq";

export interface StudentInterface {
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
      applicationStatus: string;
    }
  ];
  studentAddress: {
    region: string;
    city: string;
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
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  agent: {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
  };
}

export interface StudentAPIResponse {
  pages: number;
  students: StudentInterface[];
  totalCount: number;
}

export interface PostStudent {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string | Date | undefined;
  branch: string;
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  kebele: string;
  houseNumber: string;
  country: string;
  educationalLevel: string;
  fieldOfStudy: string;
}

export interface UpdateStudentInterface {
  admissionEmail: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  gender: string | undefined;
  phoneNumber: string | undefined;
  dateOfBirth: string | Date | undefined;
  branch: string | undefined;
}

export interface UpdateStudentAddressInterface {
  studentId: string | undefined;
  region: string | undefined;
  subCity: string | undefined;
  woreda: string | undefined;
  kebele: string | undefined;
  houseNumber: string | undefined;
}

export interface ActivateStudentInterface {
  country: string;
  educationalLevel: string;
  fieldOfStudy: string;
  studentId: string;
  intake: string;
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

export const getStudents = async (pageCount: number, filter?: FilterState) => {
  const res = await makeReq.get(
    `/students?${
      filter &&
      `gender=${filter.gender || ""}&country=${filter.country || ""}&intake=${
        filter.intake || ""
      }&isActive=${filter.status || ""}&`
    }page=${pageCount}`
  );
  return res.data;
};

export const searchStudents = async (searchParam: SearchStudentInterface) => {
  const res = await makeReq.get(
    `/students?query=${searchParam.keyword}&page=${searchParam.pageCount}`
  );
  return res.data;
};

export const getStudent = async (id: string) => {
  const res = await makeReq.get(`/students/details/${id}`);
  return res.data;
};

export const postStudent = async (student: PostStudent) => {
  const res = await makeReq.post(`/students`, student);
  return res.data;
};

export const updateStudent = async (student: UpdateStudentInterface) => {
  const res = await makeReq.patch(`/students`, student);
  return res.data;
};

export const updateStudentAddress = async (student: UpdateStudentAddressInterface) => {
  const res = await makeReq.patch(`/students/address`, student);
  return res.data;
};

export const deleteStudent = async (id: string) => {
  const res = await makeReq.delete(`/students/${id}`);
  return res.data;
};

export const activateStudent = async (data: ActivateStudentInterface) => {
  const res = await makeReq.patch(`/students/activateStudent`, data);
  return res.data;
};

export const updateStudentImage = async (id: string, image: FormData) => {
  const res = await makeReq.patch(`/students/image/${id}`, image);
  return res.data;
};
