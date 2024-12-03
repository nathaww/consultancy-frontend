import { useUser } from "@/Context/UserContext";
import { PostStudent, postStudent } from "@/api/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const AddStudent = () => {
  const { user } = useUser();
  const nav = useNavigate();
  const queryClient = useQueryClient();

  const initialValues = {
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    dateOfBirth: new Date(),
    branch: "",
    region: "",
    city: "",
    subCity: "",
    woreda: "",
    kebele: "",
    houseNumber: "",
    country: "",
    educationalLevel: "",
    fieldOfStudy: "",
    intake: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    gender: Yup.string().required("Gender is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    dateOfBirth: Yup.string().required("Date of birth is required"),
    branch: Yup.string().required("Branch is required"),
    region: Yup.string().required("Region is required"),
    city: Yup.string().required("City is required"),
    subCity: Yup.string().required("Sub-city is required"),
    woreda: Yup.string().required("Woreda is required"),
    kebele: Yup.string().required("Kebele is required"),
    houseNumber: Yup.string().required("House number is required"),
    country: Yup.string().required("Country is required"),
    educationalLevel: Yup.string().required("Educational level is required"),
    fieldOfStudy: Yup.string().required("Field of study is required"),
    intake: Yup.string().required("Intake is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await studentMutation.mutateAsync(values);
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const studentMutation = useMutation<PostStudent, Error, PostStudent>({
    mutationKey: ["StudentMutation"],
    mutationFn: async (formData) => postStudent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      const notify = toast.success("Student added successfully");
      notify;
      if (user?.user.roles.includes("Agent")) {
        nav("/agentStudents");
      } else {
        nav("/students");
      }
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
        <h1 className="sm:text-xl lg:tex-xl font-bold">Add Student</h1>
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
                  {String(formik.errors.dateOfBirth)}
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
          <h1 className="mt-2 text-lg font-bold">Address</h1>
          <hr className="my-4 bg-black" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <div className="my-2">
              <label className="text-black">Region</label>
              <input
                {...formik.getFieldProps("region")}
                className={`input-style w-full mt-1
            ${
              formik.touched.region && formik.errors.region
                ? "border-red-500"
                : ""
            } 
          `}
                type="text"
                name="region"
              />
              {formik.touched.region && formik.errors.region && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.region}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">City</label>
              <input
                {...formik.getFieldProps("city")}
                className={`input-style w-full mt-1
            ${
              formik.touched.city && formik.errors.city ? "border-red-500" : ""
            } 
          `}
                type="text"
                name="city"
              />
              {formik.touched.city && formik.errors.city && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.city}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">Subcity</label>
              <input
                {...formik.getFieldProps("subCity")}
                className={`input-style w-full mt-1
            ${
              formik.touched.subCity && formik.errors.subCity
                ? "border-red-500"
                : ""
            } 
          `}
                type="text"
                name="subCity"
              />
              {formik.touched.subCity && formik.errors.subCity && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.subCity}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">Woreda</label>
              <input
                {...formik.getFieldProps("woreda")}
                className={`input-style w-full mt-1
            ${
              formik.touched.woreda && formik.errors.woreda
                ? "border-red-500"
                : ""
            } 
          `}
                type="text"
                name="woreda"
              />
              {formik.touched.woreda && formik.errors.woreda && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.woreda}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">Kebele</label>
              <input
                {...formik.getFieldProps("kebele")}
                className={`input-style w-full mt-1
            ${
              formik.touched.kebele && formik.errors.kebele
                ? "border-red-500"
                : ""
            } 
          `}
                type="text"
                name="kebele"
              />
              {formik.touched.kebele && formik.errors.kebele && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.kebele}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">House Number</label>
              <input
                {...formik.getFieldProps("houseNumber")}
                className={`input-style w-full mt-1
            ${
              formik.touched.houseNumber && formik.errors.houseNumber
                ? "border-red-500"
                : ""
            } 
          `}
                type="text"
                name="houseNumber"
              />
              {formik.touched.houseNumber && formik.errors.houseNumber && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.houseNumber}
                </div>
              )}
            </div>
          </div>

          <h1 className="mt-2 text-lg font-bold">Application</h1>
          <hr className="my-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <div className="my-2">
              <label className="text-black">Country</label>
              <select
                className={`input-style w-full mt-1 ${
                  formik.touched.country && formik.errors.country
                    ? "border-red-500"
                    : ""
                }`}
                aria-label="Select example"
                {...formik.getFieldProps("country")}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="UnitedStates">USA</option>
                <option value="Canada">Canada</option>
                <option value="Italy">Italy</option>
                <option value="Hungary">Hungary</option>
              </select>
              {formik.touched.country && formik.errors.country && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base">
                  {formik.errors.country}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">Educational Level</label>
              <select
                className={`input-style w-full mt-1 ${
                  formik.touched.educationalLevel &&
                  formik.errors.educationalLevel
                    ? "border-red-500"
                    : ""
                }`}
                aria-label="Select example"
                {...formik.getFieldProps("educationalLevel")}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="High School">High School</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Ph.D.">Ph.D.</option>
              </select>
              {formik.touched.educationalLevel &&
                formik.errors.educationalLevel && (
                  <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                    {formik.errors.educationalLevel}
                  </div>
                )}
            </div>

            <div className="my-2">
              <label className="text-black">Intake</label>
              <select
                className={`input-style w-full mt-1 ${
                  formik.touched.intake && formik.errors.intake
                    ? "border-red-500"
                    : ""
                }`}
                aria-label="Select example"
                {...formik.getFieldProps("intake")}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Summer">Summer</option>
                <option value="Spring">Spring</option>
                <option value="Autumn">Autumn</option>
                <option value="Fall">Fall</option>
              </select>
              {formik.touched.intake && formik.errors.intake && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.intake}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">Field of study</label>
              <input
                {...formik.getFieldProps("fieldOfStudy")}
                className={`input-style w-full mt-1
            ${
              formik.touched.fieldOfStudy && formik.errors.fieldOfStudy
                ? "border-red-500"
                : ""
            } 
          `}
                type="text"
                name="fieldOfStudy"
              />
              {formik.touched.fieldOfStudy && formik.errors.fieldOfStudy && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {formik.errors.fieldOfStudy}
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
                nav("/students");
              }}
              className="btn-secondary btn-anim bg-gray-200 mb-5 w-32"
            >
              Discard
            </button>
            <button
              type="submit"
              className="btn btn-anim bg-primaryColor text-white mb-5 w-40"
            >
              {!studentMutation?.isPending && (
                <span className="indicator-label">Submit</span>
              )}
              {studentMutation?.isPending && (
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

export default AddStudent;
