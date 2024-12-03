import { makeReq } from "@/makeReq";

export interface CalendarInterface {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  color: string;
}

export interface CalendarRegisterInterface {
  access_token: string;
  expires_in: number;
}

export interface MissedCalendarInterface {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  color: string;
}

export const getCalendar = async () => {
  const res = await makeReq.get("/calendar");
  return res.data;
};
export const getMissedCalendar = async () => {
  const res = await makeReq.get("/calendar/missed-events");
  return res.data;
};
export const syncCalendar = async () => {
  const res = await makeReq.patch("/calendar/google-sync");
  return res.data;
};
export const signOutGoogleCalendar = async () => {
  const res = await makeReq.patch("/auth/google-logout");
  return res.data;
};

export const postCredentials = async (data: CalendarRegisterInterface) => {
  const res = await makeReq.patch("/auth/google-token", data);
  return res.data;
};
