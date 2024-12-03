import { AddApplicationInterface, postApplication } from "@/api/application";
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
const AddApplicationModal: React.FC<props> = ({ open, onCloseModal }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const initialValues = {
    country: "",
    educationalLevel: "",
    fieldOfStudy: "",
    studentId: id!,
    intake: "",
  };

  const validationSchema = Yup.object().shape({
    country: Yup.string().required("Country is required"),
    educationalLevel: Yup.string().required("Educational level is required"),
    fieldOfStudy: Yup.string().required("Field of study is required"),
    intake: Yup.string().required("Intake is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await addApplicationMutation.mutateAsync(values);
        formik.resetForm();
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const addApplicationMutation = useMutation<
    AddApplicationInterface,
    Error,
    AddApplicationInterface
  >({
    mutationKey: ["addApplicationMutation"],
    mutationFn: async (data: AddApplicationInterface) => postApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      const notify = toast.success("Application added successfully");
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
          <h1 className="my-2 text-lg font-bold">
            Add Application Information
          </h1>
          <hr className="my-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="my-2">
            <label className="text-black">Country</label>
            <select
              className={`input-style w-full mt-1 ${
                formik.touched.country && formik.errors.country
                  ? "border-red-500"
                  : ""
              }`}
              aria-label="Select example"
              {...formik.getFieldProps("country")}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="UnitedStates">USA</option>
              <option value="Canada">Canada</option>
              <option value="Italy">Italy</option>
              <option value="Hungary">Hungary</option>
            </select>
            {formik.touched.country && formik.errors.country && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base">
                {formik.errors.country}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Educational Level</label>
            <select
              className={`input-style w-full mt-1 ${
                formik.touched.educationalLevel &&
                formik.errors.educationalLevel
                  ? "border-red-500"
                  : ""
              }`}
              aria-label="Select example"
              {...formik.getFieldProps("educationalLevel")}
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
            {formik.touched.educationalLevel &&
              formik.errors.educationalLevel && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.educationalLevel}
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
            <label className="text-black">Intake</label>
            <select
              className={`input-style w-full mt-1 ${
                formik.touched.intake && formik.errors.intake
                  ? "border-red-500"
                  : ""
              }`}
              aria-label="Select example"
              {...formik.getFieldProps("intake")}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="Summer">Summer</option>
              <option value="Spring">Spring</option>
              <option value="Autumn">Autumn</option>
              <option value="Winter">Winter</option>
              <option value="Fall">Fall</option>
            </select>
            {formik.touched.intake && formik.errors.intake && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base">
                {formik.errors.intake}
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
            {!addApplicationMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {addApplicationMutation?.isPending && (
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

export default AddApplicationModal;
