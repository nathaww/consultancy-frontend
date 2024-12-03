import { AddEnglishTestInterface, postEnglishTest } from "@/api/englishTest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import Modal from "react-responsive-modal";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

type props = {
  open: boolean;
  onCloseModal: () => void;
};
const AddEnglishTestModal: React.FC<props> = ({ open, onCloseModal }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const initialValues = {
    applicationId: id!,
    practiceLink: "",
    practiceLink2: "",
    testDate: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    applicationId: Yup.string().required("Application ID is required"),
    practiceLink: Yup.string()
      .url("Practice link should be a valid URL")
      .required("Practice Link is required"),
    practiceLink2: Yup.string()
      .url("Practice link should be a valid URL")
      .required("Practice Link is required"),
    testDate: Yup.date().required("Test Date is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await englishTestMutation.mutateAsync(values);
        formik.resetForm();
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const englishTestMutation = useMutation<
    AddEnglishTestInterface,
    Error,
    AddEnglishTestInterface
  >({
    mutationKey: ["englishTestMutation"],
    mutationFn: async (data: AddEnglishTestInterface) => postEnglishTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["englishTest"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("English Test added successfully");
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
      classNames={{
        overlay: "customOverlay",
        modal: "customModal",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="col-span-12">
          <h1 className="my-2 text-lg font-bold">Add English Test</h1>
          <hr className="my-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="my-2">
            <label className="text-black">Practice Link 1</label>
            <input
              {...formik.getFieldProps("practiceLink")}
              className={`input-style w-full mt-1
            ${
              formik.touched.practiceLink && formik.errors.practiceLink
                ? "border-red-500"
                : ""
            } 
          `}
              type="text"
              name="practiceLink"
            />
            {formik.touched.practiceLink && formik.errors.practiceLink && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.practiceLink}
              </div>
            )}
            <p className="text-sm text-blue-400 ms-2 mt-1">
              Link should start with "http" or "https"
            </p>
          </div>

          <div className="my-2">
            <label className="text-black">Practice Link 2</label>
            <input
              {...formik.getFieldProps("practiceLink2")}
              className={`input-style w-full mt-1
            ${
              formik.touched.practiceLink2 && formik.errors.practiceLink2
                ? "border-red-500"
                : ""
            } 
          `}
              type="text"
              name="practiceLink2"
            />
            {formik.touched.practiceLink2 && formik.errors.practiceLink2 && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.practiceLink2}
              </div>
            )}
            <p className="text-sm text-blue-400 ms-2 mt-1">
              Link should start with "http" or "https"
            </p>
          </div>

          <div className="my-2">
            <label className="text-black">Test Date</label>
            <input
              {...formik.getFieldProps("testDate")}
              className={`input-style w-full mt-1
              ${
                formik.touched.testDate && formik.errors.testDate
                  ? "border-red-500"
                  : ""
              } 
                `}
              type="date"
              name="testDate"
            />
            {formik.touched.testDate && formik.errors.testDate && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.testDate)}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Email</label>
            <input
              {...formik.getFieldProps("email")}
              className={`input-style w-full mt-1
            ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : ""
            } 
            `}
              type="email"
              name="email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.email)}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Password</label>
            <input
              {...formik.getFieldProps("password")}
              className={`input-style w-full mt-1
            ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : ""
            } 
            `}
              type="text"
              name="password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.password)}
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
            {!englishTestMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {englishTestMutation?.isPending && (
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

export default AddEnglishTestModal;
