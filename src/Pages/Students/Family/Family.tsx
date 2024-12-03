import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import { FamilyInterface, deleteFamily, getFamily } from "@/api/family";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import "react-responsive-modal/styles.css";
import AddFamilyModal from "./AddFamilyModal";
import { CgTrash } from "react-icons/cg";
import toast from "react-hot-toast";
import { useUser } from "@/Context/UserContext";

const Family = () => {
  const { user } = useUser();
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const { data, isLoading, isError } = useQuery<FamilyInterface[]>({
    queryKey: ["family"],
    queryFn: () => getFamily(id!),
  });
  const Guardian = data?.filter(
    (item) => item.relationship === "Mother" || item.relationship === "Father"
  );
  const Sibling = data?.filter(
    (item) => item.relationship === "Sister" || item.relationship === "Brother"
  );

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this family member?")) {
      await deleteFamilyMutation.mutateAsync(id);
    }
  };

  const deleteFamilyMutation = useMutation({
    mutationKey: ["DeleteFamily"],
    mutationFn: async (id: string) => deleteFamily(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family"] });
      const notify = toast.success("Family deleted successfully");
      notify;
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
      <AddFamilyModal open={open} onCloseModal={onCloseModal} />
      <div className="flex justify-end w-full">
        <button
          onClick={onOpenModal}
          className="px-4 my-8 py-1 inline-flex items-center gap-2 btn-anim text-white bg-primaryColor rounded"
        >
          <IoIosAdd className="text-white text-2xl" />
          Add Family
        </button>
      </div>
      <div className="flex justify-between flex-col sm:flex-row lg:flex-row items-top w-full gap-4">
        <div className="w-full sm:w-1/2 lg:w-1/2  bg-blue-200 rounded">
          <p className="text-primaryColor font-semibold ml-3 mt-1">Guardian</p>
          <div className="mt-2 bg-white h-[400px] rounded p-2  overflow-auto">
            {isLoading && <Loading />}

            {isError && <Error />}

            {Guardian?.length === 0 && <NoData text="No Guardians" />}

            {Guardian && Guardian?.length > 0 && (
              <div className="mt-4">
                {Guardian?.map((item) => (
                  <div key={item.id}>
                    <div className="p-2 flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className="inline-flex">
                          <p className="font-semibold me-2">
                            {item.relationship === "Father"
                              ? "Father's "
                              : "Mother's "}
                            Name:
                          </p>
                          <span>
                            {item.firstName} {item.lastName || "-"}
                          </span>
                        </div>
                        <div className="inline-flex">
                          <p className="font-semibold me-2">Education:</p>
                          <span>{item.educationalLevel}</span>
                        </div>
                        <div className="inline-flex">
                          <p className="font-semibold me-2">Phone Number:</p>
                          <span>{item.phoneNumber}</span>
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
                                  `/agentStudents/detail/${id}/moredetail/family/edit/${item?.id}`
                                )
                              : nav(
                                  `/students/detail/${id}/moredetail/family/edit/${item?.id}`
                                );
                          }}
                          className="px-2  py-1 inline-flex items-center gap-2 btn-anim text-green-600 bg-green-200 rounded"
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
                          className="px-2 py-1 inline-flex items-center gap-2 btn-anim text-red-600 bg-red-200 rounded"
                        >
                          <CgTrash className="text-red-700 text-2xl" />
                        </button>
                      </div>
                    </div>
                    <hr className="my-4" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/2  bg-blue-200 rounded">
          <p className="text-primaryColor font-semibold ml-3 mt-1">Sibling</p>
          <div className="mt-2 bg-white h-[400px] rounded p-2 overflow-auto">
            {isLoading && <Loading />}

            {isError && <Error />}

            {Sibling?.length === 0 && <NoData text="No Siblings" />}

            {Sibling && Sibling?.length > 0 && (
              <div className="mt-4">
                {Sibling?.map((item) => (
                  <div key={item.id}>
                    <div className="p-2 flex justify-between items-center">
                      <div className="flex flex-col">
                        <div>
                          <p className="font-bold text-gray-500">
                            {item.relationship}
                          </p>
                          <div className="inline-flex">
                            <p className="font-semibold me-2">Name:</p>
                            <span>
                              {item.firstName} {item.lastName || "-"}
                            </span>
                          </div>
                        </div>
                        <div className="inline-flex">
                          <p className="font-semibold me-2">Education:</p>
                          <span>{item.educationalLevel}</span>
                        </div>
                        <div className="inline-flex">
                          <p className="font-semibold me-2">Phone Number:</p>
                          <span>{item.phoneNumber}</span>
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
                                  `/agentStudents/detail/${id}/moredetail/family/edit/${item?.id}`
                                )
                              : nav(
                                  `/students/detail/${id}/moredetail/family/edit/${item?.id}`
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
                          className="px-2 py-1 inline-flex items-center gap-2 btn-anim text-red-600 bg-red-200 rounded"
                        >
                          <CgTrash className="text-red-700 text-2xl" />
                        </button>
                      </div>
                    </div>
                    <hr className="my-4" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Family;
