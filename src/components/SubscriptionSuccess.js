import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { SubscriptionSuccessAPI } from '../redux/actions/auth/SubscriptionSuccessAction';

const SubscriptionSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useContext(AuthContext);
    useEffect(() => {
        Swal.fire({
            text: 'Plan upgraded successful',
            icon: 'success',
            allowOutsideClick: false,
            showConfirmButton: false,
            timer: 1500,
        });
    }, []);

    useEffect(() => {
        if (userId) {
            dispatch(SubscriptionSuccessAPI({ userId: userId }))
        }

    }, [userId])

    return (
        <div></div>
    )
}

export default SubscriptionSuccess