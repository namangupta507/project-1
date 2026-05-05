import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { UpdateProfileAPI } from '../redux/actions/auth/UpdateProfileAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { updateProfileStateReset } from '../redux/slices/auth/UpdateProfileSlice';
import { PulseLoader } from 'react-spinners';
import { ChangePasswordAPI } from '../redux/actions/auth/ChangePasswordAction';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { response, loading, error } = useSelector((state) => state.changePassword);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState('');

    const [oldPasswordShown, setOldPasswordShown] = useState('');
    const [newPasswordShown, setNewPasswordShown] = useState('');
    const [confirmPasswordShown, setConfirmPasswordShown] = useState('');

    const validateForm = () => {
        const errors = {};

        if (!oldPassword) {
            errors.oldPassword = "Old password is required";
        }
        if (!newPassword) {
            errors.newPassword = "New password is required";
        } else if (newPassword.length < 8) {
            errors.newPassword = "Password must be at least 8 characters long";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "Please confirm your new password";
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setValidationErrors(errors);

        // Return true if no errors
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async () => {

        if (!validateForm()) {
            return
        }
        try {
            await dispatch(ChangePasswordAPI({ oldPassword: oldPassword, newPassword: newPassword }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    useEffect(() => {
        if (response) {
            showSuccessToast(response?.message);
            dispatch(updateProfileStateReset());
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setValidationErrors('');
        }
    })
    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            dispatch(updateProfileStateReset());
        }
    }, [error])

    return (
        <div className="content-wrapper">
            <section className="main-section spacer-y">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-xl-12">
                            <div className="common_main_heading_wrapper">
                                <h1>Change password</h1>
                            </div>
                            <div className="common-card">
                                <div className="max_width_blk min-height_blk">
                                    <div className="space_card">
                                        <div className="profile_wrapper">
                                            <div className="profile_fields input_field">
                                                <input type={oldPasswordShown ? "text" : "password"} className="form-control w-100" id="oldPassword" placeholder="Old Password" value={oldPassword} onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length === 1 && value === ' ') return;
                                                    setOldPassword(value);
                                                    if (validationErrors.oldPassword) {
                                                        setValidationErrors(prev => ({ ...prev, oldPassword: false }));
                                                    }
                                                }} />
                                                <span className="eye-icon" onClick={() => setOldPasswordShown(prev => !prev)}>
                                                    <i className={`fa-regular ${oldPasswordShown ? "fa-eye" : "fa-eye-slash"}`} id="eyeLogin" />
                                                </span>
                                            </div>
                                            {validationErrors.password === 'Password must be at least 8 characters long' && (
                                                <span className="input_message">{validationErrors.password}</span>
                                            )}

                                            {validationErrors.password && validationErrors.password !== 'Password must be at least 8 characters long' && (
                                                <span className={`error ${validationErrors.password ? '' : 'd-none'}`}>{validationErrors.password}</span>
                                            )}

                                            <div className="profile_fields input_field">
                                                <input type={newPasswordShown ? "text" : "password"} className="form-control w-100" id="newPassword" placeholder="New password" value={newPassword} onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value.length === 1 && value === ' ') return;
                                                    setNewPassword(value);
                                                    if (validationErrors.newPassword) {
                                                        setValidationErrors(prev => ({ ...prev, newPassword: false }));
                                                    }
                                                }} />
                                                <span className="eye-icon" onClick={() => setNewPasswordShown(prev => !prev)}>
                                                    <i className={`fa-regular ${newPasswordShown ? "fa-eye" : "fa-eye-slash"}`} id="eyeLogin" />
                                                </span>
                                            </div>
                                            {validationErrors.newPassword && (
                                                <span className={`error ${validationErrors.newPassword ? '' : 'd-none'}`}>{validationErrors.newPassword}</span>
                                            )}

                                            <div className="profile_fields input_field">
                                                <input type={confirmPasswordShown ? "text" : "password"} className="form-control w-100" id="confirmPassword" placeholder="Confirm password" value={confirmPassword} onChange={(e) => {
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
                                        <div className="d-flex justify-content-center gap-3 mt-4 mt-md-4">
                                            <button className="primary-btn" onClick={handleSubmit}>{loading ? <PulseLoader size={18} color='#ffffff' /> : 'Save'}</button>
                                            <button className="outline-btn" onClick={() => {
                                                setOldPassword('');
                                                setNewPassword('');
                                                setConfirmPassword('');
                                                setValidationErrors('');
                                            }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default ChangePassword