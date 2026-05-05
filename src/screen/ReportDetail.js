import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { GetReportDetailApi } from '../redux/actions/reports/GetReportDetailAction';
import { PulseLoader } from 'react-spinners';
import { formatDate, formatDateTime } from '../helpers/dateTime';
import { DeleteReportAPI } from '../redux/actions/reports/DeleteReportAction';
import { deleteReportStateReset } from '../redux/slices/reports/DeleteReportSlice';
import Swal from 'sweetalert2';
import { UpdateReportAPI } from '../redux/actions/reports/UpdateReportAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { UpdateReportStateReset } from '../redux/slices/reports/UpdateReportSlice';
import { GeneratePdfReportAPI } from '../redux/actions/reports/GeneratePdfReportAction';
import { GenerateXlsReportAPI } from '../redux/actions/reports/GenerateXlsReportAction';
import { generatePdfReportStateReset } from '../redux/slices/reports/GeneratePdfReportSlice';
import { generateXlsReportRequest, generateXlsReportStateReset } from '../redux/slices/reports/GenerateXlsReportSlice';
import { SendReportMailAPI } from '../redux/actions/reports/ReportMailAction';
import { SubmitReportAPI } from '../redux/actions/reports/SubmitReportAction';
import { submitReportStateReset } from '../redux/slices/reports/SubmitReportSlice';
import { RenameReportAPI } from '../redux/actions/reports/RenamReportAction';

const ReportDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { type, name, startDate, endDate } = location.state || {};

    const [reportName, setReportName] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const { response, loading, error } = useSelector((state) => state.reportDetail)
    const { response: deleteReportResponse, loading: deleteReportLoading, error: deleteReportError } = useSelector((state) => state.deleteReport)
    const { response: submitReportResponse, loading: submitReportLoading, error: submitReportError } = useSelector((state) => state.submitReport)
    const { response: mailResponse, loading: mailLoading, error: mailError } = useSelector((state) => state.mailReport)
    const { response: pdfReportResponse, loading: pdfReportLoading, error: pdfReportError } = useSelector((state) => state.generatePdfReport)
    const { response: xlsReportResponse, loading: xlsReportLoading, error: xlsReportError } = useSelector((state) => state.generateXlsReport)
    const { response: UpdateReportResponse, loading: UpdateReportLoading, error: UpdateReportError } = useSelector((state) => state.renameReport)
    const formatStringDate = (dateStr) => {
        if (!dateStr) return '-';
        const safeDateStr = dateStr.replace(/-/g, '/'); // "2025-08-20" → "2025/08/20"
        const date = new Date(safeDateStr);
        if (isNaN(date)) return '-'; // fallback for invalid dates

        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

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


    const validateForm = () => {
        const newErrors = {};

        if (!reportName) {
            newErrors.reportName = 'Report Name is required';
        }
        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };
    const typeToSend = type === 'trips' ? 'trip' : 'expense'

    const categoryName = (v) => {
        switch (v) {
            case '67650053bd020f2a50f1c162':
                return 'Personal'
            case '6765006fbd020f2a50f1c169':
                return 'Business'
            case '6765007dbd020f2a50f1c16d':
                return 'Charity'
            case '67650085bd020f2a50f1c171':
                return 'Medical'
            default:
                return ''
        }
    }

    const handleDeleteReport = useCallback(async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this report?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#49a496',
            cancelButtonColor: '#ffffff',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel',
            customClass: {
                cancelButton: 'custom-cancel-btn'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await dispatch(DeleteReportAPI({ id: id }))

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }, [dispatch]);

    const handleGeneratePdfReport = async () => {
        try {
            await dispatch(GeneratePdfReportAPI({ id: id, type: typeToSend }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleGenerateXlsReport = async () => {
        try {
            await dispatch(GenerateXlsReportAPI({ id: id, type: typeToSend }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            await dispatch(RenameReportAPI({ name: reportName }, { id: id }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    const sendMail = async () => {

        try {
            await dispatch(SendReportMailAPI({ type: typeToSend, id: id }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleSubmitReport = async () => {
        try {
            await dispatch(SubmitReportAPI({ status: 1 }, { id: id }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    useEffect(() => {
        if (id) {
            dispatch(GetReportDetailApi({ id: id }))
        }
    }, [id, UpdateReportResponse])

    useEffect(() => {
        if (name) {
            setReportName(name);
        }
    }, [name])

    useEffect(() => {
        if (deleteReportResponse) {
            showSuccessToast(deleteReportResponse?.message)
            dispatch(deleteReportStateReset());
            try {
                const dropdownToggle = document.getElementById('delete-rename-report-dropdown');
                if (dropdownToggle) {
                    let dropdownInstance = window.bootstrap.Dropdown.getInstance(dropdownToggle);
                    if (!dropdownInstance) {
                        dropdownInstance = new window.bootstrap.Dropdown(dropdownToggle);
                    }
                    dropdownInstance.hide();
                }
            } catch (error) {
                showErrorToast(error);
            }
            navigate('/dashboard/reports');
        }
    }, [deleteReportResponse]);

    useEffect(() => {
        if (deleteReportError) {
            showErrorToast(deleteReportError?.data)
            dispatch(deleteReportStateReset());
        }
    }, [deleteReportError])

    useEffect(() => {
        if (mailResponse) {
            showSuccessToast(mailResponse?.message)
        }
    }, [mailResponse]);

    useEffect(() => {
        if (mailError) {
            showErrorToast(mailError?.data)
        }
    }, [mailError])


    console.log(response, "response")
    useEffect(() => {
        if (pdfReportResponse) {
            try {
                let blob;

                if (pdfReportResponse instanceof Blob) {
                    // If already a Blob, use it directly
                    blob = pdfReportResponse;
                } else if (typeof pdfReportResponse === 'string') {
                    // If raw PDF string, convert to Uint8Array for proper Blob creation

                    // Convert string to Uint8Array
                    const uint8Array = new Uint8Array(pdfReportResponse.length);
                    for (let i = 0; i < pdfReportResponse.length; i++) {
                        uint8Array[i] = pdfReportResponse.charCodeAt(i);
                    }
                    blob = new Blob([uint8Array], { type: 'application/pdf' });
                } else {
                    // If some other type (e.g. ArrayBuffer), wrap in Blob directly
                    blob = new Blob([pdfReportResponse], { type: 'application/pdf' });
                }

                // Create URL and trigger download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'report.pdf';  // filename for download
                document.body.appendChild(a);
                a.click();

                // Clean up
                a.remove();
                window.URL.revokeObjectURL(url);

                showSuccessToast('Report downloaded Successfully');

                // Close dropdown manually after successful save
                try {
                    const dropdownToggle = document.getElementById('download-report-dropdown');
                    if (dropdownToggle) {
                        let dropdownInstance = window.bootstrap.Dropdown.getInstance(dropdownToggle);
                        if (!dropdownInstance) {
                            dropdownInstance = new window.bootstrap.Dropdown(dropdownToggle);
                        }
                        dropdownInstance.hide();
                    }
                } catch (error) {
                    showErrorToast(error);
                }
            } catch (error) {
                showErrorToast(error);
            }

            // dispatch(generatePdfReportStateReset());
        }
    }, [pdfReportResponse]);

    useEffect(() => {
        if (pdfReportError) {
            showErrorToast(pdfReportError?.data)
            // dispatch(generatePdfReportStateReset());
        }
    }, [pdfReportError])

    useEffect(() => {
        if (xlsReportResponse) {
            try {
                const blob = xlsReportResponse instanceof Blob
                    ? xlsReportResponse
                    : new Blob([xlsReportResponse], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                // Create a URL for the blob
                const url = window.URL.createObjectURL(blob);

                // Create a temporary anchor element to trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = 'report.xls';  // filename for download
                document.body.appendChild(a);
                a.click();

                // Clean up
                a.remove();
                window.URL.revokeObjectURL(url);
                showSuccessToast('Report downloaded Successfully');
                try {
                    // Close dropdown manually after successful save
                    const dropdownToggle = document.getElementById('download-report-dropdown');
                    if (dropdownToggle) {
                        let dropdownInstance = window.bootstrap.Dropdown.getInstance(dropdownToggle);
                        if (!dropdownInstance) {
                            dropdownInstance = new window.bootstrap.Dropdown(dropdownToggle);
                        }
                        dropdownInstance.hide();
                    }
                } catch (error) {
                    showErrorToast(error)
                }

            } catch (error) {
                showErrorToast(error)
            }
            // dispatch(generateXlsReportStateReset());
        }
    }, [xlsReportResponse]);

    useEffect(() => {
        if (xlsReportError) {
            showErrorToast(xlsReportError?.data)
            // dispatch(generateXlsReportStateReset());
        }
    }, [xlsReportError])

    useEffect(() => {
        if (UpdateReportResponse) {
            showSuccessToast(UpdateReportResponse?.message);
            dispatch(UpdateReportStateReset());
            const modalEl = document.getElementById('renameReport');
            if (modalEl && window.bootstrap) {
                const bsOffmodal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal.getInstance(modalEl);
                bsOffmodal.hide();
            }
            try {
                const dropdownToggle = document.getElementById('delete-rename-report-dropdown');
                if (dropdownToggle) {
                    let dropdownInstance = window.bootstrap.Dropdown.getInstance(dropdownToggle);
                    if (!dropdownInstance) {
                        dropdownInstance = new window.bootstrap.Dropdown(dropdownToggle);
                    }
                    dropdownInstance.hide();
                }
            } catch (error) {
                showErrorToast(error);
            }
        }
    }, [UpdateReportResponse]);

    useEffect(() => {
        if (UpdateReportError) {
            showErrorToast(UpdateReportError?.data)
            dispatch(UpdateReportStateReset());
        }
    }, [UpdateReportError])

    useEffect(() => {
        if (submitReportResponse) {
            showSuccessToast(submitReportResponse?.message)
            dispatch(submitReportStateReset());
        }
    }, [submitReportResponse])

    useEffect(() => {
        if (submitReportError) {
            showErrorToast(submitReportError?.data)
            dispatch(submitReportStateReset());
        }
    }, [submitReportError])

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
                                                                <li className="breadcrumb-item"><Link to='/dashboard/reports'>Reports</Link></li>
                                                                <li className="breadcrumb-item text-capitalize">Report Details</li>
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
                                                                {response?.data?.content?.length > 0 &&
                                                                    <button class="primary-btn" onClick={handleSubmitReport}>{submitReportLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Submit Report'}</button>
                                                                }
                                                                <>
                                                                    <button className="no_bg-btn" onClick={sendMail} disabled={response?.data?.content?.length === 0}>
                                                                        {mailLoading ? <PulseLoader color='#000000' size={14} /> : <img src="/assets/images/mail-icon.svg" alt="mail" />}
                                                                    </button>
                                                                </>
                                                                <>
                                                                    {/* <button className="no_bg-btn dropdown-toggle" disabled id="download-report-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                                                        <img src="/assets/images/download-icon.svg" alt="Download" /></button>
                                                                    <ul className="dropdown-menu">
                                                                        <li><button className="dropdown-item" onClick={handleGeneratePdfReport}>{pdfReportLoading ? <PulseLoader color='#000000' size={14} /> : 'Pdf'}</button></li>
                                                                        <li><button className="dropdown-item" onClick={handleGenerateXlsReport}>{xlsReportLoading ? <PulseLoader color='#000000' size={14} /> : 'Xls'}</button></li>
                                                                    </ul> */}
                                                                    <button className="no_bg-btn" onClick={handleGeneratePdfReport} disabled={response?.data?.content?.length === 0}>
                                                                        {pdfReportLoading ? <PulseLoader color='#000000' size={14} /> : <img src="/assets/images/download-icon.svg" alt="Download" />}</button>
                                                                    {/* <ul className="dropdown-menu">
                                                                        <li><button className="dropdown-item" onClick={handleGeneratePdfReport}>{pdfReportLoading ? <PulseLoader color='#000000' size={14} /> : 'Pdf'}</button></li>
                                                                        <li><button className="dropdown-item" onClick={handleGenerateXlsReport}>{xlsReportLoading ? <PulseLoader color='#000000' size={14} /> : 'Xls'}</button></li>
                                                                    </ul> */}
                                                                </>
                                                                <>
                                                                    <button className="no_bg-btn dropdown-toggle" id="delete-rename-report-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                                                        <img src="/assets/images/option-list-icon.svg" alt="Option" /></button>
                                                                    <ul className="dropdown-menu">
                                                                        <li><button className="dropdown-item" onClick={handleDeleteReport}>{deleteReportLoading ? <PulseLoader color='#000000' size={14} /> : 'Delete Report'}</button></li>
                                                                        <li><button className="dropdown-item" data-bs-toggle="modal"
                                                                            data-bs-target="#renameReport">Rename Report</button></li>
                                                                    </ul>

                                                                </>
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
                                                        {response?.data?.reportDetails[0] ?
                                                            <div className="common_card_content">
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Mileage rate</h3>
                                                                        <p className="common_card_context">$0/miles</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Distance</h3>
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.totalMiles ? response?.data?.reportDetails[0]?.totalMiles?.toFixed(2) : 0}/miles</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Amount</h3>
                                                                        <p className="common_card_context">${response?.data?.reportDetails[0]?.totalPotential ? response?.data?.reportDetails[0]?.totalPotential?.toFixed(2) : 0}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <p className="common_card_context">Total</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <p className="common_card_context">{response?.data?.reportDetails[0]?.totalMiles ? response?.data?.reportDetails[0]?.totalMiles?.toFixed(2) : 0}/miles</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <p className="common_card_context">${response?.data?.reportDetails[0]?.totalPotential ? response?.data?.reportDetails[0]?.totalPotential?.toFixed(2) : 0}</p>
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
                                                    {response?.data?.content?.length > 0 &&
                                                        <div class="d-flex flex-end gap-3">
                                                            <button class="primary-btn" onClick={() => { navigate('/dashboard/trips', { state: { typeToSend: type, reportId: response?.data?.reportDetails[0]?._id, categoryFromReports: response?.data?.reportDetails[0]?.categoryId, vehicleFromReports: response?.data?.reportDetails[0]?.vehicleId, checkbox: true, filtersDisable: true } }) }}>+Add Trips</button>
                                                        </div>
                                                    }
                                                </div>
                                                {
                                                    response?.data?.content?.length === 0 &&
                                                    <div className="common-card">
                                                        <div className="min-height_blk">
                                                            <div className="space_card">
                                                                <div className="vehicle_thumb_blk mb-5">
                                                                    <img src="/assets/images/car-img.png" alt="car" />
                                                                </div>
                                                                <h2 className="fs-6 fw-medium text-center my-4">There are no trips in this report</h2>
                                                                <div className="d-flex justify-content-center gap-3 mt-4 mt-md-4">
                                                                    <button className="primary-btn" onClick={() => { navigate('/dashboard/trips', { state: { openOffCanvas: true, typeToSend: type, reportId: response?.data?.reportDetails[0]?._id, categoryFromReports: response?.data?.reportDetails[0]?.categoryId, vehicleFromReports: response?.data?.reportDetails[0]?.vehicleId, checkbox: true, filtersDisable: true } }) }}>+Add Trips</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="col-12">
                                                    <div className="row row-cols-sm-2 g-4">
                                                        {response?.data?.content?.length > 0 && response?.data?.content?.map((r_trip, index) => {
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
                                                            //     :
                                                            // <div className='col'>No data available</div>
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
                                                                <li className="breadcrumb-item"><Link to='/dashboard/reports'>Reports</Link></li>
                                                                <li className="breadcrumb-item text-capitalize">Expense Details</li>
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
                                                                {response?.data?.content?.length > 0 &&
                                                                    <button class="primary-btn" onClick={handleSubmitReport}>{submitReportLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Submit Report'}</button>
                                                                }

                                                                <>
                                                                    <button className="no_bg-btn" onClick={sendMail} disabled={response?.data?.content?.length === 0}>
                                                                        {mailLoading ? <PulseLoader color='#000000' size={14} /> : <img src="/assets/images/mail-icon.svg" alt="mail" />}
                                                                    </button>
                                                                </>
                                                                <>
                                                                    {/* <button className="no_bg-btn dropdown-toggle" disabled id="download-report-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                                                        <img src="/assets/images/download-icon.svg" alt="Download" /></button>
                                                                    <ul className="dropdown-menu">
                                                                        <li><button className="dropdown-item" onClick={handleGeneratePdfReport}>{pdfReportLoading ? <PulseLoader color='#000000' size={14} /> : 'Pdf'}</button></li>
                                                                        <li><button className="dropdown-item" onClick={handleGenerateXlsReport}>{xlsReportLoading ? <PulseLoader color='#000000' size={14} /> : 'Xls'}</button></li>
                                                                    </ul> */}
                                                                    <button className="no_bg-btn" onClick={handleGeneratePdfReport} disabled={response?.data?.content?.length === 0}>
                                                                        {pdfReportLoading ? <PulseLoader color='#000000' size={14} /> : <img src="/assets/images/download-icon.svg" alt="Download" />}</button>
                                                                </>
                                                                <>
                                                                    <button className="no_bg-btn dropdown-toggle" id="delete-rename-report-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                                                                        <img src="/assets/images/option-list-icon.svg" alt="Option" /></button>
                                                                    <ul className="dropdown-menu">
                                                                        <li><button className="dropdown-item" onClick={handleDeleteReport}>{deleteReportLoading ? <PulseLoader color='#000000' size={14} /> : 'Delete Report'}</button></li>
                                                                        <li><button className="dropdown-item" data-bs-toggle="modal"
                                                                            data-bs-target="#renameReport">Rename Report</button></li>
                                                                    </ul>

                                                                </>
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
                                                        {response?.data?.reportDetails[0] ?
                                                            <div className="common_card_content">
                                                                <div className="common_card_item_row hstack justify-content-between gap-4 flex-wrap">
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Mileage rate</h3>
                                                                        <p className="common_card_context">$0/miles</p>
                                                                    </div>
                                                                    <div class="common_card_item_col">
                                                                        <h3 class="common_card_title">Bills</h3>
                                                                        <p class="common_card_context">0</p>
                                                                    </div>
                                                                    <div className="common_card_item_col">
                                                                        <h3 className="common_card_title">Amount</h3>
                                                                        <p className="common_card_context">${response?.data?.reportDetails[0]?.totalPotential ? response?.data?.reportDetails[0]?.totalPotential?.toFixed(2) : 0}</p>
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
                                                                        <p className="common_card_context">{`$${response?.data?.reportDetails[0]?.totalPotential || 0}`}</p>
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
                                                    {response?.data?.content?.length > 0 &&
                                                        <div class="d-flex flex-end gap-3">
                                                            <button class="primary-btn" onClick={() => { navigate('/dashboard/expenses', { state: { typeToSend: type, reportId: response?.data?.reportDetails[0]?._id, categoryFromReports: response?.data?.reportDetails[0]?.categoryId, vehicleFromReports: response?.data?.reportDetails[0]?.vehicleId, checkbox: true, filtersDisable: true } }) }}>+Add Expenses</button>
                                                        </div>
                                                    }
                                                </div>
                                                {
                                                    response?.data?.content?.length === 0 &&
                                                    <div className="common-card">
                                                        <div className="min-height_blk">
                                                            <div className="space_card">
                                                                <div className="vehicle_thumb_blk mb-5">
                                                                    <img src="/assets/images/car-img.png" alt="car" />
                                                                </div>
                                                                <h2 className="fs-6 fw-medium text-center my-4">There are no expenses in this report</h2>
                                                                <div className="d-flex justify-content-center gap-3 mt-4 mt-md-4">
                                                                    <button className="primary-btn" onClick={() => { navigate('/dashboard/expenses', { state: { openOffCanvas: true, typeToSend: type, reportId: response?.data?.reportDetails[0]?._id, categoryFromReports: response?.data?.reportDetails[0]?.categoryId, vehicleFromReports: response?.data?.reportDetails[0]?.vehicleId, checkbox: true, filtersDisable: true } }) }}>+Add Expenses</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                <div class="col-12">
                                                    <div class="row row-cols-sm-2 g-4">
                                                        {response?.data?.content?.length > 0 && response?.data?.content?.map((r_expense, index) => {
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
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section >
                                </>




                        )

            }
            < div className="modal fade" id="renameReport" tabIndex={-1} aria-labelledby="renameReportLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content border-0">
                        <div className="modal-header border-0">
                            <h2 className="modal-title fs-5" id="crenameReportLabel">Rename Report</h2>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                                setReportName(name);
                                setValidationErrors('');
                            }} />
                        </div>
                        <div className="modal-body py-2">
                            <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                <div className="ofcvs_form_item">
                                    <label>Report Name</label>
                                    <div className="ofcvs_form_field">
                                        <input type="text" className="form-control" placeholder="Enter report name" value={reportName} onKeyDown={(e) => {

                                            if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                e.preventDefault();
                                            }
                                        }}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setReportName(value);
                                                if (validationErrors.reportName) {
                                                    setValidationErrors(prev => ({ ...prev, reportName: false }));
                                                }
                                            }} />
                                    </div>
                                </div>
                                {validationErrors.reportName &&
                                    (
                                        <span className={`error ${validationErrors.reportName ? '' : 'd-none'}`}>{validationErrors.reportName}</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="modal-footer p-3 border-0">
                            <button type="button" className="primary-btn m-0" onClick={handleUpdate}>{UpdateReportLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Rename Report'}</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ReportDetail