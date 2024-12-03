import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import {
  FilterState,
  SearchStudentInterface,
  StudentAPIResponse,
  deleteStudent,
  getStudents,
  searchStudents,
} from "@/api/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdDeleteOutline, MdEditLocation } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "@/Components/Loading State/Loading";
import Error from "@/Components/Loading State/Error";
import { NoData } from "@/Components/Loading State/NoData";
import { format } from "date-fns";
import { useUser } from "@/Context/UserContext";
import React, { ChangeEvent, useState } from "react";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";

const Students = () => {
  const nav = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchParam, setSearchParam] = useState<SearchStudentInterface>({
    pageCount: 1,
    keyword: "",
  });
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(true);
  const [filter, setFilter] = useState<FilterState>({
    gender: "",
    country: "",
    intake: "",
    status: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  const getStudentQuery = useQuery<StudentAPIResponse>({
    queryKey: ["students", pageCount, filter],
    queryFn: () => getStudents(pageCount, filter),
  });

  const searchStudentQuery = useQuery<StudentAPIResponse>({
    queryKey: ["searchStudents", searchParam],
    queryFn: () => searchStudents(searchParam!),
  });

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await deleteStudentMutation.mutateAsync(id);
    }
  };

  const deleteStudentMutation = useMutation({
    mutationKey: ["DeleteStudent"],
    mutationFn: async (id: string) => deleteStudent(id),
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
    if (pageNumber > 0 && pageNumber <= getStudentQuery.data?.pages!) {
      setPageCount(pageNumber);
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-base sm:text-xl lg:tex-xl font-bold">
          Students ({getStudentQuery.data?.students.length})
        </h1>
        {user?.user.roles.includes("Admin") ||
        user?.user.roles.includes("Agent") ? (
          <button
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();
              nav("/students/add");
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
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setShowFilter(!showFilter);
          }}
          className="btn btn-anim bg-primaryColor text-white"
        >
          {showFilter ? "Filter" : "Cancel"}
        </button>
      </div>

      <div
        className={`w-full bg-blue-50 gap-y-4 h-max p-4 rounded mb-1.5 transition-all duration-200 ${
          showFilter ? "hidden" : "flex"
        } flex flex-col justify-between sm:flex-col md:flex-row lg:flex-row`}
      >
        <div className="flex flex-col">
          <p className="font-bold mb-1">Gender</p>
          <label htmlFor="male" className="inline-flex gap-2">
            <input
              id="male"
              name="gender"
              type="radio"
              value="Male"
              checked={filter.gender === "Male"}
              onChange={handleInputChange}
            />
            Male
          </label>
          <label htmlFor="female" className="inline-flex gap-2">
            <input
              id="female"
              name="gender"
              type="radio"
              value="Female"
              checked={filter.gender === "Female"}
              onChange={handleInputChange}
            />
            Female
          </label>
        </div>
        <div className="flex flex-col">
          <p className="font-bold mb-1">Status</p>
          <label htmlFor="statusMale" className="inline-flex gap-2">
            <input
              id="statusMale"
              name="status"
              type="radio"
              value="true"
              checked={filter.status === "true"}
              onChange={handleInputChange}
            />
            Active
          </label>
          <label htmlFor="statusFalse" className="inline-flex gap-2">
            <input
              id="statusFalse"
              name="status"
              type="radio"
              value="false"
              checked={filter.status === "false"}
              onChange={handleInputChange}
            />
            Inactive
          </label>
        </div>
        <div className="flex flex-col">
          <p className="font-bold mb-1">Country</p>
          <label htmlFor="us" className="inline-flex gap-2">
            <input
              id="us"
              name="country"
              type="radio"
              value="UnitedStates"
              checked={filter.country === "UnitedStates"}
              onChange={handleInputChange}
            />
            US
          </label>
          <label htmlFor="canada" className="inline-flex gap-2">
            <input
              id="canada"
              name="country"
              type="radio"
              value="Canada"
              checked={filter.country === "Canada"}
              onChange={handleInputChange}
            />
            Canada
          </label>
        </div>

        <div>
          <p className="font-bold mb-1">Intake</p>
          <div className="grid grid-cols-3 gap-x-2">
            <label htmlFor="summer" className="inline-flex gap-2">
              <input
                id="summer"
                name="intake"
                type="radio"
                value="Summer"
                checked={filter.intake === "Summer"}
                onChange={handleInputChange}
              />
              Summer
            </label>
            <label htmlFor="autumn" className="inline-flex gap-2">
              <input
                id="autumn"
                name="intake"
                type="radio"
                value="Autumn"
                checked={filter.intake === "Autumn"}
                onChange={handleInputChange}
              />
              Autumn
            </label>
            <label htmlFor="spring" className="inline-flex gap-2">
              <input
                id="spring"
                name="intake"
                type="radio"
                value="Spring"
                checked={filter.intake === "Spring"}
                onChange={handleInputChange}
              />
              Spring
            </label>
            <label htmlFor="winter" className="inline-flex gap-2">
              <input
                id="winter"
                name="intake"
                type="radio"
                value="Winter"
                checked={filter.intake === "Winter"}
                onChange={handleInputChange}
              />
              Winter
            </label>
            <label htmlFor="fall" className="inline-flex gap-2">
              <input
                id="fall"
                name="intake"
                type="radio"
                value="Fall"
                checked={filter.intake === "Fall"}
                onChange={handleInputChange}
              />
              Fall
            </label>
          </div>
        </div>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setFilter({
              gender: "",
              country: "",
              intake: "",
            });
          }}
          className="btn btn-anim bg-primaryColor text-white"
        >
          Clear
        </button>
      </div>
      {getStudentQuery.isLoading && <Loading />}

      {getStudentQuery.isError && <Error />}

      {getStudentQuery.data?.students.length === 0 && (
        <NoData text="No Students" />
      )}

      {getStudentQuery.data && getStudentQuery.data?.students.length > 0 && (
        <div className="card-shadow p-2">
          <Table>
            {/* <TableCaption>A list of all students.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {searchParam.keyword &&
            searchStudentQuery.isSuccess &&
            searchStudentQuery.data.students.length === 0 ? (
              <p className="mt-2 text-center">
                No results found for "{searchParam.keyword}"
              </p>
            ) : (
              ""
            )}

            <TableBody>
              {(searchParam.keyword && searchStudentQuery.isSuccess
                ? searchStudentQuery
                : getStudentQuery
              ).data?.students.map((item) => (
                <TableRow key={item.id || "-"}>
                  <TableCell
                    className="hover:underline cursor-pointer"
                    onClick={(
                      event: React.MouseEvent<HTMLTableCellElement>
                    ) => {
                      event.preventDefault();

                      nav(`/students/detail/${item.id}`);
                    }}
                  >
                    {item.firstName} {item.lastName || "-"}
                  </TableCell>
                  <TableCell
                    className="hover:underline cursor-pointer"
                    onClick={(
                      event: React.MouseEvent<HTMLTableCellElement>
                    ) => {
                      event.preventDefault();
                      nav(`/students/detail/${item.id}`);
                    }}
                  >
                    {item.user.phoneNumber || "-"}
                  </TableCell>
                  <TableCell
                    className="hover:underline cursor-pointer"
                    onClick={(
                      event: React.MouseEvent<HTMLTableCellElement>
                    ) => {
                      event.preventDefault();

                      nav(`/students/detail/${item.id}`);
                    }}
                  >
                    {item.gender || "-"}
                  </TableCell>
                  <TableCell
                    className="hover:underline cursor-pointer"
                    onClick={(
                      event: React.MouseEvent<HTMLTableCellElement>
                    ) => {
                      event.preventDefault();

                      nav(`/students/detail/${item.id}`);
                    }}
                  >
                    {item?.dateOfBirth
                      ? format(new Date(item.dateOfBirth), "yyyy/MM/dd")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <p
                      className={`rounded-xl p-2 ${
                        item?.isActive! ? "bg-green-300" : "bg-red-300"
                      } text-center py-2 ${
                        item?.isActive! ? "text-green-900" : "text-red-900"
                      } font-bold`}
                    >
                      {item?.isActive ? "Active" : "Inactive"}
                    </p>
                  </TableCell>

                  <TableCell className="text-center">
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();

                        nav(`/students/print/${item.id}`);
                      }}
                      className="btn btn-anim bg-primaryColor text-sm text-white"
                    >
                      Print
                    </button>
                  </TableCell>
                  {user?.user.roles.includes("Admin") ||
                  user?.user.roles.includes("Agent") ? (
                    <TableCell className="text-center flex flex-row justify-center items-center">
                      <button
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          event.preventDefault();

                          nav(`/students/edit/${item.id}`);
                        }}
                        className="btn-anim me-1"
                      >
                        <MdEdit className="text-2xl text-primaryColor" />
                      </button>
                      <button
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          event.preventDefault();

                          nav(`/students/editAddress/${item.id}`);
                        }}
                        className="btn-anim me-1"
                      >
                        <MdEditLocation className="text-2xl text-primaryColor" />
                      </button>
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

            {getStudentQuery.data?.pages &&
              Array.from(
                { length: getStudentQuery.data.pages },
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
                if (pageCount !== getStudentQuery.data.pages)
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

export default Students;
