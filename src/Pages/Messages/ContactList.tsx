import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  ContactListInterface,
  getContacts,
  startConversation,
} from "@/api/message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ContactList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<ContactListInterface[]>({
    queryKey: ["contacts"],
    queryFn: () => getContacts(),
  });

  const startConversationMutation = useMutation({
    mutationKey: ["startConversation"],
    mutationFn: (id: string) => startConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      navigate(-1);
    },
    onError: (error: any) => {
      const notify = toast.error(
        error?.response.data.message || "An unknown error occurred"
      );
      notify;
    },
  });

  const handleConversation = async (id: string) => {
    startConversationMutation.mutateAsync(id);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-lg">Contacts({data?.length || 0})</h1>
      </div>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data?.length === 0 && <NoData text="No contacts" />}

      {data && !isError && (
        <div className="w-full mt-4">
          {data &&
            data?.map((chat) => (
              <div
                key={chat.id}
                className="flex flex-row justify-between items-center bg-gradient-to-r from-primaryColor via-lightPrimaryColor to-primaryColor p-3 rounded mb-2"
              >
                <div className="flex flex-row gap-2 items-center">
                  <div className="bg-darkPrimaryColor flex justify-center items-center w-12 h-12 rounded-full text-white">
                    {chat?.firstName?.charAt(0) || "-"}
                  </div>
                  <div>
                    <p className="text-white">
                      {chat?.firstName + " " + chat?.lastName || "-"}
                    </p>
                  </div>
                </div>
                <button
                  className="text-white"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    handleConversation(chat?.id!);
                  }}
                >
                  {startConversationMutation.isPending
                    ? "Adding..."
                    : "Add to chat"}
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
