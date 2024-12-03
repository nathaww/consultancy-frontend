import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { useUser } from "@/Context/UserContext";
import {
  StudentInterface,
  UpdateStudentAddressInterface,
  getStudent,
  updateStudentAddress,
} from "@/api/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const initialValues = {
    studentId: id,
    region: data?.studentAddress.region,
    city: data?.studentAddress.city,
    subCity: data?.studentAddress.subCity,
    woreda: data?.studentAddress.woreda,
    kebele: data?.studentAddress.kebele,
    houseNumber: data?.studentAddress.houseNumber,
  };

  useEffect(() => {
    formik.setValues({
      studentId: id,
      region: data?.studentAddress.region,
      city: data?.studentAddress.city,
      subCity: data?.studentAddress.subCity,
      woreda: data?.studentAddress.woreda,
      kebele: data?.studentAddress.kebele,
      houseNumber: data?.studentAddress.houseNumber,
    });
  }, [data]);

  const validationSchema = Yup.object().shape({
    region: Yup.string().required("Region Email is required"),
    city: Yup.string().required("City is required"),
    subCity: Yup.string().required("Subcity is required"),
    woreda: Yup.string().required("Woreda is required"),
    kebele: Yup.string().required("Kebele is required"),
    houseNumber: Yup.string().required("House Number is required"),
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
    UpdateStudentAddressInterface,
    Error,
    UpdateStudentAddressInterface
  >({
    mutationKey: ["EditStudentMutation"],
    mutationFn: async (data) => updateStudentAddress(data),
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
              <h1 className="my-2 text-lg font-bold">Address</h1>
              <hr className="my-4" />
            </div>
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
          ${formik.touched.city && formik.errors.city ? "border-red-500" : ""} 
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
                <label className="text-black">Sub City</label>
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
