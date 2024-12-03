import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { RiLoader3Fill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { format } from "date-fns";
import { PassportInterface, getPassport, updatePassport } from "@/api/passport";

const EditPassport = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery<PassportInterface>({
    queryKey: ["passportById"],
    queryFn: () => getPassport(id!),
    refetchOnMount: "always",
  });

  const formattedInitialtDate = data
    ? format(new Date(data?.issueDate!), "yyyy-MM-dd")
    : new Date();
  const formattedExpiryDate = data
    ? format(new Date(data?.expiryDate!), "yyyy-MM-dd")
    : new Date();

  const initialValues = {
    studentId: id,
    passportNumber: data?.passportNumber,
    issueDate: formattedInitialtDate,
    expiryDate: formattedExpiryDate,
  };

  useEffect(() => {
    formik.setValues({
      studentId: id,
      passportNumber: data?.passportNumber,
      issueDate: formattedInitialtDate,
      expiryDate: formattedExpiryDate,
    });
  }, [data]);

  const validationSchema = Yup.object().shape({
    passportNumber: Yup.string()
      .min(6, "Passport number must be at least 6 characters")
      .max(10, "Passport number cannot exceed 10 characters")
      .required("Passport number is required"),
    issueDate: Yup.date().required("Issue date is required"),
    expiryDate: Yup.date()
      .min(Yup.ref("issueDate"), "Expiry date must be after issue date")
      .required("Expiry date is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("studentId", values.studentId!);
        formData.append("passportNumber", values.passportNumber!);
        formData.append("issueDate", String(values.issueDate));
        formData.append("expiryDate", String(values.expiryDate));
        await updatePassportMutation.mutateAsync(formData);
      } catch (error: any) {
        console.error("Mutation failed", error);
      }
    },
  });

  const updatePassportMutation = useMutation<FormData, Error, FormData>({
    mutationKey: ["passportMutation"],
    mutationFn: async (formData) => updatePassport(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      const notify = toast.success("Passport information updated successfully");
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
          <h1 className="my-2 text-lg font-bold">
            Update Passport Information
          </h1>
          <hr className="my-4" />
        </div>

        {isLoading && <Loading />}

        {isError && <Error />}

        {!isError && !data && !isLoading && (
          <NoData text="No Guardian/Sibling Found" />
        )}

        {(data && !isError) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            <div className="my-2">
              <label className="text-black">Passport Number</label>
              <input
                {...formik.getFieldProps("passportNumber")}
                className={`input-style w-full mt-1
              ${
                formik.touched.passportNumber && formik.errors.passportNumber
                  ? "border-red-500"
                  : ""
              } 
            `}
                type="text"
                name="passportNumber"
              />
              {formik.touched.passportNumber &&
                formik.errors.passportNumber && (
                  <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                    {formik.errors.passportNumber}
                  </div>
                )}
            </div>

            <div className="my-2">
              <label className="text-black">Issue Date</label>
              <input
                {...formik.getFieldProps("issueDate")}
                className={`input-style w-full mt-1
              ${
                formik.touched.issueDate && formik.errors.issueDate
                  ? "border-red-500"
                  : ""
              } 
            `}
                type="date"
                name="issueDate"
              />
              {formik.touched.issueDate && formik.errors.issueDate && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {String(formik.errors.issueDate)}
                </div>
              )}
            </div>

            <div className="my-2">
              <label className="text-black">Expiry Date</label>
              <input
                {...formik.getFieldProps("expiryDate")}
                className={`input-style w-full mt-1
              ${
                formik.touched.expiryDate && formik.errors.expiryDate
                  ? "border-red-500"
                  : ""
              } 
            `}
                type="date"
                name="expiryDate"
              />
              {formik.touched.expiryDate && formik.errors.expiryDate && (
                <div className="text-red-500 text-sm sm:text-base lg:text-base mt-2">
                  {String(formik.errors.expiryDate)}
                </div>
              )}
            </div>
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
            {!updatePassportMutation?.isPending && (
              <span className="indicator-label">Update</span>
            )}
            {updatePassportMutation?.isPending && (
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

export default EditPassport;
