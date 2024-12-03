import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./Pages/Error/Error";
import Login from "./Pages/Auth/Login";
import createStore from "react-auth-kit/createStore";
import AuthProvider from "react-auth-kit";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";
import Dashboard from "./Pages/Dashboard/Dashboard";
import { UserProvider, useUser } from "./Context/UserContext";
import AuthLayout from "./Components/Layout/AuthLayout";
import MasterLayout from "./Components/Layout/MasterLayout";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Students from "./Pages/Students/Students";
import AddStudent from "./Pages/Students/AddStudent";
import PrintContract from "./Pages/Students/Contract/PrintContract";
import StudentDetail from "./Pages/Students/StudentDetail";
import EditStudent from "./Pages/Students/EditStudent";
import MoreInfoRoutes from "./Pages/Students/MoreInfoRoutes";
import ApplicationRoutes from "./Pages/Students/Application/ApplicationRoutes";
import Employees from "./Pages/Employees/Employees";
import AddEmployee from "./Pages/Employees/AddEmployee";
import EditEmployee from "./Pages/Employees/EditEmployee";
import Notification from "./Pages/Notification/Notification";
import Post from "./Pages/Post/Post";
import ForgetPassword from "./Pages/Auth/ForgetPassword";
import LocalCalendar from "./Pages/Calendar/Calendar";
import ApplicationList from "./Pages/ApplicationList/ApplicationList";
import AgentStudents from "./Pages/AgentStudents/AgentStudents";
import ResetPassword from "./Pages/Auth/ResetPassword";
import MessageList from "./Pages/Messages/MessageList";
import Message from "./Pages/Messages/Message";
import Activate from "./Pages/AgentStudents/Activate";
import Advert from "./Pages/Advert/Advert";
import ContactList from "./Pages/Messages/ContactList";
import Sales from "./Pages/Sales/Sales";
import AddSales from "./Pages/Sales/AddSales";
import IncomingNotification from "./Pages/Notification/IncomingNotification";
import EditStudentAddress from "./Pages/Students/EditStudentAddress";

interface AuthState {
  isAuthenticated: boolean;
  user?: {
    id: number;
    username: string;
  };
  authToken?: string;
}

function App() {
  const queryClient = new QueryClient();
  const store = createStore<AuthState>({
    authName: "_auth",
    authType: "localstorage",
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === "https:",
  });
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider store={store}>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
        <UserProvider>
          <Layout />
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

const Layout = () => {
  const { user } = useUser();
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"auth/*"} element={<AuthLayout />}>
          <Route path={"login"} element={<Login />} />
          <Route path={"forgot-password"} element={<ForgetPassword />} />
          <Route path={"reset-password/:token"} element={<ResetPassword />} />
          <Route path={"*"} element={<ErrorPage />} />
        </Route>

        <Route element={<AuthOutlet fallbackPath="auth/login" />}>
          <Route path={"/*"} element={<MasterLayout />}>
            <Route index element={<Dashboard />} />

            {/* Student */}
            {user?.user.roles.includes("Admin") ? (
              <>
                <Route path="students" element={<Students />} />
                <Route path="students/add" element={<AddStudent />} />
                <Route path="students/detail/:id" element={<StudentDetail />} />
                <Route path="students/edit/:id" element={<EditStudent />} />
                <Route
                  path="students/editAddress/:id"
                  element={<EditStudentAddress />}
                />
                <Route path="students/print/:id" element={<PrintContract />} />
              </>
            ) : (
              ""
            )}
            {user?.user.roles.includes("Admin") ||
            user?.user.roles.includes("Admission") ||
            user?.user.roles.includes("Visa") ? (
              <>
                <Route path="students/detail/:id" element={<StudentDetail />} />
              </>
            ) : (
              ""
            )}
            {user?.user.roles.includes("Admin") ||
            user?.user.roles.includes("Agent") ? (
              <>
                <Route path="sales" element={<Sales />} />
                <Route path="sales/add" element={<AddSales />} />
              </>
            ) : (
              ""
            )}
            {user?.user.roles.includes("Agent") ? (
              <>
                <Route path="agentStudents" element={<AgentStudents />} />
                <Route path="agentStudents/add" element={<AddStudent />} />
                <Route
                  path="agentStudents/detail/:id"
                  element={<StudentDetail />}
                />
                <Route
                  path="agentStudents/edit/:id"
                  element={<EditStudent />}
                />
                <Route
                  path="agentStudents/editAddress/:id"
                  element={<EditStudentAddress />}
                />
                <Route
                  path="agentStudents/print/:id"
                  element={<PrintContract />}
                />
                <Route
                  path="agentStudents/activate/:id"
                  element={<Activate />}
                />
                <Route
                  path="agentStudents/detail/:id/moredetail/*"
                  element={<MoreInfoRoutes />}
                />
                <Route
                  path="agentStudents/application/:id/*"
                  element={<ApplicationRoutes />}
                />
              </>
            ) : (
              ""
            )}

            <Route
              path="students/application/:id/*"
              element={<ApplicationRoutes />}
            />
            {user?.user.roles.includes("Admin") ||
            user?.user.roles.includes("Admission") ||
            user?.user.roles.includes("Visa") ? (
              <>
                <Route
                  path="students/detail/:id/moredetail/*"
                  element={<MoreInfoRoutes />}
                />
              </>
            ) : (
              ""
            )}

            {user?.user.roles.includes("Admin") ||
            user?.user.roles.includes("Finance") ||
            user?.user.roles.includes("Visa") ? (
              <Route path="calendar" element={<LocalCalendar />} />
            ) : (
              ""
            )}

            {user?.user.roles.includes("Admission") ||
            user?.user.roles.includes("Visa") ||
            user?.user.roles.includes("Finance") ? (
              <Route path="applications" element={<ApplicationList />} />
            ) : (
              ""
            )}

            {/* Student */}

            {/* Employee */}
            {user?.user.roles.includes("Admin") ? (
              <>
                <Route path="employees" element={<Employees />} />
                <Route path="employees/add" element={<AddEmployee />} />
                <Route path="employees/edit/:id" element={<EditEmployee />} />
                <Route path="advert" element={<Advert />} />
              </>
            ) : (
              ""
            )}
            {/* Employee */}

            {/* Other */}
            <Route path="notifications" element={<Notification />} />
            <Route
              path="incomingNotification"
              element={<IncomingNotification />}
            />
            <Route path="posts" element={<Post />} />

            <Route path="messages" element={<MessageList />} />
            <Route path="messages/:id" element={<Message />} />
            <Route path="contacts" element={<ContactList />} />

            <Route path="*" element={<ErrorPage />} />
            {/* Other */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
