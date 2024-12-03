import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";
import Loading from "@/Components/Loading State/Loading";
import Error from "@/Components/Loading State/Error";
import { NoData } from "@/Components/Loading State/NoData";
import { useState } from "react";
import AddNotificationModal from "./AddNotificationModal";
import { NotificationInterface, getNotifications } from "@/api/notification";

const Notification = () => {
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const { data, isLoading, isError } = useQuery<NotificationInterface[]>({
    queryKey: ["notification"],
    queryFn: () => getNotifications(),
  });

  return (
    <>
      <AddNotificationModal open={open} onCloseModal={onCloseModal} />
      <div className="flex w-full justify-between mb-4">
        <h1 className="text-base sm:text-xl lg:tex-xl font-bold">
          Recent Notifications
        </h1>
        <button
          onClick={onOpenModal}
          className="btn btn-anim bg-primaryColor text-white flex gap-2 items-center sm:w-48 lg:w-48"
        >
          <FaPlus />
          Add Notification
        </button>
      </div>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data?.length === 0 && !isError && <NoData text="No Notifications" />}

      {data && data?.length > 0 && !isError && (
        <div className="card-shadow p-4 mb-3">
          {data?.map((item) => (
            <>
              <div
                className="flex flex-col sm:flex-row lg:flex-row gap-2"
                key={item.id || "-"}
              >
                <div className="w-full flex-1 p-4 bg-">
                  <div className="w-full flex justify-between items-center">
                    <p className="text-base font-semibold sm:text-xl lg:text-xl">
                      {item.title}
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
              <hr />
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default Notification;
