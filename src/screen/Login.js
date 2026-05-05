import React, { useCallback, useContext, useEffect, useState } from 'react'
import { LoginAPI } from '../redux/actions/auth/LoginAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import { SocialLoginAPI } from '../redux/actions/auth/SocialLoginAction';
import { socialLoginStateReset } from '../redux/slices/auth/SocialLoginSlice';
import { PulseLoader } from 'react-spinners';
import { loginStateReset } from '../redux/slices/auth/LoginSlice';
import axios from 'axios';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Extract login related state from redux store
    const { response, loading, error } = useSelector((state) => state.login);

    // Extract social login related state from redux store
    const { response: socialLoginResponse, loading: socialLoginLoading, error: socialLoginError } = useSelector((state) => state.socialLogin);

    // Access authentication context to update auth status after login
    const { login: contextLogin, isAuthenticated, firstLogin } = useContext(AuthContext);

    console.log(firstLogin, "firstLogin");

    // Local state to hold form input values and UI states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);
    const [validationErrors, setValidationErrors] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);


    // Validate form inputs before submission
    const validateForm = () => {
        const newErrors = {};

        // Check if email is empty or invalid format
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Enter a valid email address';
        }
        // Check if password is empty
        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        setValidationErrors(newErrors);

        // Return true if there are no validation errors
        return Object.keys(newErrors).length === 0;
    };


    // Handle form submission for login (memoized to prevent unnecessary re-renders)
    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            // Dispatch login API call with email and password
            dispatch(LoginAPI({ email, password }));
        } catch (error) {
            // Show error toast in case of unexpected failure
            showErrorToast(error);
        }

    }, [email, password, dispatch]);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: response => {
            // Fetch user info from Google API with the access token
            const userInfo = axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` },
            });

            // If user info successfully retrieved, dispatch social login action
            if (userInfo) {
                dispatch(SocialLoginAPI({ token: response.access_token, platform: 'android', medium: 'google', fcmToken: '123344', name: userInfo?.name, email: userInfo?.email }))
            } else {
                showErrorToast('Something went wrong');
            }
        },
    });

    // Apple Sign-in handler, using Apple's JS SDK
    const handleAppleLogin = async () => {
        try {
            const response = await window.AppleID.auth.signIn();
            const { authorization, user } = response;
            const id_token = authorization?.id_token;

            if (id_token) {
                // Dispatch social login with Apple token
                dispatch(SocialLoginAPI({
                    token: id_token,
                    platform: 'ios',
                    medium: 'apple',
                    fcmToken: '123344',
                    name: user?.name?.firstName || '',
                    email: user?.email || ''
                }));
            } else {
                showErrorToast("Apple login failed");
            }
        } catch (error) {
            // Log errors from Apple sign in
            console.error('Apple Sign-In error:', error);
        }
    };

    useEffect(() => {
        window.AppleID.auth.init({
            clientId: process.env.REACT_APP_APPLE_CLIENT_ID,
            scope: 'name email',
            redirectURI: process.env.REACT_APP_APPLE_REDIRECT_URL,
            usePopup: true,
        });
    }, []);


    // Reset login state when component unmounts to clean redux store
    useEffect(() => {
        return () => {
            dispatch(loginStateReset());
        };
    }, [dispatch]);


    // Watch for login API response changes
    useEffect(() => {
        if (response?.statusCode === 200) {
            // If login success, update auth context, reset form and navigate to home page
            contextLogin(response?.token);
            contextLogin(response?.token);
            setEmail('');
            setPassword('');
            setValidationErrors('');
            showSuccessToast(response?.message);
            setRedirectAfterLogin(true);
            if (response?.user?.firstLogin === true) {
                navigate('/home');
            } else {
                navigate('/dashboard')
            }
            dispatch(loginStateReset())
        }
    }, [response, loading, contextLogin, navigate]);


    // Show toast on login API error
    useEffect(() => {
        if (error) {
            toast.dismiss();
            showErrorToast(error.data, "error");
        }
    }, [error]);


    // Watch for social login API success response
    useEffect(() => {
        if (socialLoginResponse?.statusCode === 200) {
            contextLogin(socialLoginResponse?.token)
            showSuccessToast(socialLoginResponse?.message);
            setRedirectAfterLogin(true);
            if (socialLoginResponse?.user?.firstLogin === true) {
                navigate('/home');
            } else {
                navigate('/dashboard')
            }
            dispatch(socialLoginStateReset())
        }
    }, [socialLoginResponse, contextLogin, navigate])

    // Show toast on social login API error and reset state
    useEffect(() => {
        if (socialLoginError) {
            toast.dismiss();
            showErrorToast(socialLoginError.data, "error");
            dispatch(socialLoginStateReset())
        }
    }, [socialLoginError]);

    // Redirect to home if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            if (firstLogin) {
                navigate('/home');
            }
        }
    }, [isAuthenticated, navigate, firstLogin])

    return (
        <div className="credential_main_wrapper">
            <div className="credential_content_outer">
                <div className="credential_content_wrapper">
                    {/* Logo Section */}
                    <div className="credential_logo">
                        <img src="/assets/images/savmor-logo.svg" alt="Logo" />
                    </div>
                    {/* Welcome Text Section */}
                    <div className="credential_content_info">
                        <h1>Welcome to Savmor Mileage and <br className="d-none d-lg-block" />Tax Tracker</h1>
                        <p className="mb-0 credential_sub_heading">Generate, send and download reports</p>
                        <p className="mb-0 mt-1">Send and download custom reports with a single tap</p>
                    </div>
                    {/* Footer Links */}
                    <div className="credential_footer_block">
                        <Link to='/terms' className="credential_footer_links">Terms</Link>
                        <Link to="/privacy" className="credential_footer_links">Privacy</Link>
                    </div>
                </div>
            </div>
            <div className="credential_form_wrapper">
                <div className="credential_form_card">
                    <h2>Login</h2>
                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form_field_wrapper">
                            {/* Email Input Field */}
                            <div className="form_field">
                                <label htmlFor="email">Email</label>
                                <div className="input_field">
                                    <input type="email" className="form-control" name="Email" id="email" value={email}
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
                                        }}
                                    />
                                </div>
                                {/* Display email validation error */}
                                {validationErrors.email &&
                                    (
                                        <span className={`error ${validationErrors.email ? '' : 'd-none'}`}>{validationErrors.email}</span>
                                    )
                                }
                            </div>
                            {/* Password Input Field */}
                            <div className="form_field">
                                <label htmlFor="loginPassword">Password</label>
                                <div className="input_field">
                                    <input type={passwordShown ? "text" : "password"} className="form-control" name="password" id="loginPassword" value={password}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Prevent space as first character
                                            if (value.length === 1 && value === ' ') return;
                                            setPassword(value);
                                            // Clear password validation error as user types
                                            if (validationErrors.password) {
                                                setValidationErrors(prev => ({ ...prev, password: false }));
                                            }
                                        }}
                                    />
                                    {/* Toggle password visibility */}
                                    <span className="eye-icon" onClick={() => setPasswordShown(prev => !prev)}>
                                        <i className={`fa-regular ${passwordShown ? "fa-eye" : "fa-eye-slash"}`} id="eyeLogin" />
                                    </span>
                                </div>
                                {/* Display password validation error */}
                                {validationErrors.password && (
                                    <span className={`error ${validationErrors.password ? '' : 'd-none'}`}>{validationErrors.password}</span>
                                )}
                            </div>
                        </div>
                        {/* {Forgot password section} */}
                        <div className="forgot_action_block d-flex justify-content-end align-items-center flex-wrap gap-2 mt-1">
                            <div className="forgot-psw">
                                <Link to='/send-otp' className="forgotpsw-link fw-medium text-primary text-decoration-none">Forgot password?</Link>
                            </div>
                        </div>
                        <div className="divider">
                            <span>or with</span>
                        </div>
                        {/* {social login section} */}
                        <div className="other_cred_option_blk">
                            {/* {google login button} */}
                            <button type="button" className="cred_option_btn" onClick={() => handleGoogleLogin()}>
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
                            {/* apple login button */}
                            <button type="button" className="cred_option_btn" onClick={() => handleAppleLogin()}>
                                <span className="cred_option_icon">
                                    <svg width={17} height={19} viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.9742 14.2156C15.6983 14.8529 15.3718 15.4395 14.9935 15.9788C14.4778 16.7141 14.0555 17.223 13.7301 17.5057C13.2257 17.9696 12.6852 18.2071 12.1065 18.2207C11.691 18.2207 11.1899 18.1024 10.6067 17.8626C10.0215 17.6239 9.48373 17.5057 8.99202 17.5057C8.47632 17.5057 7.92324 17.6239 7.33166 17.8626C6.73917 18.1024 6.26186 18.2274 5.89693 18.2398C5.34194 18.2634 4.78875 18.0191 4.23657 17.5057C3.88414 17.1983 3.44332 16.6713 2.91524 15.9248C2.34864 15.1276 1.88283 14.2032 1.5179 13.1493C1.12707 12.0109 0.931152 10.9086 0.931152 9.84137C0.931152 8.6189 1.19531 7.56454 1.7244 6.68098C2.14023 5.97128 2.69342 5.41144 3.38578 5.00046C4.07814 4.58948 4.82624 4.38005 5.63188 4.36665C6.0727 4.36665 6.65078 4.50301 7.36915 4.77099C8.0855 5.03987 8.54546 5.17623 8.74712 5.17623C8.89789 5.17623 9.40886 5.01679 10.2751 4.69893C11.0942 4.40415 11.7856 4.28209 12.3519 4.33017C13.8866 4.45403 15.0396 5.05901 15.8064 6.14896C14.4339 6.9806 13.7549 8.14542 13.7684 9.63971C13.7808 10.8036 14.203 11.7722 15.0329 12.5412C15.409 12.8982 15.829 13.174 16.2962 13.37C16.1949 13.6638 16.0879 13.9453 15.9742 14.2156ZM12.4544 0.364931C12.4544 1.27721 12.1211 2.129 11.4568 2.91741C10.6551 3.85467 9.6854 4.39626 8.63385 4.3108C8.62045 4.20136 8.61268 4.08617 8.61268 3.96513C8.61268 3.08934 8.99393 2.15208 9.67098 1.38574C10.009 0.99773 10.4389 0.675104 10.9602 0.417739C11.4804 0.164214 11.9725 0.0240094 12.4353 0C12.4488 0.121957 12.4544 0.243922 12.4544 0.364919V0.364931Z" fill="black" />
                                    </svg>
                                </span>
                                <span className="cred_option_text">Log in with Apple</span>
                            </button>
                        </div>
                        {/* login button  */}
                        <div className="form-btn-blk">
                            <button className="form-btn w-100 fw-medium text-white text-capitalize">
                                {loading ? <PulseLoader color="#ffffff" /> : 'Login'}
                            </button>
                        </div>
                    </form>
                    {/* register button */}
                    <div className="have_an-account_blk">
                        <p className="text-center mb-0">Not a member yet?
                            <Link to='/register' className="text-primary fw-semibold text-decoration-none ms-2">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div >
        </div >

    )
}

export default Login