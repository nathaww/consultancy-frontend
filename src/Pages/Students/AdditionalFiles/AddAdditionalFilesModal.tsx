import { postAdditionalFiles } from "@/api/additionalFiles";
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
const AddAdditionalFilesModal: React.FC<props> = ({ open, onCloseModal }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const initialValues = {
    studentId: id!,
    fileType: "",
    file: "",
  };

  const validationSchema = Yup.object().shape({
    studentId: Yup.string().required("Id is required"),
    fileType: Yup.string().required("File Type is required"),
    file: Yup.mixed().test(
      "fileSize",
      "File size is too large. Maximum size should be 4 MB",
      (value) => {
        if (value) {
          const file = value as File;
          return file.size <= 4 * 1024 * 1024;
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
        formData.append("studentId", id!);
        formData.append("fileType", values.fileType);
        formData.append("file", values.file);

        await addAdditionalFileMutation.mutateAsync(formData);
        formik.resetForm();
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const addAdditionalFileMutation = useMutation<FormData, Error, FormData>({
    mutationKey: ["addAdditionalFileMutation"],
    mutationFn: async (data: FormData) => postAdditionalFiles(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["additionalFiles"] });
      const notify = toast.success("Files added successfully");
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
          <h1 className="my-2 text-lg font-bold">Add File</h1>
          <hr className="my-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="my-2">
            <label className="text-black">File Type</label>
            <select
              className={`input-style w-full mt-1 ${
                formik.touched.fileType &&
                formik.errors.fileType
                  ? "border-red-500"
                  : ""
              }`}
              aria-label="Select example"
              {...formik.getFieldProps("fileType")}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="MediumOfInstruction">MediumOfInstruction</option>
              <option value="RecommendationLetter">RecommendationLetter</option>
              <option value="BankStatement">BankStatement</option>
              <option value="Other">Other</option>
            </select>
            {formik.touched.fileType && formik.errors.fileType && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.fileType}
              </div>
            )}
          </div>

          <div className="my-2">
            <label className="text-black">File</label>
            <input
              onChange={(event) => {
                const file =
                  event.currentTarget.files && event?.currentTarget?.files[0];
                formik.setFieldValue("file", file);
              }}
              className={`input-style w-full mt-1
            ${
              formik.touched.file && formik.errors.file ? "border-red-500" : ""
            } 
          `}
              type="file"
              name="file"
            />
            {formik.touched.file && formik.errors.file && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.file}
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
            {!addAdditionalFileMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {addAdditionalFileMutation?.isPending && (
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

export default AddAdditionalFilesModal;
