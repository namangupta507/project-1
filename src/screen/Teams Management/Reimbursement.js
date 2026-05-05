import React, { useState, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetReimbursementListApi } from '../../redux/actions/teams/reimbursement/GetListAction';
import { AuthContext } from '../../context/AuthContext';
import { PulseLoader } from 'react-spinners';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import MonthYearPickerComponent from '../../components/MonthYearPickerComponent';

const Reimbursement = () => {
    const dispatch = useDispatch();
    const tripsColumns = ['Total Potential', 'Miles', 'Created At', 'Status', 'Total Trips']
    const expensesColumns = ['Total Potential', 'Miles', 'Created At', 'Status', 'Total Expenses']
    const [activeTab, setActiveTab] = useState('trips');
    const { response, loading, error } = useSelector((state) => state.reimbursementList);
    const { parentTeamId } = useContext(AuthContext);
    // Pagination states for Trips
    const [tripsPage, setTripsPage] = useState(1);
    const [tripsLimit, setTripsLimit] = useState(5);
    // Pagination states for Expenses
    const [expensesPage, setExpensesPage] = useState(1);
    const [expenseLimit, setExpenseLimit] = useState(5);

    const [tripsList, setTripsList] = useState([]);
    const [expesnesList, setExpensesList] = useState([]);

    const [tripsTotalItems, setTripsTotalItems] = useState(1);
    const [expensesTotalItems, setExpensesTotalItems] = useState(1);

    const [tripsTotalPages, setTripsTotalPages] = useState(1);
    const [expensesTotalPages, setExpensesTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        trips: {
            dateFilter: new Date(),
        },
        expenses: {

            dateFilter: new Date(),
        }
    });

    // const tripsTotalItems = tripsList?.length;
    // const expensesTotalItems = expesnesList?.length;
    // const tripsTotalPages = Math.ceil(tripsTotalItems / tripsLimit);
    // const expensesTotalPages = Math.ceil(expensesTotalItems / expenseLimit);

    // Handle tab change (you can call this on Bootstrap tab events or manually)
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'trips') setTripsPage(1);
        if (tab === 'expenses') setExpensesPage(1);

        setFilters(prev => ({
            ...prev,
            [tab]: {
                dateFilter: new Date()
            }
        }));
    };
    // Pagination click handlers per tab
    const handleTripsPageChange = (page) => {
        setTripsPage(page);
    };

    const handleExpensesPageChange = (page) => {
        setExpensesPage(page);
    };

    // Handle limit changes (items per page)
    const handleTripsLimitChange = (limit) => {
        setTripsLimit(limit);
        setTripsPage(1); // reset page to 1 when limit changes
    };
    const handleExpensesLimitChange = (limit) => {
        setExpenseLimit(limit);
        setExpensesPage(1);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [key]: value
            }
        }));
    };

    useEffect(() => {
        if (activeTab === 'trips') {
            if (parentTeamId) {
                const month = filters[activeTab].dateFilter.getMonth() + 1;
                const year = filters[activeTab].dateFilter.getFullYear();

                dispatch(GetReimbursementListApi({ page: tripsPage, limit: tripsLimit, type: 'trip', teamId: parentTeamId, month, year }));
            }
        }
        if (activeTab === 'expenses') {
            if (parentTeamId) {
                const month = filters[activeTab].dateFilter.getMonth() + 1;
                const year = filters[activeTab].dateFilter.getFullYear();

                dispatch(GetReimbursementListApi({ page: expensesPage, limit: expenseLimit, type: 'expense', teamId: parentTeamId, month, year }));
            }
        }
    }, [activeTab, tripsPage, tripsLimit, expensesPage, expenseLimit, parentTeamId, filters])

    useEffect(() => {
        if (response) {
            if (activeTab === 'trips') {
                setTripsList(response?.data);
                setTripsPage(response?.pagination?.page || 1);
                setTripsLimit(response?.pagination?.limit || 5);
                setTripsTotalItems(response?.pagination?.total || 1);
                setTripsTotalPages(response?.pagination?.totalPages || 1);
            }
            if (activeTab === 'expenses') {
                setExpensesList(response?.data)
                setExpensesPage(response?.pagination?.page || 1);
                setExpenseLimit(response?.pagination?.limit || 5);
                setExpensesTotalItems(response?.pagination?.total || 1);
                setExpensesTotalPages(response?.pagination?.totalPages || 1);
            }
        }
    }, [activeTab, response])

    useEffect(() => {
        setActiveTab('trips')
    }, [])

    return (
        <div className="content-wrapper">
            <section className="main-section spacer-y">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-12">
                            <div className="common_main_heading_wrapper mb-4">
                                <ul className="common_nav_tab nav nav-pills mb-0 gap-2" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${activeTab === 'trips' ? 'active' : ''}`} id="pills-1-tab" data-bs-toggle="pill" data-bs-target="#pills-1" type="button" role="tab" aria-controls="pills-1" aria-selected="true" onClick={() => handleTabChange('trips')}>Trips</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`} id="pills-2-tab" data-bs-toggle="pill" data-bs-target="#pills-2" type="button" role="tab" aria-controls="pills-2" aria-selected="false" onClick={() => handleTabChange('expenses')}>Expenses</button>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content common_tab_content" id="pills-tabContent">

                                <div className={`tab-pane fade ${activeTab === 'trips' ? 'show active' : ''}`} id="pills-1" role="tabpanel" aria-labelledby="pills-1-tab" tabIndex={0}>
                                    <div className="common-table-filter-wrapper">

                                        <div className="common-sort-blk">
                                            <button className="filter_action_btn cal_btn">
                                                <MonthYearPickerComponent date={filters[activeTab].dateFilter}
                                                    onChangeDate={(date) => handleFilterChange('dateFilter', date)} />
                                            </button>

                                        </div>

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
                                                        tableData={tripsList}
                                                        setDataList={setTripsList}
                                                        limit={tripsLimit}
                                                        columns={tripsColumns}
                                                        currentPage={tripsPage}
                                                        handlePageChange={handleTripsPageChange}
                                                        setLimit={handleTripsLimitChange}
                                                        activeTab={activeTab}
                                                        detailClickable={true}
                                                    />
                                                    {tripsList?.length > 0 &&
                                                        <Pagination
                                                            currentPage={tripsPage}
                                                            totalPages={tripsTotalPages}
                                                            limit={tripsLimit}
                                                            totalItems={tripsTotalItems}
                                                            handlePageChange={handleTripsPageChange}
                                                            handleLimitChange={handleTripsLimitChange}
                                                        />
                                                    }

                                                </>
                                    }
                                </div>

                                <div className={`tab-pane fade ${activeTab === 'expenses' ? 'show active' : ''}`} id="pills-2" role="tabpanel" aria-labelledby="pills-2-tab" tabIndex={0}>
                                    <div className="common-table-filter-wrapper">

                                        <div className="common-sort-blk">
                                            <button className="filter_action_btn cal_btn">
                                                <MonthYearPickerComponent date={filters[activeTab].dateFilter}
                                                    onChangeDate={(date) => handleFilterChange('dateFilter', date)} />
                                            </button>

                                        </div>

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
                                                        tableData={expesnesList}
                                                        setDataList={setExpensesList}
                                                        limit={expenseLimit}
                                                        columns={expensesColumns}
                                                        currentPage={expensesPage}
                                                        handlePageChange={handleExpensesPageChange}
                                                        setLimit={handleExpensesLimitChange}
                                                        activeTab={activeTab}
                                                        detailClickable={true}
                                                    />
                                                    {expesnesList?.length > 0 &&
                                                        <Pagination
                                                            currentPage={expensesPage}
                                                            totalPages={expensesTotalPages}
                                                            limit={expenseLimit}
                                                            totalItems={expensesTotalItems}
                                                            handlePageChange={handleExpensesPageChange}
                                                            handleLimitChange={handleExpensesLimitChange}
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

    )
}

export default Reimbursement