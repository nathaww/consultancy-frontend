import { AddInstituteInterface, addInstitute } from "@/api/englishTest";
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
const AddInstituteModal: React.FC<props> = ({ open, onCloseModal }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const initialValues = {
    applicationId: id!,
    name: "",
    comment: "",
  };

  const validationSchema = Yup.object().shape({
    applicationId: Yup.string().required("Application ID is required"),
    name: Yup.string().required("Name is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await addInstituteMutation.mutateAsync(values);
        formik.resetForm();
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const addInstituteMutation = useMutation<
    AddInstituteInterface,
    Error,
    AddInstituteInterface
  >({
    mutationKey: ["addInstituteMutation"],
    mutationFn: async (data: AddInstituteInterface) => addInstitute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getApplication"] });
      const notify = toast.success("Institute added successfully");
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
          <h1 className="my-2 text-lg font-bold">Add Institute</h1>
          <hr className="my-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          <div className="my-2">
            <label className="text-black">Institute Name</label>
            <input
              {...formik.getFieldProps("name")}
              className={`input-style w-full mt-1
            ${
              formik.touched.name && formik.errors.name ? "border-red-500" : ""
            } 
          `}
              type="text"
              name="name"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                {formik.errors.name}
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
            {!addInstituteMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {addInstituteMutation?.isPending && (
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

export default AddInstituteModal;
