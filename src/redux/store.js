import { configureStore } from "@reduxjs/toolkit";
import loginReducer from './slices/auth/LoginSlice';
import logoutReducer from './slices/auth/LogoutSlice';
import profileReducer from './slices/profile/GetProfileSlice';
import registerReducer from './slices/auth/RegisterSlice';
import sendOtpReducer from './slices/auth/SendOtpSlice';
import socialLoginReducer from './slices/auth/SocialLoginSlice';
import verifyOtpReducer from './slices/auth/VerifyOtpSlice';
import resetPasswordReducer from './slices/auth/ResetPasswordSlice';
import getDashboardDataReducer from './slices/dashboard/GetDashboardDataSlice';
import addTripReducer from './slices/trips/AddTripSlice';
import getTripsReducer from './slices/trips/GetTripsSlice';
import editTripReducer from './slices/trips/EditTripSlice';
import addExpenseReducer from './slices/expenses/AddExpenseSlice';
import getExpensesReducer from './slices/expenses/GetExpensesSlice';
import deleteExpenseReducer from './slices/expenses/DeleteExpenseSlice';
import editExpenseReducer from './slices/expenses/EditExpenseSlice';
import deleteTripReducer from './slices/trips/DeleteTripSlice';
import addVehicleReducer from './slices/vehicle/AddVehicleSlice';
import getVehiclesReducer from './slices/vehicle/GetVehiclesSlice';
import editVehicleReducer from './slices/vehicle/EditVehicleSlice';
import deleteVehicleReducer from './slices/vehicle/DeleteVehicleSlice';
import getLocationsReducer from './slices/location/GetLocationsSlice';
import addLocationReducer from './slices/location/AddLocationSlice';
import editLocationReducer from './slices/location/EditLocationSlice';
import deleteLocationReducer from './slices/location/DeleteLocationSlice';
import addReadingReducer from './slices/odometer-readings/AddReadingSlice';
import getReadingReducer from './slices/odometer-readings/GetReadingSlice';
import deleteAccountReducer from './slices/auth/DeleteAccountSlice';
import updateProfileReducer from './slices/auth/UpdateProfileSlice';
import changePasswordReducer from './slices/auth/ChangePasswordSlice';
import addRateReducer from './slices/mileage-rates/AddRateSlice';
import customRatesReducer from './slices/mileage-rates/GetCustomRatesSlice';
import updateRateReducer from './slices/mileage-rates/UpdateRateSlice';
import getReportsReducer from './slices/reports/GetReportsSlice';
import addReportReducer from './slices/reports/AddReportSlice';
import addNewTeamReducer from './slices/teams/AddNewTeamSlice';
import teamsListReducer from './slices/teams/GetTeamsListSlice';
import teamsTreeReducer from './slices/teams/GetTeamsTreeSlice';
import parentTeamsReducer from './slices/teams/GetParentTeamsSlice';
import inviteMembersReducer from './slices/teams/members/InviteMembersSlice';
import membersListReducer from './slices/teams/members/GetMembersSlice';
import memberTripsReducer from './slices/teams/members/GetTripsSlice';
import teamMembersReducer from './slices/teams/GetTeamMembersSlice';
import memberExpensesReducer from './slices/teams/members/GetExpensesSlice';
import memberReportsReducer from './slices/teams/members/GetReportsSlice';
import memberInfoReducer from './slices/teams/members/GetInfoSlice';
import addPlacesReducer from './slices/teams/places/AddPlacesSlice';
import placesListReducer from './slices/teams/places/GetPlacesListSlice';
import addCategoryReducer from './slices/teams/category/AddCategorySlice';
import categoryListReducer from './slices/teams/category/GetCategoryListSlice';
import rolesListReducer from './slices/teams/roleAndPermissions/GetListSlice';
import updateTeamNameReducer from './slices/teams/profile/UpdateTeamNameSlice';
import summaryReducer from './slices/teams/summary/GetSummarySlice';
import reportDetailReducer from './slices/reports/GetReportDetailSlice';
import onboardingMembersReducer from './slices/teams/members/GetOnboardingMembersSlice';
import categoriesUploadMultipleReducer from './slices/teams/category/UploadMultipleSlice';
import placesUploadMultipleReducer from './slices/teams/places/UploadMultipleSlice';
import managersListReducer from './slices/teams/profile/GetManagersSlice';
import removeManagerReducer from './slices/teams/profile/RemoveManagerSlice';
import getContentReducer from './slices/auth/GetContentSlice';
import exportsReducer from './slices/teams/export/GetExportSlice';
import summaryReportReducer from './slices/teams/export/GenerateSummaryReportSlice';
import updateReadingreducer from './slices/odometer-readings/UpdateReadingSlice';
import deleteReadingreducer from './slices/odometer-readings/DeleteReadingSlice';
import subscriptionPlansReducer from './slices/subscriptions/GetPlansSlice';
import upgradePlanReducer from './slices/subscriptions/UpgradePlanSlice';
import memberReportReducer from './slices/teams/export/GenerateMemberReportSlice';
import membersDropdownReducer from './slices/teams/members/GetDropdownSlice';
import updateReportReducer from './slices/reports/UpdateReportSlice';
import deleteReportReducer from './slices/reports/DeleteReportSlice';
import generatePdfReportReducer from './slices/reports/GeneratePdfReportSlice';
import generateXlsReportReducer from './slices/reports/GenerateXlsReportSlice';
import mailReportReducer from './slices/reports/ReportMailSlice';
import subscriptionSuccessReducer from './slices/auth/SubscriptionSuccessSlice';
import updateInfoReducer from './slices/teams/members/UpdateInfoSlice';
import tripsToReportReducer from './slices/reports/AddTripsSlice';
import expensesToReportReducer from './slices/reports/AddExpensesSlice';
import submitReportReducer from './slices/reports/SubmitReportSlice';
import reimbursementListReducer from './slices/teams/reimbursement/GetListSlice';
import checkInvitationReducer from './slices/auth/GetInvitationsSlice';
import acceptInvitationReducer from './slices/auth/AcceptInvitationSlice';
import rejectInvitationReducer from './slices/auth/RejectInvitationSlice';
import reimbursementSubmitReducer from './slices/teams/reimbursement/SubmitSlice';
import renameReportReducer from './slices/reports/RenamReportSlice';
import updateLoginReducer from './slices/auth/UpdateLoginSlice';
import reimbursementGraphDataReducer from './slices/teams/reimbursement/GetGraphDataSlice';
import notificationPreferenceReducer from './slices/auth/UpdateNotificationSlice';

