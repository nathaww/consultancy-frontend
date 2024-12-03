import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  EnglishTestInterface,
  IsRequiredInterface,
  PassOrFailInterface,
  ScoreDataInterface,
  addScore,
  getEnglishTest,
  isRequiredEnglishTest,
  passOrFail,
} from "@/api/englishTest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import AddEnglishTestModal from "./AddEnglishTestModal";
import { format } from "date-fns";
import toast from "react-hot-toast";

const EnglishTest = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [scoreData, setScoreData] = useState<ScoreDataInterface>({
    applicationId: id,
    score: "",
  });

  const { data, isLoading, isError } = useQuery<EnglishTestInterface>({
    queryKey: ["englishTest"],
    queryFn: () => getEnglishTest(id!),
  });

  const addScoreMutation = useMutation<
    ScoreDataInterface,
    Error,
    ScoreDataInterface
  >({
    mutationKey: ["addScore"],
    mutationFn: () => addScore(scoreData!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["englishTest"] });
      const notify = toast.success("Score added successfully");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const englishTestRequiredMutation = useMutation<
    IsRequiredInterface,
    Error,
    IsRequiredInterface
  >({
    mutationKey: ["addScore"],
    mutationFn: (id) => isRequiredEnglishTest(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["englishTest"] });
      const notify = toast.success(
        "English test requirement updated successfully"
      );
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const englishTestPassOrFailMutation = useMutation<
    PassOrFailInterface,
    Error,
    PassOrFailInterface
  >({
    mutationKey: ["passOrFail"],
    mutationFn: (data) => passOrFail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["englishTest"] });
      const notify = toast.success(
        "English test requirement updated successfully"
      );
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleCopy = async (data: string) => {
    try {
      await navigator.clipboard.writeText(data);
      const notify = toast.success("Copied to clipboard");
      notify;
    } catch (error) {}
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setScoreData((prevScoreData) => ({
      ...prevScoreData,
      [name]: value,
    }));
  };

  const handleSendScore = async () => {
    try {
      await addScoreMutation.mutateAsync(scoreData);
    } catch (error: any) {}
  };

  const handleIsRequired = async (data: string) => {
    try {
      await englishTestRequiredMutation.mutateAsync({
        id: id!,
        englishTestRequired: data,
      });
    } catch (error: any) {}
  };

  const handlePassOrFail = async (data: string) => {
    try {
      await englishTestPassOrFailMutation.mutateAsync({
        applicationId: id!,
        hasPassed: data,
      });
    } catch (error: any) {}
  };

  return (
    <div className="w-full border min-h-40 card-shadow rounded mt-8">
      <div className="ml-2 bg-white flex justify-between h-full rounded p-4 gap-2">
        <div className="h-full flex flex-col gap-y-4 w-full">
          <div className="h-full flex justify-between items-center">
            <p className="text-base md:text-lg lg:text-lg font-semibold">
              2. English Test (Optional)
            </p>
            {data?.englishTestRequired === "Yes" && (
              <button
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  if (data?.englishTest) {
                    nav(`/students/application/${id}/englishTest/edit/${id}`);
                  } else {
                    onOpenModal();
                  }
                }}
                className="btn btn-anim bg-primaryColor text-white"
              >
                {data?.englishTest ? "Edit" : "Add"} English Test
              </button>
            )}
          </div>

          {isLoading && <Loading />}

          {isError && <Error />}

          {(data?.englishTestRequired === "Pending" ||
            data?.englishTestRequired === "No") && !isError && (
            <div className="flex flex-col w-full bg-gray-200 rounded p-4">
              Is English test required ?{" "}
              {englishTestRequiredMutation.isPending
                ? "Loading..."
                : data.englishTestRequired}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    handleIsRequired("Yes");
                  }}
                  className={`btn flex gap-1 items-center btn-anim text-white ${"bg-gray-600"}`}
                >
                  Yes
                </button>
                <button
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    handleIsRequired("No");
                  }}
                  className={`btn btn-anim text-white ${
                    data?.englishTestRequired === "No"
                      ? "bg-red-600"
                      : "bg-gray-600"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          )}
          <AddEnglishTestModal open={open} onCloseModal={onCloseModal} />

          {data?.englishTestRequired === "Yes" && isLoading && <Loading />}

          {isError && data?.englishTestRequired === "Yes" && <Error />}

          {!isLoading &&
            !data?.englishTest &&
            data?.englishTestRequired === "Yes" &&
            !isError && <NoData text="No English Test Found" />}

          {data?.englishTest &&
          data.englishTestRequired === "Yes" &&
          !isError ? (
            <>
              <div className="flex flex-col sm:flex-row md:flex-row lg:flex-row gap-y-3 justify-start sm:justify-between md:justify-between lg:justify-between md:items-center lg:items-center w-full bg-gray-200 rounded p-4">
                <div className="flex flex-col">
                  <p className="text-lg font-bold text-gray-700">
                    Practice Links
                  </p>
                  <a
                    href={data?.englishTest?.practiceLink}
                    className="text-blue-500 hover:underline"
                  >
                    1.{" "}
                    {(data?.englishTest.practiceLink &&
                      data?.englishTest?.practiceLink?.substring(0, 25)) ||
                      "-"}
                  </a>
                  <a
                    href={data?.englishTest?.practiceLink2}
                    className="text-blue-500 hover:underline"
                  >
                    2.{" "}
                    {(data?.englishTest.practiceLink &&
                      data?.englishTest?.practiceLink2?.substring(0, 25)) ||
                      "-"}
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-bold flex items-center gap-2">
                    Email:{" "}
                    <span className="font-normal">
                      {data?.englishTest?.email || "-"}
                    </span>
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        handleCopy(data?.englishTest?.email!);
                      }}
                      className="btn-anim rounded"
                    >
                      <MdContentCopy className="text-lg text-primaryColor" />
                    </button>
                  </p>
                  <p className="font-bold flex items-center gap-2">
                    Password:{" "}
                    <span className="font-normal">
                      {data?.englishTest?.password || "-"}
                    </span>
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        handleCopy(data?.englishTest?.password!);
                      }}
                      className="btn-anim rounded"
                    >
                      <MdContentCopy className="text-lg text-primaryColor" />
                    </button>
                  </p>
                </div>
              </div>
              {data?.englishTest.testDate &&
              new Date(data?.englishTest?.testDate) <= new Date() ? (
                <div className="w-64 p-2 flex flex-col justify-center items-center rounded bg-green-500">
                  <p className="text-white text-lg mb-2">
                    Result:{" "}
                    <span className="text-base">
                      {data?.englishTest?.score || "-"}/100
                    </span>
                  </p>
                  <div className="flex items-center justify-center gap-1 w-full mx-auto">
                    <input
                      min="0"
                      max="100"
                      required
                      className="input-style w-24 text-center"
                      type="number"
                      placeholder="Score"
                      name="score"
                      value={scoreData?.score || data?.englishTest?.score}
                      onChange={handleScoreChange}
                    />
                    <button
                      onClick={handleSendScore}
                      className="btn btn-anim bg-primaryColor text-white w-1/2"
                    >
                      {addScoreMutation.isPending ? "Sending..." : "Send"}
                    </button>
                  </div>
                  <span className="text-white text-sm my-2">
                    Min: 0; Max: 100
                  </span>

                  {data?.englishTest?.score && (
                    <div className="flex flex-col w-full bg-gray-200 rounded p-4">
                      Did the student pass or fail ?
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            event.preventDefault();
                            handlePassOrFail("Passed");
                          }}
                          className={`btn flex gap-1 items-center btn-anim text-white ${
                            data?.englishTest.hasPassed === "Passed"
                              ? "bg-primaryColor"
                              : "bg-gray-400"
                          }`}
                        >
                          {englishTestPassOrFailMutation.isPending
                            ? "..."
                            : "Passed"}
                        </button>
                        <button
                          onClick={(
                            event: React.MouseEvent<HTMLButtonElement>
                          ) => {
                            event.preventDefault();
                            handlePassOrFail("Failed");
                          }}
                          className={`btn btn-anim text-white ${
                            data?.englishTest.hasPassed === "Failed"
                              ? "bg-red-600"
                              : "bg-gray-400"
                          }`}
                        >
                          {englishTestPassOrFailMutation.isPending
                            ? "..."
                            : "Failed"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`${
                    data?.englishTest?.testDate
                      ? "bg-primaryColor text-white"
                      : "bg-gray-200 text-gray-500"
                  } h-32 my-auto w-40 p-2 flex flex-col justify-center items-center rounded`}
                >
                  <p className="text-center font-bold text-lg ">
                    Test Date: <br />
                    {data?.englishTest?.testDate
                      ? format(
                          new Date(data?.englishTest?.testDate),
                          "dd/MM/yyyy"
                        )
                      : "Not assigned"}
                  </p>
                </div>
              )}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default EnglishTest;
