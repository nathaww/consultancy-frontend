import { postPassport } from "@/api/passport";
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
const AddPassportModal: React.FC<props> = ({ open, onCloseModal }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const initialValues = {
    studentId: id,
    passportNumber: "",
    issueDate: new Date(),
    expiryDate: new Date(),
    passportImage: null,
  };

  const validationSchema = Yup.object().shape({
    passportNumber: Yup.string()
      .min(6, "Passport number must be at least 6 characters")
      .max(10, "Passport number cannot exceed 10 characters")
      .required("Passport number is required"),
    issueDate: Yup.date().required("Issue date is required"),
    expiryDate: Yup.date()
      .min(Yup.ref("issueDate"), "Expiry date must be after issue date")
      .required("Expiry date is required"),
    passportImage: Yup.mixed().test(
      "fileSize",
      "File size is too large. Maximum size should be 5 MB",
      (value) => {
        if (value) {
          return value instanceof File && value.size <= 5 * 1024 * 1024;
        }
        return true;
      }
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("studentId", values.studentId!);
        formData.append("passportNumber", values.passportNumber);
        formData.append("issueDate", String(values.issueDate));
        formData.append("expiryDate", String(values.expiryDate));
        if (values.passportImage !== null) {
          formData.append("passportImage", values.passportImage);
        }
        await passportMutation.mutateAsync(formData);
        formik.resetForm();
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const passportMutation = useMutation<FormData, Error, FormData>({
    mutationKey: ["passportMutation"],
    mutationFn: async (formData) => postPassport(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["passport"] });
      const notify = toast.success("Passport information added successfully");
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
          <h1 className="my-2 text-lg font-bold">Add Passport Information</h1>
          <hr className="my-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="my-2">
            <label className="text-black">Passport Number</label>
            <input
              {...formik.getFieldProps("passportNumber")}
              className={`input-style w-full mt-1
              ${
                formik.touched.passportNumber && formik.errors.passportNumber
                  ? "border-red-500"
                  : ""
              } 
            `}
              type="text"
              name="passportNumber"
            />
            {formik.touched.passportNumber && formik.errors.passportNumber && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.passportNumber}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Issue Date</label>
            <input
              {...formik.getFieldProps("issueDate")}
              className={`input-style w-full mt-1
              ${
                formik.touched.issueDate && formik.errors.issueDate
                  ? "border-red-500"
                  : ""
              } 
            `}
              type="date"
              name="issueDate"
            />
            {formik.touched.issueDate && formik.errors.issueDate && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.issueDate)}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Expiry Date</label>
            <input
              {...formik.getFieldProps("expiryDate")}
              className={`input-style w-full mt-1
              ${
                formik.touched.expiryDate && formik.errors.expiryDate
                  ? "border-red-500"
                  : ""
              } 
            `}
              type="date"
              name="expiryDate"
            />
            {formik.touched.expiryDate && formik.errors.expiryDate && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.expiryDate)}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">Passport Attachment</label>
            <input
              className={`input-style w-full mt-1 ${
                formik.touched.passportImage && formik.errors.passportImage
                  ? "border-red-500"
                  : ""
              } 
                `}
              type="file"
              name="passportImage"
              onChange={(e) => {
                const file = e.currentTarget.files && e.currentTarget.files[0];
                formik.setFieldValue("passportImage", file || null);
              }}
            />
            {formik.touched.passportImage && formik.errors.passportImage && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.passportImage)}
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
            {!passportMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {passportMutation?.isPending && (
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

export default AddPassportModal;
