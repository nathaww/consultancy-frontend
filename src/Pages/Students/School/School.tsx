import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  EducationBackgroundInterface,
  deleteEducationBackground,
  getEducationBackgrounds,
} from "@/api/school";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoIosAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import AddSchoolModal from "./AddSchoolModal";
import { useRef, useState } from "react";
import {
  PassportInterface,
  getPassport,
  updatePassportImage,
} from "@/api/passport";
import { format } from "date-fns";
import AddPassportModal from "./AddPassportModal";
import toast from "react-hot-toast";
import { CgTrash } from "react-icons/cg";
import { useUser } from "@/Context/UserContext";
import Transcript from "./Transcript";
import Certificate from "./Certificate";

const School = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openPassport, setOpenPassport] = useState(false);
  const onOpenPassportModal = () => setOpenPassport(true);
  const onClosePassportModal = () => setOpenPassport(false);

  const { data, isLoading, isError } = useQuery<EducationBackgroundInterface[]>(
    {
      queryKey: ["education"],
      queryFn: () => getEducationBackgrounds(id!),
    }
  );

  const {
    data: passportData,
    isLoading: loading,
    isError: error,
  } = useQuery<PassportInterface>({
    queryKey: ["passport"],
    queryFn: () => getPassport(id!),
  });

  const updateStudentImageMutation = useMutation<FormData, any, FormData>({
    mutationKey: ["updatePassportImage"],
    mutationFn: async (formData) => updatePassportImage(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["passport"] });
      const notify = toast.success("Passport Image updated successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response?.data?.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const deleteSchoolMutation = useMutation({
    mutationKey: ["DeleteStudent"],
    mutationFn: async (id: string) => deleteEducationBackground(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
      const notify = toast.success("Student deleted successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    const formData = new FormData();
    formData.append("passportImage", selectedFile!);
    formData.append("studentId", id!);
    updateStudentImageMutation.mutate(formData);
  };

  const handleDeleteClick = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this school information?")
    ) {
      await deleteSchoolMutation.mutateAsync(id);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-8 flex justify-between flex-col sm:flex-row lg:flex-row items-top w-full gap-4">
      <AddSchoolModal open={open} onCloseModal={onCloseModal} />
      <AddPassportModal
        open={openPassport}
        onCloseModal={onClosePassportModal}
      />

      <div className="sm:w-1/2 lg:w-1/2 w-full bg-blue-200 rounded">
        <p className="text-primaryColor font-semibold ml-3 mt-1">
          School Information
        </p>
        <div className="bg-white h-[550px] rounded p-2 mt-2 overflow-auto">
          <div className="flex justify-end gap-2">
            <button
              onClick={onOpenModal}
              className="px-4 py-1 inline-flex items-center gap-2 btn-anim text-white bg-primaryColor rounded"
            >
              <IoIosAdd className="text-white text-2xl" />
              Add
            </button>
          </div>

          <div className="mt-2">
            {isLoading && <Loading />}

            {isError && <Error />}

            {data?.length === 0 && <NoData text="No Education Info" />}

            {data && data?.length > 0 && !isError && (
              <div className="mt-4">
                {data?.map((item) => (
                  <div key={item.id}>
                    <div className="p-2 flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className="inline-flex">
                          <p className="font-semibold me-2">Level:</p>
                          <span>{item.degree || "-"}</span>
                        </div>
                        <div className="inline-flex">
                          <p className="font-semibold me-2">Institution:</p>
                          <span>{item.institution || "-"}</span>
                        </div>
                        <div className="inline-flex">
                          <p className="font-semibold me-2">Field of study:</p>
                          <span>{item.fieldOfStudy || "-"}</span>
                        </div>
                        <div className="inline-flex">
                          <p className="font-semibold me-2">GPA:</p>
                          <span>{item.gpa || "-"}</span>
                        </div>
                        <div className="inline-flex">
                          <p className="font-semibold me-2">Rank:</p>
                          <span>{item.rank || "-"}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            event.preventDefault();

                            user?.user.roles.includes("Agent")
                              ? nav(
                                  `/agentStudents/detail/${id}/moredetail/school/edit/${item?.id}`
                                )
                              : nav(
                                  `/students/detail/${id}/moredetail/school/edit/${item?.id}`
                                );
                          }}
                          className="px-2 py-1 inline-flex items-center gap-2 btn-anim text-green-600 bg-green-200 rounded"
                        >
                          <MdEdit className="text-green-600 text-2xl" />
                        </button>
                        <button
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            event.preventDefault();
                            handleDeleteClick(item.id!);
                          }}
                          className={`px-2 py-1 inline-flex items-center gap-2 btn-anim text-red-600 bg-red-200 rounded ${
                            deleteSchoolMutation.isPending
                              ? "animate-pulse"
                              : ""
                          }`}
                        >
                          <CgTrash className="text-red-600 text-2xl" />
                        </button>
                      </div>
                    </div>

                    <Transcript
                      id={item.id!}
                      transcriptFileUri={item.transcriptFileUri!}
                      />
                    <Certificate
                      id={item.id!}
                      certificateFileUri={item.certificateFileUri!}
                    />

                    <hr className="my-4" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sm:w-1/2 lg:w-1/2 w-full bg-blue-200 rounded">
        <p className="text-primaryColor font-semibold ml-3 mt-1">
          Passport Information
        </p>
        <div className="bg-white h-[550px] rounded p-2 mt-2 overflow-auto">
          <div className="flex justify-end gap-2">
            <button
              onClick={onOpenPassportModal}
              className={`px-4 py-1 inline-flex items-center gap-2 btn-anim text-white bg-primaryColor rounded`}
            >
              <IoIosAdd className="text-white text-2xl" />
              Add
            </button>
          </div>

          <div className="mt-2">
            {loading && <Loading />}

            {error && <Error />}

            {!error && !loading && !passportData?.passportNumber && (
              <NoData text="No Passport Info" />
            )}

            {passportData?.passportNumber && (
              <div className="mt-4">
                <div>
                  <div className="p-2 flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="inline-flex">
                        <p className="font-semibold me-2">Passport Number:</p>
                        <span>{passportData.passportNumber || "-"}</span>
                      </div>
                      <div className="inline-flex">
                        <p className="font-semibold me-2">Issue Date:</p>
                        <span>
                          {(passportData &&
                            format(
                              new Date(passportData.issueDate),
                              "yyyy/MM/dd"
                            )) ||
                            "-"}
                        </span>
                      </div>
                      <div className="inline-flex">
                        <p className="font-semibold me-2">Expiry Date:</p>
                        <span>
                          {(passportData &&
                            format(
                              new Date(passportData?.expiryDate),
                              "yyyy/MM/dd"
                            )) ||
                            "-"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        user?.user.roles.includes("Agent")
                          ? nav(
                              `/agentStudents/detail/${id}/moredetail/school/editpassport/${id}`
                            )
                          : nav(
                              `/students/detail/${id}/moredetail/school/editpassport/${id}`
                            );
                      }}
                      className="px-4 py-1 inline-flex items-center gap-2 btn-anim text-green-600 bg-green-200 rounded"
                    >
                      <MdEdit className="text-green-600 text-2xl" />
                    </button>
                  </div>
                  <hr className="my-4" />
                  <div className="w-full h-52 flex justify-center items-center">
                    {passportData.passportAttachment ? (
                      <a
                        className="h-full w-full cursor-pointer"
                        target="_blank"
                        href={`import.meta.env.VITE_BASE_AWS_URL${passportData.passportAttachment}`}
                      >
                        <img
                          src={`import.meta.env.VITE_BASE_AWS_URL${passportData.passportAttachment}`}
                          alt="student profile img"
                          loading="lazy"
                          className="w-full h-full rounded object-contain object-center"
                        />
                      </a>
                    ) : (
                      <p className="text-black">No Image/File found</p>
                    )}
                  </div>
                  <button
                    disabled={updateStudentImageMutation.isPending}
                    className="btn btn-anim bg-blue-200 mx-auto my-4 text-primaryColor hover:bg-blue-300"
                    onClick={openFileExplorer}
                  >
                    {updateStudentImageMutation.isPending
                      ? "Updating..."
                      : "Update Image/File"}
                  </button>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default School;
