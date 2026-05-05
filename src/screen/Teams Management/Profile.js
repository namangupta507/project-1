import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { showErrorToast, showSuccessToast } from '../../helpers/toast';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateTeamNameApi } from '../../redux/actions/teams/profile/UpdateTeamNameAction';
import { updateTeamNameStateReset } from '../../redux/slices/teams/profile/UpdateTeamNameSlice';
import { PulseLoader } from 'react-spinners';
import { GetManagersListApi } from '../../redux/actions/teams/profile/GetManagersListAction';
import Table from '../../components/Table';
import { InviteMembersAPI } from '../../redux/actions/teams/members/InviteMembersAction';
import { inviteMembersStateReset } from '../../redux/slices/teams/members/InviteMembersSlice';
import Pagination from '../../components/Pagination';
import Swal from 'sweetalert2';
import { RemoveManagerApi } from '../../redux/actions/teams/profile/RemoveManagerAction';
import { useLocation } from 'react-router-dom';

const TeamsProfile = () => {
    const columns = ['Name', 'Roles', ' ', '  '];
    const location = useLocation();
    const dispatch = useDispatch();
    const { parentTeamName, parentTeamId, setParentTeamName, userRole } = useContext(AuthContext);
    const { response, loading, error } = useSelector((state) => state.updateTeamName);
    const { response: addManagerResponse, loading: addManagerLoading, error: addManagerError } = useSelector((state) => state.inviteMembers);
    const { response: managersListResponse, loading: managersListLoading, error: managersListError } = useSelector((state) => state.managersList);
    const [teamName, setTeamName] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [type, setType] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLImit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [managersList, setManagersList] = useState([]);
    const [removedManager, setRemovedManager] = useState(false);
    const [teamId, setTeamId] = useState('');
    const idFromTeams = location?.state?.id

    console.log(idFromTeams, "idFromTeams")

    const validateForm = () => {
        const newErrors = {};

        if (!teamName) {
            newErrors.teamName = 'Please enter the team name';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleLimitChange = (newLimit) => {
        setLImit(newLimit);
        setCurrentPage(1);
    }

    // const handleRemoveManager = useCallback(async (id) => {
    //     Swal.fire({
    //         title: 'Are you sure?',
    //         text: `You want to remove this manager?`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#49a496',
    //         cancelButtonColor: '#ffffff',
    //         confirmButtonText: 'Yes',
    //         cancelButtonText: 'No, cancel',
    //         customClass: {
    //             cancelButton: 'custom-cancel-btn'
    //         }
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             try {
    //                 await dispatch(RemoveManagerApi({ id }))

    //             } catch (error) {
    //                 Swal.fire(error?.response?.message);
    //             }
    //         } else if (result.dismiss === Swal.DismissReason.cancel) {
    //             Swal.fire('Cancelled');
    //         }
    //     });
    // }, [dispatch]);

    const validateForm2 = () => {
        const newErrors = {};

        if (!name) {
            newErrors.name = 'Manager Name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Manage Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!type) {
            newErrors.type = 'Manager Type is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const handleTeamNameChange = async () => {
        if (!validateForm()) return;

        try {
            await dispatch(UpdateTeamNameApi({ id: parentTeamId, name: teamName }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleAddManager = async () => {
        if (!validateForm2()) return;
        try {
            await dispatch(InviteMembersAPI({ email: [email], role: Number(type), teamId: parentTeamId }))
        } catch (error) {
            showErrorToast(error)
        }
    }
    useEffect(() => {
        if (parentTeamName) {
            setTeamName(parentTeamName)
        }
    }, [parentTeamName])

    useEffect(() => {
        if (idFromTeams) {
            setTeamId(idFromTeams);
        } else if (parentTeamId) {
            setTeamId(parentTeamId);
        } else {
            setTeamId('');
        }
    }, [idFromTeams, parentTeamId]);

    useEffect(() => {
        if (teamId) {
            dispatch(GetManagersListApi({ id: teamId, page: currentPage, limit: limit }));
        }
    }, [currentPage, limit, addManagerResponse, teamId, removedManager])

    useEffect(() => {
        if (managersListResponse) {
            setCurrentPage(managersListResponse?.pagination?.page);
            setLImit(managersListResponse?.pagination?.limit);
            setTotalItems(managersListResponse?.pagination?.total);
            setTotalPages(managersListResponse?.pagination?.totalPages);
            setManagersList(managersListResponse?.data)
        }
    }, [managersListResponse])

    useEffect(() => {
        if (response) {
            showSuccessToast(response?.message);
            dispatch(updateTeamNameStateReset());
            setValidationErrors('');
            setParentTeamName(teamName);
        }
    }, [response])

    useEffect(() => {
        if (addManagerResponse) {
            showSuccessToast(addManagerResponse?.message);
            dispatch(inviteMembersStateReset());
            setValidationErrors('');
            setName('');
            setType('');
            setEmail('');
            const offcanvasEl = document.getElementById('addManager');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [addManagerResponse])

    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            dispatch(updateTeamNameStateReset());
            setValidationErrors('');
        }
    }, [error])

    useEffect(() => {
        if (addManagerError) {
            showErrorToast(addManagerError?.data);
            dispatch(inviteMembersStateReset());
            setValidationErrors('');
        }
    }, [addManagerError])

    console.log(managersListResponse, "manager repsomer")
    console.log(teamId, "teamId")
    console.log(parentTeamId, "parent")
    return (
        <>
            {(parentTeamName && teamId) ?
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
                                            <li className="breadcrumb-item text-capitalize">Team Profile</li>
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
                                    <div className="col-sm-8 col-md-7">
                                        <div className="common-card">
                                            <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                                <div className="ofcvs_form_item">
                                                    <label>Team Name</label>
                                                    <div className="ofcvs_form_field">
                                                        <input type="text" className="form-control" disabled={userRole === 'Manager Limited'} placeholder="Enter team name" value={teamName} onKeyDown={(e) => {

                                                            if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                            onChange={(e) => {
                                                                setTeamName(e.target.value);
                                                                if (validationErrors.teamName) {
                                                                    setValidationErrors(prev => ({ ...prev, teamName: false }));
                                                                }
                                                            }} />
                                                    </div>
                                                    {validationErrors.teamName &&
                                                        (
                                                            <span className={`error ${validationErrors.teamName ? '' : 'd-none'}`}>{validationErrors.teamName}</span>
                                                        )
                                                    }
                                                    <p className="fs-14 mb-0 mt-1 text-secondary">Your team name will appear in members accounts when classifying trips and transactions.</p>
                                                </div>
                                            </div>
                                            {
                                                !(userRole === 'Manager Limited') &&
                                                <div className="d-flex justify-content-start gap-3 mt-4 mt-md-4">
                                                    <button className="primary-btn" onClick={handleTeamNameChange}>{loading ? <PulseLoader color='#ffffff' size={14} /> : 'Save'}</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="common_main_heading_wrapper">
                                            <h1>Team Managers</h1>
                                            {
                                                !(userRole === 'Manager Limited') &&
                                                <div className="d-flex flex-end gap-3">
                                                    <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addManager" aria-controls="addManager">Add Manger</button>
                                                </div>
                                            }
                                        </div>
                                        {
                                            managersListLoading
                                                ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : managersListError ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <>
                                                        <Table
                                                            tableData={managersList}
                                                            setDataList={setManagersList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                            setRemovedManager={setRemovedManager}
                                                        />
                                                        {managersList?.length > 0 &&
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
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="addManager" aria-labelledby="addManagerLabel">
                        <div className="offcanvas-header">
                            <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                        </div>
                        <div className="offcanvas-body p-0">
                            <div className="offcanvas_top_header px-4 py-3 mb-0">
                                <h2>Add Manager</h2>
                            </div>
                            <div className="canvas_nav_tab_content">
                                <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                    <div className="ofcvs_form_item">
                                        <label>Manager Name</label>
                                        <div className="ofcvs_form_field">
                                            <input type="text" className="form-control" placeholder="Enter manager name" value={name} onKeyDown={(e) => {

                                                if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                    e.preventDefault();
                                                }
                                            }}
                                                onChange={(e) => {
                                                    setName(e.target.value);
                                                    if (validationErrors.name) {
                                                        setValidationErrors(prev => ({ ...prev, name: false }));
                                                    }
                                                }} />
                                        </div>
                                    </div>
                                    {validationErrors.name &&
                                        (
                                            <span className={`error ${validationErrors.name ? '' : 'd-none'}`}>{validationErrors.name}</span>
                                        )
                                    }
                                    <div className="ofcvs_form_item">
                                        <label>Manager Email</label>
                                        <div className="ofcvs_form_field">
                                            <input type="text" className="form-control" placeholder="Enter manager email address" value={email}
                                                onKeyDown={(e) => {
                                                    // Prevent space as first character in input
                                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setEmail(value);
                                                    // Clear email validation error as user types
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
                                        <label>Choose Manager Type</label>
                                        <div className="ofcvs_form_field">
                                            <select className="form-select" value={type} onChange={(e) => {
                                                setType(e.target.value);
                                                if (validationErrors.type) {
                                                    setValidationErrors(prev => ({ ...prev, type: false }));
                                                }
                                            }}>
                                                <option value>Select</option>
                                                <option value="3">Team Manager</option>
                                                <option value="4">Manager Limited</option>
                                            </select>
                                        </div>
                                    </div>
                                    {validationErrors.type &&
                                        (
                                            <span className={`error ${validationErrors.type ? '' : 'd-none'}`}>{validationErrors.type}</span>
                                        )
                                    }
                                </div>
                                <div className="d-flex justify-content-end gap-3 mt-4 mt-md-4">
                                    <button className="primary-btn" onClick={handleAddManager}>{addManagerLoading ? <PulseLoader size={14} color='#ffffff' /> : 'Add Manager'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                :
                <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center' >
                    <PulseLoader size={25} color="#49a496" />
                </div>
            }


        </>
    )
}

export default TeamsProfile