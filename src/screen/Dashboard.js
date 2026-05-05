import React, { useCallback, useContext, useEffect, useState } from 'react'
import Table from '../components/Table'
import { ClipLoader, PulseLoader } from 'react-spinners'
import { GetDashboardDataApi } from '../redux/actions/dashboard/GetDashboardDataAction';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../components/Pagination';
import Graph from '../components/Graph';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../helpers/utils';
import { AcceptInvitationAPI } from '../redux/actions/auth/AcceptInvitationAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { RejectInvitationAPI } from '../redux/actions/auth/RejectInvitationAction';
import { acceptInvitationStateReset } from '../redux/slices/auth/AcceptInvitationSlice';
import { rejectInvitationStateReset } from '../redux/slices/auth/RejectInvitationSlice';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    // Define columns for table
    const columns = ['From', 'To', 'Distance', 'Date', 'Time', 'Type', 'Potential'];
    // Use Redux to get the dashboard data
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Get current date
    const currentDate = new Date();
    const { response: getVeiclesResponse, loading: getVehiclesLoading, error: getVehiclesError } = useSelector((state) => state.getVehicles);
    const { response: acceptInviteResponse, loading: acceptInviteLoading, error: acceptInviteError } = useSelector((state) => state.acceptInvitation);
    const { response: rejectInviteResponse, loading: rejectInviteLoading, error: rejectInviteError } = useSelector((state) => state.rejectInvitation);
    const { response: checkInvitationResponse, loading: checkInvitationLoading, error: checkInvitationError } = useSelector((state) => state.checkInvitation);
    // Initialize dispatch function for triggering actions
    const { response, loading, error } = useSelector((state) => state.getDashboardData)

    const [vehicle, setVehicle] = useState('');

    // State variables for pagination, data, and filters
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const { fetchInvites } = useContext(AuthContext);

    // State variables for selected month and year
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [year, setYear] = useState(currentDate.getFullYear());

    // State for holding trips data
    const [dataList, setDataList] = useState([]);


    // Handle page changes in pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle changing items per page
    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setCurrentPage(1);// Reset to the first page on limit change
    };

    const handleAcceptInvitation = async () => {
        try {
            await dispatch(AcceptInvitationAPI({ id: checkInvitationResponse?.data?._id }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleRejectInvitation = async () => {
        try {
            await dispatch(RejectInvitationAPI({ id: checkInvitationResponse?.data?._id }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    // Fetch trips data using Redux action
    const fetchTrips = useCallback(() => {
        if (vehicle) {
            dispatch(GetDashboardDataApi(vehicle));
        }
    }, [dispatch, vehicle]);


    // Count number of trips for a particular category (e.g., Personal, Business)
    const getCount = (n) => {
        return dataList.filter(trip => trip?.category?.name === n).length;
    }

    // Calculate total potential earnings
    const totalPotential = dataList.reduce((acc, trip) => acc + (Number(trip?.potentialEarnings) || 0), 0);

    // Format as dollar value
    const formattedPotential = `$${totalPotential.toFixed(2)}`;

    // Paginate the data based on the current page and limit
    const paginatedData = dataList.slice((currentPage - 1) * limit, currentPage * limit);

    // Fetch trips data when the component mounts
    useEffect(() => {
        fetchTrips()
    }, [fetchTrips]);

    // Update data, pagination, and total items when data is received
    useEffect(() => {
        if (response?.statusCode === 200) {
            setTotalPages(Math.ceil(response?.data?.trips.length / limit)); // Calculate total pages
            setTotalItems(response?.data?.trips?.length); // Set total number of items
            setDataList(response?.data?.trips); // Set the trips data to state
        }
    }, [response])

    useEffect(() => {
        if (getVeiclesResponse) {
            setVehicle(getVeiclesResponse?.data[0]?._id);
        }
    }, [getVeiclesResponse])


    useEffect(() => {
        if (acceptInviteResponse) {
            showSuccessToast(acceptInviteResponse?.message)
            dispatch(acceptInvitationStateReset());
            fetchInvites()
        }
    }, [acceptInviteResponse])

    useEffect(() => {
        if (rejectInviteResponse) {
            showSuccessToast(rejectInviteResponse?.message)
            dispatch(rejectInvitationStateReset());
            fetchInvites()
        }
    }, [rejectInviteResponse])

    useEffect(() => {
        if (acceptInviteError) {
            showErrorToast(acceptInviteError?.message)
            dispatch(acceptInvitationStateReset())
        }
    }, [acceptInviteError])

    useEffect(() => {
        if (rejectInviteError) {
            showErrorToast(rejectInviteError?.message)
            dispatch(rejectInvitationStateReset())
        }
    }, [rejectInviteError])


    return (
        <>
            {
                loading
                    ? (
                        // Show loading spinner while data is being fetched
                        <div style={{ height: '70vh' }} className='d-flex align-items-center justify-content-center' >
                            <PulseLoader size={25} color="#49a496" />
                        </div >
                    ) : error ? (
                        // Display error message if there is an issue fetching data
                        <div style={{ height: '70vh' }} className='d-flex align-items-center justify-content-center'>
                            <p className='text-danger'>Something went wrong</p>
                        </div>
                    ) :
                        // Show content once data is loaded
                        <div className="content-wrapper">
                            {/* Breadcrumb navigation (hidden for now) */}
                            {/* <div className="breadcrumb_wrapper d-none">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="page-header">
                                                <nav className="breadcrumb_nav">
                                                    <ul className="breadcrumb mb-0">
                                                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                                                        <li className="breadcrumb-item text-capitalize">analytics</li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <section className="main-section spacer-y">
                                <div className="container">
                                    <div className="row gy-4">
                                        {/* Trip Overview Card */}
                                        <div className="col-xl-12">
                                            <div className="common_main_heading_wrapper">
                                                <div className="d-flex justify-content-end w-100 flex-end gap-3">
                                                    {getVeiclesResponse?.data?.length > 0 ? <div className="ofcvs_form_item">
                                                        <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/car-icon.svg)' }} />
                                                        <div className="ofcvs_form_field">
                                                            <select id className="form-select border-black" onChange={(e) => {
                                                                setVehicle(e.target.value);
                                                            }} value={vehicle}>
                                                                {getVehiclesLoading ? <span><ClipLoader size={23} color='#000000' /></span>
                                                                    :
                                                                    getVehiclesError ? <span><ClipLoader size={23} color='#000000' /></span> :
                                                                        getVeiclesResponse?.data?.length > 0 && getVeiclesResponse?.data?.map((vehcile, index) => {
                                                                            return (
                                                                                <option value={vehcile?._id}>{vehcile?.name || ''}</option>
                                                                            )
                                                                        })
                                                                }
                                                            </select>
                                                        </div>
                                                    </div> :
                                                        <button className="primary-btn" onClick={() => navigate('/dashboard/reporting/vehicle')}>+Add New Vehicle</button>
                                                    }

                                                </div>
                                            </div>
                                            {
                                                checkInvitationLoading
                                                    ? (
                                                        // Show loading spinner while data is being fetched
                                                        <div style={{ height: '20vh' }} className='d-flex align-items-center justify-content-center' >
                                                            <PulseLoader size={25} color="#49a496" />
                                                        </div >
                                                    ) : checkInvitationError ? (
                                                        // Display error message if there is an issue fetching data
                                                        <div style={{ height: '20vh' }} className='d-flex align-items-center justify-content-center'>
                                                            <p className='text-danger'>Something went wrong</p>
                                                        </div>
                                                    ) :
                                                        <div class="common-card">
                                                            <div className="common_heading_flex">
                                                                <h1>Invites</h1>
                                                            </div>
                                                            <div className="row row-cols-sm-2 g-4">
                                                                {checkInvitationResponse?.data?.length > 0 ? checkInvitationResponse?.data?.length?.map((r, index) => {
                                                                    return (
                                                                        <div className="col" key={index}>
                                                                            <button className="common-card w-100 border-0 bg-white" >
                                                                                <span className="location_info">
                                                                                    <span className="location_info_list">
                                                                                        <span className="location_info_title d-block">{r?.role ? getUserRole(r?.role) : ''}</span>
                                                                                        <span className="location_info_detail d-block">{ }</span>
                                                                                    </span>
                                                                                </span>
                                                                                <div class="d-flex justify-content-start gap-3 mt-4 mt-md-4">
                                                                                    <button class="primary-btn" type="button" onClick={handleAcceptInvitation}>Accept</button>
                                                                                    <button class="outline-btn" type='button' onClick={handleRejectInvitation}>Reject</button>
                                                                                </div>
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                })

                                                                    :

                                                                    <div className='w-100 d-flex align-items-center justify-content-center fs-5 fw-semibold' >
                                                                        No invites yet
                                                                    </div>

                                                                }
                                                            </div>
                                                        </div>
                                            }
                                            <div className="common-card mt-4">
                                                <div className="common_heading_flex">
                                                    <h1>Trip Overview</h1>
                                                    {/* <button className="select_date">Jun 18, 2025 - Jun 23, 2025</button> */}
                                                    {/* <DatePickerComponent date={date} setDate={setDate} /> */}
                                                </div>
                                                <div className="common_stats">
                                                    <div className="common_stats_item">
                                                        <span className="common_stats_value">{response?.data?.trips?.length || 0}</span>
                                                        <h2>Trips</h2>
                                                    </div>
                                                    <div className="common_stats_item">
                                                        <span className="common_stats_value">{getCount('Personal') || 0}</span>
                                                        <h2>Personal</h2>
                                                    </div>
                                                    <div className="common_stats_item">
                                                        <span className="common_stats_value">{getCount('Business') || 0}</span>
                                                        <h2>Business</h2>
                                                    </div>
                                                    <div className="common_stats_item">
                                                        <span className="common_stats_value">{getCount('Charity') || 0}</span>
                                                        <h2>Charity</h2>
                                                    </div>
                                                    <div className="common_stats_item">
                                                        <span className="common_stats_value">{getCount('Medical') || 0}</span>
                                                        <h2>Medical</h2>
                                                    </div>
                                                    <div className="common_stats_item">
                                                        <span className="common_stats_value">{formattedPotential}</span>
                                                        <h2>Potential</h2>
                                                    </div>
                                                </div>
                                                {/* Graph component for visualizing trip data */}
                                                <div className="graph_blk">
                                                    <Graph dataList={dataList} />
                                                    {/* <img src="assets/images/graph-img.png" alt="graph" /> */}
                                                    {/* {dataList?.length > 0 ? <Graph dataList={dataList} /> : <div className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-black'>No graph data available</p>
                                                    </div>} */}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Today’s trips section */}
                                        <div className="col-12">
                                            <div className="common_sub_heading_wrapper">
                                                <h2>Today Trips</h2>
                                            </div>
                                            {/* Table displaying trip data */}
                                            <Table
                                                tableData={paginatedData}
                                                setDataList={setDataList}
                                                limit={limit}
                                                columns={columns}
                                                currentPage={currentPage}
                                                handlePageChange={handlePageChange}
                                                setLimit={setLimit}
                                            />

                                            {/* Pagination component */}
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                limit={limit}
                                                totalItems={totalItems}
                                                handlePageChange={handlePageChange}
                                                handleLimitChange={handleLimitChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

            }
        </>
    )
}

export default Dashboard