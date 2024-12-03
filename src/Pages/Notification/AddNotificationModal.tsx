import {
  NotificationInterface,
  addNotification,
  getUsers,
  notificationUserInterface,
} from "@/api/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import Modal from "react-responsive-modal";
import * as Yup from "yup";

type props = {
  open: boolean;
  onCloseModal: () => void;
};
const AddNotificationModal: React.FC<props> = ({ open, onCloseModal }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<notificationUserInterface[]>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const initialValues = {
    title: "",
    content: "",
    recipientId: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    recipientId: Yup.string().required("Send-to is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await addNotificationMutation.mutateAsync(values);
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const addNotificationMutation = useMutation<
    NotificationInterface,
    Error,
    NotificationInterface
  >({
    mutationKey: ["addNotificationMutation"],
    mutationFn: async (data) => addNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification"] });
      const notify = toast.success("Notification added successfully");
      notify;
      onCloseModal();
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      center
      styles={{
        modal: {
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
        },
      }}
      classNames={{
        overlay: "customOverlay",
        modal: "customModal",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="col-span-12">
          <h1 className="my-2 text-lg font-bold">
            Add Notification Information
          </h1>
          <hr className="my-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="my-2">
            <label className="text-black">Title</label>
            <input
              {...formik.getFieldProps("title")}
              className={`input-style w-full mt-1
            ${
              formik.touched.title && formik.errors.title
                ? "border-red-500"
                : ""
            } 
          `}
              type="text"
              name="title"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.title}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Content</label>
            <input
              {...formik.getFieldProps("content")}
              className={`input-style w-full mt-1
            ${
              formik.touched.content && formik.errors.content
                ? "border-red-500"
                : ""
            } 
          `}
              type="text"
              name="content"
            />
            {formik.touched.content && formik.errors.content && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.content}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Send to</label>
            <select
              className={`input-style w-full mt-1 ${
                formik.touched.recipientId && formik.errors.recipientId
                  ? "border-red-500"
                  : ""
              }`}
              aria-label="Select User"
              {...formik.getFieldProps("recipientId")}
            >
              <option value="" disabled>
                {isLoading ? "Loading..." : "Select User"}
              </option>
              {data?.map((item) => (
                <option key={item.id} value={item?.id}>
                  {item.firstName} {item.lastName} - {item.roles}
                </option>
              ))}
            </select>
            {formik.touched.recipientId && formik.errors.recipientId && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.recipientId}
              </div>
            )}
          </div>
        </div>
        <hr className="my-6" />
        <div className="flex flex-row justify-end gap-2 w-full">
          <button
            type="button"
            onClick={onCloseModal}
            className="btn-secondary btn-anim bg-gray-200 mb-5 w-32"
          >
            Discard
          </button>
          <button
            type="submit"
            className="btn btn-anim bg-primaryColor text-white mb-5 w-40"
          >
            {!addNotificationMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {addNotificationMutation?.isPending && (
              <span className="flex gap-2 items-center">
                Submitting...{" "}
                <RiLoader3Fill className="animate-spin text-2xl text-lightPrimaryColor" />
              </span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddNotificationModal;
