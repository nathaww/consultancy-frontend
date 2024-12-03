import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { useUser } from "@/Context/UserContext";
import {
  StudentInterface,
  UpdateStudentInterface,
  getStudent,
  updateStudent,
} from "@/api/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

const EditStudent = () => {
  const nav = useNavigate();
  const { user } = useUser();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<StudentInterface>({
    queryKey: ["student"],
    queryFn: () => getStudent(id!),
  });

  const formattedDateOfBirth = data?.dateOfBirth
    ? format(new Date(data.dateOfBirth.replace(/\//g, "-")), "yyyy-MM-dd")
    : "";

  const initialValues = {
    id: id,
    admissionEmail: data?.admissionEmail,
    firstName: data?.firstName,
    lastName: data?.lastName,
    gender: data?.gender,
    phoneNumber: data?.user.phoneNumber,
    dateOfBirth: formattedDateOfBirth,
    branch: data?.branch,
  };

  useEffect(() => {
    formik.setValues({
      id: id,
      admissionEmail: data?.admissionEmail,
      firstName: data?.firstName,
      lastName: data?.lastName,
      gender: data?.gender,
      phoneNumber: data?.user.phoneNumber,
      dateOfBirth: formattedDateOfBirth,
      branch: data?.branch,
    });
  }, [data]);

  const validationSchema = Yup.object().shape({
    admissionEmail: Yup.string()
      .email("Invalid email address")
      .required("Admission Email is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    branch: Yup.string().required("Branch is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await editStudentMutation.mutateAsync(values);
      } catch (error) {
        console.error("Mutation failed", error);
      }
    },
  });

  const editStudentMutation = useMutation<
    UpdateStudentInterface,
    Error,
    UpdateStudentInterface
  >({
    mutationKey: ["EditStudentMutation"],
    mutationFn: async (data) => updateStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      const notify = toast.success("Student updated successfully");
      notify;
      if (user?.user.roles.includes("Agent")) {
        nav("/agentStudents");
      } else {
        nav("/students");
      }
    },
    onError: (error) => {
      const notify = toast.error(
        JSON.stringify(error.message) || "An unknown error occurred"
      );
      notify;
    },
  });

  return (
    <>
      <div className="flex w-full justify-between mb-4">
        <h1 className="sm:text-xl lg:tex-xl font-bold">Edit Student</h1>
      </div>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data && !isError && (
        <div className="card-shadow p-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="col-span-12">
              <h1 className="my-2 text-lg font-bold">Basic Information</h1>
              <hr className="my-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
              <div className="my-2">
                <label className="text-black">First Name</label>
                <input
                  {...formik.getFieldProps("firstName")}
                  className={`input-style w-full mt-1
          ${
            formik.touched.firstName && formik.errors.firstName
              ? "border-red-500"
              : ""
          } 
        `}
                  type="text"
                  name="firstName"
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>

              <div className="my-2">
                <label className="text-black">Last Name</label>
                <input
                  {...formik.getFieldProps("lastName")}
                  className={`input-style w-full mt-1
          ${
            formik.touched.lastName && formik.errors.lastName
              ? "border-red-500"
              : ""
          } 
        `}
                  type="text"
                  name="lastName"
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>

              <div className="my-2">
                <label className="text-black">Gender</label>
                <select
                  className={`input-style w-full mt-1 ${
                    formik.touched.gender && formik.errors.gender
                      ? "border-red-500"
                      : ""
                  }`}
                  aria-label="Select example"
                  {...formik.getFieldProps("gender")}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                    {formik.errors.gender}
                  </div>
                )}
              </div>

              <div className="my-2">
                <label className="text-black">Addmision Email</label>
                <input
                  {...formik.getFieldProps("admissionEmail")}
                  className={`input-style w-full mt-1
          ${
            formik.touched.admissionEmail && formik.errors.admissionEmail
              ? "border-red-500"
              : ""
          } 
        `}
                  type="text"
                  name="admissionEmail"
                />
                {formik.touched.admissionEmail &&
                  formik.errors.admissionEmail && (
                    <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                      {formik.errors.admissionEmail}
                    </div>
                  )}
              </div>

              <div className="my-2">
                <label className="text-black">Phone Number</label>
                <input
                  {...formik.getFieldProps("phoneNumber")}
                  className={`input-style w-full mt-1
          ${
            formik.touched.phoneNumber && formik.errors.phoneNumber
              ? "border-red-500"
              : ""
          } 
        `}
                  type="text"
                  name="phoneNumber"
                />
                <span className="text-sm mt-4 ml-2 w-max text-primaryColor">
                  Phone Number should start +251
                </span>
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                    {formik.errors.phoneNumber}
                  </div>
                )}
              </div>

              <div className="my-2">
                <label className="text-black">Date of Birth</label>
                <input
                  {...formik.getFieldProps("dateOfBirth")}
                  className={`input-style w-full mt-1
          ${
            formik.touched.dateOfBirth && formik.errors.dateOfBirth
              ? "border-red-500"
              : ""
          } 
        `}
                  type="date"
                  name="dateOfBirth"
                />
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                  <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                    {formik.errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div className="my-2">
                <label className="text-black">Branch</label>
                <input
                  {...formik.getFieldProps("branch")}
                  className={`input-style w-full mt-1
          ${
            formik.touched.branch && formik.errors.branch
              ? "border-red-500"
              : ""
          } 
        `}
                  type="text"
                  name="branch"
                />
                {formik.touched.branch && formik.errors.branch && (
                  <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                    {formik.errors.branch}
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
                  if (user?.user.roles.includes("Agent")) {
                    nav("/agentStudents");
                  } else {
                    nav("/students");
                  }
                }}
                className="btn-secondary btn-anim bg-gray-200 mb-5 w-32"
              >
                Discard
              </button>
              <button
                type="submit"
                className="btn btn-anim bg-primaryColor text-white mb-5 w-40"
              >
                {!editStudentMutation?.isPending && (
                  <span className="indicator-label">Update</span>
                )}
                {editStudentMutation?.isPending && (
                  <span className="flex gap-2 items-center">
                    Submitting...{" "}
                    <RiLoader3Fill className="animate-spin text-2xl text-lightPrimaryColor" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EditStudent;
