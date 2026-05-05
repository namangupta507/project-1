import { createBrowserRouter } from "react-router-dom";
import Login from "./screen/Login";
import ProtectedRoute from "./api/protectedRoute";
import Dashboard from "./screen/Dashboard";
import Layout from "./components/Layout";
import Trips from "./screen/Trips";
import Expenses from "./screen/Expenses";
import OdometerReading from "./screen/OdometerReading";
import UnderDevelopment from "./components/UnderDevelopment";
import Register from "./screen/Register";
import ForgotPassword from "./screen/SendOtp";
import VerifyOtp from "./screen/VerifyOtp";
import SendOtp from "./screen/SendOtp";
import ResetPassword from "./screen/ResetPassword";
import WelcomeBanners from "./screen/WelcomeBanners";
import AppleLoginSuccess from "./screen/AppleLogin";
import AppleCallback from "./screen/AppleCallback";
import AddOdometerReading from "./screen/AddOdometerReading";
import Vehicle from "./screen/Vehicle";
import Location from "./screen/Location";
import MileageRates from "./screen/MileageRates";
import Profile from "./screen/Profile";
import ChangePassword from "./screen/ChangePassword";
import Reports from "./screen/Reports";
import TeamsLayout from "./components/Teams/Layout";
import Home from "./screen/Teams Management/Home";
import Summary from "./screen/Teams Management/Summary";
import Teams from "./screen/Teams Management/Teams";
import Reimbursement from "./screen/Teams Management/Reimbursement";
import Members from "./screen/Teams Management/Members";
import DataExports from "./screen/Teams Management/DataExports";
import TeamsProfile from "./screen/Teams Management/Profile";
import Places from "./screen/Teams Management/Places";
import Categories from "./screen/Teams Management/Categories";
import InviteMembers from "./screen/Teams Management/InviteMembers";
import RolesAndPermissions from "./screen/Teams Management/RolesAndPermissions";
import ReportDetail from "./screen/ReportDetail";
import Content from "./screen/Content";
import Notifications from "./screen/Notifications";
import Subscriptions from "./screen/Subscriptions";
import EditOdometerReading from "./screen/EditOdometerReading";
import SubscriptionSuccess from "./components/SubscriptionSuccess";
import ReimbursementDetail from "./screen/Teams Management/ReimbursementDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/send-otp",
        element: <SendOtp />
    },
    {
        path: "/verify-otp",
        element: <VerifyOtp />
    },
    {
        path: "/reset-password",
        element: <ResetPassword />
    },
    {
        path: "/auth/apple/callback",
        element: <AppleCallback />
    },
    {
        path: "/terms",
        element: <Content privacyType="termsAndCondition" />
    },
    {
        path: "/privacy",
        element: <Content privacyType="privacyPolicy" />
    },
    // {
    //     path: "/google-maps",
    //     element: <GoogleMaps />
    // },
    {
        path: "/home",
        element: <ProtectedRoute element={<WelcomeBanners />} />
    },
    {
        path: '/success',
        element: <AppleLoginSuccess />
    },
    {
        path: '/payment/success',
        element: <SubscriptionSuccess />
    },
    {
        path: '/dashboard',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ProtectedRoute element={<Dashboard />} />
            },
            {
                path: 'profile',
                element: <ProtectedRoute element={<Profile />} />
            },
            {
                path: 'notifications',
                element: <ProtectedRoute element={<Notifications />} />
            },
            {
                path: 'subscriptions',
                element: <ProtectedRoute element={<Subscriptions />} />
            },
            {
                path: 'change-password',
                element: <ProtectedRoute element={<ChangePassword />} />
            },
            {
                path: 'trips',
                element: <ProtectedRoute element={<Trips />} />
            },
            {
                path: 'expenses',
                element: <ProtectedRoute element={<Expenses />} />
            },
            {
                path: 'reports',
                // element: <ProtectedRoute element={<Members />} />,
                children: [
                    {
                        index: true,
                        element: <ProtectedRoute element={<Reports />} />
                    },
                    {
                        path: 'detail/:id',
                        element: <ProtectedRoute element={<ReportDetail />} />
                    },
                ]
            },
            {
                path: 'odometer-reading',
                element: <ProtectedRoute element={<OdometerReading />} />
            },
            {
                path: 'add-odometer-reading',
                element: <ProtectedRoute element={<AddOdometerReading />} />
            },
            {
                path: 'update-delete-odometer-reading/:id',
                element: <ProtectedRoute element={<EditOdometerReading />} />
            },
            {
                path: 'reporting',
                children: [
                    {
                        path: 'vehicle',
                        element: <ProtectedRoute element={<Vehicle />} />,
                    },
                    {
                        path: 'location',
                        element: <ProtectedRoute element={<Location />} />,
                    },
                    {
                        path: 'mileage-rates',
                        element: <ProtectedRoute element={<MileageRates />} />,
                    },
                ]
            },
            {
                path: 'support',
                children: [
                    {
                        path: 'about',
                        element: <ProtectedRoute element={<Content privacyType="aboutUs" />} />,
                    },
                    {
                        path: 'privacy',
                        element: <ProtectedRoute element={<Content privacyType="privacyPolicy" />} />,
                    },
                    {
                        path: 'terms',
                        element: <ProtectedRoute element={<Content privacyType="termsAndCondition" />} />,
                    },
                    // {
                    //     path: 'contact',
                    //     element: < ProtectedRoute element={< UnderDevelopment />} />,
                    // },
                ]
            }]
    },
    {
        path: '/dashboard/teams',
        element: <TeamsLayout />,
        children: [
            {
                index: true,
                element: <ProtectedRoute element={<Home />} />
            },
            {
                path: 'summary',
                element: <ProtectedRoute element={<Summary />} />
            },
            {
                path: 'teams',
                element: <ProtectedRoute element={<Teams />} />
            },
            {
                path: 'reimbursement',
                children: [
                    {
                        index: true,
                        element: <ProtectedRoute element={<Reimbursement />} />
                    },
                    {
                        path: 'detail/:id',
                        element: <ProtectedRoute element={<ReimbursementDetail />} />
                    },
                ]
            },
            {
                path: 'members',
                // element: <ProtectedRoute element={<Members />} />,
                children: [
                    {
                        index: true,
                        element: <ProtectedRoute element={<Members />} />
                    },
                    {
                        path: 'invite',
                        element: <ProtectedRoute element={<InviteMembers />} />
                    },
                ]
            },
            {
                path: 'data-exports',
                element: <ProtectedRoute element={<DataExports />} />
            },
            {
                path: 'profile',
                element: <ProtectedRoute element={<TeamsProfile />} />
            },
            {
                path: 'places',
                element: <ProtectedRoute element={<Places />} />
            },
            {
                path: 'categories',
                element: <ProtectedRoute element={<Categories />} />
            },
            {
                path: 'roles-permissions',
                element: <ProtectedRoute element={<RolesAndPermissions />} />
            },
        ]
    }
])

export default router;