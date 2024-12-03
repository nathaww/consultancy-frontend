import { addPost } from "@/api/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
const AddPostModal: React.FC<props> = ({ open, onCloseModal }) => {
  const queryClient = useQueryClient();
  const initialValues = {
    title: "",
    description: "",
    image: null,
    videoLink: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.mixed().test(
      "fileSize",
      "File size is too large. Maximum size should be 2 MB",
      (value) => {
        if (value) {
          return value instanceof File && value.size <= 2 * 1024 * 1024;
        }
        return true;
      }
    ),
    videoLink: Yup.string()
      .url("Please enter a valid URL")
      .required("Link is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title!);
        formData.append("description", values?.description);
        formData.append("videoLink", values?.videoLink);
        formData.append("image", values?.image!);
        await addPostMutation.mutateAsync(formData);
        formik.resetForm();
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const addPostMutation = useMutation<FormData, Error, FormData>({
    mutationKey: ["addPostMutation"],
    mutationFn: async (formData) => addPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      const notify = toast.success("Post added successfully");
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
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
        },
      }}
      classNames={{
        overlay: "customOverlay",
        modal: "customModal",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="col-span-12">
          <h1 className="my-2 text-lg font-bold">Add Post Information</h1>
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
            <label className="text-black">Link</label>
            <input
              {...formik.getFieldProps("videoLink")}
              className={`input-style w-full mt-1
            ${
              formik.touched.videoLink && formik.errors.videoLink
                ? "border-red-500"
                : ""
            } 
          `}
              type="text"
              name="videoLink"
            />
            {formik.touched.videoLink && formik.errors.videoLink && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.videoLink}
              </div>
            )}
            <p className="text-sm text-blue-400 ms-6">
              Video Link should start with "http" or "https"
            </p>
          </div>

          <div className="my-2">
            <label className="text-black">Image</label>
            <input
              className={`input-style w-full mt-1 ${
                formik.touched.image && formik.errors.image
                  ? "border-red-500"
                  : ""
              } 
              `}
              type="file"
              name="image"
              onChange={(e) => {
                const file =
                  e.currentTarget.files?.[0] && e.currentTarget.files[0];
                formik.setFieldValue("image", file || null);
              }}
            />
            {formik.touched.image && formik.errors.image && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {String(formik.errors.image)}
              </div>
            )}
          </div>
          
          <div className="my-2">
            <label className="text-black">Description</label>
            <textarea
              {...formik.getFieldProps("description")}
              className={`input-style w-full mt-1
                ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : ""
                } 
              `}
              name="description"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.description}
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
            {!addPostMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {addPostMutation?.isPending && (
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

export default AddPostModal;
