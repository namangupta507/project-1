import React, { useEffect, useState } from 'react'
import { PulseLoader } from 'react-spinners';
import { ResetPasswordAPI } from '../redux/actions/auth/ResetPasswordAction';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { resetPasswordStateReset } from '../redux/slices/auth/ResetPasswordSlice';

const ResetPassword = () => {
    // Redux hooks for dispatching actions and accessing the store state
    const dispatch = useDispatch();

    const location = useLocation();// To get the email passed via router location
    const navigate = useNavigate();// To navigate programmatically
    const email = location.state?.email || '';// Extract email from location state, fallback to empty string if undefined
    const { response, loading, error } = useSelector((state) => state.resetPassword);// Accessing state of reset password flow

    // Local state for form inputs
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // States to toggle password visibility
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

    // State for holding form validation errors
    const [validationErrors, setValidationErrors] = useState('');


    // Validation function to ensure proper input for password and confirm password
    const validateForm = () => {
        const newErrors = {};

        // Check if password is provided and meets the length requirement
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        // Check if confirm password matches the password
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Re-enter password is required';
        }
        else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Password does not match';
        }
        // Update validation errors state
        setValidationErrors(newErrors);

        // Return true if no errors exist, otherwise false
        return Object.keys(newErrors).length === 0;
    };


    // Handle form submission, dispatching the reset password API action
    const handleSubmit = async (e) => {
        e.preventDefault();// Prevent form from submitting the default way
        if (!validateForm()) return;// Validate form before proceeding
        try {
            // Dispatch the reset password API action with email and password
            await dispatch(ResetPasswordAPI({ email: email, newPassword: password }))
        } catch (error) {
            console.log('error in reste password')// Log any error that occurs during the API call
        }
    }
    // Effect to handle successful password reset response
    useEffect(() => {
        if (response) {
            showSuccessToast(response?.message);// Show success message if response is successful
            // Clear password fields
            setPassword('');
            setConfirmPassword('');
            setValidationErrors('');// Reset validation errors
            dispatch(resetPasswordStateReset());// Reset the state in redux
            navigate('/')// Redirect user to the login page
        }
    }, [response])

    // Effect to handle errors from the reset password process
    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            setPassword('');
            setConfirmPassword('');
            setValidationErrors('');
            dispatch(resetPasswordStateReset());
        }
    }, [error]);

    return (
        <div className="credential_main_wrapper">
            <div className="credential_content_outer">
                <div className="credential_content_wrapper">
                    <div className="credential_content_info">
                        <h1>Welcome to Savmor Mileage and <br className="d-none d-lg-block" />Tax Tracker</h1>
                        <p className="mb-0 credential_sub_heading">One Swipe to categorize your trips</p>
                        <p className="mb-0 mt-1">Effortlessly manage your trips for business or personal with a swipe.</p>
                    </div>
                </div>
            </div>
            <div className="credential_form_wrapper">
                <div className="credential_form_card">
                    <h2>Reset password?</h2>
                    <p>Enter new password</p>
                    {/* Password reset form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form_field_wrapper">
                            <div className="form_field">
                                <label htmlFor="createPassword">New password</label>
                                <div className="input_field">
                                    <input type={passwordShown ? "text" : "password"} className="form-control" name="password" id="createPassword" value={password} placeholder='Enter new password'
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
                                    <span className="error">{validationErrors.password}</span>
                                )}
                            </div>

                            <div className='form-field'>
                                <label htmlFor="reEnterPassword">Re-enter password</label>
                                <div className="input_field">
                                    <input type={confirmPasswordShown ? "text" : "password"} className="form-control" placeholder='Re-enter password' name="password" id="reEnterPassword" value={confirmPassword}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length === 1 && value === ' ') return;
                                            setConfirmPassword(value);
                                            if (validationErrors.confirmPassword) {
                                                setValidationErrors(prev => ({ ...prev, confirmPassword: false }));
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
                        <div className="form-btn-blk">
                            <button className="form-btn fw-medium text-white text-capitalize" disabled={loading}>
                                {loading ? (
                                    < PulseLoader size={8} color="#fff" />
                                ) : (
                                    'Submit'
                                )}

                            </button>
                            {/* <Link to='/' className="form-btn bg-white-outline-btn fw-medium text-black text-capitalize">Cancel</Link> */}
                        </div>
                    </form>
                </div>
            </div >
        </div >
    )
}

export default ResetPassword