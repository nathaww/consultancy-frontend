import { makeReq } from "@/makeReq";

export interface CommentInterface {
  id: string;
  text: string;
  isEdited: boolean;
  createdAt: string;
  user: User;
  parent: Parent;
  application: {
    admissionStatus: string;
    applicationStatus: string;
    country: string;
    educationalLevel: string;
    fieldOfStudy: string;
    id: string;
    institute: string
    intake: string
    student :{
      firstName: string,
      lastName: string,
      id: string
    }
  };
}

interface Parent {
  id: string;
  text: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AddCommentInterface {
  text: string;
  applicationId: string;
  parentId?: string;
}

export const getComment = async (id: string) => {
  const res = await makeReq.get(`/comment/application/${id}`);
  return res.data;
};

export const getRecentComments = async () => {
  const res = await makeReq.get(`/comment/recent-comments`);
  return res.data;
};
export const postComment = async (data: AddCommentInterface) => {
  const res = await makeReq.post(`/comment`, data);
  return res.data;
};
export const deleteComment = async (id: string) => {
  const res = await makeReq.delete(`/comment/${id}`);
  return res.data;
};
