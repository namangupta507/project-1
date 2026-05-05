import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { InviteMembersAPI } from '../../redux/actions/teams/members/InviteMembersAction';
import { showErrorToast, showSuccessToast } from '../../helpers/toast';
import { inviteMembersStateReset } from '../../redux/slices/teams/members/InviteMembersSlice';
import { PulseLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const InviteMembers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { response, loading, error } = useSelector((state) => state.parentTeams);
    const { response: sendInviteResponse, loading: sendInviteLoading, error: sendInviteError } = useSelector((state) => state.inviteMembers);
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState({ id: '', name: '' });
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [emailInput, setEmailInput] = useState(''); // current typing input (string)
    const [emails, setEmails] = useState([]);
    const [role, setRole] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const wrapperRef = useRef(null);

    const handleSelect = (option) => {
        if (validationErrors.team) {
            setValidationErrors(prev => ({ ...prev, team: false }));
        }
        setSelectedTeam(option); // option is full object { id, name }
        setSearch(option.name);
        setShowDropdown(false);
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    };

    const validateForm = () => {
        const newErrors = {};

        if (emails.length < 0) {
            newErrors.email = 'Enter at least one email';
        }
        if (!search && filteredOptions?.length > 0) {
            newErrors.team = 'Team is required';
        }
        if (!role) {
            newErrors.role = 'Role is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const handleInvite = async () => {
        if (!validateForm()) return;
        try {
            await dispatch(InviteMembersAPI({ email: emails, role: Number(role), teamId: selectedTeam.id }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const addEmails = (input) => {
        const emailCandidates = input.split(',').map(e => e.trim()).filter(e => e.length > 0);

        const validEmailsToAdd = [];
        const invalidEmails = [];

        emailCandidates.forEach(email => {
            if (isValidEmail(email)) {
                if (!emails.includes(email)) {
                    validEmailsToAdd.push(email);
                }
            } else {
                invalidEmails.push(email);
            }
        });

        if (invalidEmails.length > 0) {
            setValidationErrors(prev => ({ ...prev, email: `Invalid email(s): ${invalidEmails.join(', ')}` }));
        } else {
            setValidationErrors(prev => ({ ...prev, email: '' }));
        }

        if (validEmailsToAdd.length > 0) {
            setEmails(prev => [...prev, ...validEmailsToAdd]);
        }
    };

    const handleInputChange = (e) => {
        setEmailInput(e.target.value);
        if (validationErrors.email) {
            setValidationErrors(prev => ({ ...prev, email: '' }));
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            if (emailInput.trim() !== '') {
                addEmails(emailInput);
                setEmailInput('');
            }
        }
    };

    const removeEmail = (emailToRemove) => {
        setEmails(prev => prev.filter(email => email !== emailToRemove));
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
        if (sendInviteResponse) {
            dispatch(inviteMembersStateReset());
            showSuccessToast(sendInviteResponse?.message);
            setEmails([]);
            setRole('');
            setSearch('');
            navigate('/dashboard/teams/members')
        }
    }, [sendInviteResponse])

    useEffect(() => {
        if (sendInviteError) {
            dispatch(inviteMembersStateReset());
            showErrorToast(sendInviteResponse?.message);
        }
    }, [sendInviteError])



    // const handleEmailChange = (e) => {
    //     const value = e.target.value;
    //     setEmail(value);
    //     if (validationErrors.email) {
    //         setValidationErrors(prev => ({ ...prev, email: '' })); // clear error while typing
    //     }
    // };



    // const validateEmails = () => {
    //     const emails = email.split(',').map(e => e.trim()).filter(e => e.length > 0);
    //     if (emails.length === 0) {
    //         setValidationErrors(prev => ({ ...prev, email: 'Please enter at least one email.' }));
    //         return false;
    //     }
    //     const invalidEmails = emails.filter(e => !isValidEmail(e));
    //     if (invalidEmails.length > 0) {
    //         setValidationErrors(prev => ({ ...prev, email: `Invalid email(s): ${invalidEmails.join(', ')}` }));
    //         return false;
    //     }
    //     setValidationErrors(prev => ({ ...prev, email: '' }));
    //     return true;
    // };

    return (
        <div className="content-wrapper">
            {/* <div className="breadcrumb_wrapper spacer-y pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="page-header">
                                <nav className="breadcrumb_nav">
                                    <ul className="breadcrumb mb-0">
                                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                                        <li className="breadcrumb-item"><a href="/">Members</a></li>
                                        <li className="breadcrumb-item text-capitalize">Invite Members</li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <section className="main-section spacer-y pt-3">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-xl-12">
                            <div className="common_main_heading_wrapper">
                                <h1>Invite Members</h1>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="common-card">
                                <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                    <div className="ofcvs_form_item">
                                        <label>Email Addresses</label>
                                        <div className="ofcvs_form_field">
                                            <div className="email-input-wrapper" style={{ border: validationErrors.email ? '1px solid red' : '1px solid #ccc', padding: '5px', borderRadius: '5px', display: 'flex', flexWrap: 'wrap', gap: '5px', minHeight: '40px' }}>
                                                {emails.map(email => (
                                                    <div
                                                        key={email}
                                                        style={{
                                                            backgroundColor: '#e0e0e0',
                                                            padding: '5px 10px',
                                                            borderRadius: '15px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <span>{email}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeEmail(email)}
                                                            style={{
                                                                marginLeft: '8px',
                                                                border: 'none',
                                                                background: 'transparent',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold',
                                                            }}
                                                            aria-label={`Remove ${email}`}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ))}
                                                <input
                                                    type="text"
                                                    value={emailInput}
                                                    placeholder="Enter email addresses"
                                                    onChange={handleInputChange}
                                                    onKeyDown={handleInputKeyDown}
                                                    style={{ flex: 1, border: 'none', outline: 'none', minWidth: '150px' }}
                                                />
                                            </div>
                                        </div>
                                        <p className="fs-14 mb-0 mt-1 text-secondary">Separate emails by comma</p>
                                        {validationErrors.email &&
                                            (
                                                <span className={`error ${validationErrors.email ? '' : 'd-none'}`}>{validationErrors.email}</span>
                                            )
                                        }
                                    </div>
                                    <div className="ofcvs_form_item">
                                        <label>Roles</label>
                                        <div className="ofcvs_form_field">
                                            <select id className="form-select" value={role} onChange={(e) => {
                                                setRole(e.target.value)
                                                if (validationErrors.role) {
                                                    setValidationErrors(prev => ({ ...prev, role: false }));
                                                }
                                            }}>
                                                <option value="">Select</option>
                                                <option value="5">Member</option>
                                                <option value="4">Manager Limited</option>
                                                <option value="3">Team Manager</option>
                                                <option value="1">Super Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                    {validationErrors.role &&
                                        (
                                            <span className={`error ${validationErrors.role ? '' : 'd-none'}`}>{validationErrors.role}</span>
                                        )
                                    }
                                    <div className="ofcvs_form_item" ref={wrapperRef}>
                                        <label>Team</label>
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
                                {validationErrors.team &&
                                    (
                                        <span className={`error ${validationErrors.team ? '' : 'd-none'}`}>{validationErrors.team}</span>
                                    )
                                }
                                <div className="d-flex justify-content-start gap-3 mt-4 mt-md-4">
                                    <button className="primary-btn" type='button' onClick={handleInvite}>{sendInviteLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Send Invites'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default InviteMembers