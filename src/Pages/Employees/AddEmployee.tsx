import { EmployeeInterface, postEmployee } from "@/api/employees";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const AddEmployee = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const roles: string[] = ["Agent", "Admission", "Finance", "Visa"];
  const initialValues = {
    email: "",
    roles: [],
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    dateOfBirth: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    roles: Yup.array()
      .required("Please select at least one role")
      .min(1, "You must select at least one role")
      .of(Yup.string().oneOf(roles, "Invalid role selected")),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await addEmployeeMutation.mutateAsync(values);
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const addEmployeeMutation = useMutation<
    EmployeeInterface,
    Error,
    EmployeeInterface
  >({
    mutationKey: ["addEmployeeMutation"],
    mutationFn: async (formData) => postEmployee(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      const notify = toast.success("Employee added successfully");
      notify;
      nav("/employees");
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  return (
    <>
      <div className="flex w-full justify-between mb-4">
        <h1 className="sm:text-xl lg:tex-xl font-bold">Add Employee</h1>
      </div>

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
                type="text"
                name="email"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.email}
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
                type="password"
                name="password"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.password}
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
              <span className="text-sm mt-4 ml-2 w-max text-primaryColor">Phone Number should start +251</span>
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
                  {String(formik.errors.dateOfBirth)}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">Roles</label>
              {roles.map((role) => (
                <div key={role} className="form-check ms-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={role}
                    value={role}
                    checked={formik.values.roles.includes(role as never)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      formik.setFieldValue(
                        "roles",
                        isChecked
                          ? [...formik.values.roles, role]
                          : formik.values.roles.filter((r) => r !== role)
                      );
                    }}
                    name="roles"
                  />
                  <label className="form-check-label ms-1" htmlFor={role}>
                    {role}
                  </label>
                </div>
              ))}
              {formik.touched.roles && formik.errors.roles && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.roles}
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
                nav("/employees");
              }}
              className="btn-secondary btn-anim bg-gray-200 mb-5 w-32"
            >
              Discard
            </button>
            <button
              type="submit"
              className="btn btn-anim bg-primaryColor text-white mb-5 w-40"
            >
              {!addEmployeeMutation?.isPending && (
                <span className="indicator-label">Submit</span>
              )}
              {addEmployeeMutation?.isPending && (
                <span className="flex gap-2 items-center">
                  Submitting...{" "}
                  <RiLoader3Fill className="animate-spin text-2xl text-lightPrimaryColor" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEmployee;
