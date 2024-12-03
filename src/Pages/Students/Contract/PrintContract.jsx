import Error from "@/Components/Loading State/Error";
import Loading from "@/Components/Loading State/Loading";
import { getStudent } from "@/api/student";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { format } from 'date-fns';


const Header = () => {
  return (
    <div>
      <img
        src="/Images/logo.webp"
        alt="logo for printing"
        className="w-16 rounded-full mb-6 sm:w-full lg:w-full mx-auto h-16 object-contain  object-center"
      />
      <p className="text-primaryColor font-bold text-xl text-center">
        Educational Consultancy and Technology
      </p>
      <p className="text-primaryColor text-2xl font-bold text-center">
        ማራኪ የትምህርት አማካሪ እና ቴክኖሎጂ
      </p>
      <p className="text-primaryColor text-center underline">
        Raise a generation that Loves Truth
      </p>
    </div>
  );
};

const Footer = () => {
  return (
    <>
      <div className="h-8 mt-8 bg-primaryColor w-full"></div>
      <p className="text-center">
        አድራሻ: ቦሌ ሸዋ ዳቦ ፊት ለፊት ጌቱ የንግድ ማዕከል 1ኛ ፎቅ <br /> ቢሮ ቁጥር 102 ስልክ ቁጥር
        0960612222
      </p>
    </>
  );
};

const DateComponent = () => {

  return (
    <div className="flex justify-end">
      <p className="text-right font-bold">__________________ዓ.ም</p>
    </div>
  );
};

const Title = React.forwardRef((props, ref) => {
  return (
    <>
      <p className="text-center my-2 font-bold">የማማከር ስራ ዉል ስምምነት</p>
      <p className="text-end font-bold">
        ዉል ተቀባይ ______________{props?.data?.firstName}_{props?.data?.lastName}
        _______________/ዜግነት ኢትዮጵያዊ/ <br />
        አድራሻ፡- ክልል:___{props?.data?.studentAddress?.region}_____ከተማ____
        {props?.data?.studentAddress?.city}_____ክ/ከተማ:____
        {props?.data?.studentAddress?.subCity}_____ዞን/ወረዳ: ____
        {props?.data?.studentAddress?.woreda}______ ቀበሌ:____
        {props?.data?.studentAddress?.kebele}______ የቤ.ቁ:_____
        {props?.data?.studentAddress?.houseNumber}_______ ስልክ ቁጥር፡______
        {props?.data?.user?.phoneNumber}_______
      </p>
      <p>
        ዉል ሰጪ፡- ማራኪ ትምህርት ማማከርና ቴክኖሎጂ አድራሻ:- አ.አ ክ/ከተማ: ቂርቆስ ወረዳ: 01 የቤት ቁጥር:
        991/102 ስልክ ቁጥር 0960612222
      </p>
    </>
  );
});

const Section1 = React.forwardRef((props, ref) => {
  return (
    <div>
      <p className="text-center font-bold mt-1">አንቀጽ አንድ</p>
      <p className="text-center">የዉል ዓላማ</p>
      <p>
        ዉል ሰጪ ማራኪ የትምህርት አማካሪ እና ቴክኖሎጂ ባላቸዉ የሥራ ሙያ በትምህርት ዙርያ የማማከር ስራ እንዲሰሩ ፣
        ዉጭ ካለዉ የትምህርት ተቋም ጋር ያለውን ሂደት እንዲያከናዉኑ እና ቪዛ ከ________________ ኢምባሲ
        እንዳገኝ ስልጠና እና ሰነዶችን እንዲያዘጋጁልኝ ዉል ተቀባይም
        _______________________________በዉሉ በተመለከተዉ ግዴታ መሰረት ክፍያ ለመፈፀም ነው። ስራዉን
        በተመለከተ ከዚህ በታች እንደሚከተለዉ ይሆናል፡፡ በትምህርት ዙርያ እና ተዛማጅ በሆኑ ጉዳዮች ላይ ማማከር ለመስራት
      </p>
    </div>
  );
});

