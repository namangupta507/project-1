import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { SocialLoginAPI } from '../redux/actions/auth/SocialLoginAction';
import { socialLoginStateReset } from '../redux/slices/auth/SocialLoginSlice';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { showSuccessToast } from '../helpers/toast';

const AppleLoginSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { login: contextLogin, isAuthenticated } = useContext(AuthContext);

    const { response, loading, error } = useSelector((state) => state.socialLogin)

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            dispatch(SocialLoginAPI({
                token,
                platform: 'ios',
                medium: 'apple',
                fcmToken: '123344',
                // name: user?.name?.firstName || '',
                // email: user?.email || ''
            }));
        }
    }, [location, navigate]);

    useEffect(() => {
        Swal.fire({
            text: 'Logging you in',
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 1500,
        });
    }, []);

    useEffect(() => {
        if (response) {
            contextLogin(response?.token)
            showSuccessToast(response?.message);
            navigate('/home', { replace: true });
            dispatch(socialLoginStateReset())
        }
    }, [response, contextLogin, navigate])

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }

    }, [isAuthenticated, navigate])

    return <div>

    </div>;
}


export default AppleLoginSuccess;