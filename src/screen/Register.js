import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { RegisterAPI } from '../redux/actions/auth/RegisterAction';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { registerStateReset } from '../redux/slices/auth/RegisterSlice';
import Swal from 'sweetalert2';
import { PulseLoader } from 'react-spinners';

const Register = () => {

    // Dispatch and navigate hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Getting the register response, loading, and error states from Redux
    const { response, loading, error } = useSelector((state) => state.register);
    // Local state variables for input fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State variables for password visibility toggle
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

    // Validation errors state
    const [validationErrors, setValidationErrors] = useState('');

    // Validate the form fields before submission
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!name.trim()) {
            newErrors.name = 'Full Name is required';
        }
        // Email validation
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }
        // Password validation
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }
        // Confirm password validation
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Re-enter password is required';
        }
        else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Password does not match';
        }
        setValidationErrors(newErrors);// Set validation errors

        return Object.keys(newErrors).length === 0;// If no errors, return true
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();// Prevent default form submission
        if (!validateForm()) return;// If validation fails, do not proceed
        try {
            // Dispatch the register action with the form data
            dispatch(RegisterAPI({ fullName: name, email, password }));
        } catch (error) {
            console.log(error);// Log any errors
        }
    }

    // Reset register state when the component unmounts or changes
    useEffect(() => {
        return () => {
            dispatch(registerStateReset());
        };
    }, [dispatch]);

    // If registration is successful, reset form and show success alert
    useEffect(() => {
        if (response) {
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setValidationErrors('');
            Swal.fire(
                'Registered Successful!',
                'Please sign in.',
                'success'
            );
            navigate('/');// Redirect to login page
            dispatch(registerStateReset());
        }
    }, [response]);

    // If there's an error, show an error toast and reset validation errors
    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            setValidationErrors('');
            dispatch(registerStateReset());
        }
    }, [error])

    return (
        <div className="credential_main_wrapper">
            <div className="credential_content_outer">
                <div className="credential_content_wrapper">
                    <div className="credential_logo">
                        <img src="/assets/images/savmor-logo.svg" alt="Logo" />
                    </div>
                    <div className="credential_content_info">
                        <h1>Welcome to Savmor Mileage and <br className="d-none d-lg-block" />Tax Tracker</h1>
                        <p className="mb-0 credential_sub_heading">Track what you spend and go</p>
                        <p className="mb-0 mt-1">Keep close tabs on expenses to ensure a smooth transactional exchange.</p>
                    </div>
                    <div className="credential_footer_block">
                        <Link to='/terms' className="credential_footer_links">Terms</Link>
                        <Link to="/privacy" className="credential_footer_links">Privacy</Link>
                    </div>
                </div>
            </div>
            <div className="credential_form_wrapper">
                <div className="credential_form_card py-4">
                    <h2>Sign up</h2>
                    {/* Register form */}
                    <form onSubmit={handleSubmit}>
                        {/* Full name field */}
                        <div className="form_field_wrapper">
                            <div className="form_field">
                                <label htmlFor="fullName">Full name</label>
                                <div className="input_field">
                                    <input type="text" className="form-control" name="name" id="fullName" value={name}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            value = value.replace(/[0-9]/g, '');
                                            if (value.length === 1 && value === ' ') return;
                                            setName(value);
                                            if (validationErrors.name) {
                                                setValidationErrors(prev => ({ ...prev, name: false }));
                                            }
                                        }} />
                                </div>
                                {validationErrors.name &&
                                    (
                                        <span className={`error ${validationErrors.name ? '' : 'd-none'}`}>{validationErrors.name}</span>
                                    )
                                }
                            </div>
                            {/* Email field */}
                            <div className="form_field">
                                <label htmlFor="email">Email address</label>
                                <div className="input_field">
                                    <input type="email" className="form-control" name="Email" id="email" value={email}
                                        onKeyDown={(e) => {

                                            if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length === 1 && value === ' ') return;
                                            setEmail(value);
                                            if (validationErrors.email) {
                                                setValidationErrors(prev => ({ ...prev, email: false }));
                                            }
                                        }} />
                                </div>
                                {validationErrors.email &&
                                    (
                                        <span className={`error ${validationErrors.email ? '' : 'd-none'}`}>{validationErrors.email}</span>
                                    )
                                }
                            </div>
                            {/* Password field */}
                            <div className="form_field mb-3">
                                <label htmlFor="createPassword">Create password</label>
                                <div className="input_field">
                                    <input type={passwordShown ? "text" : "password"} className="form-control" name="password" id="createPassword" value={password}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length === 1 && value === ' ') return;
                                            setPassword(value);
                                            if (validationErrors.password) {
                                                setValidationErrors(prev => ({ ...prev, password: false }));
                                            }
                                        }} />
                                    <span className="eye-icon" onClick={() => setPasswordShown(prev => !prev)}>
                                        <i className={`fa-regular ${passwordShown ? "fa-eye" : "fa-eye-slash"}`} id="eyeLogin" />
                                    </span>
                                </div>
                                {validationErrors.password === 'Password must be at least 8 characters long' && (
                                    <span className="input_message">{validationErrors.password}</span>
                                )}

                                {validationErrors.password && validationErrors.password !== 'Password must be at least 8 characters long' && (
                                    <span className={`error ${validationErrors.password ? '' : 'd-none'}`}>{validationErrors.password}</span>
                                )}
                            </div>
                            {/* Confirm password field */}
                            <div className="form_field">
                                <label htmlFor="reEnterPassword">Re-enter password</label>
                                <div className="input_field">
                                    <input type={confirmPasswordShown ? "text" : "password"} className="form-control" name="password" id="reEnterPassword" value={confirmPassword}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length === 1 && value === ' ') return;
                                            setConfirmPassword(value);
                                            if (validationErrors.confirmPassword) {
                                                setValidationErrors(prev => ({ ...prev, confirmPassword: false }));
                                            }
                                            if (confirmPassword && value !== password) {
                                                setValidationErrors(prev => ({
                                                    ...prev,
                                                    confirmPassword: 'Passwords do not match'
                                                }));
                                            } else if (confirmPassword && value === password) {
                                                setValidationErrors(prev => ({
                                                    ...prev,
                                                    confirmPassword: false
                                                }));
                                            }
                                        }} />
                                    <span className="eye-icon" onClick={() => setConfirmPasswordShown(prev => !prev)}>
                                        <i className={`fa-regular ${confirmPasswordShown ? "fa-eye" : "fa-eye-slash"}`} id="eyeLogin" />
                                    </span>
                                </div>
                                {validationErrors.confirmPassword && (
                                    <span className={`error ${validationErrors.confirmPassword ? '' : 'd-none'}`}>{validationErrors.confirmPassword}</span>
                                )}
                            </div>
                        </div>
                        {/* <div className="divider">
                            <span>or with</span>
                        </div> */}
                        {/* <div className="other_cred_option_blk">
                            <button type="button" className="cred_option_btn">
                                <span className="cred_option_icon">
                                    <svg width={18} height={19} viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.8765 9.328C17.8765 8.68126 17.8184 8.05939 17.7106 7.4624H9.12061V10.9905H14.0292C13.8178 12.1305 13.1752 13.0965 12.2092 13.7432V16.0317H15.1568C16.8815 14.4439 17.8765 12.1057 17.8765 9.328Z" fill="#4EA396" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.12031 18.2414C11.5829 18.2414 13.6475 17.4247 15.1565 16.0317L12.2089 13.7432C11.3922 14.2905 10.3475 14.6138 9.12031 14.6138C6.74478 14.6138 4.73408 13.0094 4.01687 10.8536H0.969727V13.2167C2.47049 16.1975 5.55495 18.2414 9.12031 18.2414Z" fill="#34A853" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M4.01725 10.8536C3.83484 10.3064 3.73119 9.72181 3.73119 9.12068C3.73119 8.51954 3.83484 7.93499 4.01725 7.38775V5.02466H0.97011C0.35239 6.25595 0 7.64893 0 9.12068C0 10.5924 0.35239 11.9854 0.97011 13.2167L4.01725 10.8536Z" fill="#FBBC05" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.12031 3.62755C10.4594 3.62755 11.6617 4.08773 12.6069 4.9915L15.2229 2.37553C13.6433 0.903777 11.5787 0 9.12031 0C5.55495 0 2.47049 2.04386 0.969727 5.02467L4.01687 7.38776C4.73408 5.23196 6.74478 3.62755 9.12031 3.62755Z" fill="#EA4335" />
                                    </svg>
                                </span>
                                <span className="cred_option_text">Log in with Google</span>
                            </button>
                            <button type="button" className="cred_option_btn">
                                <span className="cred_option_icon">
                                    <svg width={17} height={19} viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.9742 14.2156C15.6983 14.8529 15.3718 15.4395 14.9935 15.9788C14.4778 16.7141 14.0555 17.223 13.7301 17.5057C13.2257 17.9696 12.6852 18.2071 12.1065 18.2207C11.691 18.2207 11.1899 18.1024 10.6067 17.8626C10.0215 17.6239 9.48373 17.5057 8.99202 17.5057C8.47632 17.5057 7.92324 17.6239 7.33166 17.8626C6.73917 18.1024 6.26186 18.2274 5.89693 18.2398C5.34194 18.2634 4.78875 18.0191 4.23657 17.5057C3.88414 17.1983 3.44332 16.6713 2.91524 15.9248C2.34864 15.1276 1.88283 14.2032 1.5179 13.1493C1.12707 12.0109 0.931152 10.9086 0.931152 9.84137C0.931152 8.6189 1.19531 7.56454 1.7244 6.68098C2.14023 5.97128 2.69342 5.41144 3.38578 5.00046C4.07814 4.58948 4.82624 4.38005 5.63188 4.36665C6.0727 4.36665 6.65078 4.50301 7.36915 4.77099C8.0855 5.03987 8.54546 5.17623 8.74712 5.17623C8.89789 5.17623 9.40886 5.01679 10.2751 4.69893C11.0942 4.40415 11.7856 4.28209 12.3519 4.33017C13.8866 4.45403 15.0396 5.05901 15.8064 6.14896C14.4339 6.9806 13.7549 8.14542 13.7684 9.63971C13.7808 10.8036 14.203 11.7722 15.0329 12.5412C15.409 12.8982 15.829 13.174 16.2962 13.37C16.1949 13.6638 16.0879 13.9453 15.9742 14.2156ZM12.4544 0.364931C12.4544 1.27721 12.1211 2.129 11.4568 2.91741C10.6551 3.85467 9.6854 4.39626 8.63385 4.3108C8.62045 4.20136 8.61268 4.08617 8.61268 3.96513C8.61268 3.08934 8.99393 2.15208 9.67098 1.38574C10.009 0.99773 10.4389 0.675104 10.9602 0.417739C11.4804 0.164214 11.9725 0.0240094 12.4353 0C12.4488 0.121957 12.4544 0.243922 12.4544 0.364919V0.364931Z" fill="black" />
                                    </svg>
                                </span>
                                <span className="cred_option_text">Log in with Apple</span>
                            </button>
                        </div> */}
                        {/* Register buton */}
                        <div className="form-btn-blk">
                            <button className="form-btn w-100 fw-medium text-white text-capitalize">
                                {loading ? <PulseLoader color="#ffffff" /> : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                    {/* Login button for redirecting on login page */}
                    <div className="have_an-account_blk">
                        <p className="text-center mb-0">Already have an account?
                            <Link to='/' className="text-primary fw-semibold text-decoration-none ms-2">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Register