import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { useUser } from "@/Context/UserContext";
import {
  SalesAPIResponse,
  SearchSalesInterface,
  convertSales,
  deleteSales,
  getSales,
  searchSales,
} from "@/api/sales";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaSearch } from "react-icons/fa";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Sales = () => {
  const nav = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchParam, setSearchParam] = useState<SearchSalesInterface>({
    pageCount: 1,
    keyword: "",
  });
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const getSalesQuery = useQuery<SalesAPIResponse>({
    queryKey: ["students", pageCount],
    queryFn: () => getSales(pageCount),
  });

  const searchSalesQuery = useQuery<SalesAPIResponse>({
    queryKey: ["searchStudents", searchParam],
    queryFn: () => searchSales(searchParam!),
  });

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudentMutation.mutateAsync(id);
    }
  };

  const convertStudentMutation = useMutation({
    mutationKey: ["convertStudent"],
    mutationFn: async (id: string) => convertSales(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      const notify = toast.success("Student converted successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const deleteStudentMutation = useMutation({
    mutationKey: ["DeleteStudent"],
    mutationFn: async (id: string) => deleteSales(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
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

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= getSalesQuery.data?.pages!) {
      setPageCount(pageNumber);
      setCurrentPage(pageNumber);
    }
  };
  return (
    <>
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-base sm:text-xl lg:tex-xl font-bold">Sales</h1>
        {user?.user.roles.includes("Admin") ||
        user?.user.roles.includes("Agent") ? (
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              nav("/sales/add");
            }}
            className="btn btn-anim bg-primaryColor text-white flex gap-2 items-center sm:w-40 lg:w-40"
          >
            <FaPlus />
            Add Student
          </button>
        ) : (
          ""
        )}
      </div>

      <div className="flex items-center w-full gap-2">
        <div className="w-full flex my-1.5 items-center input-style gap-2 bg-white">
          <FaSearch className="text-primaryColor" />
          <input
            type="text"
            required={true}
            value={searchParam.keyword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              setSearchParam({ pageCount: 1, keyword: e.target.value });
            }}
            className=" w-full outline-none"
            placeholder="Search"
          />
        </div>
      </div>

      {getSalesQuery.isLoading && <Loading />}

      {getSalesQuery.isError && <Error />}

      {getSalesQuery.data?.students.length === 0 && (
        <NoData text="No Students" />
      )}

      {getSalesQuery.data && getSalesQuery.data?.students.length > 0 && (
        <div className="card-shadow p-2">
          <Table>
            {/* <TableCaption>A list of all students.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Field of Study</TableHead>
                <TableHead>Educational Level</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {searchParam.keyword &&
            searchSalesQuery.isSuccess &&
            searchSalesQuery.data.students.length === 0 ? (
              <p className="mt-2 text-center">
                No results found for "{searchParam.keyword}"
              </p>
            ) : (
              ""
            )}

            <TableBody>
              {(searchParam.keyword && searchSalesQuery.isSuccess
                ? searchSalesQuery
                : getSalesQuery
              ).data?.students.map((item) => (
                <TableRow key={item.id || "-"}>
                  <TableCell>
                    {item.firstName} {item.lastName || "-"}
                  </TableCell>
                  <TableCell>{item.user.phoneNumber || "-"}</TableCell>
                  <TableCell>{item.gender || "-"}</TableCell>
                  <TableCell>
                    {item?.dateOfBirth
                      ? format(new Date(item.dateOfBirth), "yyyy/MM/dd")
                      : "-"}
                  </TableCell>
                  <TableCell>{item.futureStudentInfo.country || "-"}</TableCell>
                  <TableCell>{item.futureStudentInfo.field || "-"}</TableCell>
                  <TableCell>{item.futureStudentInfo.level || "-"}</TableCell>

                  {user?.user.roles.includes("Admin") ||
                  user?.user.roles.includes("Agent") ? (
                    <TableCell className="text-center flex flex-row justify-center items-center">
                      <button
                        onClick={async (
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          event.preventDefault();
                          await convertStudentMutation.mutateAsync(item?.id!);
                        }}
                        className="btn-anim bg-yellow-600 p-2 rounded text-white me-1"
                      >
                        {convertStudentMutation.isPending
                          ? "Converting..."
                          : "Convert to Client"}
                      </button>
                      <button
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          event.preventDefault();

                          handleDeleteClick(item?.id!);
                        }}
                        className="btn-anim p-2 bg-red-600 rounded text-white"
                      >
                        {deleteStudentMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </TableCell>
                  ) : (
                    ""
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-center w-full gap-2 mt-2">
            <button
              onClick={() => {
                if (pageCount === 1) {
                  setPageCount(1);
                } else {
                  setPageCount(pageCount! - 1);
                }
              }}
              className="flex items-center text-sm gap-1 px-2 py-1.5 rounded btn-anim bg-primaryColor text-white"
            >
              <LuArrowLeftToLine />
              Prev
            </button>

            {getSalesQuery.data?.pages &&
              Array.from(
                { length: getSalesQuery.data.pages },
                (_, i) => i + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`flex items-center justify-center text-sm gap-1 w-8 h-8 rounded btn-anim text-white ${
                    currentPage === pageNumber
                      ? "bg-primaryColor text-white"
                      : "bg-gray-500"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

            <button
              onClick={() => {
                if (pageCount !== getSalesQuery.data.pages)
                  setPageCount(pageCount! + 1);
              }}
              className="flex items-center text-sm gap-1 px-2 py-1.5 rounded btn-anim bg-primaryColor text-white"
            >
              Next
              <LuArrowRightToLine />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sales;
