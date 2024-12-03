import { makeReq } from "@/makeReq";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import * as Yup from "yup";

const ForgetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues = {
    email: "",
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("E-mail is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await makeReq.patch(`/auth/request-password-reset/${values.email}`);
        if (res.status === 204) {
          const notify = () => toast.success("Reset E-mail has been sent successfully");
          notify();
        }
      } catch (error: any) {
        const notify = () =>
          toast.error(
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              "An unexpected error has occurred"
          );
        notify();
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <form
      className="w-full h-full px-6 sm:px-0 lg:px-0"
      onSubmit={formik.handleSubmit}
    >
      <h1 className="text-base text-white text-center sm:text-xl lg:text-xl my-4">
        Reset password
      </h1>

      <div className="mb-3">
        <input
          placeholder="Your e-mail address"
          {...formik.getFieldProps("email")}
          className={`input-style w-full
          ${
            formik.touched.email && formik.errors.email ? "border-red-600" : ""
          } 
        `}
          required
          type="email"
          name="email"
          autoComplete="off"
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-red-900 text-sm">{formik.errors.email}</span>
        )}
      </div>

      <div className="d-grid mb-10">
        <button
          type="submit"
          className="btn bg-primaryColor text-white w-full"
          disabled={!formik.errors || !formik.isValid}
        >
          {!loading && <span className="indicator-label">Reset</span>}
          {loading && (
            <p className="inline-flex justify-center gap-1 items-center">
              <RiLoader3Fill className="text-white animate-spin" />
              Loading...
            </p>
          )}
        </button>
      </div>
    </form>
  );
};

export default ForgetPassword;
