import { useUser } from "@/Context/UserContext";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessage, MessageInterface } from "@/api/message";
import { useEffect, useRef, useState } from "react";
import { format, isSameDay } from "date-fns";
import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { FaArrowDown } from "react-icons/fa";
import { PiCheckBold, PiChecksBold } from "react-icons/pi";

const Message = () => {
  const { id } = useParams();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError } = useQuery<MessageInterface>({
    queryKey: ["message"],
    queryFn: () => getMessage(id!),
    refetchInterval: 1000,
  });

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_BASE_URL}/chat`, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${localStorage.getItem("_auth")}`,
      },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {});

    socket.on("message", () => {
      queryClient.invalidateQueries({ queryKey: ["message"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  useEffect(() => {
    const handleScroll = () => {
      const chatContainer = chatContainerRef.current;
      if (chatContainer) {
        const atBottom =
          chatContainer.scrollHeight - chatContainer.scrollTop ===
          chatContainer.clientHeight;
        setIsScrolled(!atBottom);
      }
    };

    const chatContainer = chatContainerRef.current;
    chatContainer?.addEventListener("scroll", handleScroll);

    return () => {
      chatContainer?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isScrolled) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, isScrolled]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  let lastDisplayedDate: any = null;

  const sendMessage = async () => {
    if (messageInput !== "" && socketRef.current) {
      setLoading(true);
      const message = {
        content: messageInput,
        recipientId: data?.participants[0]?.id,
      };
      socketRef.current?.emit("message", message);
      await queryClient.invalidateQueries({ queryKey: ["message"] });
      setMessageInput("");
      setLoading(false);
    }
  };

  const onEnterPress = async (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (messageInput !== "" && socketRef.current) {
        setLoading(true);
        const message = {
          content: messageInput,
          recipientId: data?.participants[0]?.id,
        };
        socketRef.current?.emit("message", message);
        await queryClient.invalidateQueries({ queryKey: ["message"] });
        setMessageInput("");
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <p className="mb-2 text-primaryColor">
        {data?.participants && data?.participants[0]?.firstName}{" "}
        {data?.participants && data?.participants[0]?.lastName}
      </p>
      {isLoading && <Loading />}

      {isError && <Error />}

      {data && !isError && (
        <>
          <div
            ref={chatContainerRef}
            className="overflow-y-scroll h-[70vh] shadow-sm w-full md:w-3/4 lg:w-3/4  bg-white py-2 px-3 rounded-xl"
          >
            {data?.messages.map((message) => {
              const currentDate = new Date(message?.sentAt);
              let shouldDisplayDate = false;

              if (
                !lastDisplayedDate ||
                !isSameDay(currentDate, lastDisplayedDate)
              ) {
                shouldDisplayDate = true;
                lastDisplayedDate = currentDate;
              }

              return (
                <div key={message?.id}>
                  {shouldDisplayDate && (
                    <div className=" flex justify-center w-full h-max cursor-pointer">
                      <span className="text-xs text-white p-1.5 bg-gray-300 hover:bg-gray-400 rounded">
                        {format(currentDate, "LLLL d, yyyy")}
                      </span>
                    </div>
                  )}
                  <div
                    key={message?.id}
                    className={`flex ${
                      user?.user?.id === message?.senderId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex flex-col w-1/2 ${
                        user?.user?.id === message?.senderId
                          ? "rounded-tr-xl rounded-l-xl bg-primaryColor"
                          : "rounded-r-xl rounded-tl-xl bg-blue-100"
                      } p-1.5 md:p-3 lg:p-3 mb-1 w-max`}
                    >
                      <p
                        style={{
                          wordWrap: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                        className={`${
                          user?.user?.id === message?.senderId
                            ? "text-right text-white"
                            : "text-left text-primaryColor"
                        } text-sm md:text-lg lg:text-lg mb-1 break-all`}
                      >
                        {message?.content}
                      </p>
                      <span
                        className={`${
                          user?.user?.id === message?.senderId
                            ? "text-right text-gray-300"
                            : "text-left text-blue-300"
                        } text-xs flex items-center gap-2`}
                      >
                        {format(currentDate, "h:mm a")}
                        {user?.user?.id === message?.senderId ? (
                          message.read ? (
                            <PiChecksBold className="text-white text-lg" />
                          ) : (
                            <PiCheckBold className="text-white text-lg" />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {isScrolled && (
            <button
              className="fixed bottom-28 right-10 p-2 bg-primaryColor text-white rounded-full shadow-lg"
              onClick={scrollToBottom}
            >
              <FaArrowDown className="text-white" />
            </button>
          )}

          <div className="md:w-1/2 lg:w-1/2 w-full">
            <textarea
              className="input-style my-2 w-full"
              rows={2}
              placeholder="Type a message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={onEnterPress}
            />

            <div className="flex justify-end items-center w-full">
              <button
                className="btn btn-anim w-full bg-primaryColor text-white"
                type="button"
                onClick={sendMessage}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              If you are having trouble sending messages check your network or
              try refreshing the page.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
