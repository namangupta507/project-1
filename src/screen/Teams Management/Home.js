import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { GetReimbursementGraphDataApi } from '../../redux/actions/teams/reimbursement/GetGraphDataAction';
import { PulseLoader } from 'react-spinners';
import TeamsGraph from '../../components/Teams/TeamsGraph';

const Home = () => {
    const navigate = useNavigate();
    const { userRole } = useContext(AuthContext);
    const dispatch = useDispatch();
    const { response, loading, error } = useSelector((state) => state.reimbursementGraphData);
    const [dataList, setDataList] = React.useState([])

    useEffect(() => {
        dispatch(GetReimbursementGraphDataApi());
    }, [])


    console.log(response, "response")
    useEffect(() => {
        if (response) {
            setDataList(response?.data)
        }
    }, [response])

    return (
        <div className="content-wrapper">
            <section className="main-section spacer-y">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-xl-12">
                            <div className="common_main_heading_wrapper">
                                <div className="d-flex flex-end w-100 gap-3">
                                    <button className="primary-btn" type="button" onClick={() => navigate('/dashboard/teams/members/invite')}>Invite members</button>
                                    {/* <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addTripoffcanvas" aria-controls="addTripoffcanvas">Invite members</button> */}
                                    {!(userRole === 'Manager Limited') &&
                                        <button className="outline-btn" type="button" onClick={() => navigate('/dashboard/teams/summary')}>Team summary export</button>
                                    }
                                    {/* <button className="outline-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addExpensesoffcanvas" aria-controls="addExpensesoffcanvas">Team summary export</button> */}
                                </div>
                            </div>
                            <div className="cta-blk welcome_cta_blk">
                                <h2 className="fs-4 fw-medium text-black">Welcome to Savmor Teams Dashboard</h2>
                                <p>Read our step-by-step guide to get started on your own, so you can start <br className="d-none d-md-block" />saving today</p>
                                {/* <a href="#!" className="primary-text-btn d-inline-block">Get started guide</a> */}
                            </div>
                            {/* <div className="common-card mt-4">
                                <div className="common_sub_heading_wrapper">
                                    <h2>My Task</h2>
                                </div>
                                <div className="no_card_data_available">
                                    <img src="/assets/images/tree-sun-icon.png" className="nodata_img_icon" alt="icon" />
                                    <h3>No tasks for now!</h3>
                                </div>
                                <div className="task_detail_blk">
                                    <div className="task_detail_item">
                                        <div className="task_detail_header hstack justify-content-start gap-2 flex-wrap">
                                            <img src="/assets/images/member-theme-icon.svg" className="tsd_icon" />
                                            <h3>Member onboarding</h3>
                                        </div>
                                        <div className="task_detail_content hstack justify-content-between gap-3 flex-wrap">
                                            <p>1 driver needs to accept invite</p>
                                            <button className="primary-text-btn">Re-send invites</button>
                                        </div>
                                    </div>
                                    <div className="task_detail_item">
                                        <div className="task_detail_header hstack justify-content-start gap-2 flex-wrap">
                                            <img src="/assets/images/report-theme-icon.svg" className="tsd_icon" />
                                            <h3>Report approvals</h3>
                                        </div>
                                        <div className="task_detail_content hstack justify-content-between gap-3 flex-wrap">
                                            <p>1 report needs your approval</p>
                                            <button className="primary-text-btn">Approval reports</button>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="common-card mt-4">
                                <div className="common_sub_heading_wrapper">
                                    <h2>Reimbursement History</h2>
                                    <button className="primary-text-btn fs-12" type='button' onClick={() => navigate('/dashboard/teams/reimbursement')}>View Reimbursement</button>
                                </div>
                                {
                                    dataList.length === 0 &&
                                    <div className="no_card_data_available">
                                        <img src="/assets/images/dollar-report-icon.png" className="nodata_img_icon" alt="icon" />
                                        <h3>No Report have been submitted yet</h3>
                                        <p>User report approval to streamline your mileage reimbursement </p>
                                    </div>
                                }
                                <div className="reimbursement_detail-blk">
                                    {/* <div className="hstack justify-content-end gap-2 flex-wrap mb-3">
                                        <div className="graph_slide_blk">
                                            <button className="arrow_btn"><img src="/assets/images/left-sm-arrow.svg" alt="arrow" /></button>
                                            <span>2025</span>
                                            <button className="arrow_btn"><img src="/assets/images/right-sm-arrow.svg" alt="arrow" /></button>
                                        </div>
                                    </div> */}
                                    {(userRole === 'Owner' || userRole === 'Super Admin') && dataList.length > 0 &&
                                        <div className="reimbursement_graph_bkl">
                                            {
                                                loading ?
                                                    (
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
                                                        <TeamsGraph dataList={dataList} />
                                                // <img src="/assets/images/graph-img-2.png" alt="graph" />
                                            }
                                        </div>
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

export default Home