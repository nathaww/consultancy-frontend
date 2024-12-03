import { ActivateStudentInterface, activateStudent } from "@/api/student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

const Activate = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const initialValues = {
    country: "",
    educationalLevel: "",
    fieldOfStudy: "",
    studentId: id!,
    intake: "",
  };

  const validationSchema = Yup.object().shape({
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
        await activateStudentMutation.mutateAsync(values);
        formik.resetForm();
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const activateStudentMutation = useMutation<
    ActivateStudentInterface,
    Error,
    ActivateStudentInterface
  >({
    mutationKey: ["activateStudentMutation"],
    mutationFn: async (data: ActivateStudentInterface) => activateStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      const notify = toast.success("Student activated successfully");
      notify;
      formik.resetForm();
      nav("/agentStudents");
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  return (
    <div className="w-full">
      <h1 className="mb-4 text-lg font-bold">Activate Student</h1>
      <form
        className="rounded shadow-sm p-3 bg-white"
        onSubmit={formik.handleSubmit}
      >
        <div className="col-span-12">
          <h1 className="my-2">
            Provide application information to activate student.
          </h1>
          <hr className="my-4" />
        </div>
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
            <label className="text-black">Field of Study</label>
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
              <option value="Winter">Winter</option>
              <option value="Fall">Fall</option>
            </select>
            {formik.touched.intake && formik.errors.intake && (
              <div className="text-red-500 text-sm sm:text-base lg:text-base">
                {formik.errors.intake}
              </div>
            )}
          </div>
        </div>

        <hr className="my-6" />
        <div className="flex flex-row justify-end gap-2 w-full">
          <button
            type="button"
            onClick={() => {
              nav("/agentStudents");
            }}
            className="btn-secondary btn-anim bg-gray-200 mb-5 w-32"
          >
            Discard
          </button>
          <button
            type="submit"
            className="btn btn-anim bg-primaryColor text-white mb-5 w-40"
          >
            {!activateStudentMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {activateStudentMutation?.isPending && (
              <span className="flex gap-2 items-center">
                Submitting...{" "}
                <RiLoader3Fill className="animate-spin text-2xl text-lightPrimaryColor" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Activate;
