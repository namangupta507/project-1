import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetParentTeamsApi } from '../../redux/actions/teams/GetParentTeamsAction';
import { showErrorToast, showSuccessToast } from '../../helpers/toast';
import { AddNewTeamAPI } from '../../redux/actions/teams/AddNewTeamAction';
import { addNewTeamStateReset } from '../../redux/slices/teams/AddNewTeamSlice';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { GetTeamsListApi } from '../../redux/actions/teams/GetTeamsListAction';
import { GetTeamsTreeApi } from '../../redux/actions/teams/GetTeamsTreeAction';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import TreeNode from '../../components/Teams/TreeNode';
import { GetTeamMembersApi } from '../../redux/actions/teams/GetTeamMembersAction';
import { AuthContext } from '../../context/AuthContext';

const Teams = () => {
    const columns = ['Team Name', 'Team Managers', 'Parent Team', 'Action']
    const canvasColumns = ['Name', 'Roles']
    const dispatch = useDispatch();
    const { fetchProfile, fetchParentTeams } = useContext(AuthContext);
    const { response, loading, error } = useSelector((state) => state.parentTeams);
    const { response: addTeamResponse, loading: addTeamLoading, error: addTeamError } = useSelector((state) => state.addNewTeam);
    const { response: getTeamsResponse, loading: getTeamsLoading, error: getTeamsError } = useSelector((state) => state.teamsList);
    const { response: getTreeResponse, loading: getTreeLoading, error: getTreeError } = useSelector((state) => state.teamsTree);
    const { response: getTeamMembersResponse, loading: getTeamMembersLoading, error: getTeamMembersError } = useSelector((state) => state.teamMembers);
    const [activeTab, setActiveTab] = useState('teams');
    const [teamsList, setTeamsList] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLImit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [isActive, setIsActive] = useState(true);
    const [search, setSearch] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedParentTeam, setSelectedParentTeam] = useState({ id: '', name: '' });
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const wrapperRef = useRef(null);
    const [teamName, setTeamname] = useState('');
    const [validationErrors, setValidationErrors] = useState('');

    const [canvasPage, setCanvasPage] = useState(1);
    const [canvasLimit, setCanvasLImit] = useState(5);
    const [canvasTotalPages, setCanvasTotalPages] = useState(1);
    const [canvasTotalItems, setCanvasTotalItems] = useState(1);
    const [teamMembersList, setTeamMembersList] = useState([]);

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleLimitChange = (newLimit) => {
        setLImit(newLimit);
        setCurrentPage(1);
    }

    const handleCanvasPageChange = (page) => {
        setCanvasPage(page)
    }

    const handleCanvasLimitChange = (newLimit) => {
        setCanvasLImit(newLimit);
        setCanvasPage(1);
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'teams') {
            setIsActive(false);
        }
        setIsActive(true);
    }

    const fetchTeams = async () => {
        try {
            await dispatch(GetTeamsListApi({ page: currentPage, limit: limit, search: searchFilter || '' }));
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleSelect = (option) => {
        if (validationErrors.parentTeam) {
            setValidationErrors(prev => ({ ...prev, parentTeam: false }));
        }
        setSelectedParentTeam(option); // option is full object { id, name }
        setSearch(option.name);
        setShowDropdown(false);
    };

    // const fetchParentTeams = async () => {
    //     try {
    //         await dispatch(GetParentTeamsApi())
    //     } catch (error) {
    //         showErrorToast(error)
    //     }
    // }

    const fetchTeamsTree = async () => {
        try {
            await dispatch(GetTeamsTreeApi())
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleAddTeam = async () => {
        if (!validateForm()) return;
        try {
            await dispatch(AddNewTeamAPI({ name: teamName, parentTeamId: selectedParentTeam.id || '' }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const validateForm = () => {
        const newErrors = {};

        if (!teamName) {
            newErrors.teamName = 'Team Name is required';
        }
        if (!search && filteredOptions?.length > 0) {
            newErrors.parentTeam = 'Parent team is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    useEffect(() => {
        setFilteredOptions(
            options.filter(opt =>
                opt?.name?.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, options]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // useEffect(() => {
    //     fetchParentTeams()
    // }, [])

    useEffect(() => {
        if (activeTab === 'teams') {
            fetchTeams()
        }
        if (activeTab === 'tree') {
            fetchTeamsTree()
        }
    }, [activeTab, currentPage, limit, searchFilter, addTeamResponse])

    useEffect(() => {
        if (response) {
            const dataForDropdown = response?.data?.map((r, i) => {
                return { name: r?.name, id: r?._id }
            })
            setOptions(dataForDropdown)

        }
    }, [response])

    useEffect(() => {
        if (options) {
            setFilteredOptions(options);
        }
    }, [options])

    useEffect(() => {
        if (addTeamResponse) {
            showSuccessToast(addTeamResponse?.message);
            dispatch(addNewTeamStateReset());
            setTeamname('');
            setSearch('');
            fetchProfile();
            fetchParentTeams();
            const offcanvasEl = document.getElementById('createNewTeam');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [addTeamResponse])

    useEffect(() => {
        if (addTeamError) {
            showErrorToast(addTeamError?.data);
            dispatch(addNewTeamStateReset());
        }
    }, [addTeamError])


    useEffect(() => {
        if (getTeamsResponse) {
            setTeamsList(getTeamsResponse?.data);
            setCurrentPage(getTeamsResponse?.pagination?.page);
            setLImit(getTeamsResponse?.pagination?.limit);
            setTotalPages(getTeamsResponse?.pagination?.totalPages);
            setTotalItems(getTeamsResponse?.pagination?.total)
        }
    }, [getTeamsResponse])

    useEffect(() => {
        setSearchFilter('');
        setCurrentPage(1);
        setLImit(5);
    }, [activeTab])

    useEffect(() => {
        if (selectedTeam) {
            dispatch(GetTeamMembersApi({ page: canvasPage, limit: canvasLimit }))
        }
    }, [selectedTeam, canvasPage, canvasLimit])

    useEffect(() => {
        if (getTeamMembersResponse) {
            setTeamMembersList(getTeamMembersResponse?.data);
            setCanvasPage(getTeamMembersResponse?.pagination?.page);
            setCanvasLImit(getTeamMembersResponse?.pagination?.limit);
            setCanvasTotalPages(getTeamMembersResponse?.pagination?.totalPages);
            setCanvasTotalItems(getTeamMembersResponse?.pagination?.total)
        }
    }, [getTeamMembersResponse])

    console.log(selectedTeam, "selectedTeam")

    return (
        <>
            <div className="content-wrapper">
                <section className="main-section spacer-y">
                    <div className="container">
                        <div className="row gy-4">
                            <div className="col-xl-12">
                                <div className="common_main_heading_wrapper">
                                    <ul className="common_nav_tab nav nav-pills mb-0 gap-2" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => handleTabChange('teams')} id="pills-1-tab" data-bs-toggle="pill" data-bs-target="#pills-1" type="button" role="tab" aria-controls="pills-1" aria-selected="true">Team List</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeTab === 'tree' ? 'active' : ''}`} onClick={() => handleTabChange('tree')} id="pills-2-tab" data-bs-toggle="pill" data-bs-target="#pills-2" type="button" role="tab" aria-controls="pills-2" aria-selected="false">Team Tree</button>
                                        </li>
                                    </ul>
                                    <div className="d-flex flex-end gap-3">
                                        <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#createNewTeam" aria-controls="createNewTeam">New Team</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="tab-content common_tab_content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-1" role="tabpanel" aria-labelledby="pills-1-tab" tabIndex={0}>
                                        <div className="common-table-filter-wrapper">
                                            <div className="common-left-blk">
                                                <div className="common-sort-blk">
                                                    <div className="common-search-blk">
                                                        <input type="search" className="form-control" id="search" placeholder="Search" value={searchFilter} onKeyDown={(e) => {

                                                            if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                            onChange={(e) => setSearchFilter(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            getTeamsLoading
                                                ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : getTeamsError ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <>
                                                        <Table
                                                            tableData={teamsList}
                                                            setDataList={setTeamsList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                            targetTeamId={'viewMember'}
                                                            setSelectedTeam={setSelectedTeam}
                                                        />
                                                        {teamsList?.length > 0 &&
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
                                    <div className="tab-pane fade" id="pills-2" role="tabpanel" aria-labelledby="pills-2-tab" tabIndex={0}>
                                        <div className="common-card">
                                            {
                                                getTreeLoading
                                                    ? (
                                                        // Show loading spinner while data is being fetched
                                                        <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                            <PulseLoader size={25} color="#49a496" />
                                                        </div >
                                                    ) : getTreeError ? (
                                                        // Display error message if there is an issue fetching data
                                                        <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                            <p className='text-danger'>Something went wrong</p>
                                                        </div>
                                                    ) :
                                                        <>
                                                            <div className="common_sub_heading_wrapper">
                                                                <h2>The Team Tree visualizes how your company is organized.</h2>
                                                            </div>
                                                            <div className="team_tree_card mt-4">
                                                                {getTreeResponse?.data?.length > 0 ?
                                                                    getTreeResponse?.data?.map((tree, index) => {
                                                                        return (
                                                                            // <div className="team_tree_card mt-4">
                                                                            //     <div className="team_tree_blk">
                                                                            //         <span className="tree_point" />
                                                                            //         <span className="tree_box">
                                                                            //             <span className="tree_box_list">
                                                                            //                 <span className="tree_box_title d-block">{tree?.name || '-'}</span>
                                                                            //                 <p className="tree_box_detail mb-0">Manager: <span className="ms-1">{tree?.managerName || '-'}</span></p>
                                                                            //                 <button className="primary-text-btn fs-14 fw-medium mt-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#viewMember" aria-controls="viewMember">View Members</button>
                                                                            //             </span>
                                                                            //         </span>
                                                                            //     </div>
                                                                            //     <div className="team_tree_blk">
                                                                            //         <span className="tree_point" />
                                                                            //         <span className="tree_box">
                                                                            //             <span className="tree_box_list">
                                                                            //                 <span className="tree_box_title d-block">Syntax &amp; Soil</span>
                                                                            //                 <p className="tree_box_detail mb-0">No Manager: <span className="ms-1" /></p>
                                                                            //                 <button className="primary-text-btn fs-14 fw-medium mt-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#viewMember" aria-controls="viewMember">View Members</button>
                                                                            //             </span>
                                                                            //         </span>
                                                                            //     </div>
                                                                            // </div>

                                                                            <TreeNode key={index} node={tree} setSelectedTeam={setSelectedTeam} />

                                                                        )
                                                                    })
                                                                    :
                                                                    <h1 className='text-center'>no data available</h1>
                                                                }
                                                            </div>
                                                        </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
            </div >

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="createNewTeam" aria-labelledby="createNewTeamLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { setValidationErrors(''); setTeamname(''); setSearch('') }} />
                </div>
                <div className="offcanvas-body p-0">
                    <div className="offcanvas_top_header px-4 py-3 mb-0">
                        <h2>Create a Team</h2>
                    </div>
                    <div className="canvas_nav_tab_content">
                        <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                            <div className="ofcvs_form_item">
                                <label>Team Name</label>
                                <div className="ofcvs_form_field">
                                    <input type="text" className="form-control" placeholder="Enter team name" value={teamName} onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setTeamname(value);
                                            if (validationErrors.teamName) {
                                                setValidationErrors(prev => ({ ...prev, teamName: false }));
                                            }
                                        }} />
                                </div>
                            </div>
                            {validationErrors.teamName &&
                                (
                                    <span className={`error ${validationErrors.teamName ? '' : 'd-none'}`}>{validationErrors.teamName}</span>
                                )
                            }
                            <div className="ofcvs_form_item" ref={wrapperRef}>
                                <label>Parent Team</label>
                                <div className="ofcvs_form_field">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search"
                                        value={search}
                                        onChange={e => {
                                            setSearch(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => setShowDropdown(true)}
                                    />
                                    {showDropdown && (
                                        <ul
                                            className="dropdown-list"
                                            style={{
                                                listStyle: 'none',
                                                margin: 0,
                                                padding: '0.5rem',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                maxHeight: '150px',
                                                overflowY: 'auto',
                                                position: 'absolute',
                                                width: '100%',
                                                background: 'white',
                                                zIndex: 1000,
                                            }}
                                        >
                                            {loading ? (
                                                <li
                                                    style={{
                                                        padding: '0.25rem 0',
                                                        color: '#666',
                                                        cursor: 'default',
                                                        userSelect: 'none',
                                                    }}
                                                >
                                                    Loading...
                                                </li>
                                            ) : error ? (
                                                <li
                                                    style={{
                                                        padding: '0.25rem 0',
                                                        color: '#999',
                                                        cursor: 'default',
                                                        userSelect: 'none',
                                                    }}
                                                >
                                                    No data available
                                                </li>
                                            ) : filteredOptions.length > 0 ? (
                                                filteredOptions.map((option, idx) => (
                                                    <li
                                                        key={option.id || idx}
                                                        style={{ padding: '0.25rem 0', cursor: 'pointer' }}
                                                        onClick={() => handleSelect(option)}
                                                    >
                                                        {option.name}
                                                    </li>
                                                ))
                                            ) : (
                                                <li
                                                    style={{
                                                        padding: '0.25rem 0',
                                                        color: '#999',
                                                        cursor: 'default',
                                                        userSelect: 'none',
                                                    }}
                                                >
                                                    No such team
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {validationErrors.parentTeam && (
                                <span className="error">{validationErrors.parentTeam}</span>
                            )}
                        </div>
                        <div className="d-flex justify-content-end gap-3 mt-4 mt-md-4">
                            <button className="primary-btn" type='button' onClick={handleAddTeam}>{addTeamLoading ? <PulseLoader size={14} color='#ffffff' /> : 'Create Team'}</button>
                            <button className="outline-btn" type='button' onClick={() => { setValidationErrors(''); setTeamname(''); setSearch('') }}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="viewMember" aria-labelledby="viewMemberLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                {
                    getTeamMembersLoading
                        ? (
                            // Show loading spinner while data is being fetched
                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                <PulseLoader size={25} color="#49a496" />
                            </div >
                        ) : getTeamMembersError ? (
                            // Display error message if there is an issue fetching data
                            <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                <p className='text-danger'>Something went wrong</p>
                            </div>
                        ) :
                            <div className="offcanvas-body p-0">
                                <div className="offcanvas_top_header px-4 py-3 mb-0">
                                    <h2>{selectedTeam || '-'}</h2>
                                    {/* <div className="canvas_action_btn">
                                        <button className="filter_action_btn edit_column_btn">Edit Teams</button>
                                    </div> */}
                                </div>
                                <div className="canvas_nav_tab_content">
                                    <Table
                                        tableData={teamMembersList}
                                        setDataList={setTeamMembersList}
                                        limit={canvasLimit}
                                        columns={canvasColumns}
                                        currentPage={canvasPage}
                                        handlePageChange={handleCanvasPageChange}
                                        setLimit={handleCanvasLimitChange}
                                    />
                                    {teamMembersList?.length > 0 &&
                                        <Pagination
                                            currentPage={canvasPage}
                                            totalPages={canvasTotalPages}
                                            limit={canvasLimit}
                                            totalItems={canvasTotalItems}
                                            handlePageChange={handleCanvasPageChange}
                                            handleLimitChange={handleCanvasLimitChange}
                                        />
                                    }
                                </div>
                            </div>
                }

            </div>

        </>
    )
}

export default Teams