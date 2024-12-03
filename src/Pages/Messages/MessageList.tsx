import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import { MessageListInterface, getMessageList } from "@/api/message";
import { useQuery } from "@tanstack/react-query";
import { FaAngleRight, FaPlus } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const MessageList = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery<
    MessageListInterface[]
  >({
    queryKey: ["messages"],
    queryFn: () => getMessageList(),
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-lg">Chats({data?.length || 0})</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              navigate("/contacts");
            }}
            className="btn btn-anim bg-primaryColor text-white"
          >
            <FaPlus />
          </button>
          <button
            onClick={handleRefresh}
            className="btn btn-anim bg-primaryColor text-white"
          >
            <FaRotate />
          </button>
        </div>
      </div>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data?.length === 0 && <NoData text="No chats" />}

      {data && !isError && (
        <div className="w-full mt-4 cursor-pointer">
          {data &&
            data?.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/messages/${chat.id}`)}
                className="flex flex-row justify-between items-center bg-gradient-to-r from-primaryColor via-lightPrimaryColor to-primaryColor p-3 rounded mb-2"
              >
                <div className="flex flex-row gap-2 items-center">
                  <div className="bg-darkPrimaryColor flex justify-center items-center w-12 h-12 rounded-full text-white">
                    {chat?.participants[0]?.firstName?.charAt(0) || "-"}
                  </div>
                  <div>
                    <p className="text-white">
                      {chat?.participants[0]?.firstName +
                        " " +
                        chat?.participants[0]?.lastName || "-"}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {chat?.messages[0]?.content}
                    </p>
                  </div>
                </div>
                {chat._count.messages > 0 ? (
                  <p className="text-white bg-red-600 py-1 px-2 rounded-full text-sm">
                    {chat._count?.messages}
                  </p>
                ) : (
                  <FaAngleRight className="text-white text-2xl" />
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;
