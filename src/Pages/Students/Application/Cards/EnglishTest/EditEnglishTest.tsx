import {
  AddEnglishTestInterface,
  EnglishTestInterface,
  getEnglishTestById,
  updateEnglishTest,
} from "@/api/englishTest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

const EditEnglishTest = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data } = useQuery<EnglishTestInterface>({
    queryKey: ["englishTestById"],
    queryFn: () => getEnglishTestById(id!),
    refetchOnMount: "always",
  });

  const formattedTestDate = data
    ? format(new Date(data?.englishTest?.testDate!), "yyyy-MM-dd")
    : "";

  const initialValues = {
    applicationId: id!,
    practiceLink: data?.englishTest?.practiceLink,
    practiceLink2: data?.englishTest?.practiceLink2,
    testDate: formattedTestDate,
    email: data?.englishTest?.email,
    password: data?.englishTest?.password,
  };

  useEffect(() => {
    formik.setValues({
      applicationId: id!,
      practiceLink: data?.englishTest?.practiceLink,
      practiceLink2: data?.englishTest?.practiceLink2,
      testDate: formattedTestDate,
      email: data?.englishTest?.email,
      password: data?.englishTest?.password,
    });
  }, [data]);

  const validationSchema = Yup.object().shape({
    applicationId: Yup.string().required("Application ID is required"),
    practiceLink: Yup.string().required("Practice Link is required"),
    practiceLink2: Yup.string().required("Practice Link is required"),
    testDate: Yup.date().required("Test Date is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await updateEnglishTestMutation.mutateAsync(values);
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const updateEnglishTestMutation = useMutation<
    AddEnglishTestInterface,
    Error,
    AddEnglishTestInterface
  >({
    mutationKey: ["updateEnglishTestMutation"],
    mutationFn: async (data) => updateEnglishTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["englishTest"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("English Test updated successfully");
      notify;
      nav(-1);
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  return (
    <div className="w-full mt-8 card-shadow p-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="col-span-12">
          <h1 className="my-2 text-base md:text-lg lg:text-lg font-bold">
            Edit English Test Information
          </h1>
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
                {String(formik.errors.practiceLink)}
              </div>
            )}
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
                {String(formik.errors.practiceLink2)}
              </div>
            )}
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
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();

              nav(-1);
            }}
            className="btn-secondary btn-anim bg-gray-200 mb-5 w-32"
          >
            Discard
          </button>
          <button
            type="submit"
            className="btn btn-anim bg-primaryColor text-white mb-5 w-40"
          >
            {!updateEnglishTestMutation?.isPending && (
              <span className="indicator-label">Update</span>
            )}
            {updateEnglishTestMutation?.isPending && (
              <span className="flex gap-2 items-center">
                Updating...{" "}
                <RiLoader3Fill className="animate-spin text-2xl text-lightPrimaryColor" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEnglishTest;
