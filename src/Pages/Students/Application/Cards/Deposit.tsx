import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import { DepositInterface, getDeposit, postDeposit } from "@/api/application";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { useParams } from "react-router-dom";

const Deposit = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery<DepositInterface>({
    queryKey: ["getDeposit"],
    queryFn: () => getDeposit(id!),
  });

  useEffect(() => {
    calculateDaysLeft();
  }, [data, data?.expiration]);

  const calculateDaysLeft = () => {
    const expirationDate = new Date(data?.expiration!);
    const currentDate = new Date();
    const difference = expirationDate.getTime() - currentDate.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    setDaysLeft(days);
  };

  const depositMutation = useMutation<
    DepositInterface,
    Error,
    DepositInterface
  >({
    mutationKey: ["deposit"],
    mutationFn: (data) => postDeposit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDeposit"] });
      queryClient.invalidateQueries({ queryKey: ["recentActivities"] });
      const notify = toast.success("Successful");
      notify;
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response?.data?.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleDeposit = async (state: boolean) => {
    depositMutation.mutateAsync({
      isDeposited: state,
      isBlocked: data?.isBlocked,
      applicationId: id!,
    });
  };
  const handleBlock = async (state: boolean) => {
    depositMutation.mutateAsync({
      isDeposited: data?.isDeposited,
      isBlocked: state,
      applicationId: id!,
    });
  };

  return (
    <div className="w-full min-h-40 card-shadow rounded border mt-8">
      <div className="w-full min-h-40 bg-white flex justify-between h-full rounded p-4 gap-2">
        {isLoading && <Loading />}

        {isError && <Error />}

        {!isLoading && !data?.status && !isError && (
          <NoData text="No Deposit Found" />
        )}

        {data?.status && !isError ? (
          <>
            <div className="flex flex-col gap-y-4">
              <p className="text-base md:text-lg lg:text-lg font-semibold">
                1. Deposit Money
              </p>
              <p className="text-sm font-semibold">
                Status:{" "}
                <span className="font-normal">{data?.status || "-"}</span>
              </p>

              <div className="flex items-center space-x-2">
                <div>
                  <p className="flex items-center gap-1">
                    Did the student deposit money?
                    {depositMutation.isPending ? (
                      <CgSpinner className="animate-spin" />
                    ) : (
                      ""
                    )}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        handleDeposit(true);
                      }}
                      className={`btn flex gap-1 items-center btn-anim text-white ${
                        data?.isDeposited ? "bg-primaryColor" : "bg-gray-400"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        handleDeposit(false);
                      }}
                      className={`btn btn-anim text-white ${
                        data?.isDeposited
                          ? "bg-gray-400"
                          : "bg-red-600 focus:bg-red-700"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <span className="flex items-center gap-1">
                    Did the student block the account?{" "}
                    {depositMutation.isPending ? (
                      <CgSpinner className="animate-spin" />
                    ) : (
                      ""
                    )}
                  </span>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();

                        handleBlock(true);
                      }}
                      className={`btn flex gap-1 items-center btn-anim text-white ${
                        data?.isBlocked ? "bg-primaryColor" : "bg-gray-400"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();

                        handleBlock(false);
                      }}
                      className={`btn btn-anim text-white ${
                        data?.isBlocked
                          ? "bg-gray-400"
                          : "bg-red-600 focus:bg-red-700"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-green-300 h-32 my-auto w-32 flex flex-col justify-center items-center rounded">
              <p className="text-center font-extrabold text-4xl text-green-600">
                {daysLeft || "-"}
              </p>
              <span className="text-center font-bold text-2xl text-green-600">
                Days
              </span>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Deposit;
