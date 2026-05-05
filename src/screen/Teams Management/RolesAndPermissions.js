import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetRolesListApi } from '../../redux/actions/teams/rolesAndPermissions/GetListAction';
import { PulseLoader } from 'react-spinners';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router-dom';

const RolesAndPermissions = () => {
    const columns = ['Role', 'Role Description', 'Users']

    const dispatch = useDispatch();
    const [rolesList, setRolesList] = useState([]);
    // const [updatedList, setUpdatedList] = useState([]);
    const { response, loading, error } = useSelector((state) => state.rolesList);

    // const handlePageChange = (page) => {
    //     setCurrentPage(page)
    // }

    // const handleLimitChange = (newLimit) => {
    //     setLImit(newLimit);
    //     setCurrentPage(1);
    // }

    useEffect(() => {
        dispatch(GetRolesListApi())
    }, [])

    const roleDescriptions = {
        members: 'Cannot access any other member',
        teamManager: 'Can access any member on their team or sub-teams',
        managerLimited: 'Can access any member on their own team',
        // reviewer: 'Can review compliance submissions only, no access to members',
        superAdmin: 'Unrestricted access to all features, settings, and members',
    };

    useEffect(() => {
        if (response) {
            const list = Object.entries(response.counts).map(([role, count]) => ({
                role,
                count,
                description: roleDescriptions[role] || 'No description',
            }));
            setRolesList(list)
        }
    }, [response])

    return (
        <>
            <div className="content-wrapper">
                {/* <div className="breadcrumb_wrapper spacer-y pb-0">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-header">
                                    <nav className="breadcrumb_nav">
                                        <ul className="breadcrumb mb-0">
                                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                                            <li className="breadcrumb-item"><a href="/">Teams</a></li>
                                            <li className="breadcrumb-item"><a href="/">test</a></li>
                                            <li className="breadcrumb-item"><a href="/">Team Setting</a></li>
                                            <li className="breadcrumb-item text-capitalize">Roles &amp; Permission</li>
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
                            <div className="col-12">
                                <div className="common_main_heading_wrapper">
                                    <p>Roles determine what each user has access to. Bulk edit roles from the  <Link to='/dashboard/teams/members' className="primary-text-btn text-decoration-underline">Members page</Link>, or individually from each user’s profile.</p>
                                    {/* <a href="#!" className="primary-text-btn text-decoration-underline">Learn more about roles.</a></p> */}
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
                                                    tableData={rolesList}
                                                    setDataList={setRolesList}
                                                    columns={columns}
                                                />
                                                {/* {rolesList?.length > 0 &&
                                                    <Pagination
                                                        currentPage={currentPage}
                                                        totalPages={totalPages}
                                                        limit={limit}
                                                        totalItems={totalItems}
                                                        handlePageChange={handlePageChange}
                                                        handleLimitChange={handleLimitChange}
                                                    />
                                                } */}

                                            </>
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </>
    )
}

export default RolesAndPermissions