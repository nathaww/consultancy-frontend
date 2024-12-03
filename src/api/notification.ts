import { makeReq } from "@/makeReq";

export interface NotificationInterface {
  id?: string;
  title: string;
  content: string;
  recipientId: string | null;
  createdAt?: string;
  recipient?: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    phoneNumber: string;
  };
  sender?: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    phoneNumber: string;
  };
}

export interface notificationUserInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export const getNotifications = async () => {
  const res = await makeReq.get(`/notification`);
  return res.data;
};
export const getUsers = async () => {
  const res = await makeReq.get(`/user/usersForNotification?role=Student`);
  return res.data;
};

export const addNotification = async (student: NotificationInterface) => {
  const res = await makeReq.post(`/notification`, student);
  return res.data;
};

export const updateNotification = async (
  Notification: NotificationInterface
) => {
  const res = await makeReq.patch(`/notification`, Notification);
  return res.data;
};

export const deleteNotification = async (id: string) => {
  const res = await makeReq.delete(`/notification/${id}`);
  return res.data;
};

export const getIncomingNotifications = async () => {
  const res = await makeReq.get(`/notification/employee`);
  return res.data;
};

export const getNotificationCount = async () => {
  const res = await makeReq.get(`/notification/employee/count`);
  return res.data;
};
