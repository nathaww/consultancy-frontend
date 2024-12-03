import { useCallback, useMemo, Fragment } from "react";
import PropTypes from "prop-types";
import {
  Calendar,
  Views,
  DateLocalizer,
  dateFnsLocalizer,
} from "react-big-calendar";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCalendar,
  signOutGoogleCalendar,
  syncCalendar,
} from "@/api/calendar";

function CreateEventWithNoOverlap() {
  const { data } = useQuery({
    queryKey: ["calendar"],
    queryFn: () => getCalendar(),
  });

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: "10px",
      color: "white",
      border: "0px",
      display: "block",
      padding: "2px",
      fontSize: "12px",
    };
    return {
      style: style,
    };
  };

  const handleSelectEvent = useCallback((event) => {
    window.alert(`Title: ${event.title}\n ${event.description}`);
  }, []);

  const { scrollToTime } = useMemo(
    () => ({
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );
  const today = new Date();
  return (
    <Fragment>
      <Calendar
        localizer={dateFnsLocalizer({
          format,
          parse,
          startOfWeek,
          getDay,
          locales: { enUS },
        })}
        defaultDate={today}
        defaultView={Views.WEEK}
        events={data?.map((event) => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          allDay: true,
          color: event.color,
        }))}
        onSelectEvent={handleSelectEvent}
        selectable
        scrollToTime={scrollToTime}
        eventPropGetter={eventStyleGetter}
      />
    </Fragment>
  );
}

CreateEventWithNoOverlap.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  dayLayoutAlgorithm: PropTypes.string,
};

import { postCredentials } from "@/api/calendar";
import { format, getDay, getMonth, getYear } from "date-fns";
import React, { useEffect, useState, useRef } from "react";
import { FaGoogle, FaLink, FaSignOutAlt } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import toast from "react-hot-toast";
import { gapi } from "gapi-script";
import { GoogleLogin, GoogleLogout } from "react-google-login";

export const LocalCalendar = () => {
  const DISCOVERY_DOC = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ];
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  const expiresIn = localStorage.getItem("expires_in");
  const accessToken = localStorage.getItem("access_token");


  const updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      const authInstance = gapi.auth2.getAuthInstance();
      const user = authInstance.currentUser.get();
      const authResponse = user.getAuthResponse();
      handleToken(authResponse);
    }
  };

  const handleToken = async ({ access_token, expires_in }) => {
    const currentTime = new Date().getTime();
    const expiryTime = currentTime + expires_in * 1000;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("expires_in", expires_in);
    localStorage.setItem("expiry_time", expiryTime);

    setTimeout(refreshToken, 3099 * 1000);

    await signInMutation.mutateAsync({ access_token, expires_in });
  };

  const refreshToken = async () => {
    const authInstance = gapi.auth2.getAuthInstance();
    const user = authInstance.currentUser.get();
    const newAuthResponse = await user.reloadAuthResponse();
    handleToken(newAuthResponse);
  };

  const onSuccess = async (res) => {
    const { access_token, expires_in } = res?.tokenObj;
    handleToken({ access_token, expires_in });
    await signInMutation.mutateAsync({ access_token, expires_in });
  };

  const signInMutation = useMutation({
    mutationKey: ["signInMutation"],
    mutationFn: async (data) => postCredentials(data),
    onSuccess: () => {},
    onError: (error) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const signOutMutation = useMutation({
    mutationKey: ["signOutMutation"],
    mutationFn: async () => signOutGoogleCalendar(),
    onError: (error) => {
      const notify = toast.error(
        error?.response.data.message ||
          error?.response.data.error ||
          "An unknown error occurred"
      );
      notify;
    },
  });

  const syncMutation = useMutation({
    mutationKey: ["syncMutation"],
    mutationFn: async () => syncCalendar(),
    onSuccess: () => {
      const notify = toast.success("Calendar synced successfully");
      notify;
    },
    onError: (error) => {
      const notify = toast.error("Please Sign In and try again");
      notify;
    },
  });

  const handleSyncClick = async () => {
    await syncMutation.mutateAsync();
  };

  const onSuccessLogout = async (res) => {
    await signOutMutation.mutateAsync();
  };

  return (
    <>
      <p className="mt-4 text-lg">Calendar</p>
      <div className="w-full md:w-96 lg:w-96 mb-4">
        <p className="text-gray-500 text-xs text-center md:text-sm lg:text-sm">
          Once you have signed in with Google, we will create a new summary for
          you and your calendar events will be synced.
        </p>
        <p className="text-gray-500 text-xs text-center md:text-sm lg:text-sm">
          If you have trouble seeing your events on your Google calendar, sign
          in with Google again or refresh.
        </p>
      </div>
      <CreateEventWithNoOverlap />
    </>
  );
};

export default LocalCalendar;