const Section2 = () => {
  return (
    <div>
      <p className="text-center font-bold mt-1">አንቀጽ ሁለት</p>
      <p className="text-left">
        የአገልግሎት ክፍያ መጠንና የአከፋፈል ሁኔታ
        <br />
        ዉል ተቀባይ ለዉል ሰጪ በብር _____________/_______________ ብር/ ይከፉላሉ፡፡ አከፋፈሉም
      </p>
      <p className="mt-2">
        2.1. አድሚሽን ሲያገኙ የማይመለስ የመቀበያ ክፍያ ____________ ብር/ _____________ ብር/ ይከፍላል፡፡ ዉል ተቀባይ
        በማራኪ ክሬዲት አገልግሎት አማካኝነት ሌሎች ተማሪዎች በዉል ሰጪ አገልግሎት እንዲያገኙ ዉል ተቀባይ የሚያመጣ ከሆነ
        ለአንድ ተማሪ በብር ____________ (__________________) ኮሚሽን እየታሰበ ከመቀበያ ክፍያ ተቀናሽ ይሆናል፡፡
        ድምሩ ከመቀበያ ክፍያ ካለፈ ወይም የመቀበያ ክፍያ ከከፈሉ በኋላ ተማሪ ካስመዘገቡ ከአገልግሎት ክፍያ ተቀናሽ
        ይሆናል።
      </p>
      <p className="mt-2">
        2.2. ከ ኢምባሲ ቪዛ የማግኘት ፈቃድ ሲያገኙ የአገልግሎት ብር ____________ ብር (______________ ብር) የሚከፍሉ
        ይሆናል፡፡
      </p>
    </div>
  );
};

const Section3 = React.forwardRef((props, ref) => {
  return (
    <div>
      <p className="text-center font-bold mt-1">አንቀጽ ሶስት</p>
      <p className="text-center">የዉል ሰጪ ግዴታና ሃላፊነት</p>
      <p className="font-bold">ዉል ሰጪ ለውል ተቀባይ የሚሰጡት አገልግሎት በ 4 ደረጃዎች ይሆናል;-</p>
      <p className="mt-2">
        3.1: ለአድሚሺን የሚያስፈልጉትን የትምህርት ማስረጃዎች ከዉል ተቀባይ ተረክቦ ማዘጋጀት። <br /> 3.2:
        በ_______{props?.data?.applications[0]?.country}________ የሚገኘ የትምህርት ተቋም
        አድሚሽን ማስገኘት፡፡ <br />
        3.3: ቪዛ ለማግኘት የሚረዱ ሰነዶች ውል ተቀባይ እንዲያዘጋጁ መርዳት እና/ወይም ለቪዛ ቃለመጠየቅ ማዘጋጀት።
        <br />
        ጉርሻ አገልግሎቶች: <br /> 1. አድሚሽን ባገኙበት ትምህርት ተቋም በሚማሩበት ለቀጣዮቹ 2 (ሁለት) ዓመታት
        የመፃህፍት እና የመሳሰሉትን በሚችሉት መጠን ትብብር ማድረግ።
        <br />
        2. ትምህርታቸዉን ስጨርሱ ለአንድ ዓመት ከተማሩት ትምህርት ጋር ተዛማጅ በሆኑ ጉዳዮች ላይ ያለ ተጨማሪ ክፍያ
        ማማከር::
      </p>
      <p className="mt-2">
        2.2. ከ ኢምባሲ ቪዛ የማግኘት ፈቃድ ሲያገኙ የአገልግሎት ብር ____________ ብር (______________ ብር) የሚከፍሉ
        ይሆናል፡፡
      </p>
    </div>
  );
});

