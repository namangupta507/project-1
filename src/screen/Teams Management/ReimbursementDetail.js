import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { GetReportDetailApi } from '../../redux/actions/reports/GetReportDetailAction';
import { PulseLoader } from 'react-spinners';
import { formatDate } from '../../helpers/dateTime';
import { categoryName } from '../../helpers/utils';
import { SubmitReimbursementAPI } from '../../redux/actions/teams/reimbursement/SubmitAction';
import { showErrorToast, showSuccessToast } from '../../helpers/toast';
import { submitStateReset } from '../../redux/slices/teams/reimbursement/SubmitSlice';

const ReimbursementDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [accepted, setAccepted] = React.useState(false);
    const [rejected, setRejected] = React.useState(false);
    const { response, loading, error } = useSelector((state) => state.reportDetail)
    const { response: submitResponse, loading: submitLoading, error: submitError } = useSelector((state) => state.reimbursementSubmit)
    const { type, name, startDate, endDate } = location.state || {};

    const statusClassMap = {
        0: 'status_badge st-draft',
        1: 'status_badge st-pending',
        2: 'status_badge st-approved',
        3: 'status_badge st-rejected',
    };

    const statusClass = (status) => {
        return typeof status === 'number'
            ? statusClassMap[status] || ''
            : '';
    }

    const getStatus = (status) => {
        switch (status) {
            case 0:
                return 'Draft';
            case 1:
                return 'Sent';
            case 2:
                return 'Approved';
            case 3:
                return 'Rejected';
            default:
                return status;
        }
    }

    const handleSubmitReport = async () => {
        try {
            if (accepted) {
                await dispatch(SubmitReimbursementAPI({ status: 2 }, { id: id }))
            }
            if (rejected) {
                await dispatch(SubmitReimbursementAPI({ status: 3 }, { id: id }))
            }
        } catch (error) {
            showErrorToast(error)
        }
    }

    useEffect(() => {
        if (id) {
            dispatch(GetReportDetailApi({ id: id }))
        }
    }, [id])

    useEffect(() => {
        if (submitResponse) {
            showSuccessToast(submitResponse?.message);
            dispatch(submitStateReset());
            dispatch(GetReportDetailApi({ id: id }))
        }
    }, [submitResponse])

    useEffect(() => {
        if (submitError) {
            showErrorToast(submitError?.data);
            dispatch(submitStateReset());
        }
    }, [submitError])

    return (
        <>
            {
                loading
                    ? (
                        // Show loading spinner while data is being fetched
                        <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center' >
                            <PulseLoader size={25} color="#49a496" />
                        </div >
                    ) : error ? (
                        // Display error message if there is an issue fetching data
                        <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center'>
                            <p className='text-danger'>Something went wrong</p>
                        </div>
                    ) :
                        (

                            type === 'trips' ?
                                <>

                                    <div className="breadcrumb_wrapper spacer-y pb-0">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="page-header">
                                                        <nav className="breadcrumb_nav">
                                                            <ul className="breadcrumb mb-0">
                                                                <li className="breadcrumb-item"><Link to='/dashboard/teams/reimbursement'>Reimbursement</Link></li>
                                                                <li className="breadcrumb-item text-capitalize">Reimbursement Details</li>
                                                            </ul>
                                                        </nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                    <section className="main-section spacer-y pt-3">
                                        <div className="container">
                                            <div className="row gy-4">
                                                <div className="col-xl-12">
                                                    <div className="common_main_heading_wrapper mb-4">
                                                        <div className="w-100 d-flex align-items-center justify-content-between gap-3">
                                                            <span className={statusClass(response?.data?.reportDetails[0]?.status)}>{typeof response?.data?.reportDetails[0]?.status === 'number' ? getStatus(response?.data?.reportDetails[0]?.status) : (response?.data?.reportDetails[0]?.status || '-')}</span>

                                                            <div class="d-flex flex-end gap-3">


                                                                <button class="outline-btn" type='button' onClick={() => { setRejected(prev => !prev); handleSubmitReport() }}>{(submitLoading && rejected) ? <PulseLoader color='#ffffff' size={14} /> : 'Reject'}</button>
                                                                <button class="primary-btn" type="button" onClick={() => { setAccepted(prev => !prev); handleSubmitReport() }}>{(submitLoading && accepted) ? <PulseLoader color='#ffffff' size={14} /> : 'Accept'}</button>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row row-cols-sm-2 g-4">
                                                <div className="col">
                                                    <div className="common-card-wrapper">
                                                        <div className="common_card_header hstack justify-content-between gap-3 flex-wrap">
                                                            <h2>{response?.data?.reportDetails[0]?.name || ''}</h2>
                                                            <p>{response?.data?.reportDetails[0]?.createdAt ? formatDate(response?.data?.reportDetails[0]?.createdAt) : '-'}</p>
                                                        </div>
                                                        {(response?.data?.reportDetails[0]?.user && response?.data?.reportDetails[0]?.vehicle) ?
                                                            <div className="common_card_content">
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Driver’s name</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.user?.fullName || ''}</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">License plate number</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.vehicle?.licensePlate}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Vehicle</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.vehicle?.name}</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Type</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.category?.name}</p>
                                                                    </div>
                                                                </div>
                                                            </div> :
                                                            <div className='common_card_content'>No data available</div>}

                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="common-card-wrapper">
                                                        <div className="common_card_header hstack justify-content-between gap-3 flex-wrap">
                                                            <h2>Summary</h2>
                                                        </div>
                                                        {response?.data?.data?.summaryDetails ?
                                                            <div className="common_card_content">
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Mileage rate</h3>
                                                                        <p className="common_card_context">${response?.data?.data?.summaryDetails?.rateValue || 0}/miles</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Distance</h3>
                                                                        <p className="common_card_context">{response?.data?.data?.summaryDetails?.totalDistance ? response?.data?.data?.summaryDetails?.totalDistance?.toFixed(2) : 0}/miles</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Amount</h3>
                                                                        <p className="common_card_context">${response?.data?.data?.summaryDetails?.totalAmount || 0}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <p className="common_card_context">Total</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <p className="common_card_context">{response?.data?.data?.totalSummary?.totalDistance ? `${response?.data?.data?.totalSummary?.totalDistance.toFixed(2)}/miles` : `${0}/miles`}</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <p className="common_card_context">{`$${response?.data?.data?.totalSummary?.totalAmount}`}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className='common_card_content'>No data available</div>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-4">
                                                <div class="common_main_heading_wrapper">
                                                    <h1>Trips</h1>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row row-cols-sm-2 g-4">
                                                        {response?.data?.content?.length > 0 ? response?.data?.content?.map((r_trip, index) => {
                                                            return (
                                                                <div className="col" key={index}>
                                                                    <div className="trip_item_blk">
                                                                        {/* <h2 className="date_title">{formatStringDate(r_trip?.date)}</h2> */}

                                                                        <div className="common-card-wrapper trip_item">
                                                                            <div className="common_card_header hstack justify-content-end gap-3 flex-wrap border-0">
                                                                                <p>{(r_trip?.startTime && r_trip?.endTime) ? `${formatDate(r_trip?.startTime)} - ${formatDate(r_trip?.endTime)}` : '-'}</p>
                                                                            </div>
                                                                            <div className="common_card_content">
                                                                                <div className="common_card_item_row hstack justify-content-evenly gap-4 flex-wrap">
                                                                                    <div className="common_card_item_col">
                                                                                        <h3 className="common_card_title">Type</h3>
                                                                                        <p className="common_card_context">{r_trip?.categoryId ? categoryName(r_trip?.categoryId) : '-'}</p>
                                                                                    </div>
                                                                                    <div className="common_card_item_col">
                                                                                        <h3 className="common_card_title">Distance</h3>
                                                                                        <p className="common_card_context">{r_trip?.distance ? `${r_trip?.distance?.toFixed(2)} miles` : '-'}</p>
                                                                                    </div>
                                                                                    <div className="common_card_item_col">
                                                                                        <h3 className="common_card_title">Potential</h3>
                                                                                        <p className="common_card_context">${r_trip?.potentialEarnings ? r_trip?.potentialEarnings : '0'}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="trip_location_blk">
                                                                                    <span className="total_time_of_trip">{r_trip?.trip?.travelTime || '-'}</span>
                                                                                    <div className="trip_location_card">
                                                                                        <div className="trip_blk">
                                                                                            <span className="map_pin_img">
                                                                                                <img src="/assets/images/map-pin-yellow.svg" alt="location" />
                                                                                            </span>
                                                                                            <span className="location_info">
                                                                                                <span className="location_info_list">
                                                                                                    <span className="location_info_title d-block">{r_trip?.startLocation?.locationName || ''} </span>
                                                                                                    <span className="location_info_detail d-block">{r_trip?.startLocation?.address || ''} </span>
                                                                                                </span>
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="trip_blk">
                                                                                            <span className="map_pin_img">
                                                                                                <img src="/assets/images/map-pin.svg" alt="location" />
                                                                                            </span>
                                                                                            <span className="location_info">
                                                                                                <span className="location_info_list">
                                                                                                    <span className="location_info_title d-block">{r_trip?.destinationLocation?.locationName || ''} </span>
                                                                                                    <span className="location_info_detail d-block">{r_trip?.destinationLocation?.address || ''} </span>
                                                                                                </span>
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                            :
                                                            <div className='col'>No data available</div>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section >
                                </>
                                :
                                <>

                                    <div className="breadcrumb_wrapper spacer-y pb-0">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="page-header">
                                                        <nav className="breadcrumb_nav">
                                                            <ul className="breadcrumb mb-0">
                                                                <li className="breadcrumb-item"><Link to='/dashboard/teams/reimbursement'>Reimbursement</Link></li>
                                                                <li className="breadcrumb-item text-capitalize">Reimbursement Details</li>
                                                            </ul>
                                                        </nav>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                    <section className="main-section spacer-y pt-3">
                                        <div className="container">
                                            <div className="row gy-4">
                                                <div className="col-xl-12">
                                                    <div className="common_main_heading_wrapper justify-content-end mb-4">
                                                        <div className="d-flex align-items-center flex-end gap-3">

                                                            <div class="d-flex flex-end gap-3">

                                                                <button class="outline-btn" type='button' onClick={() => { setRejected(prev => !prev); handleSubmitReport() }}>{(submitLoading && rejected) ? <PulseLoader color='#ffffff' size={14} /> : 'Reject'}</button>
                                                                <button class="primary-btn" type="button" onClick={() => { setAccepted(prev => !prev); handleSubmitReport() }}>{(submitLoading && accepted) ? <PulseLoader color='#ffffff' size={14} /> : 'Accept'}</button>

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row row-cols-sm-2 g-4">
                                                <div className="col">
                                                    <div className="common-card-wrapper">
                                                        <div className="common_card_header hstack justify-content-between gap-3 flex-wrap">
                                                            <h2>{response?.data?.reportDetails[0]?.name || ''}</h2>
                                                            <p>{response?.data?.reportDetails[0]?.createdAt ? formatDate(response?.data?.reportDetails[0]?.createdAt) : '-'}</p>
                                                        </div>
                                                        {(response?.data?.reportDetails[0]?.user && response?.data?.reportDetails[0]?.vehicle) ?
                                                            <div className="common_card_content">
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Driver’s name</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.user?.fullName || ''}</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">License plate number</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.vehicle?.licensePlate}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Vehicle</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.vehicle?.name}</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Type</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.category?.name}</p>
                                                                    </div>
                                                                </div>
                                                            </div> :
                                                            <div className='common_card_content'>No data available</div>}

                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="common-card-wrapper">
                                                        <div className="common_card_header hstack justify-content-between gap-3 flex-wrap">
                                                            <h2>Summary</h2>
                                                        </div>
                                                        {response?.data?.data?.summaryDetails ?
                                                            <div className="common_card_content">
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Mileage rate</h3>
                                                                        <p className="common_card_context">${response?.data?.data?.summaryDetails?.rateValue || 0}/miles</p>
                                                                    </div>
                                                                    <div class="common_card_item_col">
                                                                        <h3 class="common_card_title">Bills</h3>
                                                                        <p class="common_card_context">{response?.data?.data?.summaryDetails?.totalBills || 0}</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Amount</h3>
                                                                        <p className="common_card_context">${response?.data?.data?.summaryDetails?.totalAmount || 0}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <p className="common_card_context">Total</p>
                                                                    </div>
                                                                    {/* <div className="common_card_item_col">
                                                                    <p className="common_card_context">{response?.data?.data?.totalSummary?.totalDistance ? `${response?.data?.data?.totalSummary?.totalDistance.toFixed(2)}/miles` : `${0}/miles`}</p>
                                                                </div> */}
                                                                    <div className="common_card_item_col">
                                                                        <p className="common_card_context">{`$${response?.data?.data?.totalSummary?.totalAmount}`}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className='common_card_content'>No data available</div>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row mt-4">
                                                <div class="common_main_heading_wrapper">
                                                    <h1>Expenses</h1>
                                                </div>
                                                <div class="col-12">
                                                    <div class="row row-cols-sm-2 g-4">
                                                        {response?.data?.content?.length > 0 ? response?.data?.content?.map((r_expense, index) => {
                                                            return (
                                                                <div class="col" key={index}>
                                                                    <div class="trip_item_blk">
                                                                        <h2 class="date_title">{r_expense?.createdAt ? formatDate(r_expense?.createdAt) : '-'}</h2>
                                                                        <div class="common-card-wrapper trip_item">
                                                                            <div class="common_card_content">
                                                                                <div class="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                                    <div class="common_card_item_col">
                                                                                        <h3 class="common_card_title">Type</h3>
                                                                                        <p class="common_card_context">{r_expense?.categoryId ? categoryName(r_expense?.categoryId) : '-'}</p>
                                                                                    </div>
                                                                                    <div class="common_card_item_col">
                                                                                        <h3 class="common_card_title">Potential</h3>
                                                                                        <p class="common_card_context">${r_expense?.amount || 0}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                                    <div class="common_card_item_col">
                                                                                        <h3 class="common_card_title">Maintenance</h3>
                                                                                        <p class="common_card_context">{r_expense?.merchantName || ''}</p>
                                                                                    </div>
                                                                                    <div class="common_card_item_col">
                                                                                        <h3 class="common_card_title">{r_expense?.dateTime ? formatDate(r_expense?.dateTime) : '-'}</h3>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            )
                                                        })
                                                            :
                                                            <div className='col'>No data available</div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section >
                                </>
                        )
            }
        </>
    )
}

export default ReimbursementDetail