export const store = configureStore({
    reducer: {
        login: loginReducer,
        register: registerReducer,
        socialLogin: socialLoginReducer,
        sendOtp: sendOtpReducer,
        verifyOtp: verifyOtpReducer,
        resetPassword: resetPasswordReducer,
        changePassword: changePasswordReducer,
        logout: logoutReducer,
        profile: profileReducer,
        updateProfile: updateProfileReducer,
        getDashboardData: getDashboardDataReducer,
        addTrip: addTripReducer,
        subscriptionSuccess: subscriptionSuccessReducer,
        getTrips: getTripsReducer,
        editTrip: editTripReducer,
        deleteTrip: deleteTripReducer,
        addExpense: addExpenseReducer,
        getExpenses: getExpensesReducer,
        deleteExpense: deleteExpenseReducer,
        editExpense: editExpenseReducer,
        addVehicle: addVehicleReducer,
        getVehicles: getVehiclesReducer,
        editVehicle: editVehicleReducer,
        deleteVehicle: deleteVehicleReducer,
        getLocations: getLocationsReducer,
        addLocation: addLocationReducer,
        editLocation: editLocationReducer,
        deleteLocation: deleteLocationReducer,
        addReading: addReadingReducer,
        getReading: getReadingReducer,
        updateReading: updateReadingreducer,
        deleteReading: deleteReadingreducer,
        deleteAccount: deleteAccountReducer,
        addRate: addRateReducer,
        customRates: customRatesReducer,
        updateRate: updateRateReducer,
        getReports: getReportsReducer,
        updateReport: updateReportReducer,
        deleteReport: deleteReportReducer,
        addReport: addReportReducer,
        tripsToReport: tripsToReportReducer,
        expensesToReport: expensesToReportReducer,
        submitReport: submitReportReducer,
        generatePdfReport: generatePdfReportReducer,
        generateXlsReport: generateXlsReportReducer,
        mailReport: mailReportReducer,
        addNewTeam: addNewTeamReducer,
        teamsList: teamsListReducer,
        teamsTree: teamsTreeReducer,
        parentTeams: parentTeamsReducer,
        inviteMembers: inviteMembersReducer,
        membersList: membersListReducer,
        memberTrips: memberTripsReducer,
        updateInfo: updateInfoReducer,
        teamMembers: teamMembersReducer,
        memberExpenses: memberExpensesReducer,
        memberReports: memberReportsReducer,
        memberInfo: memberInfoReducer,
        addPlace: addPlacesReducer,
        placesList: placesListReducer,
        addCategory: addCategoryReducer,
        categoryList: categoryListReducer,
        rolesList: rolesListReducer,
        updateTeamName: updateTeamNameReducer,
        summary: summaryReducer,
        reportDetail: reportDetailReducer,
        onboardingMembers: onboardingMembersReducer,
        categoriesUploadMultiple: categoriesUploadMultipleReducer,
        placesUploadMultiple: placesUploadMultipleReducer,
        managersList: managersListReducer,
        removeManager: removeManagerReducer,
        getContent: getContentReducer,
        exports: exportsReducer,
        summaryReport: summaryReportReducer,
        memberReport: memberReportReducer,
        subscriptionPlans: subscriptionPlansReducer,
        upgradePlan: upgradePlanReducer,
        membersDropdown: membersDropdownReducer,
        reimbursementList: reimbursementListReducer,
        checkInvitation: checkInvitationReducer,
        acceptInvitation: acceptInvitationReducer,
        rejectInvitation: rejectInvitationReducer,
        reimbursementSubmit: reimbursementSubmitReducer,
        renameReport: renameReportReducer,
        updateLogin: updateLoginReducer,
        reimbursementGraphData: reimbursementGraphDataReducer,
        notificationPreference: notificationPreferenceReducer
    }
})