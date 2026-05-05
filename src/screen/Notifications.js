import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateProfileAPI } from '../redux/actions/auth/UpdateProfileAction';
import { updateProfileStateReset } from '../redux/slices/auth/UpdateProfileSlice';
import { showErrorToast } from '../helpers/toast';
import { UpdateNotificationPreferenceAPI } from '../redux/actions/auth/UpdateNotificationAction';
import { updateNotificationStateReset } from '../redux/slices/auth/UpdateNotificationSlice';

const Notifications = () => {
    const dispatch = useDispatch();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isOneSignalReady, setIsOneSignalReady] = useState(false);
    const { response, error, loading } = useSelector((state) => state.updateProfile);

    useEffect(() => {
        const OneSignal = window.OneSignal || [];

        // Wait for OneSignal to be initialized
        OneSignal.push(() => {
            console.log('OneSignal after push:', window.OneSignal);
            setIsOneSignalReady(true);

            // Get current subscription status
            OneSignal.isPushNotificationsEnabled((enabled) => {
                setIsSubscribed(enabled);
            });
        });
    }, []);

    useEffect(() => {
        console.log(isSubscribed, "isSubscribed")
        dispatch(UpdateNotificationPreferenceAPI({ allowNotification: isSubscribed }))
    }, [isOneSignalReady, isSubscribed])

    useEffect(() => {
        if (response) {
            dispatch(updateNotificationStateReset());
        }
    }, [response])

    useEffect(() => {
        if (error) {
            showErrorToast(error)
        }
    }, [error])

    const handleToggle = (e) => {
        const OneSignal = window.OneSignal || [];
        if (!isOneSignalReady) return;

        const checked = e.target.checked;
        setIsSubscribed(checked);

        if (checked) {
            // Subscribe user to notifications
            OneSignal.push(() => {
                OneSignal.registerForPushNotifications()
                    .then(() => {
                        console.log('User subscribed to notifications');
                        dispatch(UpdateNotificationPreferenceAPI({ allowNotification: checked }));
                    }
                    )
                    .catch((err) => console.error('Subscription error:', err));
            });
        } else {
            // Unsubscribe user from notifications
            OneSignal.push(() => {
                OneSignal.setSubscription(false);
                dispatch(UpdateNotificationPreferenceAPI({ allowNotification: checked }));
                console.log('User unsubscribed from notifications');
            });
        }
    };
    return (
        <section className="main-section spacer-y">
            <div className="container">
                <div className="row gy-4">
                    <div className="col-xl-12">
                        <div className="common_main_heading_wrapper">
                            <h1>Notification</h1>
                        </div>
                        <div className="common-card">
                            <div className="min-height_blk">
                                <div className="space_card">
                                    <div className="notification_blk">
                                        <div className="notification_item hstack justify-content-between align-items-start gap-3">
                                            <div className="notification_item_content">
                                                <p className="mb-0">Allow notification</p>
                                            </div>
                                            <div className="common_toggle_box">
                                                <input
                                                    type="checkbox"
                                                    className="d-none"
                                                    id="allowNotification"
                                                    checked={isSubscribed}
                                                    onChange={handleToggle}
                                                />
                                                <label htmlFor="allowNotification" />
                                            </div>
                                        </div>
                                        <h2>Reminders</h2>
                                        <div className="notification_item hstack justify-content-between align-items-start gap-3">
                                            <div className="notification_item_content">
                                                <h3>Trip Inbox Reminder</h3>
                                                <p className="mb-0">At the end of the period chosen below, we’ll check if you have unreviewed trips and remind you.</p>
                                            </div>
                                            <div className="common_toggle_box">
                                                <input type="checkbox" className="d-none" id="tirToggle" />
                                                <label htmlFor="tirToggle" />
                                            </div>
                                        </div>
                                        <div className="notification_item hstack justify-content-between align-items-start gap-3">
                                            <div className="notification_item_content">
                                                <h3>Reporting Reminder</h3>
                                                <p className="mb-0">At the end of the period chosen below, we’ll remind you to generate a report.</p>
                                            </div>
                                            <div className="common_toggle_box">
                                                <input type="checkbox" className="d-none" id="rrToggle" />
                                                <label htmlFor="rrToggle" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="d-flex justify-content-center gap-3 mt-4 mt-md-5">
                                        <button className="primary-btn">Update</button>
                                        <button className="outline-btn">Cancel</button>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Notifications