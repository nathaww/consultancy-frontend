import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  StudentInterface,
  getStudent,
  updateStudentImage,
} from "@/api/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaLeftLong } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddApplicationModal from "./AddApplicationModal";
import { useUser } from "@/Context/UserContext";
import { MdDeleteOutline } from "react-icons/md";
import { deleteApplication } from "@/api/application";

const StudentDetail = () => {
  const { user } = useUser();
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isError } = useQuery<StudentInterface>({
    queryKey: ["student"],
    queryFn: () => getStudent(id!),
  });

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      await deleteStudentMutation.mutateAsync(id);
    }
  };

  const deleteStudentMutation = useMutation({
    mutationKey: ["DeleteStudent"],
    mutationFn: async (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      const notify = toast.success("Application deleted successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const updateStudentImageMutation = useMutation<FormData, any, FormData>({
    mutationKey: ["updateStudentImage"],
    mutationFn: async (formData) => updateStudentImage(id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student"] });
      queryClient.invalidateQueries({ queryKey: ["studentImage"] });
      const notify = toast.success("Image updated successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response?.data?.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    const formData = new FormData();
    formData.append("profileImage", selectedFile!);
    updateStudentImageMutation.mutate(formData);
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <AddApplicationModal open={open} onCloseModal={onCloseModal} />
      <div className="flex w-full">
        {user?.user.roles.includes("Admin") ||
        user?.user.roles.includes("Agent") ? (
          <Link
            className="inline-flex items-center gap-2 mb-4"
            to={`${
              user?.user.roles.includes("Agent")
                ? "/agentStudents"
                : "/students"
            }`}
          >
            <FaLeftLong className="text-primaryColor" /> Back to Student List
          </Link>
        ) : (
          <Link
            className="inline-flex items-center gap-2 mb-4"
            to={`${"/applications"}`}
          >
            <FaLeftLong className="text-primaryColor" /> Back to Application
            List
          </Link>
        )}
      </div>
      <div className="flex w-full justify-center items-center mb-4">
        <h1 className="text-base text-center sm:text-xl lg:tex-xl font-bold">
          Students Information
        </h1>
      </div>
      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row justify-between items-start w-full gap-2">
        <div className="w-80 px-4 py-4 card-shadow border mx-auto">
          <div className="w-32 h-32 rounded-full mx-auto bg-primaryColor flex justify-center items-center">
            {data?.image ? (
              <img
                src={`import.meta.env.VITE_BASE_AWS_URL${data?.image}`}
                alt="student profile img"
                loading="lazy"
                className="w-full h-full rounded-full object-cover object-center"
              />
            ) : (
              <p className="text-white text-7xl">{data?.firstName.charAt(0)}</p>
            )}
          </div>
          <div className="text-left flex flex-col gap-y-3 mt-3">
            <div>
              <strong className="block text-xl font-semibold">
                {data?.firstName} {data?.lastName || "-"}
              </strong>
              <span>Student</span>
            </div>
            {user?.user.roles.includes("Admin") ||
            user?.user.roles.includes("Agent") ? (
              <button
                disabled={updateStudentImageMutation.isPending}
                className="btn btn-anim bg-blue-200 text-primaryColor hover:bg-blue-300"
                onClick={openFileExplorer}
              >
                {updateStudentImageMutation.isPending
                  ? "Loading..."
                  : " Change Image"}
              </button>
            ) : (
              ""
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </div>

          <div className="mt-4 flex flex-col gap-y-2">
            <div>
              <p className="block font-semibold">Gender</p>
              <span>{data?.gender || "-"}</span>
            </div>

            <div>
              <p className="block font-semibold">Date of birth</p>
              <span>
                {data?.dateOfBirth
                  ? format(new Date(data.dateOfBirth), "yyyy/MM/dd")
                  : "-"}
              </span>
            </div>

            <div>
              <p className="block font-semibold">Phone Number</p>
              <span>{data?.user?.phoneNumber || "-"}</span>
            </div>

            <div>
              <p className="block font-semibold">Admission E-mail</p>
              <span>{data?.admissionEmail || "-"}</span>
            </div>
            <div>
              <p className="block font-semibold">Registered By</p>
              <span>
                {data?.agent?.firstName || "-"} {data?.agent?.lastName || "-"}
              </span>
            </div>
            <div>
              <p className="block font-semibold">Branch</p>
              <span>{data?.branch || "-"}</span>
            </div>
          </div>
          {user?.user.roles.includes("Admin") ||
          user?.user.roles.includes("Agent") ||
          user?.user.roles.includes("Admission") ||
          user?.user.roles.includes("Visa") ? (
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                user?.user.roles.includes("Agent")
                  ? nav(`/agentStudents/detail/${id}/moredetail/school`)
                  : nav(`/students/detail/${id}/moredetail/school`);
              }}
              className="btn btn-anim bg-primaryColor text-white w-full mt-4"
            >
              More Info
            </button>
          ) : (
            ""
          )}
        </div>

        {user?.user.roles.includes("Admin") ||
        user?.user.roles.includes("Agent") ? (
          <>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <h1 className="m-4 text-base sm:text-xl lg:tex-xl font-bold">
                  Applications
                </h1>
                {user?.user.roles.includes("Admin") ||
                user?.user.roles.includes("Agent") ? (
                  <button
                    onClick={onOpenModal}
                    className="btn btn-anim bg-primaryColor text-white"
                  >
                    Add Application
                  </button>
                ) : (
                  ""
                )}
              </div>
              {isLoading && <Loading />}

              {isError && <Error />}

              {data && data?.applications?.length < 1 && !isError && (
                <NoData text="No Applications" />
              )}
              {data && data?.applications?.length > 0 && !isError && (
                <div className="card-shadow border p-2 w-full">
                  <Table>
                    <TableCaption>A list of all applications.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Level</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Field of Study</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {data?.applications?.map((item) => (
                        <TableRow key={item.id || "-"}>
                          <TableCell
                            className="hover:underline cursor-pointer"
                            onClick={(
                              event: React.MouseEvent<HTMLTableCellElement>
                            ) => {
                              event.preventDefault();
                              user?.user.roles.includes("Agent")
                                ? nav(
                                    `/agentStudents/application/${item.id}/deposit`
                                  )
                                : nav(
                                    `/students/application/${item.id}/deposit`
                                  );
                            }}
                          >
                            {item.educationalLevel || "-"}
                          </TableCell>
                          <TableCell
                            className="hover:underline cursor-pointer"
                            onClick={(
                              event: React.MouseEvent<HTMLTableCellElement>
                            ) => {
                              event.preventDefault();

                              user?.user.roles.includes("Agent")
                                ? nav(
                                    `/agentStudents/application/${item.id}/deposit`
                                  )
                                : nav(
                                    `/students/application/${item.id}/deposit`
                                  );
                            }}
                          >
                            {item.country || "-"}
                          </TableCell>
                          <TableCell
                            className="hover:underline cursor-pointer"
                            onClick={(
                              event: React.MouseEvent<HTMLTableCellElement>
                            ) => {
                              event.preventDefault();

                              user?.user.roles.includes("Agent")
                                ? nav(
                                    `/agentStudents/application/${item.id}/deposit`
                                  )
                                : nav(
                                    `/students/application/${item.id}/deposit`
                                  );
                            }}
                          >
                            {item.fieldOfStudy || "-"}
                          </TableCell>
                          <TableCell
                            className="hover:underline cursor-pointer"
                            onClick={(
                              event: React.MouseEvent<HTMLTableCellElement>
                            ) => {
                              event.preventDefault();

                              user?.user.roles.includes("Agent")
                                ? nav(
                                    `/agentStudents/application/${item.id}/deposit`
                                  )
                                : nav(
                                    `/students/application/${item.id}/deposit`
                                  );
                            }}
                          >
                            {item.applicationStatus || "-"}
                          </TableCell>
                          <TableCell className="flex justify-center">
                            <button
                              onClick={(
                                event: React.MouseEvent<HTMLButtonElement>
                              ) => {
                                event.preventDefault();

                                handleDeleteClick(item?.id!);
                              }}
                              className="btn-anim"
                            >
                              <MdDeleteOutline className="text-2xl text-red-700" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default StudentDetail;
