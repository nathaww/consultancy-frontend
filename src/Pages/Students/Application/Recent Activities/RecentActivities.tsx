import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { NoData } from "@/Components/Loading State/NoData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/Components/ui/accordion";
import {
  RecentActivitiesInterface,
  getRecentActivities,
} from "@/api/application";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

const RecentActivities = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery<RecentActivitiesInterface[]>({
    queryKey: ["recentActivities"],
    queryFn: () => getRecentActivities(id!),
  });
  return (
    <div className="card-shadow border p-4 w-full md:w-1/2 lg:w-1/2 sm:mt-8 lg:mt-8 mt-2 rounded">
      <p className="font-bold text-lg">Recent Activities</p>

      {isLoading && <Loading />}

      {isError && <Error />}

      {data && data?.length < 1 && <NoData text="No Recent Activities" />}

      {data && data?.length > 0 && !isError && (
        <div className="flex flex-col w-full h-96 overflow-y-scroll p-1">
          <Accordion type="single" collapsible className="w-full">
            {data?.map((item) => (
              <AccordionItem
                value={item.id}
                key={item?.id}
                className="rounded bg-gray-50 p-3 my-2"
              >
                <AccordionTrigger className="text-primaryColor">
                  {item?.entity}
                </AccordionTrigger>
                <AccordionContent>
                  <p>
                    {item.entity +
                      " " +
                      item?.operation +
                      " by " +
                      item?.user?.firstName +
                      " " +
                      item?.user?.lastName}
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    At {format(new Date(item?.createdAt), "hh:mm dd/MM/yyyy")}
                  </p>
                  {item.detail && <p className="mt-2">{item?.detail}</p>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
