import { makeReq } from "@/makeReq";

export interface PostInterface {
  id?: string;
  title: string;
  description: string;
  image: string | null;
  createdAt?: string;
  videoLink: string;
}

export const getPosts = async () => {
  const res = await makeReq.get(`/post`);
  return res.data;
};

export const addPost = async (data: FormData) => {
  const res = await makeReq.post(`/post`, data);
  return res.data;
};

export const updatePost = async (post: PostInterface) => {
  const res = await makeReq.patch(`/post`, post);
  return res.data;
};

export const deletePost = async (id: string) => {
    const res = await makeReq.delete(`/post/${id}`);
    return res.data;
  }