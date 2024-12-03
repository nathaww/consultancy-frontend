import { makeReq } from "@/makeReq";

export interface MessageInterface {
  id: string;
  title: null;
  participants: Participant[];
  type: string;
  messages: ChatInterface[];
}

export interface ChatInterface {
  id: string;
  senderId: string;
  recipientId: string;
  conversationId: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface MessageListInterface {
  id: string;
  title: null;
  participants: Participant[];
  type: string;
  _count: { messages: number };
  messages: [
    {
      content: string;
    }
  ];
}

interface Participant {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
}

export interface ContactListInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
}

export const getMessageList = async () => {
  const res = await makeReq.get(`/conversation`);
  return res.data;
};

export const getMessage = async (id: string) => {
  const res = await makeReq.get(`/conversation/details/${id}`);
  return res.data;
};

export const getContacts = async () => {
  const res = await makeReq.get(`/conversation/employees`);
  return res.data;
};

export const startConversation = async (id: string) => {
  const res = await makeReq.post(`/conversation/employees/${id}`);
  return res.data;
};
