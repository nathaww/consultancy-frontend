import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import { FamilyInterface, getFamilyById, updateFamily } from "@/api/family";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

const EditFamily = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedRelationship, setSelectedRelationship] = useState<string>("");

  const { data, isError, isLoading } = useQuery<FamilyInterface>({
    queryKey: ["familyById"],
    queryFn: () => getFamilyById(id!),
    refetchOnMount: "always",
  });

  const formattedDateOfBirth = data
    ? format(new Date(data?.dateOfBirth!), "yyyy-MM-dd")
    : new Date();

  const initialValues = {
    firstName: data?.firstName,
    lastName: data?.lastName,
    phoneNumber: data?.phoneNumber,
    educationalLevel: data?.educationalLevel,
    dateOfBirth: formattedDateOfBirth,
    relationship: data?.relationship,
  };

  useEffect(() => {
    formik.setValues({
      firstName: data?.firstName,
      lastName: data?.lastName,
      phoneNumber: data?.phoneNumber,
      educationalLevel: data?.educationalLevel,
      dateOfBirth: formattedDateOfBirth,
      relationship: data?.relationship,
    });
  }, [data]);

  const validationSchema = Yup.object().shape({
    relationship: Yup.string().required("Relationship is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    educationalLevel: Yup.string().required("Educational Level is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    dateOfBirth:
      selectedRelationship === "Father" || selectedRelationship === "Mother"
        ? Yup.date().nullable().required("Date of Birth is required")
        : Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await familyUpdateMutation.mutateAsync(values);
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const familyUpdateMutation = useMutation<
    FamilyInterface,
    Error,
    FamilyInterface
  >({
    mutationKey: ["familyEditMutation"],
    mutationFn: async (formData: FamilyInterface) =>
      updateFamily(id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyById"] });
      const notify = toast.success("Student Family updated successfully");
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
          <h1 className="my-2 text-lg font-bold">Update Family Information</h1>
          <hr className="my-4" />
        </div>

        {isLoading && <Loading />}

        {isError && <Error />}

        {(!isLoading && !data && !isError) && <NoData text="No Guardian/Sibling Found" />}

        {(data && !isError ) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <div className="my-2">
              <label className="text-black">
                Relationship <label className="text-red-700">*</label>
              </label>
              <select
                className={`input-style w-full mt-1 ${
                  formik.touched.relationship && formik.errors.relationship
                    ? "border-red-500"
                    : ""
                }`}
                aria-label="Select example"
                {...formik.getFieldProps("relationship")}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
              </select>
              {formik.touched.relationship && formik.errors.relationship && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {String(formik.errors.relationship)}
                </div>
              )}
            </div>

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
                  {String(formik.errors.firstName)}
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
                  {String(formik.errors.lastName)}
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
                onChange={(e) => {
                  setSelectedRelationship(e.target.value);
                  formik.handleChange(e);
                }}
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
                    {String(formik.errors.educationalLevel)}
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
                  {String(formik.errors.phoneNumber)}
                </div>
              )}
            </div>
            {formik.values.relationship === "Father" ||
            formik.values.relationship === "Mother" ? (
              <>
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
              </>
            ) : (
              ""
            )}
          </div>
        )}
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
            {!familyUpdateMutation?.isPending && (
              <span className="indicator-label">Submit</span>
            )}
            {familyUpdateMutation?.isPending && (
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

export default EditFamily;
