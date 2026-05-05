import React, { useCallback, useContext, useEffect, useState } from 'react'
import { formatDate, formatDateTime, formatTime } from '../helpers/dateTime';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteExpenseAPI } from '../redux/actions/expenses/DeleteExpenseAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { deleteExpenseStateReset } from '../redux/slices/expenses/DeleteExpenseSlice';
import { ClipLoader } from 'react-spinners';
import { calculateDistanceInMiles } from '../helpers/utils';
import { formatProdErrorMessage } from '@reduxjs/toolkit';
import { Link, useNavigate } from 'react-router-dom';
import TripMapImage from './StaticMap';
import TripsImageModal from './TripsImageModal';
import { AuthContext } from '../context/AuthContext';
import { RemoveManagerApi } from '../redux/actions/teams/profile/RemoveManagerAction';
import { removeManagerStateReset } from '../redux/slices/teams/profile/RemoveManagerSlice';

const Table = ({ tableData, setDataList, columns, limit, currentPage, handlePageChange, targetId, detailClickable, targetViewId, targetTeamId, targetMemberId, selectedRows, setSelectedRows, handleSelectAll, handleRowCheckboxChange, targetEditId, setSelectedTrip, setSelectedExpense, setDeleted, setSelectedTeam, rowClick, setSelectedMember, activeTab, setRemovedManager }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { response, loading, error } = useSelector((state) => state.deleteExpense);
    const { response: removeManagerResponse, loading: removeManagerLoading, error: removeManagerError } = useSelector((state) => state.removeManager);
    const [selectedTripLocations, setSelectedTripLocations] = useState(null);
    const { parentTeamId } = useContext(AuthContext);

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

    const statusClassMap = {
        0: 'td-status st-draft',
        1: 'td-status st-pending',
        2: 'td-status st-approved',
        3: 'td-status st-rejected',
    };

    const statusClass = (status) => {
        return typeof status === 'number'
            ? statusClassMap[status] || ''
            : '';
    }

    const handleDownloadFile = async (url) => {
        if (!url) {
            showErrorToast('File URL not found');
            return;
        }
        try {
            // Extract a filename (optional)
            const fileName = url.split('/').pop().split('?')[0];

            // Create a hidden anchor to download the file
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // browser may use this if headers aren't set
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            showErrorToast(error)
        }
    };

    const handleDeleteExpense = useCallback(async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this expense?`,
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
                    await dispatch(DeleteExpenseAPI({ id }))

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }, [dispatch]);

    const handleRemoveManager = useCallback(async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to remove this manager?`,
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
                    await dispatch(RemoveManagerApi({ teamId: parentTeamId, memberId: id }))

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }, [dispatch]);

    // Function to render table row based on column data
    const renderRow = (row) => {
        // Map through the column names and display the corresponding data in each cell
        return columns?.map((col, colIndex) => {
            switch (col) {
                case 'Checkbox':
                    return <td key={colIndex}>
                        <span className="check-box">
                            <input
                                type="checkbox"
                                id={`check-${row._id}`}
                                checked={selectedRows?.includes(row._id)}
                                onChange={() => handleRowCheckboxChange(row._id)}
                            />
                            <label htmlFor={`check-${row._id}`} />
                        </span>
                    </td>
                case 'From':
                    // For 'From' column, show startLocationName or 'N/A' if not available
                    return <td key={colIndex}>
                        {row?.startLocationName ? row?.startLocationName : row?.startLocation?.locationName ? row?.startLocation?.locationName : '-'}</td>;
                case 'To':
                    // For 'To' column, show endLocationName or 'N/A' if not available
                    return <td key={colIndex}>{row?.endLocationName ? row?.endLocationName : row?.destinationLocation?.locationName ? row?.destinationLocation?.locationName : '-'}</td>;
                case 'Distance':
                    // For 'Distance' column, show distance in miles, formatted to 2 decimal places, or 'N/A' if not available
                    return <td key={colIndex}>{(row.startLocation.coordinates.latitude && row.startLocation.coordinates.longitude && row.destinationLocation.coordinates.latitude && row.destinationLocation.coordinates.longitude)
                        ? `${calculateDistanceInMiles(row.startLocation.coordinates.latitude,
                            row.startLocation.coordinates.longitude,
                            row.destinationLocation.coordinates.latitude,
                            row.destinationLocation.coordinates.longitude)} Miles` : '-'
                    }</td>;
                case 'Date':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.startTime ? formatDate(row?.startTime) : row?.date ? formatDate(row?.date) : '-'}</td>;
                case 'Place Name':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.placeName || '-'}</td>;
                case 'Code':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.code || '-'}</td>;
                case 'Export Type':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.exportType || '-'}</td>;
                case 'Date Range':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.fromDate ? formatDate(row?.fromDate) : '-'}</td>;
                case 'Total Potential':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.totalPotential ? row?.totalPotential?.toFixed(2) : '0'}</td>;
                case 'Expires In':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.toDate ? formatDate(row?.toDate) : '-'}</td>;
                case 'Created':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.createdAt ? formatDate(row?.createdAt) : '-'}</td>;
                case 'Download':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}><button className="border-0 bg-white" type='button' onClick={() => handleDownloadFile(row?.fileName)}><img src="/assets/images/download-icon.svg" alt="download" /></button>
                    </td>;
                case 'Emplyee Id':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.employeeId || '-'}</td>;
                case 'Phone Number':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.phoneNumber || '-'}</td>;
                case 'Street Address':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.address || '-'}</td>;
                case 'Role Description':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.description || '-'}</td>;
                case 'Users':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.count || '0'}</td>;
                case 'Email':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.email || '-'}</td>;
                case 'Team Kms':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.teamKms ? row?.teamKms?.toFixed(2) : '0'}</td>;
                case 'Unclassified Kms':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.unclassifiedKms ? row?.unclassifiedKms?.toFixed(2) : '0'}</td>;
                case 'Total Kms':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.totalKms ? row?.totalKms?.toFixed(2) : '0'}</td>;
                case 'Team':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.teamName || row?.team || '-'}</td>;
                case 'Role':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    switch (row.role) {
                        case 'members':
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Member
                                </td>
                            );
                        case 'teamManager':
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Manager
                                </td>
                            );
                        case 'managerLimited':
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Manager Limited
                                </td>
                            );
                        case 'reviewer':
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Reviewer
                                </td>
                            );
                        case 'superAdmin':
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Super Admin
                                </td>
                            );
                        case 1:
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Super Admin
                                </td>
                            );
                        case 3:
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Team Manager
                                </td>
                            );
                        case 4:
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Manager Limited
                                </td>
                            );
                        case 5:
                            // For example, show formatted role name
                            return (
                                <td key={colIndex}>
                                    Member
                                </td>
                            );
                        default:
                            return <td key={colIndex}>{'-'}</td>;
                    }

                case 'City':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.city || '-'}</td>;
                // case 'Team':
                //     // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                //     return <td key={colIndex}>{row?.team || '-'}</td>;
                case 'Miles':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{(row?.recent?.startLocation?.coordinates?.latitude && row?.recent?.startLocation?.coordinates?.longitude && row?.recent?.destinationLocation?.coordinates?.latitude && row?.recent?.destinationLocation?.coordinates?.longitude)
                        ? `${calculateDistanceInMiles(row?.recent?.startLocation?.coordinates?.latitude,
                            row?.recent?.startLocation?.coordinates?.longitude,
                            row?.recent?.destinationLocation?.coordinates?.latitude,
                            row?.recent?.destinationLocation?.coordinates?.longitude)} Miles` : row?.totalMiles ? row?.totalMiles?.toFixed(2) : '0'
                    }</td>;
                case 'Name':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.name || row?.fullName || '-'}</td>;
                case 'Status':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}><span className={statusClass(row?.status)}>{typeof row?.status === 'number' ? getStatus(row?.status) : (row?.status || '-')}</span></td>;
                case 'Locations':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return (<td key={colIndex}>
                        <span className="td_location_indicator i-green">{
                            row?.recent?.startTime && row?.recent?.startLocation
                                ? `${formatTime(row?.recent?.startTime)} ${row?.recent?.startLocation?.locationName}`
                                : ''
                        }</span>
                        <span className="td_location_indicator i-red">{row?.recent?.endTime && row?.recent?.destinationLocation
                            ? `${formatTime(row?.recent?.endTime)} ${row?.recent?.destinationLocation?.locationName}`
                            : ''}</span>
                    </td >);
                case 'Roles':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.roles || row?.role || '-'}</td>;
                case 'Maps':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>
                        <div className='position-relative map_outline_icon'>
                            <button className="border-0 bg-white dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false"
                                // data-bs-target="#tripsImage"
                                onClick={() =>
                                    setSelectedTripLocations({
                                        fromLocation: row?.recent?.startLocation,
                                        toLocation: row?.recent?.destinationLocation,
                                    })
                                } ><img src="/assets/images/map-line-img.svg" alt="Map" /></button>
                            <TripsImageModal selectedTripLocations={selectedTripLocations} />
                        </div>
                    </td >;
                case 'Team Name':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.name || '-'}</td>;
                case ' ':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}><Link
                        to={{
                            pathname: '/dashboard/teams/members',
                        }}
                        state={{ id: row._id, viewProfile: true }}
                        className="primary-text-btn"
                    >View Profile</Link></td>
                case '  ':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>
                        <button className="remove_btn border-0 bg-white dropdown-toggle" type="button" onClick={() => handleRemoveManager(row._id)}><img src="/assets/images/close-gray-icon.svg" alt="remove" /></button>
                        <div className="sm_card dropdown-menu">
                            <h4 className="fs-14 fw-medium text-black mb-0">Are you sure want to remove this manager?</h4>
                            <div className="hstack justify-content-end gap-2 mt-3">
                                <button className="outline-btn p-2">No</button>
                                <button className="primary-btn p-2">Yes</button>
                            </div>
                        </div>
                    </td>

                case 'Team Managers':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.managerName || '-'}</td>;
                case 'Created On':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.createdAt ? formatDate(row?.createdAt) : '-'}</td>;
                case 'Parent Team':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.parentTeamName || '-'}</td>;
                case 'Vehicle':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{typeof row?.vehicle === 'object' && row?.vehicle !== null
                        ? row?.vehicle?.name || '-'
                        : row?.vehicle || '-'}</td>;
                case 'Date Duration':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.startDate && row?.endDate ? `${formatDate(row?.startDate)} - ${formatDate(row?.endDate)}` : '-'}</td>;
                case 'Trips':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.tripCount || '0'}</td>;
                case 'Potentials':
                    // For 'Date' column, format the createdAt date using formatDate function, or show 'N/A' if not available
                    return <td key={colIndex}>{row?.totalPotential ? row?.totalPotential?.toFixed(2) : '0'}</td>;
                case 'Type':
                    // For 'Type' column, capitalize the tripType or show 'N/A' if not available
                    return <td key={colIndex}>{row?.tripType ? (row?.tripType).charAt(0)
                        .toUpperCase() + (row?.tripType)
                            .slice(1)
                            .toLowerCase() : row?.tripType ? (row?.tripType).charAt(0)
                                .toUpperCase() + (row?.tripType)
                                    .slice(1)
                                    .toLowerCase() : '-'}</td>;
                case 'Time':
                    // For 'Time' column, show travelTime or 'N/A' if not available
                    return <td key={colIndex}>{row?.travelTime || '-'}</td>;
                case 'Date & Time':
                    // For 'Time' column, show travelTime or 'N/A' if not available
                    return <td key={colIndex}>{row?.dateTime ? formatDateTime(row?.dateTime) : '-'}</td>;
                case 'Travel Time':
                    // For 'Time' column, show travelTime or 'N/A' if not available
                    return <td key={colIndex}>{row?.travelTime || 'N/A'}</td>;
                case 'Total Trips':
                    // For 'Time' column, show travelTime or 'N/A' if not available
                    return <td key={colIndex}>{row?.tripCount || '0'}</td>;
                case 'Total Expenses':
                    // For 'Time' column, show travelTime or 'N/A' if not available
                    return <td key={colIndex}>{row?.tripexpenseCount || '0'}</td>;
                case 'Potential':
                    // For 'Potential' column, show potential earnings formatted to 2 decimal places, or 'N/A' if not available
                    return <td key={colIndex}>{row?.potentialEarnings ? `$${row?.potentialEarnings.toFixed(2)}` : '0'}</td>;
                case 'Expense Name':
                    return <td key={colIndex}>{row?.name || '-'}</td>;
                case 'Merchant Name':
                    return <td key={colIndex}>{row?.merchantName || '-'}</td>;
                case 'Amount':
                    return <td key={colIndex}>{row?.amount ? `$${row?.amount.toFixed(2)}` : row?.amount === 0 ? '$0.00' : '-'}</td>;
                // case 'Status':
                //     return <td key={colIndex}>{row?.status ? getStatus(row?.status) : '-'}</td>;
                case 'Notes':
                    return <td key={colIndex}>
                        {row?.note
                            ? Array.isArray(row.note)
                                ? row.note.join(', ')
                                : row.note
                            : 'N/A'}
                    </td>;
                case 'Map':
                    return <td key={colIndex}>
                        <button className="border-0 bg-white" type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target={`#${targetId}`}
                            aria-controls={`#${targetId}`}
                            onClick={() => setSelectedTrip(row)}>
                            <img src="/assets/images/map-img.png" alt="Map" /></button>
                    </td>
                case 'Action':
                    return (<td key={colIndex}>
                        {/* <span className="table-action">
                            <button className="table-eye"
                                data-bs-toggle="offcanvas"
                                data-bs-target={`#${targetTeamId}`}
                                aria-controls={`#${targetTeamId}`}
                                onClick={() => setSelectedTeam(row)}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.9834 9.99993C12.9834 11.6499 11.6501 12.9833 10.0001 12.9833C8.35006 12.9833 7.01672 11.6499 7.01672 9.99993C7.01672 8.34993 8.35006 7.0166 10.0001 7.0166C11.6501 7.0166 12.9834 8.34993 12.9834 9.99993Z" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M9.99999 16.8918C12.9417 16.8918 15.6833 15.1584 17.5917 12.1584C18.3417 10.9834 18.3417 9.00843 17.5917 7.83343C15.6833 4.83343 12.9417 3.1001 9.99999 3.1001C7.05832 3.1001 4.31666 4.83343 2.40833 7.83343C1.65833 9.00843 1.65833 10.9834 2.40833 12.1584C4.31666 15.1584 7.05832 16.8918 9.99999 16.8918Z" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </span> */}
                        <span className="table-action">
                            <button className="table-eye"
                                onClick={() => navigate('/dashboard/teams/profile', { state: { id: row._id } })}
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.9834 9.99993C12.9834 11.6499 11.6501 12.9833 10.0001 12.9833C8.35006 12.9833 7.01672 11.6499 7.01672 9.99993C7.01672 8.34993 8.35006 7.0166 10.0001 7.0166C11.6501 7.0166 12.9834 8.34993 12.9834 9.99993Z" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M9.99999 16.8918C12.9417 16.8918 15.6833 15.1584 17.5917 12.1584C18.3417 10.9834 18.3417 9.00843 17.5917 7.83343C15.6833 4.83343 12.9417 3.1001 9.99999 3.1001C7.05832 3.1001 4.31666 4.83343 2.40833 7.83343C1.65833 9.00843 1.65833 10.9834 2.40833 12.1584C4.31666 15.1584 7.05832 16.8918 9.99999 16.8918Z" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </span>
                    </td >)
                case 'Actions':
                    return (<td key={colIndex}>
                        <span className="table-action">
                            <button className="table-eye" data-bs-toggle="offcanvas"
                                data-bs-target={`#${targetViewId}`}
                                aria-controls={`#${targetViewId}`}
                                onClick={() => setSelectedExpense(row)}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.9834 9.99993C12.9834 11.6499 11.6501 12.9833 10.0001 12.9833C8.35006 12.9833 7.01672 11.6499 7.01672 9.99993C7.01672 8.34993 8.35006 7.0166 10.0001 7.0166C11.6501 7.0166 12.9834 8.34993 12.9834 9.99993Z" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M9.99999 16.8918C12.9417 16.8918 15.6833 15.1584 17.5917 12.1584C18.3417 10.9834 18.3417 9.00843 17.5917 7.83343C15.6833 4.83343 12.9417 3.1001 9.99999 3.1001C7.05832 3.1001 4.31666 4.83343 2.40833 7.83343C1.65833 9.00843 1.65833 10.9834 2.40833 12.1584C4.31666 15.1584 7.05832 16.8918 9.99999 16.8918Z" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </button>
                            <button type="button" className="table-edit" data-bs-toggle="offcanvas"
                                data-bs-target={`#${targetEditId}`}
                                aria-controls={`#${targetEditId}`}
                                onClick={() => setSelectedExpense(row)}>
                                <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.3832 3.00002L4.54154 10.2417C4.28321 10.5167 4.03321 11.0584 3.98321 11.4334L3.67488 14.1333C3.56654 15.1083 4.26654 15.775 5.23321 15.6084L7.91654 15.15C8.29154 15.0834 8.81654 14.8084 9.07488 14.525L15.9165 7.28335C17.0999 6.03335 17.6332 4.60835 15.7915 2.86668C13.9582 1.14168 12.5665 1.75002 11.3832 3.00002Z" stroke="#292D32" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M10.2416 4.20801C10.5999 6.50801 12.4666 8.26634 14.7832 8.49967" stroke="#292D32" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M2.83325 18.3335H17.8333" stroke="#292D32" stroke-width="1.25" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                            <button className="table-trash" onClick={() => handleDeleteExpense(row._id)}>
                                {loading ? <ClipLoader color="#000000" size={24} /> :
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M18.1665 4.98307C15.3915 4.70807 12.5998 4.56641 9.8165 4.56641C8.1665 4.56641 6.5165 4.64974 4.8665 4.81641L3.1665 4.98307" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M7.74988 4.1415L7.93321 3.04984C8.06654 2.25817 8.16654 1.6665 9.57488 1.6665H11.7582C13.1665 1.6665 13.2749 2.2915 13.3999 3.05817L13.5832 4.1415" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16.3749 7.6167L15.8333 16.0084C15.7416 17.3167 15.6666 18.3334 13.3416 18.3334H7.99159C5.66659 18.3334 5.59159 17.3167 5.49992 16.0084L4.95825 7.6167" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.27478 13.75H12.0498" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M8.58313 10.4165H12.7498" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                }
                            </button>
                        </span>
                    </td >);
                default:
                    // For unknown columns, return 'N/A'
                    return <td key={colIndex}>N/A</td>;
            }
        });
    };

    useEffect(() => {
        if (response) {
            showSuccessToast('Expense deleted successfully');
            setDeleted(true);
            dispatch(deleteExpenseStateReset())
        }
    }, [response])

    useEffect(() => {
        if (removeManagerResponse) {
            showSuccessToast(removeManagerResponse?.message);
            setRemovedManager(true);
            dispatch(removeManagerStateReset())
        }
    }, [removeManagerResponse])


    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            dispatch(deleteExpenseStateReset())
        }
    }, [error])

    useEffect(() => {
        if (removeManagerError) {
            showErrorToast(removeManagerError?.data);
            dispatch(removeManagerStateReset())
        }
    }, [removeManagerError])

    useEffect(() => {
        const headerCheckbox = document.getElementById('header-check');
        if (headerCheckbox) {
            headerCheckbox.indeterminate =
                selectedRows?.length > 0 && selectedRows?.length < tableData?.length;
        }
    }, [selectedRows, tableData]);


    console.log(tableData, "databjbdm")

    return (
        <div className="common-table-wrapper">
            <div className="table-blk table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            {/* Map through column names and display them as table headers */}
                            {/* {columns?.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))} */}
                            {columns?.map((col, index) => (
                                <th key={index}>
                                    {col === 'Checkbox' ? (
                                        <span className="check-box">
                                            <input
                                                type="checkbox"
                                                id="header-check"
                                                onChange={(e) => handleSelectAll(e.target.checked, tableData)}
                                                checked={selectedRows?.length === tableData?.length}
                                                indeterminate={
                                                    selectedRows?.length > 0 && selectedRows?.length < tableData?.length
                                                }
                                            />
                                            <label htmlFor="header-check" />
                                        </span>
                                    ) : (
                                        col
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* If tableData is an array and has data, render rows */}
                        {Array.isArray(tableData) && tableData.length > 0 ? (
                            tableData.map((row, index) => {
                                const rowProps = (() => {
                                    const commonProps = {
                                        style: { cursor: 'pointer' },
                                    };

                                    if (rowClick && (activeTab === 'trips' || activeTab === 'expenses')) {
                                        return {
                                            ...commonProps,
                                            onClick: () =>
                                                navigate(`/dashboard/reports/detail/${row._id}`, {
                                                    state: { type: activeTab, name: row?.name, startDate: row?.startDate, endDate: row?.endDate },
                                                }),
                                        };
                                    }
                                    if (detailClickable && (activeTab === 'trips' || activeTab === 'expenses')) {
                                        return {
                                            ...commonProps,
                                            onClick: () =>
                                                navigate(`/dashboard/teams/reimbursement/detail/${row._id}`, {
                                                    state: { type: activeTab },
                                                }),
                                        };
                                    }

                                    if (targetMemberId) {
                                        return {
                                            ...commonProps,
                                            'data-bs-toggle': 'offcanvas',
                                            'data-bs-target': `#${targetMemberId}`,
                                            'aria-controls': targetMemberId,
                                            onClick: () => setSelectedMember(row),
                                        };
                                    }

                                    return commonProps; // ✅ fallback
                                })();

                                return (
                                    <tr key={row._id} {...rowProps}>
                                        {/* <span className="check-box">
                                            <input type="checkbox" id="check0" />
                                            <label htmlFor="check0" />
                                        </span> */}

                                        {renderRow(row)}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="100%" style={{ textAlign: 'center' }}>No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default Table