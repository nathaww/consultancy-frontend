import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Deposit from "./Cards/Deposit";
import Comment from "./Comment/Comment";
import EnglishTest from "./Cards/EnglishTest/EnglishTest";
import EditEnglishTest from "./Cards/EnglishTest/EditEnglishTest";
import Admission from "./Cards/Admission/Admission";
import RecentActivities from "./Recent Activities/RecentActivities";
import Visa from "./Cards/Visa/Visa";
import { useUser } from "@/Context/UserContext";

const ApplicationRoutes = () => {
  const { user } = useUser();
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Header />
      <div className="flex sm:flex-col lg:flex-row flex-col w-full justify-evenly items-start gap-4">
        <Routes>
          {user?.user.roles.includes("Finance") ||
          user?.user.roles.includes("Admin") ? (
            <Route path="deposit" element={<Deposit />} />
          ) : (
            ""
          )}
          {user?.user.roles.includes("Admission") ||
          user?.user.roles.includes("Admin") ? (
            <>
              <Route path="admission" element={<Admission />} />
              <Route path="englishTest" element={<EnglishTest />} />
              <Route
                path="englishTest/edit/:id"
                element={<EditEnglishTest />}
              />
            </>
          ) : (
            ""
          )}

          {user?.user.roles.includes("Visa") ||
          user?.user.roles.includes("Admin") ? (
            <Route path="visa" element={<Visa />} />
          ) : (
            ""
          )}
        </Routes>
      </div>
      <div className="flex flex-col w-full md:flex-row lg:flex-row gap-2">
        <Comment />
        <RecentActivities />
      </div>
    </div>
  );
};

export default ApplicationRoutes;
