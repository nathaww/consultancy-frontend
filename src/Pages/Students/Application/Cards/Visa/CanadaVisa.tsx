import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loading from "@/Components/Loading State/Loading";
import Error from "@/Components/Loading State/Error";
import { NoData } from "@/Components/Loading State/NoData";
import { CanadaVisaInterface, getCanadaVisa } from "@/api/canadaVisa";
import BiometricSubmissionDate from "./CanadaCards/BiometricSubmissionDate";
import ServiceFeeDeposit from "./CanadaCards/ServiceFeeDeposit";

const RequestDocuments = React.lazy(
  () => import("./CanadaCards/RequestDocuments")
);
const ConfirmDocuments = React.lazy(
  () => import("./CanadaCards/ConfirmDocuments")
);
const ConfirmApplicationAndBiometricFee = React.lazy(
  () => import("./CanadaCards/ConfirmApplicationAndBiometricFee")
);
const UploadVisaFeeFiles = React.lazy(
  () => import("./CanadaCards/UploadVisaFeeFiles")
);
const NotifyUser = React.lazy(() => import("./CanadaCards/NotifyUser"));

const CanadaVisa = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery<CanadaVisaInterface>({
    queryKey: ["CanadaVisaDocument"],
    queryFn: () => getCanadaVisa(id!),
  });

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

          {data?.requiredDocumentsReceived! && (
            <ConfirmApplicationAndBiometricFee
              visaId={data?.id!}
              visaApplicationAndBiometricFee={
                data?.visaApplicationAndBiometricFee!
              }
            />
          )}

          {data.visaApplicationAndBiometricFee === "Paid" && (
            <BiometricSubmissionDate
              visaId={data?.id!}
              biometricSubmissionDate={data?.biometricSubmissionDate!}
              visaApplicationAndBiometricSubmitted={
                data?.visaApplicationAndBiometricSubmitted!
              }
            />
          )}

          {data.biometricSubmissionDate &&
            data.visaApplicationAndBiometricSubmitted === "Attended" && (
              <ServiceFeeDeposit
                visaId={data.id!}
                serviceFeeDepositDate={data?.serviceFeeDepositDate!}
                serviceFeeDepositPaymentStatus={
                  data?.serviceFeeDepositPaymentStatus!
                }
              />
            )}

          {data.serviceFeeDepositDate &&
            data.serviceFeeDepositPaymentStatus === "Paid" && (
              <UploadVisaFeeFiles
                visaId={data.id!}
                confirmationSent={data?.confirmationSent!}
                confirmationReceived={data?.confirmationReceived!}
              />
            )}

          {data.confirmationSent && data.confirmationReceived && (
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

export default CanadaVisa;
