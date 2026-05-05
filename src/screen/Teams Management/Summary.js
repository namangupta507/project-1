import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../../context/AuthContext';
import { GetSummaryApi } from '../../redux/actions/teams/summary/GetSummaryAction';
import { PulseLoader } from 'react-spinners';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { showErrorToast } from '../../helpers/toast';

const Summary = () => {
    const columns = ['Email', 'Name', 'Roles', 'Team Kms', 'Unclassified Kms', 'Total kms']
    const dispatch = useDispatch();
    const { response, loading, error } = useSelector((state) => state.summary)
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLImit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [search, setSearch] = useState('');
    const [summaryList, setSummaryList] = useState([]);
    const { parentTeamId } = useContext(AuthContext);


    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleLimitChange = (newLimit) => {
        setLImit(newLimit);
        setCurrentPage(1);
    }

    const handleExportClick = () => {
        if (!summaryList || summaryList.length === 0) {
            showErrorToast('No data to export');
            return;
        }

        // Define headers based on your columns
        const headers = [
            'Email',
            'Name',
            'Roles',
            'Team kms',
            'Unclassified kms',
            'Total kms'
        ];

        // Create CSV rows
        const rows = summaryList.map(row => [
            row?.email || '',
            row?.name || '',
            row?.role || '',
            row?.teamKms?.toFixed(2) || '0',
            row?.unclassifiedKms?.toFixed(2) || '0',
            row?.allMiles?.toFixed(2) || '0',
        ]);

        // Combine headers and rows
        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'team-summary.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    useEffect(() => {
        if (parentTeamId) {
            dispatch(GetSummaryApi({ page: currentPage, limit: limit, id: parentTeamId }))
        }
    }, [parentTeamId, currentPage, limit]);

    useEffect(() => {
        if (response) {
            setSummaryList(response?.data);
            setCurrentPage(response?.pagination?.page);
            setLImit(response?.pagination?.limit);
            setTotalPages(response?.pagination?.totalPages);
            setTotalItems(response?.pagination?.total)
        }
    }, [response])
    console.log(response, "response")
    return (
        <>
            <div className="content-wrapper">
                <section className="main-section spacer-y">
                    <div className="container">
                        <div className="row gy-4">
                            <div className="col-xl-12">
                                <div className="common-card">
                                    <div className="common_heading_flex">
                                        {/* <button className="select_date">Jun 18, 2025 - Jun 23, 2025</button> */}
                                        <button className="primary-btn" type='button' onClick={handleExportClick}>Export</button>
                                    </div>
                                    <div className="common_stats">
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{response?.summary?.allMiles ? response?.summary?.allMiles?.toFixed(2) : 0} kms</span>
                                            <h2>All miles</h2>
                                        </div>
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{response?.summary?.teamKms ? response?.summary?.teamKms?.toFixed(2) : 0} kms</span>
                                            <h2>Team</h2>
                                        </div>
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{response?.summary?.unclassifiedKms ? response?.summary?.unclassifiedKms?.toFixed(2) : 0} kms</span>
                                            <h2>Unclassified</h2>
                                        </div>
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">$ {response?.summary?.expenses ? response?.summary?.expenses?.toFixed(2) : 0}</span>
                                            <h2>Expenses</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="tab-content common_tab_content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-1" role="tabpanel" aria-labelledby="pills-1-tab" tabIndex={0}>
                                        {/* <div className="common-table-filter-wrapper">
                                            <div className="common-right-blk w-100">
                                                <div className="edit_column_blk">
                                                    <button className="filter_action_btn edit_column_btn dropdown-toggle" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Edit Columns</button>
                                                    <ul className="select_table_column_blk dropdown-menu dropdown-menu-end">
                                                        <li className="tbl_check_item">
                                                            <input type="checkbox" className="d-none" id="tableColumn_1" />
                                                            <label htmlFor="tableColumn_1">
                                                                <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                <span className="tbl_col_text">Email</span>
                                                            </label>
                                                        </li>
                                                        <li className="tbl_check_item">
                                                            <input type="checkbox" className="d-none" id="tableColumn_2" />
                                                            <label htmlFor="tableColumn_2">
                                                                <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                <span className="tbl_col_text">Name</span>
                                                            </label>
                                                        </li>
                                                        <li className="tbl_check_item">
                                                            <input type="checkbox" className="d-none" id="tableColumn_3" />
                                                            <label htmlFor="tableColumn_3">
                                                                <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                <span className="tbl_col_text">Roles</span>
                                                            </label>
                                                        </li>
                                                        <li className="tbl_check_item">
                                                            <input type="checkbox" className="d-none" id="tableColumn_4" />
                                                            <label htmlFor="tableColumn_4">
                                                                <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                <span className="tbl_col_text">Team kms</span>
                                                            </label>
                                                        </li>
                                                        <li className="tbl_check_item">
                                                            <input type="checkbox" className="d-none" id="tableColumn_5" />
                                                            <label htmlFor="tableColumn_5">
                                                                <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                <span className="tbl_col_text">Unclassified kms</span>
                                                            </label>
                                                        </li>
                                                        <li className="tbl_check_item">
                                                            <input type="checkbox" className="d-none" id="tableColumn_6" />
                                                            <label htmlFor="tableColumn_6">
                                                                <span className="tbl_col_checkbox"><img src="assets/images/check-sm-icon.svg" /></span>
                                                                <span className="tbl_col_text">Total kms</span>
                                                            </label>
                                                        </li>
                                                        <li className="tbl_check_item">
                                                            <button className="outline-btn w-100 py-2">Apply</button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div> */}
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
                                                            tableData={summaryList}
                                                            setDataList={setSummaryList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                        />
                                                        {summaryList?.length > 0 &&
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
                                    <div className="tab-pane fade" id="pills-2" role="tabpanel" aria-labelledby="pills-2-tab" tabIndex={0}>Onboardings...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="memberInfo" aria-labelledby="memberInfoLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body p-0">
                    <div className="offcanvas_top_header px-4 py-3 mb-0">
                        <h2>James Rodriguez</h2>
                        <div className="canvas_action_btn">
                            <button className="no_bg-btn"><img src="assets/images/download-icon.svg" alt="Download" /></button>
                        </div>
                    </div>
                    <div className="canvas_nav_tab_blk">
                        <ul className="nav nav-pills gap-3 mb-0" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="pills-canvas-1-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-1" type="button" role="tab" aria-controls="pills-canvas-1" aria-selected="true">Trips</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="pills-canvas-2-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-2" type="button" role="tab" aria-controls="pills-canvas-2" aria-selected="false">Expenses</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="pills-canvas-3-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-3" type="button" role="tab" aria-controls="pills-canvas-3" aria-selected="false">Reports</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="pills-canvas-4-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-4" type="button" role="tab" aria-controls="pills-canvas-4" aria-selected="false">Member Info</button>
                            </li>
                        </ul>
                    </div>
                    <div className="canvas_nav_tab_content">
                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-canvas-1" role="tabpanel" aria-labelledby="pills-canvas-1-tab" tabIndex={0}>
                                <h3 className="fs-6 fw-semibold mb-3">Trips</h3>
                                <div className="common-table-filter-wrapper">
                                    <div className="common-left-blk">
                                        <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button>
                                    </div>
                                </div>
                                <div className="common-table-wrapper">
                                    <div className="table-blk table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Kms</th>
                                                    <th>Locations</th>
                                                    <th>Maps</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Jan 1,2025</td>
                                                    <td>262.3 Km</td>
                                                    <td>
                                                        <span className="td_location_indicator i-green">4:00 PM Chandigarh</span>
                                                        <span className="td_location_indicator i-red">5:00 PM Mohali</span>
                                                    </td>
                                                    <td><button className="border-0 bg-white"><img src="assets/images/map-line-img.svg" alt="Map" /></button></td>
                                                </tr>
                                                <tr>
                                                    <td>Jan 1,2025</td>
                                                    <td>262.3 Km</td>
                                                    <td>
                                                        <span className="td_location_indicator i-green">4:00 PM Chandigarh</span>
                                                        <span className="td_location_indicator i-red">5:00 PM Mohali</span>
                                                    </td>
                                                    <td><button className="border-0 bg-white"><img src="assets/images/map-line-img.svg" alt="Map" /></button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="table_footer">
                                    <span className="showing-value">Showing 4 out of {'{'}total num{'}'} trips.</span>
                                    <div className="table_page_action">
                                        <div className="table-pagination">
                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination justify-content-end mb-0 gap-2">
                                                    <li className="page-item prev-page disabled">
                                                        <a className="page-link">Prev</a>
                                                    </li>
                                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">...</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">8</a></li>
                                                    <li className="page-item next-page">
                                                        <a className="page-link" href="#">Next</a>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                        <div className="select_per_loads">
                                            <select className="form-select">
                                                <option value selected>25 per load</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="pills-canvas-2" role="tabpanel" aria-labelledby="pills-canvas-2-tab" tabIndex={0}>
                                <h3 className="fs-6 fw-semibold mb-3">Expenses</h3>
                                <div className="common-table-filter-wrapper">
                                    <div className="common-left-blk">
                                        <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button>
                                    </div>
                                </div>
                                <div className="common-table-wrapper">
                                    <div className="table-blk table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Merchant</th>
                                                    <th>Transaction Amount</th>
                                                    <th>Purpose</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Jan 1,2025</td>
                                                    <td>Paytm</td>
                                                    <td>$500.00</td>
                                                    <td>Alpha</td>
                                                </tr>
                                                <tr>
                                                    <td>Jan 1,2025</td>
                                                    <td>Paytm</td>
                                                    <td>$500.00</td>
                                                    <td>Alpha</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="table_footer">
                                    <span className="showing-value">Showing 4 out of {'{'}total num{'}'} trips.</span>
                                    <div className="table_page_action">
                                        <div className="table-pagination">
                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination justify-content-end mb-0 gap-2">
                                                    <li className="page-item prev-page disabled">
                                                        <a className="page-link">Prev</a>
                                                    </li>
                                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">...</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">8</a></li>
                                                    <li className="page-item next-page">
                                                        <a className="page-link" href="#">Next</a>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                        <div className="select_per_loads">
                                            <select className="form-select">
                                                <option value selected>25 per load</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="pills-canvas-3" role="tabpanel" aria-labelledby="pills-canvas-3-tab" tabIndex={0}>
                                <h3 className="fs-6 fw-semibold mb-3">Reports</h3>
                                <div className="common-table-filter-wrapper">
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
                                </div>
                                <div className="common-table-wrapper">
                                    <div className="table-blk table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Report Name</th>
                                                    <th>Total</th>
                                                    <th>Kms</th>
                                                    <th>Report Status</th>
                                                    <th>Submitted On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Test1</td>
                                                    <td>$500.00</td>
                                                    <td>262.3 Km</td>
                                                    <td><span className="td-status st-approved">Approved</span></td>
                                                    <td>Jan 1,2025</td>
                                                </tr>
                                                <tr>
                                                    <td>Test1</td>
                                                    <td>$500.00</td>
                                                    <td>262.3 Km</td>
                                                    <td><span className="td-status st-approved">Approved</span></td>
                                                    <td>Jan 1,2025</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="table_footer">
                                    <span className="showing-value">Showing 4 out of {'{'}total num{'}'} trips.</span>
                                    <div className="table_page_action">
                                        <div className="table-pagination">
                                            <nav aria-label="Page navigation example">
                                                <ul className="pagination justify-content-end mb-0 gap-2">
                                                    <li className="page-item prev-page disabled">
                                                        <a className="page-link">Prev</a>
                                                    </li>
                                                    <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">2</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">...</a></li>
                                                    <li className="page-item"><a className="page-link" href="#">8</a></li>
                                                    <li className="page-item next-page">
                                                        <a className="page-link" href="#">Next</a>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                        <div className="select_per_loads">
                                            <select className="form-select">
                                                <option value selected>25 per load</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="pills-canvas-4" role="tabpanel" aria-labelledby="pills-canvas-4-tab" tabIndex={0}>
                                <h3 className="fs-6 fw-semibold mb-3">Personal</h3>
                                <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                    <div className="ofcvs_form_item hstack gap-3">
                                        <div>
                                            <label>First Name</label>
                                            <div className="ofcvs_form_field">
                                                <input type="text" className="form-control" placeholder="Enter first name" defaultValue />
                                            </div>
                                        </div>
                                        <div>
                                            <label>Last Name</label>
                                            <div className="ofcvs_form_field">
                                                <input type="text" className="form-control" placeholder="Enter last name" defaultValue />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ofcvs_form_item">
                                        <label>Email Address</label>
                                        <div className="ofcvs_form_field">
                                            <input type="email" className="form-control" placeholder="Enter email address" defaultValue />
                                        </div>
                                    </div>
                                    <div className="ofcvs_form_item">
                                        <label>Employee ID</label>
                                        <div className="ofcvs_form_field">
                                            <input type="text" className="form-control" placeholder="Enter employee ID" defaultValue />
                                        </div>
                                    </div>
                                    <div className="ofcvs_form_item hstack gap-3">
                                        <div className="w-50">
                                            <label>State</label>
                                            <div className="ofcvs_form_field">
                                                <select id className="form-select">
                                                    <option value>Select State</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label>Zip Code</label>
                                            <div className="ofcvs_form_field">
                                                <input type="text" className="form-control" placeholder="Enter zip code" defaultValue />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ofcvs_form_item">
                                        <label>Annual Business Miles</label>
                                        <div className="ofcvs_form_field">
                                            <input type="text" className="form-control" placeholder="Select" defaultValue />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="fs-6 fw-semibold my-3">Team</h3>
                                <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                    <div className="ofcvs_form_item">
                                        <label>Roles</label>
                                        <div className="ofcvs_form_field">
                                            <select id className="form-select">
                                                <option value>Select Roles</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="ofcvs_form_item">
                                        <label>Team</label>
                                        <div className="ofcvs_form_field">
                                            <input type="text" className="form-control" placeholder="Enter employee ID" defaultValue />
                                        </div>
                                    </div>
                                    <div className="ofcvs_form_item">
                                        <label>Team Manager</label>
                                        <div className="ofcvs_form_field">
                                            <input type="text" className="form-control" placeholder="Enter Team Manager" defaultValue="Swift" readOnly />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end gap-3 mt-4 mt-md-4">
                                    <button className="primary-btn">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

        </>
    )
}

export default Summary