import { useEffect, useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { makeReq } from "@/makeReq";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useUser } from "@/Context/UserContext";
import toast from "react-hot-toast";
import { CircleSpinner } from "react-spinners-kit";

const Login = () => {
  const nav = useNavigate();
  const signIn = useSignIn();
  const { setUser } = useUser();
  const isAuthenticated = useIsAuthenticated();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      nav("/");
    }
  }, []);

  const initialValues = {
    email: "",
    password: "",
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("E-mail is required"),
    password: Yup.string()
      .min(8, "Minimum 8 Characters")
      .max(50, "Maximum 50 Characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await makeReq.post("auth/login", values);
        setUser(res.data);
        if (res.status === 200) {
          signIn({
            auth: {
              token: res?.data?.token.access_token,
              type: "Bearer",
            },
          });

          makeReq.interceptors.request.use(
            (config) => {
              const token = localStorage.getItem("_auth");
              if (token) {
                config.headers.Authorization = `Bearer ${token}`;
              }
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );
          const notify = () => toast.success("Logged in successfully");
          notify();
          nav("/");
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
        Sign In
      </h1>

      <div className="mb-3">
        <input
          placeholder="Your e-mail address"
          {...formik.getFieldProps("email")}
          className={`input-style w-full
            ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : ""
            } 
          `}
          required
          type="email"
          name="email"
          autoComplete="off"
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-red-700 text-sm">{formik.errors.email}</span>
        )}
      </div>

      <div className="fv-row mb-3">
        <input
          type="password"
          required
          placeholder="********"
          autoComplete="off"
          {...formik.getFieldProps("password")}
          className={`input-style w-full
            ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : ""
            } 
            `}
        />
        {formik.touched.password && formik.errors.password && (
          <span className="text-red-700 text-sm">{formik.errors.password}</span>
        )}
      </div>

      <div className="d-flex text-white text-center flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8 hover:underline underline-offset-1">
        <Link to="/auth/forgot-password">Forgot Password ?</Link>
      </div>

      <div className="d-grid mb-2">
        <button
          type="submit"
          className="btn bg-primaryColor text-white w-full"
          disabled={!formik.errors || !formik.isValid || loading}
        >
          {!loading && <span className="indicator-label">Login</span>}
          {loading && (
            <div className="flex flex-row justify-center items-center">
              <CircleSpinner size={25} color="#ffffff" loading={loading}  />
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default Login;
