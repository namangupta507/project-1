import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetPlansApi } from '../redux/actions/subscription/GetPlansAction';
import { PulseLoader } from 'react-spinners';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { UpgradePlanAPI } from '../redux/actions/subscription/UpgradePlanAction';
import { upgradePlanStateReset } from '../redux/slices/subscriptions/UpgradePlanSlice';
import { AuthContext } from '../context/AuthContext';

const Subscriptions = () => {
    const dispatch = useDispatch();
    const { fetchSubscriptionPlans } = useContext(AuthContext);
    const { response, loading, error } = useSelector((state) => state.subscriptionPlans);
    const [loadingPriceId, setLoadingPriceId] = React.useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { response: upgardePlanResponse, loading: upgradePlanLoading, error: upgradePlanError } = useSelector((state) => state.upgradePlan);

    const handleUpgradation = async (priceId) => {
        setLoadingPriceId(priceId); // Only show loader for the clicked card

        try {
            await dispatch(UpgradePlanAPI({ priceId }));
        } catch (error) {
            showErrorToast(error);
        } finally {
            setLoadingPriceId(null); // Reset after request
        }
    };

    useEffect(() => {
        if (upgardePlanResponse) {
            // showSuccessToast('Plan upgraded Successful')
            dispatch(upgradePlanStateReset());
            fetchSubscriptionPlans();
            if (upgardePlanResponse?.url) {
                setIsRedirecting(true); // show loader
                setTimeout(() => {
                    window.location.href = upgardePlanResponse?.url;
                }, 100);
            }
        }
    }, upgardePlanResponse)

    useEffect(() => {
        if (upgradePlanError) {
            showErrorToast(upgradePlanError?.data);
            dispatch(upgradePlanStateReset());
        }
    }, [upgradePlanError])

    console.log(response, "response")


    return (
        <>
            {isRedirecting ?

                <div style={{ height: '100vh' }} className="d-flex align-items-center justify-content-center">
                    <PulseLoader color="#49a496" size={18} />
                </div>
                :

                loading
                    ? (
                        // Show loading spinner while data is being fetched
                        <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center' >
                            <PulseLoader size={25} color="#49a496" />
                        </div >
                    ) : error ? (
                        // Display error message if there is an issue fetching data
                        <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center'>
                            <p className='text-danger'>Something went wrong</p>
                        </div>
                    ) :
                        <section className="main-section spacer-y">
                            <div className="container">
                                <div className="row gy-4">
                                    <div className="col-xl-12">
                                        <div className="common_main_heading_wrapper">
                                            <h1>Your Subscription</h1>
                                        </div>
                                        <div className="common-card">
                                            <iframe style={{ width: "100%", minHeight: "100vh", scrollbarWidth: "0px" }}
                                                src={response?.data?.url}
                                            />
                                            {/* <div className="subscription_wrapper">
                                                <div className="subscription_card">
                                                    <div className="subscription_info">
                                                        <div className="subscription_plan_detail">
                                                            <h3>Free Subscription</h3>
                                                            <p className="subscription_amount"><sup>$</sup>0</p>
                                                        </div>
                                                        <div className="subscription_plan_feature">
                                                            <ul className="list-unstyled mb-0">
                                                                <li>Manual Mileage Tracker</li>
                                                                <li>Expense Management</li>
                                                                <li>40 Free Trips</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex justify-content-center gap-3 mt-4 mt-md-4">
                                                        <button className="fade-btn">Current Plan</button>
                                                    </div>
                                                </div>
                                                {response?.data?.data?.length > 0 && response?.data?.data?.map((r, index) => {
                                                    return (
                                                        <div className="subscription_card" key={index}>
                                                            <div className="subscription_info">
                                                                <div className="subscription_plan_detail">
                                                                    <h3>{r?.recurring ? r?.recurring?.interval === 'month' ? 'Mothly Subscription' : 'Yearly Subscription' : ''}</h3>
                                                                    <p className="subscription_amount"><sup>$</sup>{r?.unit_amount || 0}<sub>{r?.recurring ? r?.recurring?.interval === 'month' ? '/month' : '/year' : ''}</sub></p>
                                                                </div>
                                                                <div className="subscription_plan_feature">
                                                                    <ul className="list-unstyled mb-0">
                                                                        <li>Automated Mileage Tracker</li>
                                                                        <li>Unlimited Trips</li>
                                                                        <li>Expense Management</li>
                                                                        <li>Unlimited vehicles</li>
                                                                        <li>Unlimited Reports</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex justify-content-center gap-3 mt-4 mt-md-4">
                                                                <button className="primary-btn" type='button' onClick={() => handleUpgradation(r?.price_id)}> {loadingPriceId === r?.price_id ? (
                                                                    <PulseLoader color="#ffffff" size={14} />
                                                                ) : (
                                                                    'Upgrade Now'
                                                                )}</button>
                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
            }
        </>
    )
}

export default Subscriptions