import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GetMembersListApi } from '../../redux/actions/teams/members/GetMembersAction';
import { useDispatch, useSelector } from 'react-redux';
import { PulseLoader } from 'react-spinners';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { GetMemberTripsApi } from '../../redux/actions/teams/members/GetTripsAction';
import { GetMemberExpensesApi } from '../../redux/actions/teams/members/GetExpensesAction';
import { GetMemberReportsApi } from '../../redux/actions/teams/members/GetReportsAction';
import { cleanFieldResponse } from '@mui/x-date-pickers/internals';
import { GetMemberInfoApi } from '../../redux/actions/teams/members/GetInfoAction';
import { useEventCallback } from '@mui/material';
import { showErrorToast, showSuccessToast } from '../../helpers/toast';
import { GetOnboardingMembersListApi } from '../../redux/actions/teams/members/GetOnboardingMembersAction';
import TripsImageModal from '../../components/TripsImageModal';
import { AuthContext } from '../../context/AuthContext';
import { UpdateInfoAPI } from '../../redux/actions/teams/members/UpdateInfoAction';
import { updateInfoStateReset } from '../../redux/slices/teams/members/UpdateInfoSlice';
import { vi } from 'date-fns/locale';

const Members = () => {
    const columns = ['Name', 'Team', 'Status', 'Roles', 'Emplyee Id', 'Phone Number'];
    const columnsOnboarding = ['Email', 'Role', 'Status'];
    const tripColumns = ['Date', 'Miles', 'Locations', 'Maps']
    const expenseColumns = ['Date', 'Merchant', 'Transaction Amount', 'Purpose']
    const reportColumns = ['Date', 'Merchant', 'Transaction Amount', 'Purpose'];
    const dispatch = useDispatch();
    const location = useLocation();
    const { id, viewProfile } = location.state || {};
    const { userId } = useContext(AuthContext);
    const { response, loading, error } = useSelector((state) => state.membersList);
    const { response: onboardingResponse, loading: onboardingLoading, error: onboardingError } = useSelector((state) => state.onboardingMembers);
    const { response: tripsResponse, loading: tripsLoading, error: tripsError } = useSelector((state) => state.memberTrips);
    const { response: expensesResponse, loading: expensesLoading, error: expensesError } = useSelector((state) => state.memberExpenses);
    const { response: reportsResponse, loading: reportsLoading, error: reportsError } = useSelector((state) => state.memberReports);
    const { response: infoResponse, loading: infoLoading, error: infoError } = useSelector((state) => state.memberInfo);
    const { response: updateInfoResponse, loading: updateInfoLoading, error: updateInfoError } = useSelector((state) => state.updateInfo);
    const [membersList, setMembersList] = useState([]);
    const [onboardingList, setOnboardingList] = useState([]);
    const [allMembers, setAllMembers] = useState(0);
    const [onboarding, setOnboarding] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLImit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [validationErrors, setValidationErrors] = useState('');

    const [currentPageOnboarding, setCurrentPageOnboarding] = useState(1);
    const [limitOnboarding, setLImitOnboarding] = useState(5);
    const [totalPagesOnboarding, setTotalPagesOnboarding] = useState(1);
    const [totalItemsOnboarding, setTotalItemsOnboarding] = useState(1);

    const [tripsList, setTripsList] = useState([]);
    const [currentPageTrips, setCurrentPageTrips] = useState(1);
    const [limitTrips, setLImitTrips] = useState(5);
    const [totalPagesTrips, setTotalPagesTrips] = useState(1);
    const [totalItemsTrips, setTotalItemsTrips] = useState(1);

    const [expensesList, setExpensesList] = useState([]);
    const [currentPageExpenses, setCurrentPageExpenses] = useState(1);
    const [limitExpenses, setLImitExpenses] = useState(5);
    const [totalPagesExpenses, setTotalPagesExpenses] = useState(1);
    const [totalItemsExpenses, setTotalItemsExpenses] = useState(1);

    const [reportsList, setReportsList] = useState([]);
    const [currentPageReports, setCurrentPageReports] = useState(1);
    const [limitReports, setLImitReports] = useState(5);
    const [totalPagesReports, setTotalPagesReports] = useState(1);
    const [totalItemsReports, setTotalItemsReports] = useState(1);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [empId, setEmpId] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [miles, setMiles] = useState('');
    const [roles, setRoles] = useState('');
    const [team, setTeam] = useState('');
    const [manager, setManager] = useState([]);
    const [search, setSearch] = useState('');
    const [searchOnboarding, setSearchOnboarding] = useState('');

    const [rowClick, setRowClick] = useState(true);
    const [selectedMember, setSelectedMember] = useState(null);
    const [activeParent, setActiveParent] = useState('all');
    const [activeTab, setActiveTab] = useState('trips');
    const [selectedTripLocations, setSelectedTripLocations] = useState(null);

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleLimitChange = (newLimit) => {
        setLImit(newLimit);
        setCurrentPage(1);
    }

    const handleOnboardingPageChange = (page) => {
        setCurrentPageOnboarding(page)
    }

    const handleOnboardingLimitChange = (newLimit) => {
        setLImitOnboarding(newLimit);
        setCurrentPageOnboarding(1);
    }

    const handleTripsPageChange = (page) => {
        setCurrentPageTrips(page)
    }

    const handleTripsLimitChange = (newLimit) => {
        setLImitTrips(newLimit);
        setCurrentPageTrips(1);
    }

    const handleExpensesPageChange = (page) => {
        setCurrentPageExpenses(page)
    }

    const handleExpensesLimitChange = (newLimit) => {
        setLImitExpenses(newLimit);
        setCurrentPageExpenses(1);
    }

    const handleReportPageChange = (page) => {
        setCurrentPageReports(page)
    }

    const handleReportLimitChange = (newLimit) => {
        setLImitReports(newLimit);
        setCurrentPageReports(1);
    }

    const handleDownload = () => {
        if (!selectedMember) return;

        let dataToExport = [];
        let fileName = `${selectedMember.name}_`;

        switch (activeTab) {
            case 'trips':
                if (!tripsList || tripsList.length === 0) return;
                dataToExport = tripsList;
                fileName += 'trips.csv';
                break;
            case 'expenses':
                if (!expensesList || expensesList.length === 0) return;
                dataToExport = expensesList;
                fileName += 'expenses.csv';
                break;
            case 'reports':
                if (!reportsList || reportsList.length === 0) return;
                dataToExport = reportsList;
                fileName += 'reports.csv';
                break;
            case 'info':
                dataToExport = [selectedMember]; // exporting member info as single row
                fileName += 'info.csv';
                break;
            default:
                return;
        }

        // Convert data to CSV
        const headers = Object.keys(dataToExport[0]).join(',');
        const rows = dataToExport.map(row => Object.values(row).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isDownloadDisabled = () => {
        switch (activeTab) {
            case 'trips': return !tripsList || tripsList.length === 0;
            case 'expenses': return !expensesList || expensesList.length === 0;
            case 'reports': return !reportsList || reportsList.length === 0;
            case 'info': return !selectedMember;
            default: return true;
        }
    };


    const validateForm = () => {
        const newErrors = {};

        if (!firstName) {
            newErrors.firstName = 'First name is required';
        }
        if (!lastName) {
            newErrors.lastName = 'Last name is required';
        }
        if (!empId) {
            newErrors.empId = 'Employee Id is required';
        }
        if (!state) {
            newErrors.state = 'State is required';
        }
        if (!zipCode) {
            newErrors.zipCode = 'Zip code is required';
        }
        if (!miles) {
            newErrors.miles = 'Miles are required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab)

        switch (tab) {
            case 'trips':
                setCurrentPageTrips(1);
                setLImitTrips(5);
                break;
            case 'expenses':
                setCurrentPageExpenses(1);
                setLImitExpenses(5);
                break;
            case 'reports':
                setCurrentPageReports(1);
                setLImitReports(10);
                break;
            // case 'info':

            //     break;
            default:
                break;
        }
    }

    const handleParentChange = (tab) => {
        setActiveParent(tab)

        switch (tab) {
            case 'all':
                setCurrentPage(1);
                setLImit(5);
                setSearch('');
                break;
            case 'onboarding':
                setCurrentPageOnboarding(1);
                setLImitOnboarding(5);
                setSearchOnboarding('');
                break;
            default:
                break;
        }
    }

    const fetchMembers = async () => {
        try {
            await dispatch(GetMembersListApi({ page: currentPage, limit: limit, search: search }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    const fetchOnboardingMembers = async () => {
        try {
            await dispatch(GetOnboardingMembersListApi({ page: currentPageOnboarding, limit: limitOnboarding, search: searchOnboarding }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleUpdateInfo = async () => {
        if (!validateForm()) return;
        try {
            await dispatch(UpdateInfoAPI({ fullName: `${firstName} ${lastName}`, email: email, empId: empId, state: state, zipCode: zipCode, annualBusinessMiles: miles, role: roles, isActive: true }, { userId: userId }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    useEffect(() => {
        if (activeParent === 'all') {
            fetchMembers()
        }
        if (activeParent === 'onboarding') {
            fetchOnboardingMembers()
        }
    }, [currentPage, limit, currentPageOnboarding, limitOnboarding, activeParent, search, searchOnboarding, updateInfoResponse])

    useEffect(() => {
        if (response) {
            setMembersList(response?.data);
            setCurrentPage(response?.pagination?.page);
            setAllMembers(response?.pagination?.totalActive);
            setOnboarding(response?.pagination?.onBoardingUsers);
            setLImit(response?.pagination?.limit);
            setTotalPages(response?.pagination?.totalPages);
            setTotalItems(response?.pagination?.total)
        }
    }, [response])

    useEffect(() => {
        if (onboardingResponse) {
            setOnboardingList(onboardingResponse?.data);
            setCurrentPageOnboarding(onboardingResponse?.pagination?.page);
            setLImitOnboarding(onboardingResponse?.pagination?.limit);
            setTotalPagesOnboarding(onboardingResponse?.pagination?.totalPages);
            setTotalItemsOnboarding(onboardingResponse?.pagination?.total)
        }
    }, [onboardingResponse])

    useEffect(() => {
        if (selectedMember) {
            if (activeTab === 'trips') {
                dispatch(GetMemberTripsApi({ page: currentPageTrips, limit: limitTrips, id: selectedMember._id }))
            }
            if (activeTab === 'expenses') {
                dispatch(GetMemberExpensesApi({ page: currentPageExpenses, limit: limitExpenses, id: selectedMember._id, type: 'expense' }))
            }
            if (activeTab === 'reports') {
                dispatch(GetMemberReportsApi({ page: currentPageReports, limit: limitReports, id: selectedMember._id, type: 'trip' }))
            }
            if (activeTab === 'info') {
                dispatch(GetMemberInfoApi({ id: selectedMember._id }))
            }
        }
    }, [selectedMember, activeTab, currentPageTrips, limitTrips, currentPageExpenses, limitExpenses, currentPageReports, limitReports, updateInfoResponse])

    useEffect(() => {
        if (id && viewProfile) {
            const offcanvasEl = document.getElementById('memberInfo');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.show();
            }
            if (activeTab === 'trips') {
                dispatch(GetMemberTripsApi({ page: currentPageTrips, limit: limitTrips, id: id }))
            }
            if (activeTab === 'expenses') {
                dispatch(GetMemberExpensesApi({ page: currentPageExpenses, limit: limitExpenses, id: id, type: 'expense' }))
            }
            if (activeTab === 'reports') {
                dispatch(GetMemberReportsApi({ page: currentPageReports, limit: limitReports, id: id, type: 'trip' }))
            }
            if (activeTab === 'info') {
                dispatch(GetMemberInfoApi({ id: id }))
            }
        }
    }, [activeTab, currentPageTrips, limitTrips, currentPageExpenses, limitExpenses, currentPageReports, limitReports, updateInfoResponse, id, viewProfile])

    useEffect(() => {
        if (tripsResponse) {
            setTripsList(tripsResponse?.data?.data);
            setCurrentPageTrips(tripsResponse?.data?.pagination?.page);
            setLImitTrips(tripsResponse?.data?.pagination?.limit);
            setTotalPagesTrips(tripsResponse?.data?.pagination?.totalPages);
            setTotalItemsTrips(tripsResponse?.data?.pagination?.total)
        }
    }, [tripsResponse])

    useEffect(() => {
        if (expensesResponse) {
            setExpensesList(expensesResponse?.data?.data);
            setCurrentPageExpenses(expensesResponse?.data?.pagination?.page);
            setLImitExpenses(expensesResponse?.data?.pagination?.limit);
            setTotalPagesExpenses(expensesResponse?.data?.pagination?.totalPages);
            setTotalItemsExpenses(expensesResponse?.data?.pagination?.total)
        }
    }, [expensesResponse])


    useEffect(() => {
        if (reportsResponse) {
            setReportsList(reportsResponse?.data?.data);
            setCurrentPageReports(reportsResponse?.data?.pagination?.page);
            setLImitReports(reportsResponse?.data?.pagination?.limit);
            setTotalPagesReports(reportsResponse?.data?.pagination?.totalPages);
            setTotalItemsReports(reportsResponse?.data?.pagination?.total)
        }
    }, [reportsResponse])

    useEffect(() => {
        if (infoResponse) {
            setFirstName(infoResponse?.personal?.firstName || '');
            setLastName(infoResponse?.personal?.lastName || '');
            setEmail(infoResponse?.personal?.email || '');
            setEmpId(infoResponse?.personal?.empId || '');
            setZipCode(infoResponse?.personal?.zipCode || '');
            setState(infoResponse?.personal?.state);
            setMiles(infoResponse?.personal?.annualBusinessMiles || 0);
            // setRoles(infoResponse?.team?.roles || '');
            setTeam(infoResponse?.team?.team || '')
            setManager(infoResponse?.team?.manager?.join(', ') || '');
            switch (infoResponse?.team?.role) {
                case 1:
                    setRoles('Super Admin')
                    break;
                case 2:
                    setRoles('Owner')
                    break;
                case 3:
                    setRoles('Team Manager')
                    break;
                case 4:
                    setRoles('Manager Limited')
                    break;
                case 5:
                    setRoles('Member')
                    break;
                default:
                    setRoles('Owner')
            }
        }
    }, [infoResponse])


    useEffect(() => {
        if (updateInfoResponse) {
            showSuccessToast(updateInfoResponse?.message)
            dispatch(updateInfoStateReset());
        }
    }, [updateInfoResponse])

    useEffect(() => {
        if (updateInfoError) {
            showErrorToast(updateInfoError?.message)
            dispatch(updateInfoStateReset());
        }
    }, [updateInfoError])
    return (
        <>
            <div className="content-wrapper">
                <section className="main-section spacer-y">
                    <div className="container">
                        <div className="row gy-4">
                            <div className="col-xl-12">
                                <div className="common_main_heading_wrapper align-items-start">
                                    <ul className="common_nav_tab big_nav_tab nav nav-pills mb-0 gap-1" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeParent === 'all' ? 'active' : ''}`} id="pills-1-tab" data-bs-toggle="pill" data-bs-target="#pills-1" type="button" role="tab" aria-controls="pills-1" aria-selected="true" onClick={() => handleParentChange('all')}>All Members <span>{allMembers || 0}</span></button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeParent === 'onboarding' ? 'active' : ''}`} id="pills-2-tab" data-bs-toggle="pill" data-bs-target="#pills-2" type="button" role="tab" aria-controls="pills-2" aria-selected="false" onClick={() => handleParentChange('onboarding')}>Onboardings <span>{onboarding || 0}</span></button>
                                        </li>
                                    </ul>
                                    <div className="d-flex flex-end gap-3">
                                        <Link to='/dashboard/teams/members/invite' className="primary-btn">Invite members</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="tab-content common_tab_content" id="pills-tabContent">
                                    {activeParent === 'all' &&
                                        <div className="tab-pane fade show active" id="pills-1" role="tabpanel" aria-labelledby="pills-1-tab" tabIndex={0}>
                                            <div className="common-table-filter-wrapper">
                                                <div className="common-left-blk">
                                                    <div className="common-sort-blk">
                                                        <div className="common-search-blk">
                                                            <input type="search" className="form-control" id="search" placeholder="Search"
                                                                value={search} onKeyDown={(e) => {

                                                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onChange={(e) => setSearch(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className="common-right-blk">
                                                    <div className="common-sort-blk">
                                                        <select className="form-select">
                                                            <option value="Invites">Invites</option>
                                                        </select>
                                                    </div>
                                                    <button className="filter_action_btn filter_btn">Filter</button>
                                                    <button className="filter_action_btn export_btn">Export</button>
                                                    <div className="edit_column_blk">
                                                        <button className="filter_action_btn edit_column_btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Edit Columns</button>
                                                        <ul className="select_table_column_blk dropdown-menu dropdown-menu-end">
                                                            <li className="tbl_check_item">
                                                                <input type="checkbox" className="d-none" id="tableColumn_1" />
                                                                <label htmlFor="tableColumn_1">
                                                                    <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                    <span className="tbl_col_text">Name</span>
                                                                </label>
                                                            </li>
                                                            <li className="tbl_check_item">
                                                                <input type="checkbox" className="d-none" id="tableColumn_2" />
                                                                <label htmlFor="tableColumn_2">
                                                                    <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                    <span className="tbl_col_text">Team</span>
                                                                </label>
                                                            </li>
                                                            <li className="tbl_check_item">
                                                                <input type="checkbox" className="d-none" id="tableColumn_3" />
                                                                <label htmlFor="tableColumn_3">
                                                                    <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                    <span className="tbl_col_text">Status</span>
                                                                </label>
                                                            </li>
                                                            <li className="tbl_check_item">
                                                                <input type="checkbox" className="d-none" id="tableColumn_4" />
                                                                <label htmlFor="tableColumn_4">
                                                                    <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                    <span className="tbl_col_text">Roles</span>
                                                                </label>
                                                            </li>
                                                            <li className="tbl_check_item">
                                                                <input type="checkbox" className="d-none" id="tableColumn_5" />
                                                                <label htmlFor="tableColumn_5">
                                                                    <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                    <span className="tbl_col_text">Employee ID</span>
                                                                </label>
                                                            </li>
                                                            <li className="tbl_check_item">
                                                                <input type="checkbox" className="d-none" id="tableColumn_6" />
                                                                <label htmlFor="tableColumn_6">
                                                                    <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                    <span className="tbl_col_text">Phone Number</span>
                                                                </label>
                                                            </li>
                                                            <li className="tbl_check_item">
                                                                <button className="outline-btn w-100 py-2">Apply</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div> */}
                                            </div>
                                            {
                                                loading
                                                    ? (
                                                        // Show loading spinner while data is being fetched
                                                        <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                            <PulseLoader size={25} color="#49a496" />
                                                        </div >
                                                    ) : error ? (
                                                        // Display error message if there is an issue fetching data
                                                        <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                            <p className='text-danger'>Something went wrong</p>
                                                        </div>
                                                    ) :
                                                        <>
                                                            <Table
                                                                tableData={membersList}
                                                                setDataList={setMembersList}
                                                                limit={limit}
                                                                columns={columns}
                                                                currentPage={currentPage}
                                                                handlePageChange={handlePageChange}
                                                                setLimit={handleLimitChange}
                                                                rowClick={rowClick}
                                                                targetMemberId='memberInfo'
                                                                setSelectedMember={setSelectedMember}
                                                            />
                                                            {membersList?.length > 0 &&
                                                                <Pagination
                                                                    currentPage={currentPage}
                                                                    totalPages={totalPages}
                                                                    limit={limit}
                                                                    totalItems={totalItems}
                                                                    handlePageChange={handlePageChange}
                                                                    handleLimitChange={handleLimitChange}
                                                                />
                                                            }

                                                        </>
                                            }
                                        </div>
                                    }
                                    <div className="tab-pane fade" id="pills-2" role="tabpanel" aria-labelledby="pills-2-tab" tabIndex={0}>
                                        <div className="common-table-filter-wrapper">
                                            <div className="common-left-blk">
                                                <div className="common-sort-blk">
                                                    <div className="common-search-blk">
                                                        <input type="search" className="form-control" id="search" placeholder="Search"
                                                            value={searchOnboarding} onKeyDown={(e) => {

                                                                if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onChange={(e) => setSearchOnboarding(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            onboardingLoading
                                                ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : onboardingError ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <>
                                                        <Table
                                                            tableData={onboardingList}
                                                            setDataList={setOnboardingList}
                                                            limit={limitOnboarding}
                                                            columns={columnsOnboarding}
                                                            currentPage={currentPageOnboarding}
                                                            handlePageChange={handleOnboardingPageChange}
                                                            setLimit={handleOnboardingLimitChange}
                                                        // rowClick={rowClick}
                                                        // targetMemberId='memberInfo'
                                                        // activeTab={activeTab}
                                                        // setSelectedMember={setSelectedMember}
                                                        />
                                                        {onboardingList?.length > 0 &&
                                                            <Pagination
                                                                currentPage={currentPageOnboarding}
                                                                totalPages={totalPagesOnboarding}
                                                                limit={limitOnboarding}
                                                                totalItems={totalItemsOnboarding}
                                                                handlePageChange={handleOnboardingPageChange}
                                                                handleLimitChange={handleOnboardingLimitChange}
                                                            />
                                                        }

                                                    </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>


            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="memberInfo" aria-labelledby="memberInfoLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => {
                        setSelectedMember(null);
                        setActiveTab('trips')
                    }} />
                </div>
                <div className="offcanvas-body p-0">
                    <div className="offcanvas_top_header px-4 py-3 mb-0">
                        <h2>{selectedMember?.name}</h2>
                        <div className="canvas_action_btn">
                            <button className="no_bg-btn"><img src="/assets/images/download-icon.svg" alt="Download" onClick={handleDownload} disabled={isDownloadDisabled()} /></button>
                        </div>
                    </div>
                    <div className="canvas_nav_tab_blk">
                        <ul className="nav nav-pills gap-3 mb-0" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className={`nav-link ${activeTab === 'trips' ? 'active' : ''}`} onClick={() => handleTabChange('trips')} id="pills-canvas-1-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-1" type="button" role="tab" aria-controls="pills-canvas-1" aria-selected="true">Trips</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => handleTabChange('expenses')} id="pills-canvas-2-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-2" type="button" role="tab" aria-controls="pills-canvas-2" aria-selected="false">Expenses</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => handleTabChange('reports')} id="pills-canvas-3-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-3" type="button" role="tab" aria-controls="pills-canvas-3" aria-selected="false">Reports</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className={`nav-link ${activeTab === 'info' ? 'active' : ''}`} onClick={() => handleTabChange('info')} id="pills-canvas-4-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-4" type="button" role="tab" aria-controls="pills-canvas-4" aria-selected="false">Member Info</button>
                            </li>
                        </ul>
                    </div>
                    <div className="canvas_nav_tab_content">
                        <div className="tab-content" id="pills-tabContent">
                            <div className={`tab-pane fade ${activeTab === 'trips' ? 'show active' : ''}`} id="pills-canvas-1" role="tabpanel" aria-labelledby="pills-canvas-1-tab" tabIndex={0}>
                                <h3 className="fs-6 fw-semibold mb-3">Trips</h3>
                                {/* <div className="common-table-filter-wrapper">
                                    <div className="common-left-blk">
                                        <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button>
                                    </div>
                                </div> */}
                                {
                                    tripsLoading
                                        ? (
                                            // Show loading spinner while data is being fetched
                                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                <PulseLoader size={25} color="#49a496" />
                                            </div >
                                        ) : tripsError ? (
                                            // Display error message if there is an issue fetching data
                                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                <p className='text-danger'>Something went wrong</p>
                                            </div>
                                        ) :
                                            <>
                                                <Table
                                                    tableData={tripsList}
                                                    setDataList={setTripsList}
                                                    limit={limitTrips}
                                                    columns={tripColumns}
                                                    currentPage={currentPageTrips}
                                                    handlePageChange={handleTripsPageChange}
                                                    setLimit={handleTripsLimitChange}
                                                // setSelectedTripLocations={setSelectedTripLocations}
                                                />
                                                {tripsList?.length > 0 &&
                                                    <Pagination
                                                        currentPage={currentPageTrips}
                                                        totalPages={totalPagesTrips}
                                                        limit={limitTrips}
                                                        totalItems={totalItemsTrips}
                                                        handlePageChange={handleTripsPageChange}
                                                        handleLimitChange={handleTripsLimitChange}
                                                    />
                                                }

                                            </>
                                }
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'expenses' ? 'show active' : ''}`} id="pills-canvas-2" role="tabpanel" aria-labelledby="pills-canvas-2-tab" tabIndex={0}>
                                <h3 className="fs-6 fw-semibold mb-3">Expenses</h3>
                                {/* <div className="common-table-filter-wrapper">
                                    <div className="common-left-blk">
                                        <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button>
                                    </div>
                                </div> */}
                                {
                                    expensesLoading
                                        ? (
                                            // Show loading spinner while data is being fetched
                                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                <PulseLoader size={25} color="#49a496" />
                                            </div >
                                        ) : expensesError ? (
                                            // Display error message if there is an issue fetching data
                                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                <p className='text-danger'>Something went wrong</p>
                                            </div>
                                        ) :
                                            <>
                                                <Table
                                                    tableData={expensesList}
                                                    setDataList={setExpensesList}
                                                    limit={limitExpenses}
                                                    columns={expenseColumns}
                                                    currentPage={currentPageExpenses}
                                                    handlePageChange={handleExpensesPageChange}
                                                    setLimit={handleExpensesLimitChange}
                                                />
                                                {expensesList?.length > 0 &&
                                                    <Pagination
                                                        currentPage={currentPageTrips}
                                                        totalPages={totalPagesExpenses}
                                                        limit={limitExpenses}
                                                        totalItems={totalItemsExpenses}
                                                        handlePageChange={handleExpensesPageChange}
                                                        handleLimitChange={handleExpensesLimitChange}
                                                    />
                                                }

                                            </>
                                }
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'reports' ? 'show active' : ''}`} id="pills-canvas-3" role="tabpanel" aria-labelledby="pills-canvas-3-tab" tabIndex={0}>
                                <h3 className="fs-6 fw-semibold mb-3">Reports</h3>
                                {/* <div className="common-table-filter-wrapper">
                                    <div className="common-left-blk">
                                        <div>
                                            <h4 className="fs-14 fw-normal mb-1">Submitted on</h4>
                                            <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button>
                                        </div>
                                        <div>
                                            <h4 className="fs-14 fw-normal mb-1">Approved On</h4>
                                            <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button>
                                        </div>
                                    </div>
                                </div> */}
                                {
                                    reportsLoading
                                        ? (
                                            // Show loading spinner while data is being fetched
                                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                <PulseLoader size={25} color="#49a496" />
                                            </div >
                                        ) : reportsError ? (
                                            // Display error message if there is an issue fetching data
                                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                <p className='text-danger'>Something went wrong</p>
                                            </div>
                                        ) :
                                            <>
                                                <Table
                                                    tableData={reportsList}
                                                    setDataList={setReportsList}
                                                    limit={limitReports}
                                                    columns={reportColumns}
                                                    currentPage={currentPageReports}
                                                    handlePageChange={handleReportPageChange}
                                                    setLimit={handleReportLimitChange}
                                                />
                                                {reportsList?.length > 0 &&
                                                    <Pagination
                                                        currentPage={currentPageTrips}
                                                        totalPages={totalPagesReports}
                                                        limit={limitReports}
                                                        totalItems={totalItemsReports}
                                                        handlePageChange={handleReportPageChange}
                                                        handleLimitChange={handleReportLimitChange}
                                                    />
                                                }

                                            </>
                                }
                            </div>
                            <div className={`tab-pane fade ${activeTab === 'info' ? 'show active' : ''}`} id="pills-canvas-4" role="tabpanel" aria-labelledby="pills-canvas-4-tab" tabIndex={0}>
                                {
                                    infoLoading
                                        ? (
                                            // Show loading spinner while data is being fetched
                                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                <PulseLoader size={25} color="#49a496" />
                                            </div >
                                        ) : infoError ? (
                                            // Display error message if there is an issue fetching data
                                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                <p className='text-danger'>Something went wrong</p>
                                            </div>
                                        ) :
                                            <>
                                                <h3 className="fs-6 fw-semibold mb-3">Personal</h3>
                                                <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                                    <div className="ofcvs_form_item hstack gap-3">
                                                        <div>
                                                            <label>First Name</label>
                                                            <div className="ofcvs_form_field">
                                                                <input type="text" className="form-control" placeholder="Enter first name" value={firstName} onKeyDown={(e) => {

                                                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        setFirstName(value);
                                                                        if (validationErrors.firstName) {
                                                                            setValidationErrors(prev => ({ ...prev, firstName: false }));
                                                                        }
                                                                    }} />
                                                            </div>
                                                        </div>
                                                        {validationErrors.firstName &&
                                                            (
                                                                <span className={`error ${validationErrors.firstName ? '' : 'd-none'}`}>{validationErrors.firstName}</span>
                                                            )
                                                        }
                                                        <div>
                                                            <label>Last Name</label>
                                                            <div className="ofcvs_form_field">
                                                                <input type="text" className="form-control" placeholder="Enter last name" value={lastName}
                                                                    onKeyDown={(e) => {

                                                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        setLastName(value);
                                                                        if (validationErrors.lastName) {
                                                                            setValidationErrors(prev => ({ ...prev, lastName: false }));
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {validationErrors.lastName &&
                                                            (
                                                                <span className={`error ${validationErrors.lastName ? '' : 'd-none'}`}>{validationErrors.lastName}</span>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="ofcvs_form_item">
                                                        <label>Email Address</label>
                                                        <div className="ofcvs_form_field">
                                                            <input type="email" className="form-control" placeholder="Enter email address" value={email} onKeyDown={(e) => {

                                                                if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (value.length === 1 && value === ' ') return;
                                                                    setEmail(value);
                                                                    if (validationErrors.email) {
                                                                        setValidationErrors(prev => ({ ...prev, email: false }));
                                                                    }
                                                                }} />
                                                        </div>
                                                    </div>
                                                    {validationErrors.email &&
                                                        (
                                                            <span className={`error ${validationErrors.email ? '' : 'd-none'}`}>{validationErrors.email}</span>
                                                        )
                                                    }
                                                    <div className="ofcvs_form_item">
                                                        <label>Employee ID</label>
                                                        <div className="ofcvs_form_field">
                                                            <input type="text" className="form-control" placeholder="Enter employee ID" value={empId}
                                                                onKeyDown={(e) => {

                                                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setEmpId(value);
                                                                    if (validationErrors.empId) {
                                                                        setValidationErrors(prev => ({ ...prev, empId: false }));
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {validationErrors.empId &&
                                                        (
                                                            <span className={`error ${validationErrors.empId ? '' : 'd-none'}`}>{validationErrors.empId}</span>
                                                        )
                                                    }
                                                    <div className="ofcvs_form_item hstack gap-3">
                                                        <div className="w-50">
                                                            <label>State</label>
                                                            <div className="ofcvs_form_field">
                                                                <input type="email" className="form-control" placeholder="Enter email address" value={state}
                                                                    onKeyDown={(e) => {

                                                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        setState(value);
                                                                        if (validationErrors.state) {
                                                                            setValidationErrors(prev => ({ ...prev, state: false }));
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {validationErrors.state &&
                                                            (
                                                                <span className={`error ${validationErrors.state ? '' : 'd-none'}`}>{validationErrors.state}</span>
                                                            )
                                                        }
                                                        <div>
                                                            <label>Zip Code</label>
                                                            <div className="ofcvs_form_field">
                                                                <input type="text" className="form-control" placeholder="Enter zip code" value={zipCode}
                                                                    onKeyDown={(e) => {

                                                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        setZipCode(value);
                                                                        if (validationErrors.zipCode) {
                                                                            setValidationErrors(prev => ({ ...prev, zipCode: false }));
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {validationErrors.zipCode &&
                                                            (
                                                                <span className={`error ${validationErrors.zipCode ? '' : 'd-none'}`}>{validationErrors.zipCode}</span>
                                                            )
                                                        }
                                                    </div>
                                                    <div className="ofcvs_form_item">
                                                        <label>Annual Business Miles</label>
                                                        <div className="ofcvs_form_field">
                                                            <input type="text" className="form-control" placeholder="Select" value={miles}
                                                                onKeyDown={(e) => {

                                                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    setMiles(value);
                                                                    if (validationErrors.miles) {
                                                                        setValidationErrors(prev => ({ ...prev, miles: false }));
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {validationErrors.miles &&
                                                        (
                                                            <span className={`error ${validationErrors.miles ? '' : 'd-none'}`}>{validationErrors.miles}</span>
                                                        )
                                                    }
                                                </div>
                                                <h3 className="fs-6 fw-semibold my-3">Team</h3>
                                                <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                                    <div className="ofcvs_form_item">
                                                        <label>Roles</label>
                                                        <div className="ofcvs_form_field">
                                                            {/* <select id className="form-select" value={roles}>
                                                                <option value>Select Roles</option>
                                                            </select> */}
                                                            <input type="text" className="form-control" placeholder="Enter role" value={roles} disabled
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="ofcvs_form_item">
                                                        <label>Team</label>
                                                        <div className="ofcvs_form_field">
                                                            <input type="text" className="form-control" placeholder="Enter employee ID" value={team} disabled />
                                                        </div>
                                                    </div>
                                                    <div className="ofcvs_form_item">
                                                        <label>Team Manager</label>
                                                        <div className="ofcvs_form_field">
                                                            <input type="text" className="form-control" placeholder="Enter Team Manager" value={manager} disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-end gap-3 mt-4 mt-md-4">
                                                    <button className="primary-btn" onClick={handleUpdateInfo}>{updateInfoLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Save'}</button>
                                                </div>
                                            </>}

                            </div>
                        </div>
                    </div>
                </div>
            </div >



        </>
    )
}

export default Members