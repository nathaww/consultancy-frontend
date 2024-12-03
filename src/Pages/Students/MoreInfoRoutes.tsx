import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import School from "./School/School";
import Family from "./Family/Family";
import EditFamily from "./Family/EditFamily";
import EditSchool from "./School/EditSchool";
import EditPassport from "./School/EditPassport";
import { useUser } from "@/Context/UserContext";
import AdditionalFiles from "./AdditionalFiles/AdditionalFiles";

const MoreInfoRoutes = () => {
  const { user } = useUser();
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Header />
      <Routes>
        {user?.user.roles.includes("Admin") ||
        user?.user.roles.includes("Agent") ? (
          <>
            <Route path="school" element={<School />} />
            <Route path="school/edit/:id" element={<EditSchool />} />
            <Route path="school/editpassport/:id" element={<EditPassport />} />
            <Route path="family" element={<Family />} />
            <Route path="family/edit/:id" element={<EditFamily />} />
            <Route path="additionalFiles" element={<AdditionalFiles />} />
          </>
        ) : (
          ""
        )}
        {user?.user.roles.includes("Admission") ||
        user?.user.roles.includes("Visa") ? (
          <>
            <Route path="school" element={<School />} />
            <Route path="family" element={<Family />} />
            <Route path="additionalFiles" element={<AdditionalFiles />} />
          </>
        ) : (
          ""
        )}
      </Routes>
    </div>
  );
};

export default MoreInfoRoutes;
