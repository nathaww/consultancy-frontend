import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Loading from "@/Components/Loading State/Loading";
import Error from "@/Components/Loading State/Error";
import { NoData } from "@/Components/Loading State/NoData";
import React, { ChangeEvent, useState } from "react";
import { LuArrowLeftToLine, LuArrowRightToLine } from "react-icons/lu";

import {
  ApplicationListAPIResponse,
  FilterStateApplicationList,
  SearchApplicationListInterface,
  getApplicationList,
  searchApplicationList,
} from "@/api/applicationList";
import { FaSearch } from "react-icons/fa";
import { useUser } from "@/Context/UserContext";

const ApplicationList = () => {
  const { user } = useUser();
  const nav = useNavigate();
  const [searchParam, setSearchParam] =
    useState<SearchApplicationListInterface>({
      pageCount: 1,
      keyword: "",
    });
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(true);
  const [filter, setFilter] = useState<FilterStateApplicationList>({
    gender: "",
    country: "",
    intake: "",
    applicationStatus: "",
    admissionStatus: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  const getApplicationListQuery = useQuery<ApplicationListAPIResponse>({
    queryKey: ["students", pageCount, filter],
    queryFn: () => getApplicationList(pageCount, filter),
  });

  const searchApplicationQuery = useQuery<ApplicationListAPIResponse>({
    queryKey: ["searchStudents", searchParam],
    queryFn: () => searchApplicationList(searchParam!),
  });

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= getApplicationListQuery.data?.pages!) {
      setPageCount(pageNumber);
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between mb-4">
        <h1 className="text-base sm:text-xl lg:tex-xl font-bold">
          Applications ({getApplicationListQuery.data?.applications.length})
        </h1>
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
        } flex flex-col justify-between gap-y-4 sm:flex-col md:flex-row lg:flex-row`}
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
          <div className="grid grid-cols-1 gap-x-2">
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
        <div>
          <p className="font-bold mb-1">Admission Status</p>
          <div className="grid grid-cols-1 gap-x-2">
            <label htmlFor="Pending" className="inline-flex gap-2">
              <input
                id="Pending"
                name="admissionStatus"
                type="radio"
                value="Pending"
                checked={filter.admissionStatus === "Pending"}
                onChange={handleInputChange}
              />
              Pending
            </label>
            <label htmlFor="Applying" className="inline-flex gap-2">
              <input
                id="Applying"
                name="admissionStatus"
                type="radio"
                value="Applying"
                checked={filter.admissionStatus === "Applying"}
                onChange={handleInputChange}
              />
              Applying
            </label>
            <label htmlFor="Accepted" className="inline-flex gap-2">
              <input
                id="Accepted"
                name="admissionStatus"
                type="radio"
                value="Accepted"
                checked={filter.admissionStatus === "Accepted"}
                onChange={handleInputChange}
              />
              Accepted
            </label>
            <label htmlFor="Rejected" className="inline-flex gap-2">
              <input
                id="Rejected"
                name="admissionStatus"
                type="radio"
                value="Rejected"
                checked={filter.admissionStatus === "Rejected"}
                onChange={handleInputChange}
              />
              Rejected
            </label>
          </div>
        </div>
        <div>
          <p className="font-bold mb-1">Application Status</p>
          <div className="grid grid-cols-1 gap-x-2">
            <label htmlFor="Deposit" className="inline-flex gap-2">
              <input
                id="Deposit"
                name="applicationStatus"
                type="radio"
                value="Deposit"
                checked={filter.applicationStatus === "Deposit"}
                onChange={handleInputChange}
              />
              Deposit
            </label>
            <label htmlFor="Admission" className="inline-flex gap-2">
              <input
                id="Admission"
                name="applicationStatus"
                type="radio"
                value="Admission"
                checked={filter.applicationStatus === "Admission"}
                onChange={handleInputChange}
              />
              Admission
            </label>
            <label htmlFor="Visa" className="inline-flex gap-2">
              <input
                id="Visa"
                name="applicationStatus"
                type="radio"
                value="Visa"
                checked={filter.applicationStatus === "Visa"}
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
              country: "",
              intake: "",
              applicationStatus: "",
              admissionStatus: "",
            });
          }}
          className="btn btn-anim bg-primaryColor text-white mt-2 sm:mt-2 md:mt-0 lg:mt-0"
        >
          Clear
        </button>
      </div>
      {getApplicationListQuery.isLoading && <Loading />}

      {getApplicationListQuery.isError && <Error />}

      {getApplicationListQuery.data?.applications.length === 0 && (
        <NoData text="No Students" />
      )}

      {searchParam.keyword &&
      searchApplicationQuery.isSuccess &&
      searchApplicationQuery.data.applications.length === 0 ? (
        <p className="mt-2 text-center">
          No results found for "{searchParam.keyword}"
        </p>
      ) : (
        ""
      )}

      {getApplicationListQuery.data &&
        getApplicationListQuery.data?.applications.length > 0 && (
          <div className="card-shadow p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Education Level</TableHead>
                  <TableHead>Application Status</TableHead>
                  <TableHead>Country</TableHead>
                  {user?.user.roles.includes("Finance") ? (
                    ""
                  ) : (
                    <TableHead className="text-center">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {(searchParam.keyword && searchApplicationQuery.isSuccess
                  ? searchApplicationQuery
                  : getApplicationListQuery
                ).data?.applications?.map((item) => (
                  <TableRow key={item.id || "-"}>
                    <TableCell
                      className="hover:underline cursor-pointer"
                      onClick={(
                        event: React.MouseEvent<HTMLTableCellElement>
                      ) => {
                        event.preventDefault();

                        nav(`/students/application/${item.id}/deposit`);
                      }}
                    >
                      {item.student.firstName} {item.student.lastName || "-"}
                    </TableCell>
                    <TableCell
                      className="hover:underline cursor-pointer"
                      onClick={(
                        event: React.MouseEvent<HTMLTableCellElement>
                      ) => {
                        event.preventDefault();
                        nav(`/students/application/${item.id}/deposit`);
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

                        nav(`/students/application/${item.id}/deposit`);
                      }}
                    >
                      {item?.applicationStatus}
                    </TableCell>
                    <TableCell
                      className="hover:underline cursor-pointer"
                      onClick={(
                        event: React.MouseEvent<HTMLTableCellElement>
                      ) => {
                        event.preventDefault();

                        nav(`/students/application/${item.id}/deposit`);
                      }}
                    >
                      <p>{item?.country}</p>
                    </TableCell>
                    {user?.user.roles.includes("Finance") ? (
                      ""
                    ) : (
                      <TableCell
                        className="cursor-pointer text-white text-center btn-anim flex justify-center"
                        onClick={(
                          event: React.MouseEvent<HTMLTableCellElement>
                        ) => {
                          event.preventDefault();

                          nav(`/students/detail/${item.student.id}`);
                        }}
                      >
                        <p className="py-1 px-2 bg-primaryColor w-max rounded">
                          More Detail
                        </p>
                      </TableCell>
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

              {getApplicationListQuery.data?.pages &&
                Array.from(
                  { length: getApplicationListQuery.data.pages },
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
                  if (pageCount !== getApplicationListQuery.data.pages)
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

export default ApplicationList;
