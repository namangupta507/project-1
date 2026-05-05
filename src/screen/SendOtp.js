import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SendOtpAPI } from '../redux/actions/auth/SendOtpAction';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { sendOtpStateReset } from '../redux/slices/auth/SendOtpSlice';
import { PulseLoader } from 'react-spinners';

const SendOtp = () => {
    const dispatch = useDispatch();// Hook to dispatch actions to Redux store
    const navigate = useNavigate();// Hook to navigate programmatically

    // Accessing the response, loading, and error state from Redux store
    const { response, loading, error } = useSelector((state) => state.sendOtp);

    // Local state for the email input field and validation errors
    const [email, setEmail] = useState('');
    const [validationErrors, setValidationErrors] = useState('');

    // Form validation logic for email input
    const validateForm = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }
        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            dispatch(SendOtpAPI({ email: email }));
        } catch (error) {
            console.log(error);
        }
    }

    // Reset the OTP state in Redux when the component mounts
    useEffect(() => {
        dispatch(sendOtpStateReset());
    }, [dispatch]);

    // Handle response from the SendOtpAPI
    useEffect(() => {
        if (response) {
            setEmail('');
            Swal.fire({
                title: 'Otp sent successful!',
                text: 'Please check your email.',
                icon: 'success',
                confirmButtonColor: '#49a496'
            });
            dispatch(sendOtpStateReset());
            navigate('/verify-otp', { state: { email } });
        }
    }, [response, dispatch, navigate])

    // Handle error from the SendOtpAPI
    useEffect(() => {
        if (error) {

            if (error) {
                const responseData = error?.data;

                let errorData;

                if (responseData) {
                    // If it's a string, parse it, otherwise use as is
                    errorData = typeof responseData === 'string'
                        ? JSON.parse(responseData)
                        : responseData;
                } else {
                    errorData = { errors: [{ message: 'Something went wrong!' }] };
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.errors?.[0]?.message || 'Something went wrong!',
                });
            }
            dispatch(sendOtpStateReset());
        }
    }, [error])

    console.log(error)

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
                    <h2>Forgot password?</h2>
                    <p>Enter your email to reset your password</p>
                    {/* OTP request form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form_field_wrapper">
                            <div className="form_field">
                                <label htmlFor="email">Email address</label>
                                <div className="input_field">
                                    <input type="email" className="form-control" name="Email" id="email" value={email}
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
                        </div>
                        <div className="form-btn-blk">
                            <button className="form-btn fw-medium text-white text-capitalize" disabled={loading}>
                                {loading ? (
                                    < PulseLoader size={8} color="#fff" />
                                ) : (
                                    'Submit'
                                )}

                            </button>
                            <Link to='/' className="form-btn bg-white-outline-btn fw-medium text-black text-capitalize">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default SendOtp