const Section4 = () => {
  return (
    <div>
      <p className="text-center font-bold mt-1">አንቀጽ አራት</p>
      <p className="text-center">የዉል ተቀባይ ግዴታና ኃለፊነት</p>
      <p className="mt-2">
        4.1 ክፍያዎችን በጊዜዉ ለመክፈል በዚህ ዉል ግዴታ ገብቻለሁ፡፡ <br />
        4.2 የሚጠየቁትን አስፈላጊ የትምህርት እና የስራ ማስረጃዎች ኦርጂናሉን በጊዜዉ ማቅረብ፡፡
        <br />
        4.3 ለኢንባሲ ቀጠሮዬ በሰዓቱ መዘጋጀት፡፡ <br />
        4.4 ለኢንባሲ እና ለትምህርት ቤት የምከፈሉትን ክፍያዎች በጊዜው መክፈል። <br /> 4.5 የመቀበያ ክፊያው ዉል
        ከተዋዋሉበት ቀን አንስቶ በ ቀን 7 (ሰባት) የስራ ቀን ውስጥ በስማቸዉ በከፈቱት የአቢሲኒያ ባንክ አፉሪካ ጎዳና
        ቅርንጫፍ የባንክ አካውንት ዉስጥ ገቢ ማድረግ፡፡ <br /> 4.6 የአገልግሎት ክፊያውን ከኤምባሲ ቀጠሮ ቀን 14
        (አስራ አራት) የስራ ቀን በፊት በስማቸዉ በከፈቱት የአቢሲኒያ ባንክ አፉሪካ ጎዳና ቅርንጫፍ የባንክ አካውንት
        ዉስጥ ገቢ ማድረግ፡፡ <br /> 4.7 ዉል ሰጪ ስራቸውን በመስራት ላይ ሆነው ወይም የትምህርት እድሉን አመቻችተው
        ጨርሰው ዉል ተቀባይ ማቋረጥ ቢፈልጉ ዉል ሰጪ ለሚደርስባቸው የጊዜ ፣ የገንዘብ እና የእዉቀት ኪሳራ ለዉል ሰጪ
        ___________ ብር/ ____________ ብር/ ከፍለዉ ዉሉ የጸና ይሆናል። ዉል ማቋረጥ የሚቻለዉ ለኢምባሲ ቀጠሮ 14 (አስራ
        አራት) እና ከዛ በላይ የስራ ቀናት ሲቀሩ ብቻ ነዉ።
      </p>
    </div>
  );
};

const Signature = () => {
  return (
    <div className="mt-2">
      <p>
        ይህንን ዉል ስንዋዋል የነበሩ ምስክሮች <br /> 1ኛ ወ /ት በረከት ተስፋዬ ተሰማ/ዜግነት ኢትዮጵያዊት/
        አድራሻ፡ ከተማ: አ.አ ክ/ከተማ: ኮ/ቀራኒዮ ወረዳ: 05 የቤት ቁጥር: 3141 <br /> 2ኛ
        _________________________ /ዜግነት ኢትዮጵያዊ/ አድራሻ፡
        ________________________________________ <br /> እኛም ከዚህ በላይ ስማችን የተጠቀሰዉ
        ምስክሮች ዉል ሰጪና ዉል ተቀባይ ከዚህ በላይ በተጻፈ ዉል ተስማምተዉ በዉሉ ላይ ሲፈራረሙ ማየታችንን በፊርማችን
        እናረጋግጣለን፡
      </p>
      <div className="flex justify-evenly mt-4">
        <p>
          <strong>ዉል ሰጪ</strong>
          <br /> ስም: ማራኪ የትምህርት አማካሪ እና ቴክኖሎጂ <br /> ፊርማ: _________________
        </p>
        <p>
          <strong>የዉል ተቀባይ/ተወካይ</strong>
          <br /> ስም: ___________________ <br /> ፊርማ: _________________
        </p>
      </div>
      <div className="flex flex-col mt-8">
        ምስክሮች <br />
        <div className="flex justify-evenly">
          <p>
            1ኛ. ስም: ___________________________ <br /> ፊርማ: _________________
          </p>
          <p>
            2ኛ. ስም: __________________________ <br /> ፊርማ: _________________
          </p>
        </div>
      </div>
    </div>
  );
};

const PrintableLetter = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="w-full flex flex-col p-4">
      <Header />
      <DateComponent />
      <Title data={props?.printdata} />
      <Section1 data={props?.printdata} />
      <Section2 data={props?.printdata} />
      <Section3 data={props?.printdata} />
      <Footer />

      <div className="page-break-container mt-8">
        <Header />
        <Section4 />
        <Signature />
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
});

const PrintContract = () => {
  const componentRef = useRef(null);
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["student"],
    queryFn: () => getStudent(id),
  });

  return (
    <div className="d-flex flex-column justify-content-center w-full">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isError ? (
            <Error />
          ) : (
            <PrintableLetter printdata={data} ref={componentRef} />
          )}
          <ReactToPrint
            trigger={() => (
              <button
                disabled={!data}
                className="btn btn-anim bg-primaryColor text-white mt-8 mx-auto"
              >
                Print Letter
              </button>
            )}
            content={() => componentRef.current}
          />
        </>
      )}
    </div>
  );
};

export default PrintContract;
