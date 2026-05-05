import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetReportsApi } from '../redux/actions/reports/GetReportsAction';
import { PulseLoader } from 'react-spinners';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import MultiRangeDatePicker from '../components/MultiRangeDatePicker';
import { AddReportAPI } from '../redux/actions/reports/AddReportAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { addReportStateReset } from '../redux/slices/reports/AddReportSlice';
import { useEventCallback } from '@mui/material';
import TripsImageModal from '../components/TripsImageModal';
import { UpdateReportAPI } from '../redux/actions/reports/UpdateReportAction';
import { Link } from 'react-router-dom';
import { set } from 'date-fns';
import MonthYearPickerComponent from '../components/MonthYearPickerComponent';

const Reports = () => {
    const dispatch = useDispatch();
    const tripsColumns = ['Vehicle', 'Created On', 'Trips', 'Miles', 'Status', 'Potentials'];
    const expensesColumns = ['Vehicle', 'Created On', 'Trips', 'Miles', 'Status', 'Potentials'];
    const [activeTab, setActiveTab] = useState('trips'); // 'trips' or 'expenses'
    const { response, loading, error } = useSelector((state) => state.getReports);
    const { response: addReportResponse, loading: addReportLoading, error: addReportError } = useSelector((state) => state.addReport);
    const { response: getVeiclesResponse, loading: getVehiclesLoading, error: getVehiclesError } = useSelector((state) => state.getVehicles);
    const [dateRange, setDateRange] = useState([], []);
    const [vehicle, setVehicle] = useState('');
    const [type, setType] = useState('');
    const [reportType, setReportType] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [rowClick, setRowClick] = useState(false);
    const [reportName, setReportName] = useState('');

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

    // const [dateFilter, setDateFilter] = useState(new Date());

    // const tripsTotalItems = tripsList?.length;
    // const expensesTotalItems = expesnesList?.length;
    // const tripsTotalPages = Math.ceil(tripsTotalItems / tripsLimit);
    // const expensesTotalPages = Math.ceil(expensesTotalItems / expenseLimit);

    // Handle tab change (you can call this on Bootstrap tab events or manually)

    const [filters, setFilters] = useState({
        trips: {
            dateFilter: new Date(),
        },
        expenses: {

            dateFilter: new Date(),
        }
    });

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

    const validateForm = () => {
        const newErrors = {};

        if (!reportType) {
            newErrors.reportType = 'Report Type is required';
        }

        if (!type) {
            newErrors.type = 'Category is required';
        }

        if (!vehicle) {
            newErrors.vehicle = 'Vehicle is required';
        }

        if (!dateRange) {
            newErrors.dateRange = 'Date is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
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

    const handleAddReport = async () => {
        if (!validateForm()) return;
        try {
            // let name = '';
            // if (reportType === 'trip') {
            //     name = 'Mileage report'
            // } else {
            //     name = 'Expense report'
            // }
            const [startDate, endDate] = dateRange
            await dispatch(AddReportAPI({ name: reportName, vehicleId: vehicle, categoryId: type, startDate: startDate, endDate: endDate, type: reportType }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    // const handleUpdateReport = async () => {
    //     if (!validateForm2()) return;

    //     try {
    //         await dispatch(UpdateReportAPI({ name: reportName }));
    //     } catch (error) {
    //         showErrorToast(error);
    //     }
    // }

    useEffect(() => {
        if (activeTab === 'trips') {
            const month = filters[activeTab].dateFilter.getMonth() + 1;
            const year = filters[activeTab].dateFilter.getFullYear();

            dispatch(GetReportsApi({ page: tripsPage, limit: tripsLimit, type: 'trip', month: month, year: year }));
        }
        if (activeTab === 'expenses') {
            const month = filters[activeTab].dateFilter.getMonth() + 1;
            const year = filters[activeTab].dateFilter.getFullYear();
            dispatch(GetReportsApi({ page: expensesPage, limit: expenseLimit, type: 'expense', month: month, year: year }));
        }
    }, [activeTab, tripsPage, tripsLimit, expensesPage, expenseLimit, filters])

    useEffect(() => {
        if (response) {
            if (activeTab === 'trips') {
                setTripsList(response?.data?.data);
                setTripsPage(response?.data?.pagination?.page || 1);
                setTripsLimit(response?.data?.pagination?.limit || 5);
                setTripsTotalItems(response?.data?.pagination?.total || 1);
                setTripsTotalPages(response?.data?.pagination?.totalPages || 1);
            }
            if (activeTab === 'expenses') {
                setExpensesList(response?.data?.data)
                setExpensesPage(response?.data?.pagination?.page || 1);
                setExpenseLimit(response?.data?.pagination?.limit || 5);
                setExpensesTotalItems(response?.data?.pagination?.total || 1);
                setExpensesTotalPages(response?.data?.pagination?.totalPages || 1);
            }
            setRowClick(true)
        }
    }, [activeTab, response])

    useEffect(() => {
        if (addReportResponse) {
            const currentReportType = reportType;

            showSuccessToast(addReportResponse?.message);
            dispatch(addReportStateReset());
            setType(
                ''
            );
            setReportType(
                ''
            );
            setReportName('');
            setValidationErrors('');
            setVehicle('');
            setDateRange([], []);
            const offcanvasEl = document.getElementById('generateMR');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
            if (currentReportType === 1) {
                setActiveTab('trips');
                setTripsPage(1);      // Optionally reset pagination to page 1
                setTripsLimit(5);     // Or keep existing limit
                dispatch(GetReportsApi({ page: 1, limit: tripsLimit, type: 'trip' }));
            } else {
                setActiveTab('expenses');
                setExpensesPage(1);
                setExpenseLimit(5);
                dispatch(GetReportsApi({ page: 1, limit: expenseLimit, type: 'expense' }));
            }
        }

    }, [addReportResponse])

    useEffect(() => {
        if (addReportError) {
            showErrorToast(addReportError?.data);
            dispatch(addReportStateReset());
            setValidationErrors('');
        }
    }, [addReportError])

    useEffect(() => {
        if (reportType === 1) {
            setReportName('Mileage Report')
        }
        if (reportType === 2) {
            setReportName('Expense Report')
        }
    }, [reportType])

    return (
        <>
            <section className="main-section spacer-y">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-xl-12">
                            <div className="common_main_heading_wrapper mb-4">
                                <ul className="common_nav_tab nav nav-pills mb-0 gap-2" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${activeTab === 'trips' ? 'active' : ''}`} id="pills-1-tab" data-bs-toggle="pill" data-bs-target="#pills-1" type="button" role="tab" aria-controls="pills-1" aria-selected="true" onClick={() => handleTabChange('trips')}>Trips</button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`} id="pills-2-tab" data-bs-toggle="pill" data-bs-target="#pills-2" type="button" role="tab" aria-controls="pills-2" aria-selected="false" onClick={() => handleTabChange('expenses')}>Expenses</button>
                                    </li>
                                </ul>
                                <div className="d-flex flex-end gap-3">
                                    <div className='ofcvs_form_item'>
                                        <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/Plus.svg)' }} />
                                        <div className="ofcvs_form_field">
                                            <select id className="form-select border-black" onChange={(e) => {
                                                const value = e.target.value;
                                                setReportType(Number(value));

                                                if (value === '1' || value === '2') {
                                                    const offcanvas = new window.bootstrap.Offcanvas(document.getElementById('generateMR'));
                                                    offcanvas.show();
                                                }
                                            }} value={reportType}>
                                                <option value=''>Add Report</option>
                                                <option value='1'>Mileage Report</option>
                                                <option value='2'>Expense Report</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* <button className="outline-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#generateMR" aria-controls="generateMR">+Add Report</button> */}
                                </div>
                            </div>
                            <div className="tab-content common_tab_content" id="pills-tabContent">
                                {/* {activeTab === 'trips' && ( */}
                                <div className={`tab-pane fade ${activeTab === 'trips' ? 'show active' : ''}`} id="pills-1" role="tabpanel" aria-labelledby="pills-1-tab" tabIndex={0}>
                                    <div className="row row-cols-sm-1 g-4">
                                        <div className="common-table-filter-wrapper">

                                            <div className="common-sort-blk">
                                                <button className="filter_action_btn cal_btn">
                                                    <MonthYearPickerComponent date={filters[activeTab].dateFilter}
                                                        onChangeDate={(date) => handleFilterChange('dateFilter', date)} />
                                                </button>

                                            </div>

                                        </div>
                                        <div className="col">
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
                                                                rowClick={rowClick}
                                                                activeTab={activeTab}
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
                                    </div>
                                </div>
                                {/* )} */}
                                {/* {activeTab === 'expenses' && ( */}
                                <div className={`tab-pane fade ${activeTab === 'expenses' ? 'show active' : ''}`} id="pills-2" role="tabpanel" aria-labelledby="pills-2-tab" tabIndex={0}>
                                    <div className="row row-cols-sm-1 g-4">
                                        <div className="common-table-filter-wrapper">

                                            <div className="common-sort-blk">
                                                <button className="filter_action_btn cal_btn">
                                                    <MonthYearPickerComponent date={filters[activeTab].dateFilter}
                                                        onChangeDate={(date) => handleFilterChange('dateFilter', date)} />
                                                </button>

                                            </div>

                                        </div>
                                        <div className="col">
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
                                                                rowClick={rowClick}
                                                                activeTab={activeTab}
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
                                {/* )} */}
                            </div>
                        </div>
                    </div>
                </div >
            </section >

            {/* add report canvas */}
            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1
            } id="generateMR" aria-labelledby="generateMRLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => {
                        setType(
                            ''
                        );
                        setReportType(
                            ''
                        );
                        setValidationErrors('');
                        setVehicle('');
                        // setDateRange([], []);
                    }
                    } />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>{`Generate ${reportName}`}</h2>
                        <div className="canvas_action_btn">
                            <button id="report-dropdown-toggle" className="save_btn" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside"
                            >{addReportLoading ? <PulseLoader size={14} color='#ffffff' /> : 'Save'}</button>
                            <div className="dropdown-menu map-preview p-3">

                                <div className="form_field">
                                    <label htmlFor="fullName">Report name</label>
                                    <div className="input_field">
                                        <input type="text" className="form-control" name="name" id="fullName" value={reportName}
                                            onChange={(e) => {
                                                let value = e.target.value;
                                                // value = value.replace(/[0-9]/g, '');
                                                if (value.length === 1 && value === ' ') return;
                                                setReportName(value);
                                                if (validationErrors.reportName) {
                                                    setValidationErrors(prev => ({ ...prev, reportName: false }));
                                                }
                                            }} />
                                    </div>
                                    {validationErrors.reportName &&
                                        (
                                            <span className={`error ${validationErrors.reportName ? '' : 'd-none'}`}>{validationErrors.reportName}</span>
                                        )
                                    }
                                </div>
                                <div className="form-btn-blk">
                                    <button className="form-btn w-100 fw-medium text-white text-capitalize" onClick={async (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        if (!reportName.trim()) {
                                            // Show validation error and keep dropdown open
                                            setValidationErrors(prev => ({
                                                ...prev,
                                                reportName: 'Report name is required'
                                            }));
                                        } else {
                                            // Clear error
                                            setValidationErrors(prev => ({
                                                ...prev,
                                                reportName: false
                                            }));

                                            try {
                                                // Close dropdown manually after successful save
                                                const dropdownToggle = document.getElementById('report-dropdown-toggle');
                                                if (dropdownToggle) {
                                                    let dropdownInstance = window.bootstrap.Dropdown.getInstance(dropdownToggle);
                                                    if (!dropdownInstance) {
                                                        dropdownInstance = new window.bootstrap.Dropdown(dropdownToggle);
                                                    }
                                                    dropdownInstance.hide();
                                                }
                                                await handleAddReport();
                                            } catch (error) {
                                                showErrorToast(error)
                                            }
                                        }
                                    }}>
                                        Update
                                    </button>
                                </div>
                            </div>
                            {/* <button className="save_btn" type='button' onClick={handleAddReport}>{addReportLoading ? <PulseLoader size={14} color='#ffffff' /> : 'Save'}</button> */}
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper">
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/car-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setVehicle(e.target.value);
                                    if (validationErrors.vehicle) {
                                        setValidationErrors(prev => ({ ...prev, vehicle: false }));
                                    }
                                }} value={vehicle}>
                                    {getVehiclesLoading ? (
                                        <option disabled>Loading...</option>
                                    ) : getVehiclesError ? (
                                        <option disabled>Error loading vehicles</option>
                                    ) : getVeiclesResponse?.data?.length === 0 ? (
                                        <option value="">Vehicle</option>
                                    ) : (
                                        <>
                                            <option value="">Select Vehicle</option>
                                            {getVeiclesResponse?.data.map((vehicle) => (
                                                <option key={vehicle._id} value={vehicle._id}>
                                                    {vehicle.name || ''}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                        </div>
                        {validationErrors.vehicle &&
                            (
                                <span className={`error ${validationErrors.vehicle ? '' : 'd-none'}`}>{validationErrors.vehicle}</span>
                            )
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/briefcase-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setType(e.target.value);
                                    if (validationErrors.type) {
                                        setValidationErrors(prev => ({ ...prev, type: false }));
                                    }
                                }} value={type}>
                                    <option value=''>Select Type</option>
                                    {/* <option value='67650053bd020f2a50f1c162'>Personal</option> */}
                                    <option value='6765006fbd020f2a50f1c169'>Business</option>
                                    <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                    <option value='67650085bd020f2a50f1c171'>Medical</option>
                                </select>
                            </div>
                        </div>
                        {validationErrors.type &&
                            (
                                <span className={`error ${validationErrors.type ? '' : 'd-none'}`}>{validationErrors.type}</span>
                            )
                        }
                        {/* <div className="ofcvs_form_item">
                            <div className="hstack gap-2">
                                <div className="ofcvs_flex_item">
                                    <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/clock-icon.svg)' }} />
                                    <div className="ofcvs_form_field">
                                        <input type="text" className="form-control" id="timeFrom" placeholder="From" defaultValue />
                                    </div>
                                </div>
                                <div className="ofcvs_flex_item">
                                    <span>To</span>
                                </div>
                                <div className="ofcvs_flex_item">
                                    <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/clock-icon.svg)' }} />
                                    <div className="ofcvs_form_field">
                                        <input type="text" className="form-control" id="timeTo" placeholder="To" defaultValue />
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/cal-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Date" defaultValue="Date" />
                            </div>
                        </div> */}
                        {/* <MultiRangeDatePicker dateRange={dateRange} setDateRange={setDateRange} validationErrors={validationErrors} setValidationErrors={setValidationErrors} /> */}
                    </div>
                </div>
            </div >

        </>
    )
}

export default Reports