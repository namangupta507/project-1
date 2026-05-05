import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { GetExportsApi } from '../../redux/actions/teams/export/GetExportAction';
import { PulseLoader } from 'react-spinners';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import MultiRangeDatePicker from '../../components/MultiRangeDatePicker';
import { GenerateSummaryReportAPI } from '../../redux/actions/teams/export/GenerateSummaryReportAction';
import { showErrorToast } from '../../helpers/toast';
import { GetParentTeamsApi } from '../../redux/actions/teams/GetParentTeamsAction';
import { generateSummaryReportStateReset } from '../../redux/slices/teams/export/GenerateSummaryReportSlice';
import { GenerateMemberReportAPI } from '../../redux/actions/teams/export/GenerateMemberReportAction';
import { generateMemberReportStateReset } from '../../redux/slices/teams/export/GenerateMemberReportSlice';

const DataExports = () => {
    const columns = ['Export Type', 'Date Range', 'Expires In', 'Created', 'Download']

    const dispatch = useDispatch();
    const { response, loading, error } = useSelector((state) => state.exports);
    const { response: parentTeamResponse, loading: parentTeamLoading, error: parentTeamError } = useSelector((state) => state.parentTeams);
    const { response: membersDropdownResponse, loading: membersDropdownLoading, error: membersDropdownError } = useSelector((state) => state.membersDropdown);
    const { response: summaryReportResponse, loading: summaryReportLoading, error: summaryReportError } = useSelector((state) => state.summaryReport);
    const { response: memberReportResponse, loading: memberReportLoading, error: memberReportError } = useSelector((state) => state.memberReport);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLImit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [exportsList, setExportsList] = useState([]);
    const { parentTeamId, userRole } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [dateRange, setDateRange] = useState([], []);
    const [fileFormat, setFileFormat] = useState('');
    const [exportType, setExportType] = useState('');
    const [selectedTeam, setSelectedTeam] = useState({ id: '', name: '' });
    const [selectedMember, setSelectedMember] = useState({ id: '', name: '' });
    const [showDropdown, setShowDropdown] = useState(false);
    const [options, setOptions] = useState([]);
    const [optionsMember, setOptionsMember] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showMemberDropdown, setShowMemberDropdown] = useState(false);
    // const [options, setOptions] = useState([]);
    const [filteredMemberOptions, setFilteredMemberOptions] = useState([]);
    const wrapperRef = useRef(null);
    const wrapperMembersRef = useRef(null);


    const [dateRangeMember, setDateRangeMember] = useState([], []);
    const [fileFormatMember, setFileFormatMember] = useState('');
    const [exportTypeMember, setExportTypeMember] = useState('');
    const [memberName, setMemberName] = useState('');

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleSelect = (option) => {
        if (validationErrors.name) {
            setValidationErrors(prev => ({ ...prev, name: false }));
        }
        setSelectedTeam(option); // option is full object { id, name }
        setName(option.name);
        setShowDropdown(false);
    };
    const handleSelectMember = (option) => {
        if (validationErrors.member) {
            setValidationErrors(prev => ({ ...prev, member: false }));
        }
        setSelectedMember(option); // option is full object { id, name }
        setMemberName(option.name);
        setShowMemberDropdown(false);
    };

    const handleLimitChange = (newLimit) => {
        setLImit(newLimit);
        setCurrentPage(1);
    }

    const validateForm = () => {
        const newErrors = {};

        if (!name && filteredOptions?.length > 0) {
            newErrors.name = 'Team Name is required';
        }
        if (!dateRange) {
            newErrors.dateRange = 'Date Range is required';
        }
        if (!fileFormat) {
            newErrors.fileFormat = 'File format is required';
        }
        if (!exportType) {
            newErrors.exportType = 'Export type is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const validateForm2 = () => {
        const newErrors = {};

        if (!memberName) {
            newErrors.memberName = 'Member Name is required';
        }
        if (!dateRangeMember) {
            newErrors.dateRangeMember = 'Date Range is required';
        }
        if (!fileFormatMember) {
            newErrors.fileFormatMember = 'File format is required';
        }
        if (!exportTypeMember) {
            newErrors.exportTypeMember = 'Export type is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const fetchParentTeams = async () => {
        try {
            await dispatch(GetParentTeamsApi())
        } catch (error) {
            showErrorToast(error)
        }
    }

    console.log(selectedTeam, "selectedTeam")

    const handleGenerateSummaryReport = async () => {
        if (!validateForm()) return;
        try {
            const [startDate, endDate] = dateRange
            if (parentTeamId) {

                await dispatch(GenerateSummaryReportAPI({
                    teamId: selectedTeam?.id,
                    fileFormat: fileFormat,
                    exportType: exportType,
                    startDate: startDate,
                    endDate: endDate,
                    parentTeamId: parentTeamId
                }))
            }
        } catch (error) {
            showErrorToast(error);
        }
    }

    const handleGenerateMemberReport = async () => {
        if (!validateForm2()) return;
        try {
            const [startDate, endDate] = dateRangeMember
            if (parentTeamId) {

                await dispatch(GenerateMemberReportAPI({
                    userId: selectedMember?.id,
                    fileFormat: fileFormat,
                    exportType: exportType,
                    startDate: startDate,
                    endDate: endDate,
                    parentTeamId: parentTeamId
                }))
            }
        } catch (error) {
            showErrorToast(error);
        }
    }

    useEffect(() => {
        if (parentTeamId) {
            dispatch(GetExportsApi({ page: currentPage, limit: limit, id: parentTeamId }))
        }
    }, [parentTeamId, currentPage, limit, summaryReportResponse, memberReportResponse])

    useEffect(() => {
        if (response) {
            setCurrentPage(response?.pagination?.page);
            setLImit(response?.pagination?.limit);
            setTotalItems(response?.pagination?.totalRecords);
            setTotalPages(response?.pagination?.totalPages);
            setExportsList(response?.data)
        }
    }, [response])

    useEffect(() => {
        if (parentTeamResponse) {
            const dataForDropdown = parentTeamResponse?.data?.map((r, i) => {
                return { name: r?.name, id: r?._id }
            })
            setOptions(dataForDropdown)

        }
    }, [parentTeamResponse])

    useEffect(() => {
        if (options) {
            setFilteredOptions(options);
        }
    }, [options])

    useEffect(() => {
        if (membersDropdownResponse) {
            const dataForDropdown = membersDropdownResponse?.data?.map((r, i) => {
                return { name: r?.name, id: r?._id }
            })
            setOptionsMember(dataForDropdown)

        }
    }, [membersDropdownResponse])

    useEffect(() => {
        if (optionsMember) {
            setFilteredMemberOptions(optionsMember);
        }
    }, [optionsMember])

    useEffect(() => {
        setFilteredOptions(
            options.filter(opt =>
                opt?.name?.toLowerCase().includes(name.toLowerCase())
            )
        );
    }, [name, options]);

    useEffect(() => {
        setFilteredMemberOptions(
            optionsMember.filter(opt =>
                opt?.name?.toLowerCase().includes(memberName.toLowerCase())
            )
        );
    }, [memberName, optionsMember]);

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

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperMembersRef.current && !wrapperMembersRef.current.contains(event.target)) {
                setShowMemberDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(() => {
        fetchParentTeams()
    }, [])

    useEffect(() => {
        if (summaryReportResponse) {
            setDateRange([], []);
            setFileFormat('');
            setExportType('');
            setName('');
            setValidationErrors('');
            dispatch(generateSummaryReportStateReset());
            const offcanvasEl = document.getElementById('createNewExport');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [summaryReportResponse])

    useEffect(() => {
        if (summaryReportError) {
            showErrorToast(summaryReportError?.data)
            dispatch(generateSummaryReportStateReset());
        }
    }, [summaryReportError])

    useEffect(() => {
        if (memberReportResponse) {
            setDateRangeMember([], []);
            setFileFormatMember('');
            setExportTypeMember('');
            setMemberName('');
            setValidationErrors('');
            dispatch(generateMemberReportStateReset());
            const offcanvasEl = document.getElementById('createNewExport');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [memberReportResponse])

    useEffect(() => {
        if (memberReportError) {
            showErrorToast(memberReportError?.data)
            dispatch(generateMemberReportStateReset());
        }
    }, [memberReportError])

    return (
        <>
            {parentTeamId ?
                <>
                    <div className="content-wrapper">
                        <section className="main-section spacer-y">
                            <div className="container">
                                <div className="row gy-4">
                                    <div className="col-xl-12">
                                        <div className="common_main_heading_wrapper">
                                            <div className="d-flex flex-end gap-3 w-100">
                                                <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#createNewExport" aria-controls="createNewExport">New Export</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
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
                                                            tableData={exportsList}
                                                            setDataList={setExportsList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                        />
                                                        {exportsList?.length > 0 &&
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


                    <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="createNewExport" aria-labelledby="createNewExportLabel">
                        <div className="offcanvas-header">
                            <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                        </div>
                        <div className="offcanvas-body p-0">
                            <div className="offcanvas_top_header px-4 py-3 mb-0">
                                <h2>Create Data Export</h2>
                            </div>
                            <div className="canvas_nav_tab_blk">
                                <ul className="nav nav-pills gap-3 mb-0" id="pills-tab" role="tablist">
                                    {!(userRole === 'manager') &&
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="pills-canvas-1-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-1" type="button" role="tab" aria-controls="pills-canvas-1" aria-selected="true">Team Summary</button>
                                        </li>
                                    }
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="pills-canvas-2-tab" data-bs-toggle="pill" data-bs-target="#pills-canvas-2" type="button" role="tab" aria-controls="pills-canvas-2" aria-selected="false">By Member</button>
                                    </li>
                                </ul>
                            </div>
                            <div className="canvas_nav_tab_content">
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-canvas-1" role="tabpanel" aria-labelledby="pills-canvas-1-tab" tabIndex={0}>
                                        <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                            <div className="ofcvs_form_item">
                                                <label>Team Name</label>
                                                <div className="ofcvs_form_field" ref={wrapperRef}>
                                                    <input type="text" className="form-control" placeholder="Search" value={name}
                                                        onChange={e => {
                                                            setName(e.target.value);
                                                            setShowDropdown(true);
                                                        }}
                                                        onFocus={() => setShowDropdown(true)} />
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
                                            {validationErrors.name &&
                                                (
                                                    <span className={`error ${validationErrors.name ? '' : 'd-none'}`}>{validationErrors.name}</span>
                                                )
                                            }
                                            {/* <div className="ofcvs_form_item">
                                                <label>Date Range</label>
                                                <div className="ofcvs_form_field">
                                                    <input type="text" className="form-control" placeholder="Enter email address" defaultValue />
                                                </div>
                                            </div> */}
                                            <MultiRangeDatePicker dateRange={dateRange} setDateRange={setDateRange} validationErrors={validationErrors} setValidationErrors={setValidationErrors} iconToShow={false} />
                                            <div className="ofcvs_form_item">
                                                <label>File Format</label>
                                                <div className="hstack align-items-center gap-3">
                                                    <div className="hstack align-items-center gap-2">
                                                        <label className="radio_label m-0" htmlFor="custom_check_1">
                                                            <input
                                                                type="radio"
                                                                name="fileFormat"
                                                                className="d-none"
                                                                id="custom_check_1"
                                                                value="excel"
                                                                checked={fileFormat === 'excel'}
                                                                onChange={(e) => {
                                                                    setFileFormat(e.target.value);
                                                                    if (validationErrors.fileFormat) {
                                                                        setValidationErrors(prev => ({ ...prev, fileFormat: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <span className="radio_dot" />
                                                        </label>
                                                        <span>Excel</span>
                                                    </div>
                                                    <div className="hstack align-items-center gap-2">
                                                        <label className="radio_label m-0" htmlFor="custom_check_2">
                                                            <input
                                                                type="radio"
                                                                name="fileFormat"
                                                                className="d-none"
                                                                id="custom_check_2"
                                                                value="csv"
                                                                checked={fileFormat === 'csv'}
                                                                onChange={(e) => {
                                                                    setFileFormat(e.target.value);
                                                                    if (validationErrors.fileFormat) {
                                                                        setValidationErrors(prev => ({ ...prev, fileFormat: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <span className="radio_dot" />
                                                        </label>
                                                        <span>CSV</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {validationErrors.fileFormat && (
                                                <span className="error">{validationErrors.fileFormat}</span>
                                            )}

                                            <div className="ofcvs_form_item">
                                                <label>Export Type</label>
                                                <div className="hstack align-items-center gap-3">
                                                    <div className="hstack align-items-center gap-2">
                                                        <label className="radio_label m-0" htmlFor="custom_check_3">
                                                            <input
                                                                type="radio"
                                                                name="exportType"
                                                                className="d-none"
                                                                id="custom_check_3"
                                                                value="trips"
                                                                checked={exportType === 'trips'}
                                                                onChange={(e) => {
                                                                    setExportType(e.target.value);
                                                                    if (validationErrors.exportType) {
                                                                        setValidationErrors(prev => ({ ...prev, exportType: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <span className="radio_dot" />
                                                        </label>
                                                        <span>Trips</span>
                                                    </div>
                                                    <div className="hstack align-items-center gap-2">
                                                        <label className="radio_label m-0" htmlFor="custom_check_4">
                                                            <input
                                                                type="radio"
                                                                name="exportType"
                                                                className="d-none"
                                                                id="custom_check_4"
                                                                value="expenses"
                                                                checked={exportType === 'expenses'}
                                                                onChange={(e) => {
                                                                    setExportType(e.target.value);
                                                                    if (validationErrors.exportType) {
                                                                        setValidationErrors(prev => ({ ...prev, exportType: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <span className="radio_dot" />
                                                        </label>
                                                        <span>Expenses</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {validationErrors.exportType && (
                                                <span className="error">{validationErrors.exportType}</span>
                                            )}
                                            {/* <div className="ofcvs_form_item">
                                                <label>Export Content</label>
                                                <div className="ofcvs_form_field">
                                                    <select id className="form-select">
                                                        <option value>Select</option>
                                                        <option value>Summary Only</option>
                                                        <option value>Summary and full trips</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="d-flex justify-content-end gap-3 mt-4 mt-md-4">
                                            <button className="primary-btn" type='button' onClick={handleGenerateSummaryReport}>{summaryReportLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Generate Export'}</button>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-canvas-2" role="tabpanel" aria-labelledby="pills-canvas-2-tab" tabIndex={0}>
                                        <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                            <div className="ofcvs_form_item">
                                                <label>Member Name</label>
                                                <div className="ofcvs_form_field" ref={wrapperMembersRef}>
                                                    <input type="text" className="form-control" placeholder="Search" value={memberName}
                                                        onChange={e => {
                                                            setMemberName(e.target.value);
                                                            setShowMemberDropdown(true);
                                                        }}
                                                        onFocus={() => setShowMemberDropdown(true)} />
                                                    {showMemberDropdown && (
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
                                                            {membersDropdownLoading ? (
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
                                                            ) : membersDropdownError ? (
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
                                                            ) : filteredMemberOptions.length > 0 ? (
                                                                filteredMemberOptions.map((option, idx) => (
                                                                    <li
                                                                        key={option.id || idx}
                                                                        style={{ padding: '0.25rem 0', cursor: 'pointer' }}
                                                                        onClick={() => handleSelectMember(option)}
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
                                                                    No such Member
                                                                </li>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                            {validationErrors.member &&
                                                (
                                                    <span className={`error ${validationErrors.member ? '' : 'd-none'}`}>{validationErrors.member}</span>
                                                )
                                            }
                                            <MultiRangeDatePicker dateRange={dateRangeMember} setDateRange={setDateRangeMember} validationErrors={validationErrors} setValidationErrors={setValidationErrors} iconToShow={false} />
                                            <div className="ofcvs_form_item">
                                                <label>File Format</label>
                                                <div className="hstack align-items-center gap-3">
                                                    <div className="hstack align-items-center gap-2">
                                                        <label className="radio_label m-0" htmlFor="custom_check_5">
                                                            <input
                                                                type="radio"
                                                                name="fileFormat"
                                                                className="d-none"
                                                                id="custom_check_5"
                                                                value="excel"
                                                                checked={fileFormatMember === 'excel'}
                                                                onChange={(e) => {
                                                                    setFileFormatMember(e.target.value);
                                                                    if (validationErrors.fileFormat) {
                                                                        setValidationErrors(prev => ({ ...prev, fileFormat: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <span className="radio_dot" />
                                                        </label>
                                                        <span>Excel</span>
                                                    </div>
                                                    <div className="hstack align-items-center gap-2">
                                                        <label className="radio_label m-0" htmlFor="custom_check_6">
                                                            <input
                                                                type="radio"
                                                                name="fileFormat"
                                                                className="d-none"
                                                                id="custom_check_6"
                                                                value="csv"
                                                                checked={fileFormatMember === 'csv'}
                                                                onChange={(e) => {
                                                                    setFileFormatMember(e.target.value);
                                                                    if (validationErrors.fileFormat) {
                                                                        setValidationErrors(prev => ({ ...prev, fileFormat: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <span className="radio_dot" />
                                                        </label>
                                                        <span>CSV</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {validationErrors.fileFormat && (
                                                <span className="error">{validationErrors.fileFormat}</span>
                                            )}

                                            <div className="ofcvs_form_item">
                                                <label>Export Type</label>
                                                <div className="hstack align-items-center gap-3">
                                                    <div className="hstack align-items-center gap-2">
                                                        <label className="radio_label m-0" htmlFor="custom_check_7">
                                                            <input
                                                                type="radio"
                                                                name="exportType"
                                                                className="d-none"
                                                                id="custom_check_7"
                                                                value="trips"
                                                                checked={exportTypeMember === 'trips'}
                                                                onChange={(e) => {
                                                                    setExportTypeMember(e.target.value);
                                                                    if (validationErrors.exportType) {
                                                                        setValidationErrors(prev => ({ ...prev, exportType: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <span className="radio_dot" />
                                                        </label>
                                                        <span>Trips</span>
                                                    </div>
                                                    <div className="hstack align-items-center gap-2">
                                                        <label className="radio_label m-0" htmlFor="custom_check_8">
                                                            <input
                                                                type="radio"
                                                                name="exportType"
                                                                className="d-none"
                                                                id="custom_check_8"
                                                                value="expenses"
                                                                checked={exportTypeMember === 'expenses'}
                                                                onChange={(e) => {
                                                                    setExportTypeMember(e.target.value);
                                                                    if (validationErrors.exportType) {
                                                                        setValidationErrors(prev => ({ ...prev, exportType: false }));
                                                                    }
                                                                }}
                                                            />
                                                            <span className="radio_dot" />
                                                        </label>
                                                        <span>Expenses</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {validationErrors.exportType && (
                                                <span className="error">{validationErrors.exportType}</span>
                                            )}
                                        </div>
                                        <div className="d-flex justify-content-end gap-3 mt-4 mt-md-4">
                                            <button className="primary-btn" type='button' onClick={handleGenerateMemberReport}>{memberReportLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Generate Export'}</button>
                                        </div>
                                    </div>
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

export default DataExports