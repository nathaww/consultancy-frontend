import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  NotificationInterface,
  getIncomingNotifications,
} from "@/api/notification";
import { useQuery } from "@tanstack/react-query";

const IncomingNotification = () => {
  const { data, isLoading, isError } = useQuery<NotificationInterface[]>({
    queryKey: ["incomingNotification"],
    queryFn: () => getIncomingNotifications(),
  });
  return (
    <>
      <div className="flex w-full mb-4">
        <h1 className="text-base sm:text-xl lg:tex-xl font-bold">
          Notifications
        </h1>
      </div>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data?.length === 0 && !isError && <NoData text="No Notifications" />}

      {data && data?.length > 0 && !isError && (
        <div className="card-shadow p-4 mb-3">
          {data?.map((item, index) => (
            <>
              <div
                className="flex flex-col sm:flex-row lg:flex-row gap-2"
                key={index}
              >
                <div className="w-full flex-1 p-4">
                  <div className="w-full flex justify-between items-center">
                    <p className="text-base font-semibold sm:text-xl lg:text-xl">
                      {item.title || "-"}
                    </p>
                    <p className="text-xs sm:text-sm lg:text-sm">
                      To:{" "}
                      {item.recipient &&
                        item?.recipient.firstName +
                          " " +
                          item.recipient.lastName}
                    </p>
                  </div>
                  <p className="text-sm">{item.content}</p>
                </div>
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default IncomingNotification;
