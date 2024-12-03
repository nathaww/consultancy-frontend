import React, { Suspense } from "react";
import { VisaInterface, getRequiredVisaDocument } from "@/api/usVisa";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "@/Components/Loading State/Loading";
import Error from "@/Components/Loading State/Error";
import { NoData } from "@/Components/Loading State/NoData";
import ServiceFeeDeposit from "./USCards/ServiceFeeDeposit";

const RequestDocuments = React.lazy(() => import("./USCards/RequestDocuments"));
const UploadVisaFeeFiles = React.lazy(
  () => import("./USCards/UploadVisaFeeFiles")
);
const TrainingSchedule = React.lazy(() => import("./USCards/TrainingSchedule"));
const InterviewSchedule = React.lazy(
  () => import("./USCards/InterviewSchedule")
);
const SevisPayment = React.lazy(() => import("./USCards/SevisPayment"));
const NotifyUser = React.lazy(() => import("./USCards/NotifyUser"));
const ConfirmDocuments = React.lazy(() => import("./USCards/ConfirmDocuments"));

const UsVisa = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery<VisaInterface>({
    queryKey: ["VisaDocument"],
    queryFn: () => getRequiredVisaDocument(id!),
  });

  console.log(data, "us data");

  return (
    <>
      {isLoading && <Loading />}

      {isError && <Error />}

      {!isLoading && !data && !isError && <NoData text="No Visa Found" />}

      {data && !isError ? (
        <Suspense fallback={<Loading />}>
          <RequestDocuments
            visaId={data?.id!}
            requiredDocumentsRequested={data?.requiredDocumentsRequested!}
          />
          {data?.requiredDocumentsRequested && (
            <ConfirmDocuments
              visaId={data?.id!}
              requiredDocumentsReceived={data?.requiredDocumentsReceived!}
            />
          )}
          {data?.requiredDocumentsReceived && (
            <UploadVisaFeeFiles
              visaId={data?.id!}
              visaFeeFileUri={data?.visaFeeFileUri!}
              visaFeePaymentStatus={data?.visaFeePaymentStatus!}
            />
          )}
          {data?.visaFeePaymentStatus === "Paid" &&
            data.visaFeeFileUri !== null && (
              <>
                <InterviewSchedule
                  visaId={data.id!}
                  interviewSchedule={data?.interviewSchedule!}
                  interviewAttended={data?.interviewAttended!}
                  serviceFeeDepositPaymentStatus={
                    data?.serviceFeeDepositPaymentStatus!
                  }
                />
                {!data.interviewAttended ? (
                  <TrainingSchedule
                    visaId={data?.id!}
                    interviewSchedule={data?.interviewSchedule!}
                    interviewTrainingScheduleComplete={
                      data?.interviewTrainingScheduleComplete!
                    }
                    interviewTrainingSchedules={
                      data?.interviewTrainingSchedules!
                    }
                  />
                ) : (
                  ""
                )}
                {data.interviewSchedule && !data.interviewAttended ? (
                  <ServiceFeeDeposit
                    visaId={data?.id!}
                    interviewSchedule={data?.interviewSchedule!}
                    serviceFeeDepositDate={data?.serviceFeeDepositDate!}
                    serviceFeeDepositPaymentStatus={
                      data?.serviceFeeDepositPaymentStatus!
                    }
                  />
                ) : (
                  ""
                )}
              </>
            )}

          {data?.interviewSchedule && data.interviewAttended && (
            <SevisPayment
              visaId={data.id!}
              sevisPaymentStatus={data?.sevisPaymentStatus!}
            />
          )}

          {data?.sevisPaymentStatus === "Paid" && (
            <NotifyUser
              visaId={data.id!}
              visaStatusNotificationSent={data?.visaStatusNotificationSent!}
            />
          )}
        </Suspense>
      ) : (
        ""
      )}
    </>
  );
};

export default UsVisa;
