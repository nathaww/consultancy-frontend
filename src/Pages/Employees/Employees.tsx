import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "@/Components/Loading State/Loading";
import Error from "@/Components/Loading State/Error";
import { NoData } from "@/Components/Loading State/NoData";
import { format } from "date-fns";
import {
  EmployeeAPIResponse,
  FilterStateEmployee,
  SearchEmployeeInterface,
  deleteEmployee,
  getEmployees,
  searchEmployees,
} from "@/api/employees";
import { FaSearch } from "react-icons/fa";
import { ChangeEvent, useEffect, useState } from "react";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";

const Employees = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const [searchParam, setSearchParam] = useState<SearchEmployeeInterface>({
    pageCount: 1,
    keyword: "",
  });
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(true);
  const [filter, setFilter] = useState<FilterStateEmployee>({
    gender: "",
    role: "",
  });

  const getEmployeesQuery = useQuery<EmployeeAPIResponse>({
    queryKey: ["employees", pageCount, filter],
    queryFn: () => getEmployees(pageCount, filter),
  });

  const searchEmployeeQuery = useQuery<EmployeeAPIResponse>({
    queryKey: ["searchStudents", searchParam],
    queryFn: () => searchEmployees(searchParam!),
  });

  useEffect(() => {
    getEmployeesQuery.refetch();
  }, [pageCount]);

  const handleDeleteClick = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployeeMutation.mutateAsync(id);
    }
  };

  const deleteEmployeeMutation = useMutation({
    mutationKey: ["deleteEmployee"],
    mutationFn: async (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      const notify = toast.success("Employee deleted successfully");
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
    if (pageNumber > 0 && pageNumber <= getEmployeesQuery.data?.pages!) {
      setPageCount(pageNumber);
      setCurrentPage(pageNumber);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  return (
    <>
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-base sm:text-xl lg:tex-xl font-bold">
          Employees ({getEmployeesQuery.data?.employees.length})
        </h1>
        <button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            nav("/employees/add");
          }}
          className="btn btn-anim bg-primaryColor text-white flex gap-2 items-center sm:w-44 lg:w-44"
        >
          <FaPlus />
          Add Employee
        </button>
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
        className={`w-full bg-blue-50 h-max p-3 rounded mb-1.5 transition-all duration-200 ${
          showFilter ? "hidden" : "flex"
        } flex flex-col justify-between sm:flex-col gap-y-4 md:flex-row lg:flex-row`}
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
          <p className="font-bold mb-1">Role</p>
          <div className="grid grid-cols-3 gap-1.5">
            <label htmlFor="Admin" className="inline-flex gap-2">
              <input
                id="Admin"
                name="role"
                type="radio"
                value="Admin"
                checked={filter.role === "Admin"}
                onChange={handleInputChange}
              />
              Admin
            </label>
            <label htmlFor="Agent" className="inline-flex gap-2">
              <input
                id="Agent"
                name="role"
                type="radio"
                value="Agent"
                checked={filter.role === "Agent"}
                onChange={handleInputChange}
              />
              Agent
            </label>
            <label htmlFor="Agent" className="inline-flex gap-2">
              <input
                id="Agent"
                name="role"
                type="radio"
                value="Agent"
                checked={filter.role === "Agent"}
                onChange={handleInputChange}
              />
              Agent
            </label>
            <label htmlFor="Finance" className="inline-flex gap-2">
              <input
                id="Finance"
                name="role"
                type="radio"
                value="Finance"
                checked={filter.role === "Finance"}
                onChange={handleInputChange}
              />
              Finance
            </label>
            <label htmlFor="Admission" className="inline-flex gap-2">
              <input
                id="Admission"
                name="role"
                type="radio"
                value="Admission"
                checked={filter.role === "Admission"}
                onChange={handleInputChange}
              />
              Admission
            </label>
            <label htmlFor="Visa" className="inline-flex gap-2">
              <input
                id="Visa"
                name="role"
                type="radio"
                value="Visa"
                checked={filter.role === "Visa"}
                onChange={handleInputChange}
              />
              Visa
            </label>
          </div>
        </div>

        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setFilter({
              gender: "",
              role: "",
            });
          }}
          className="btn btn-anim bg-primaryColor text-white"
        >
          Clear
        </button>
      </div>

      {getEmployeesQuery.isLoading && <Loading />}

      {getEmployeesQuery.isError && <Error />}

      {getEmployeesQuery.data?.employees.length === 0 && (
        <NoData text="No Students" />
      )}

      {getEmployeesQuery.data &&
        getEmployeesQuery.data?.employees.length > 0 && (
          <div className="card-shadow p-2">
            <Table>
              <TableCaption>A list of all employees.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              {searchParam.keyword &&
              searchEmployeeQuery.isSuccess &&
              searchEmployeeQuery.data.employees.length === 0 ? (
                <p className="mt-2 text-center">
                  No results found for "{searchParam.keyword}"
                </p>
              ) : (
                ""
              )}

              <TableBody>
                {(searchParam.keyword && searchEmployeeQuery.isSuccess
                  ? searchEmployeeQuery
                  : getEmployeesQuery
                ).data?.employees.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.firstName} {item.lastName || "-"}
                    </TableCell>
                    <TableCell>{item?.user?.phoneNumber || "-"}</TableCell>
                    <TableCell>{item.gender || "-"}</TableCell>
                    <TableCell>
                      {item?.dateOfBirth
                        ? format(new Date(item.dateOfBirth), "yyyy/MM/dd")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item?.user?.roles.map((item) => (
                        <p className="block">{item}</p>
                      ))}
                    </TableCell>

                    <TableCell className="text-center flex flex-row justify-center">
                      <button
                        onClick={(
                          event: React.MouseEvent<HTMLButtonElement>
                        ) => {
                          event.preventDefault();
                          nav(`/employees/edit/${item.id}`);
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

              {getEmployeesQuery.data?.pages &&
                Array.from(
                  { length: getEmployeesQuery.data.pages },
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
                  if (pageCount !== getEmployeesQuery.data.pages)
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

export default Employees;
