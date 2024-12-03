import { useNavigate, useParams } from "react-router-dom";
import { makeReq } from "@/makeReq";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import * as Yup from "yup";

const ResetPassword = () => {
  const nav = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues = {
    email: "",
    password: "",
    resetPasswordToken: token!,
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("E-mail is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await makeReq.patch(`/auth/reset-password`, values);
        if (res.status === 204) {
          const notify = () =>
            toast.success("Password has been reset successfully");
          notify();
          nav("/auth/login");
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
      <h1 className="text-base text-center sm:text-xl lg:text-xl my-4">
        Reset Password
      </h1>

      <div className="mb-3">
        <label className="text-black">E-mail</label>
        <input
          placeholder="Current e-mail address"
          {...formik.getFieldProps("email")}
          className={`input-style w-full
        ${formik.touched.email && formik.errors.email ? "border-red-500" : ""} 
      `}
          required
          type="email"
          name="email"
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-red-700 text-sm">{formik.errors.email}</span>
        )}
      </div>
      <div className="mb-3">
        <label className="text-black">New Password</label>
        <input
          placeholder="******"
          {...formik.getFieldProps("password")}
          className={`input-style w-full
        ${
          formik.touched.password && formik.errors.password
            ? "border-red-500"
            : ""
        } 
      `}
          required
          type="password"
          name="password"
          autoComplete="off"
        />
        {formik.touched.password && formik.errors.password && (
          <span className="text-red-700 text-sm">{formik.errors.password}</span>
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

export default ResetPassword;
