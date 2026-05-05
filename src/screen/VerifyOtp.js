import React, { useEffect, useState } from 'react'
import { VerifyOtpAPI } from '../redux/actions/auth/VerifyOtpAction';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { verifyOtpStateReset } from '../redux/slices/auth/VerifyOtpSlice';
import { ClipLoader, PuffLoader, PulseLoader } from 'react-spinners';
import { SendOtpAPI } from '../redux/actions/auth/SendOtpAction';
import { sendOtpStateReset } from '../redux/slices/auth/SendOtpSlice';

const VerifyOtp = () => {
    const dispatch = useDispatch(); // Redux dispatch hook to send actions
    const location = useLocation(); // Accessing location passed via react-router to get email
    const email = location.state?.email || '';// Extract email from location state or default to empty string
    const navigate = useNavigate('');// React Router navigate hook for navigation

    // Accessing state from Redux store for OTP verification and resend OTP
    const { response, loading, error } = useSelector((state) => state.verifyOtp)
    const { response: resendOtpResponse, loading: resendOtpLoading, error: resendOtpError } = useSelector((state) => state.sendOtp)

    // Local state variables
    const [otp, setOtp] = useState('');

    const [validationErrors, setValidationErrors] = useState('');// State for form validation errors

    const [timer, setTimer] = useState(60);//State for countdown timer before user can resend OTP
    const [canResend, setCanResend] = useState(false);// State to control whether the user can resend OTP

    // Form validation to check if OTP is entered
    const validateForm = () => {
        const newErrors = {};

        if (!otp.trim()) {
            newErrors.otp = 'otp is required';
        }
        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Handle OTP verification form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            dispatch(VerifyOtpAPI({ email: email, otp: Number(otp) }));
        } catch (error) {
            console.log(error);
        }
    }

    // Handle resend OTP button click
    const handleResendOtp = async () => {
        if (!canResend) return;
        try {
            dispatch(SendOtpAPI({ email }));
        } catch (error) {
            console.log(error);
        }
    };

    // Countdown timer effect for OTP resend
    useEffect(() => {

        setCanResend(false);
        setTimer(60);

        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        // Cleanup the interval on component unmount or when the timer is reset
        return () => clearInterval(interval);
    }, [resendOtpResponse]);

    // Effect to handle OTP verification response (success)
    useEffect(() => {
        if (response) {
            showSuccessToast(response?.message);
            setOtp('');
            setValidationErrors('');
            dispatch(verifyOtpStateReset());
            navigate('/reset-password', { state: { email } })
        }
    }, [response]);

    // Effect to handle successful OTP resend response
    useEffect(() => {
        if (resendOtpResponse) {
            showSuccessToast('Otp resend successfully');
            dispatch(sendOtpStateReset());
        }
    }, [resendOtpResponse])

    // Effect to handle error response for OTP verification
    useEffect(() => {
        if (error) {
            showErrorToast(error?.data)
            setOtp('');
            setValidationErrors('');
            dispatch(verifyOtpStateReset());
        }
    }, [error])


    // Effect to handle error response for OTP resend failure
    useEffect(() => {
        if (resendOtpError) {
            showErrorToast(resendOtpError?.data);
            dispatch(sendOtpStateReset());
        }
    }, [resendOtpError])

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
                    <h2>Enter OTP</h2>
                    {email && <p>{`OTP sent to this email: ${email}`}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form_field_wrapper">
                            <div className="form_field">
                                {/* <label htmlFor="email">Email address</label> */}
                                <div className="input_field">
                                    <input type="text" className="form-control" name="otp" id="otp" placeholder='Enter OTP' value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length === 1 && value === ' ') return;
                                            if (/^\d*$/.test(value)) {
                                                setOtp(value);
                                            }
                                            if (validationErrors.otp) {
                                                setValidationErrors(prev => ({ ...prev, otp: false }));
                                            }
                                        }}
                                        inputMode="numeric"
                                        pattern="[0-9]*"

                                    />
                                </div>
                                {validationErrors.otp &&
                                    (
                                        <span className={`error ${validationErrors.otp ? '' : 'd-none'}`}>{validationErrors.otp}</span>
                                    )
                                }
                                {timer > 0 ? (
                                    <p className="text-end mt-2">Resend OTP in: {timer} sec</p>
                                ) : (
                                    <div className="hstack justify-content-end mt-2">
                                        <button
                                            className="border-0 p-0 bg-white text-black fs-12 ms-auto"
                                            disabled={!canResend || resendOtpLoading}
                                            onClick={handleResendOtp}
                                        >
                                            {resendOtpLoading ? <ClipLoader color="#000000" size={24} /> : 'Resend OTP'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-btn-blk">
                            <button className="form-btn fw-medium text-white text-capitalize">{loading ? <PulseLoader color='#ffffff' /> : 'Verify'}</button>
                            {/* <button className="form-btn fw-medium text-white text-capitalize" disabled={!canResend || resendOtpLoading} onClick={() => handleResendOtp()}>{resendOtpLoading ? <PulseLoader color='#ffffff' /> : 'Resend OTP'}</button> */}
                            {/* <a href="login.html" className="form-btn bg-white-outline-btn fw-medium text-white text-capitalize">Cancel</a> */}
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default VerifyOtp