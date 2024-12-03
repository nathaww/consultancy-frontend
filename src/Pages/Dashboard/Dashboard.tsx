import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import { MissedCalendarInterface, getMissedCalendar } from "@/api/calendar";
import {
  getApplicationCount,
  getEmployeeRoleCount,
  getGenderCount,
} from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CgFileDocument, CgWorkAlt } from "react-icons/cg";
import { PiStudent } from "react-icons/pi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { CommentInterface, getRecentComments } from "@/api/comment";
import CommentComponent from "./CommentComponent";
import { MessageListInterface, getMessageList } from "@/api/message";

interface StudentData {
  gender: "Male" | "Female";
  count: number;
}
interface EmployeeRoleCountData {
  role: string;
  count: number;
}
interface ApplicationCountData {
  name: string;
  count: number;
}

const Dashboard = () => {
  const {
    data: missedCalendar,
    isError: missedCalendarIsError,
    isLoading: missedCalendarIsLoading,
  } = useQuery<MissedCalendarInterface[]>({
    queryKey: ["missedCalendar"],
    queryFn: () => getMissedCalendar(),
  });

  const {
    data: recentComment,
    isLoading: recentCommentIsLoading,
    isError: recentCommentIsError,
  } = useQuery<CommentInterface[]>({
    queryKey: ["recentComments"],
    queryFn: () => getRecentComments(),
  });

  const {
    data: recentChat,
    isLoading: recentChatIsLoading,
    isError: recentChatIsError,
  } = useQuery<MessageListInterface[]>({
    queryKey: ["recentMessages"],
    queryFn: () => getMessageList(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["genderCount"],
    queryFn: () => getGenderCount(),
  });
  const { data: empRoleCount } = useQuery({
    queryKey: ["graph"],
    queryFn: () => getEmployeeRoleCount(),
  });
  const { data: applicationCount } = useQuery({
    queryKey: ["applicationCount"],
    queryFn: () => getApplicationCount(),
  });

  const totalStudentsData: StudentData[] = [
    { gender: "Male", count: data?.male },
    { gender: "Female", count: data?.female },
  ];

  const empRoleCountData: EmployeeRoleCountData[] = [
    { role: "Admin", count: empRoleCount?.admin },
    { role: "Agent", count: empRoleCount?.agent },
    { role: "Admission", count: empRoleCount?.admission },
    { role: "Finance", count: empRoleCount?.finance },
    { role: "Visa", count: empRoleCount?.visa },
  ];

  const applicationCountData: ApplicationCountData[] = [
    { name: "Deposit Status", count: applicationCount?.depositStatus },
    { name: "Admission Status", count: applicationCount?.admissionStatus },
    { name: "Visa Status", count: applicationCount?.visaStatus },
  ];

  // const getReplies = (
  //   parentId: string,
  //   comments: CommentInterface[]
  // ): CommentInterface[] => {
  //   return comments?.filter((comment) => comment?.parent?.id === parentId);
  // };

  return (
    <>
      <h1 className="text-base text-left sm:text-xl lg:tex-xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2 md:gap-3 lg:gap-3 w-full my-4 place-items-center">
        <div className="card-shadow flex flex-col justify-start p-5 bg-indigo-900">
          <p className="text-sm lg:text-base text-white flex gap-1 items-center mb-2">
            <PiStudent />
            Students
          </p>
          <p className="text-white text-2xl font-black">
            {data?.total || "-"}
          </p>
          <p className="text-sm text-gray-200">Applying</p>
        </div>
        <div className="card-shadow flex flex-col justify-start p-5 bg-slate-800">
          <p className="text-sm lg:text-base text-white flex gap-1 items-center mb-2">
            <CgWorkAlt />
            Employees
          </p>
          <p className="text-white text-2xl font-black">
            {empRoleCount?.total || "-"}
          </p>
          <p className="text-sm text-gray-200">Description</p>
        </div>
        <div className="card-shadow flex flex-col justify-start p-5 bg-teal-700">
          <p className="text-sm lg:text-base text-white  flex gap-1 items-center mb-2">
            <CgFileDocument />
            Applications
          </p>
          <p className="text-white text-2xl font-black">
            {applicationCount?.total || "-"}
          </p>
          <p className="text-sm text-gray-200">To US, Canada, Italy, Hungary</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2 md:gap-3 lg:gap-3 w-full mb-4 place-items-start">
        <div className="card-shadow p-2 w-full">
          <p className="text-primaryColor">Missed Calendar Events</p>
          {missedCalendarIsLoading && <Loading />}

          {missedCalendarIsError && <Error />}

          {missedCalendar?.length === 0 && !isLoading && <NoData text="No missed events" />}

          {missedCalendar &&
            missedCalendar?.length > 0 &&
            !missedCalendarIsError && (
              <div className="flex flex-col h-96 overflow-y-scroll p-1">
                <Accordion type="single" collapsible className="w-full">
                  {missedCalendar?.map((item) => (
                    <AccordionItem
                      value={item.id}
                      key={item?.id}
                      style={{ backgroundColor: item.color }}
                      className={`rounded p-3 my-2`}
                    >
                      <AccordionTrigger className="text-white">
                        {item?.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-xs mt-2 text-gray-200">
                          From {format(new Date(item?.startDate), "dd/MM/yyyy")}{" "}
                          To {format(new Date(item?.endDate), "dd/MM/yyyy")}
                        </p>
                        <p className="mt-2">{item?.description}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
        </div>
        <div className="card-shadow p-2 w-full">
          <p className="text-primaryColor">Recent Comments</p>
          {recentCommentIsLoading && <Loading />}

          {recentCommentIsError && <Error />}

          {recentComment && recentComment?.length < 1 && (
            <NoData text="No Comments" />
          )}

          {recentComment && recentComment?.length > 0 && !isError && (
            <div className="h-96 overflow-y-auto mt-2">
              {recentComment
                .filter((comment) => comment.parent === null)
                .map((mainComment) => (
                  <CommentComponent
                    key={mainComment.id}
                    comment={mainComment}
                    // replies={getReplies(mainComment.id, data)}
                    comments={data}
                  />
                ))}
            </div>
          )}
        </div>
        <div className="card-shadow p-2 w-full">
          <p className="text-primaryColor">Recent Chat</p>
          {recentChatIsLoading && <Loading />}

          {recentChatIsError && <Error />}

          {recentChat?.length === 0 && <NoData text="No chats" />}

          { recentChat && recentChat?.length > 0 && !recentChatIsError && (
            <div className="h-96 overflow-y-auto mt-2">
              {recentChat &&
                recentChat?.slice(0, 5).map((chat) => (
                  <div
                    key={chat.id}
                    className="flex flex-row justify-between items-center bg-[#B6D4E3] p-3 rounded mb-2"
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <div className="bg-primaryColor flex justify-center items-center w-12 h-12 rounded-full text-white">
                        {chat?.participants[0]?.firstName?.charAt(0) || "-"}
                      </div>
                      <div>
                        <p className="text-primaryColor">
                          {chat?.participants[0]?.firstName +
                            " " +
                            chat?.participants[0]?.lastName || "-"}
                        </p>
                        <p className="text-gray-50 text-sm">
                          {chat?.messages[0]?.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

        </div>
      </div>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data?.length === 0 && <NoData text="No graph data" />}

      {totalStudentsData?.length > 0 && data && !isError && (
        <>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="sm:w-full md:w-full flex  flex-col justify-center card-shadow p-4 ">
              <p className="font-semibold mb-3 text-xl text-center">
                Total Students
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={totalStudentsData}>
                  <XAxis dataKey="gender" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="sm:w-full md:w-full flex flex-col justify-center card-shadow p-4 ">
              <p className="font-semibold mb-3 text-xl text-center">
                Total Employees
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={empRoleCountData}>
                  <XAxis dataKey="role" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="count" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="sm:w-full md:w-full flex flex-col justify-center card-shadow p-4 ">
              <p className="font-semibold mb-3 text-xl text-center">
                Application Status
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={applicationCountData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
