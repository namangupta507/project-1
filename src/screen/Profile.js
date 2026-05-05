import React, { use, useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DeleteAccountAPI } from '../redux/actions/auth/DeleteAccountAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { deleteAccountStateReset } from '../redux/slices/auth/DeleteAccountSlice';
import { AuthContext } from '../context/AuthContext';
import { PulseLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import PhoneInputComponent from '../components/PhoneInput';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { UpdateProfileAPI } from '../redux/actions/auth/UpdateProfileAction';
import { updateProfileRequest, updateProfileStateReset } from '../redux/slices/auth/UpdateProfileSlice';
import { useProfileImage } from '../context/ProfileImageContext';

const Profile = () => {
    const dispatch = useDispatch();
    const { response: profileResponse, loading: profileLoading, error: profileError } = useSelector((state) => state.profile);
    const { response: deleteAccountResponse, loading: deleteAccountLoading, error: deleteAccountError } = useSelector((state) => state.deleteAccount);
    const { response: updateProfileResponse, loading: updateProfileLoading, error: updateProfileError } = useSelector((state) => state.updateProfile);
    // const [phone, setPhone] = useState('');
    const { logoutAfterAccountDeletion, fetchProfile } = useContext(AuthContext)
    const { profileImage, updateProfileImage } = useProfileImage();
    const [previewUrl, setPreviewUrl] = React.useState(null);

    // const [image, setProfileImage] = useState('');
    const [isProfileImageChange, setProfileImageChange] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('');

    // Split by space
    const nameParts = fullName?.trim()?.split(' ');

    // Safely access parts
    // const firstName = nameParts ? nameParts[0] : '';
    // const lastName = nameParts ? nameParts[1] : '';

    const getProfileCompletion = () => {
        let completed = 0;

        if (fullName?.trim()) completed += 1;
        if (email?.trim()) completed += 1;
        if (!phone) completed += 1;

        return (completed / 2) * 100;
    };

    const profileCompletion = getProfileCompletion(); // e.g., 50, 75, etc.

    const handleDeleteAccount = useCallback(async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to permanently delete your account?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#49a496',
            cancelButtonColor: '#ffffff',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel',
            customClass: {
                cancelButton: 'custom-cancel-btn'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await dispatch(DeleteAccountAPI())

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }, [dispatch]);

    console.log(profileImage, "image")

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            updateProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));  // create a preview URL
            setProfileImageChange(true);
        } else {
            updateProfileImage(null);
            setPreviewUrl(null);
            setProfileImageChange(false);
        }
    };

    const phoneNumber = parsePhoneNumberFromString(phone?.toString()) // 'IN' as default region if needed

    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('countryCode', countryCode);

        // Only append if file exists
        if (profileImage && isProfileImageChange) {
            formData.append('profileImage', profileImage);
        }
        try {
            await dispatch(UpdateProfileAPI(formData))
        } catch (error) {
            showErrorToast(error)
        }
    }

    useEffect(() => {
        if (profileResponse) {
            setFullName(profileResponse?.user?.fullName);
            setEmail(profileResponse?.user?.email);
            const rawPhone = profileResponse.user.phone || '';
            // const rawCountryCode = profileResponse.user.countryCode || '';

            setPhone(rawPhone);
        }
    }, [profileResponse])

    useEffect(() => {
        if (phoneNumber) {
            setPhone(phoneNumber?.nationalNumber);
            setCountryCode(phoneNumber?.countryCallingCode);
        }
    }, [phoneNumber])

    useEffect(() => {
        if (deleteAccountResponse) {
            Swal.fire({
                icon: 'success',
                title: 'Account deleted',
                text: 'You no longer have access to this account.',
            });
            dispatch(deleteAccountStateReset());
            logoutAfterAccountDeletion()
        }
    }, [deleteAccountResponse])

    useEffect(() => {
        if (updateProfileResponse) {
            showSuccessToast(updateProfileResponse?.message);
            dispatch(updateProfileStateReset());
            fetchProfile();
            // logoutAfterAccountDeletion()
        }
    }, [updateProfileResponse])

    useEffect(() => {
        if (updateProfileError) {
            showErrorToast(updateProfileError?.data);
            dispatch(updateProfileStateReset());
        }
    }, [updateProfileError])

    return (
        <>
            <div className="content-wrapper">
                <section className="main-section spacer-y">
                    <div className="container">
                        <div className="row gy-4">
                            <div className="col-xl-12">
                                <div className="common_main_heading_wrapper">
                                    <h1>My Profile</h1>
                                </div>
                                <div className="common-card">
                                    <div className="progress mb-3" role="progressbar" aria-label="Warning example" aria-valuenow={profileCompletion} aria-valuemin={0} aria-valuemax={100} style={{ height: 10 }}>
                                        <div className="progress-bar bg-warning" style={{ width: `${profileCompletion}%` }} />
                                    </div>
                                    <h2 className="md-4 fs-5 fw-semibold text-black">Personal info</h2>
                                    <div className="max_width_blk min-height_blk">
                                        <div className="space_card">
                                            <div className="profile_wrapper">
                                                <div className="profile_img_upload">
                                                    <input type="file" id="profileUpload" className="d-none" accept="image/*" onChange={handleImageUpload} />
                                                    <label htmlFor='profileUpload' className="profile_upload_label">
                                                        <i className='fas fa-camera'></i>
                                                    </label>
                                                    <div className="profile_img_preview">
                                                        {previewUrl ? (
                                                            <img src={previewUrl} alt="Profile Preview" />
                                                        ) : (
                                                            <img src={profileImage} alt="Profile" />  // fallback image maybe
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="profile_fields">
                                                    <label>Full name</label>
                                                    <input type="text" name="Firstname" className="form-control" placeholder="Enter first name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                                </div>
                                                {/* <div className="profile_fields">
                                                    <label>Last name</label>
                                                    <input type="text" name="lastname" className="form-control" placeholder="Enter last name" value={lastName} />
                                                </div> */}
                                                <div className="profile_fields">
                                                    <label>Email address</label>
                                                    <input type="email" name="EmailAddress" className="form-control" placeholder="Enter email address" value={email} />
                                                </div>
                                                <PhoneInputComponent phone={phone} setPhone={setPhone} />
                                                {/* <div className="profile_fields">
                                                    <label>Phone Number</label>
                                                    <input type="text" name="phoneNumber" className="form-control" placeholder="Enter Phone Number" value={phone} />
                                                </div> */}
                                                {/* <div className="profile_fields">
                                                    <label>Phone number</label>
                                                    <input type="tel" name="Phone" className="form-control" placeholder="Enter phone number" value={phone} />
                                                </div> */}
                                            </div>
                                            <div className="d-flex justify-content-center gap-3 mt-4 mt-md-4">
                                                <button className="primary-btn" onClick={() => handleDeleteAccount()}>{deleteAccountLoading ? <PulseLoader color='#ffffff' size={18} /> : 'Delete Account'}</button>
                                                <button className="outline-btn" onClick={handleUpdateProfile}>{updateProfileLoading ? <PulseLoader color='#000000' size={14} /> : 'Update Account'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
            </div >

            {/* add custom rates */}
            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1} id="addCustomRates" aria-labelledby="addCustomRatesLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Add Custom Rate</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn">Save</button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper outline_form_wrapper">
                        <div className="ofcvs_form_item">
                            <label>Vehicle Type</label>
                            <div className="ofcvs_form_field w-50">
                                <select id className="form-select">
                                    <option value>Select Type</option>
                                    <option value>Car</option>
                                    <option value>Bike</option>
                                </select>
                            </div>
                        </div>
                        <div className="ofcvs_form_item">
                            <label>Rate</label>
                            <div className="ofcvs_form_field miles_input">
                                <input type="text" className="form-control" placeholder="Rate" defaultValue />
                                <span className="miles_title">$/mile</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >


            {/* Edit custom rates  */}
            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1
            } id="editCustomRates" aria-labelledby="editCustomRatesLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Edit Custom Rate</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn">Save</button>
                            <button className="delete_btn"><img src="assets/images/trash-icon.svg" alt="Trash" /></button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper outline_form_wrapper">
                        <div className="ofcvs_form_item">
                            <label>Vehicle Type</label>
                            <div className="ofcvs_form_field w-50">
                                <select id className="form-select">
                                    <option value>Select Type</option>
                                    <option value selected>Car</option>
                                    <option value>Bike</option>
                                </select>
                            </div>
                        </div>
                        <div className="ofcvs_form_item">
                            <label>Rate</label>
                            <div className="ofcvs_form_field miles_input">
                                <input type="text" className="form-control" placeholder="Rate" defaultValue={34} />
                                <span className="miles_title">$/mile</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

export default Profile