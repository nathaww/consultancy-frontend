import {
  EducationBackgroundInterface,
  postEducationBackgrounds,
} from "@/api/school";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import Modal from "react-responsive-modal";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

type props = {
  open: boolean;
  onCloseModal: () => void;
};
const AddSchoolModal: React.FC<props> = ({ open, onCloseModal }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedDegree, setSelectedDegree] = useState("");

  const initialValues = {
    studentId: id!,
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: new Date(),
    endDate: new Date(),
    gpa: "",
    rank: 0,
  };

  const validationSchema = Yup.object().shape({
    studentId: Yup.string().required("Student ID is required"),
    institution: Yup.string().required("Institution is required"),
    degree: Yup.string().required("Degree is required"),
    fieldOfStudy: Yup.string().required("Field of Study is required"),
    startDate: Yup.date().required("Start Date is required"),
    endDate: Yup.date().required("End Date is required"),
    gpa: Yup.number().required("GPA is required"),
    rank:
      selectedDegree === "Bachelor's Degree"
        ? Yup.number()
        : Yup.number()
            .integer("Rank must be an integer")
            .min(0, "Rank must be a positive number")
            .required("Rank is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await educationMutation.mutateAsync(values);
        formik.resetForm();
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const educationMutation = useMutation<
    EducationBackgroundInterface,
    Error,
    EducationBackgroundInterface
  >({
    mutationKey: ["educationMutation"],
    mutationFn: async (formData) => postEducationBackgrounds(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      const notify = toast.success("Education background added successfully");
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
          <h1 className="my-2 text-lg font-bold">Add School Information</h1>
          <hr className="my-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="my-2">
            <label className="text-black">Institution</label>
            <input
              {...formik.getFieldProps("institution")}
              className={`input-style w-full mt-1
            ${
              formik.touched.institution && formik.errors.institution
                ? "border-red-500"
                : ""
            } 
          `}
              type="text"
              name="institution"
            />
            {formik.touched.institution && formik.errors.institution && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.institution}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Field of Study</label>
            <input
              {...formik.getFieldProps("fieldOfStudy")}
              className={`input-style w-full mt-1
            ${
              formik.touched.fieldOfStudy && formik.errors.fieldOfStudy
                ? "border-red-500"
                : ""
            } 
          `}
              type="text"
              name="fieldOfStudy"
            />
            {formik.touched.fieldOfStudy && formik.errors.fieldOfStudy && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.fieldOfStudy}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Educational Level</label>
            <select
              className={`input-style w-full mt-1 ${
                formik.touched.degree && formik.errors.degree
                  ? "border-red-500"
                  : ""
              }`}
              aria-label="Select example"
              {...formik.getFieldProps("degree")}
              onChange={(e) => {
                formik.handleChange(e);
                setSelectedDegree(e.target.value);
              }}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="High School">High School</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Ph.D.">Ph.D.</option>
            </select>
            {formik.touched.degree && formik.errors.degree && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.degree}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Start Date</label>
            <input
              {...formik.getFieldProps("startDate")}
              className={`input-style w-full mt-1
              ${
                formik.touched.startDate && formik.errors.startDate
                  ? "border-red-500"
                  : ""
              } 
                `}
              type="date"
              name="startDate"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.startDate)}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">End Date</label>
            <input
              {...formik.getFieldProps("endDate")}
              className={`input-style w-full mt-1
            ${
              formik.touched.endDate && formik.errors.endDate
                ? "border-red-500"
                : ""
            } 
            `}
              type="date"
              name="endDate"
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.endDate)}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">GPA</label>
            <input
              {...formik.getFieldProps("gpa")}
              className={`input-style w-full mt-1
            ${formik.touched.gpa && formik.errors.gpa ? "border-red-500" : ""} 
          `}
              type="number"
              name="gpa"
            />
            {formik.touched.gpa && formik.errors.gpa && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.gpa}
              </div>
            )}
          </div>

          {selectedDegree !== "Bachelor's Degree" && (
            <div className="my-2">
              <label className="text-black">Rank</label>
              <input
                {...formik.getFieldProps("rank")}
                className={`input-style w-full mt-1 ${
                  formik.touched.rank && formik.errors.rank
                    ? "border-red-500"
                    : ""
                }`}
                type="number"
                name="rank"
              />
              {formik.touched.rank && formik.errors.rank && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.rank}
                </div>
              )}
            </div>
          )}
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
            {!educationMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {educationMutation?.isPending && (
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

export default AddSchoolModal;
