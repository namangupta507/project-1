import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateLoginAPI } from '../redux/actions/auth/UpdateLoginAction';
import { updateLoginStateReset } from '../redux/slices/auth/UpdateLoginSlice';
import Swal from 'sweetalert2';

const WelcomeBanners = () => {

    const navigate = useNavigate(); // Initialize navigate hook to programmatically navigate to different routes
    const { fetchProfile, firstLogin } = useContext(AuthContext);
    const dispatch = useDispatch();
    const { response, loading, error } = useSelector((state) => state.updateLogin);

    const finishWelcome = () => {
        dispatch(UpdateLoginAPI({ firstLogin: false }));
    };

    useEffect(() => {
        if (response) {
            dispatch(updateLoginStateReset());
            fetchProfile();
            navigate('/dashboard')
        }
    }, [response])

    useEffect(() => {
        if (loading) {
            Swal.fire({
                title: 'Loading...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
        } else {
            Swal.close(); // Close loading when loading is false

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            } else {
                Swal.close();
            }
        }
    }, [loading, error]);

    useEffect(() => {
        // Event listener for the "Next" button on the first screen
        const btn1Next = document.getElementById("ts_btn_1_next");
        btn1Next?.addEventListener("click", () => {
            // Transition to the second screen (slide out screen 1 and slide in screen 2)
            document.querySelectorAll(".ts_screen_1").forEach(el => {
                el.style.left = "-100%";
                el.style.opacity = "0";
                el.style.transition = "all 0.5s ease-in-out";
            });
            document.querySelectorAll(".ts_screen_2").forEach(el => {
                el.style.left = "0";
                el.style.opacity = "1";
                el.style.transition = "all 0.5s ease-in-out";
            });
        });

        // Event listener for the "Back" button on the second screen
        const btn2Back = document.getElementById("ts_btn_2_back");
        btn2Back?.addEventListener("click", () => {
            document.querySelectorAll(".ts_screen_1").forEach(el => {
                el.style.left = "0%";
                el.style.opacity = "1";
                el.style.transition = "all 0.5s ease-in-out";
            });
            document.querySelectorAll(".ts_screen_2").forEach(el => {
                el.style.left = "100%";
                el.style.opacity = "0";
                el.style.transition = "all 0.5s ease-in-out";
            });
        });

        // Event listener for the "Next" button on the second screen
        const btn2Next = document.getElementById("ts_btn_2_next");
        btn2Next?.addEventListener("click", () => {
            document.querySelectorAll(".ts_screen_2").forEach(el => {
                el.style.left = "-100%";
                el.style.opacity = "0";
                el.style.transition = "all 0.5s ease-in-out";
            });
            document.querySelectorAll(".ts_screen_3").forEach(el => {
                el.style.left = "0%";
                el.style.opacity = "1";
                el.style.transition = "all 0.5s ease-in-out";
            });
        });
        // Event listener for the "Back" button on the third screen
        const btn3Back = document.getElementById("ts_btn_3_back");
        btn3Back?.addEventListener("click", () => {
            document.querySelectorAll(".ts_screen_2").forEach(el => {
                el.style.left = "0%";
                el.style.opacity = "1";
                el.style.transition = "all 0.5s ease-in-out";
            });
            document.querySelectorAll(".ts_screen_3").forEach(el => {
                el.style.left = "100%";
                el.style.opacity = "0";
                el.style.transition = "all 0.5s ease-in-out";
            });
        });

        // Event listener for the "Next" button on the third screen
        const btn3Next = document.getElementById("ts_btn_3_next");
        btn3Next?.addEventListener("click", () => {
            // navigate('/dashboard');
        });

        // Event listener for the "Skip" button (to skip the tutorial and go to the dashboard)
        const skipLinks = document.querySelectorAll('.ts_btn.skip');
        skipLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                // navigate('/dashboard');
            });
        });
    }, []);// Empty dependency array to ensure this effect runs only once on mount

    return (
        <div className="tutorial_main_wrapper">
            {/* First screen of the tutorial */}
            <div className="ts_screen_1">
                <div className="ts_header">
                    {/* Skip button to skip the tutorial */}
                    <div className="hstack justify-content-end gap-3">
                        <Link to='/dashboard' className="ts_btn skip" onClick={() => finishWelcome()}>Skip</Link>
                    </div>
                    <h1>Welcome To Savmor Mileage and Tax Tracker</h1>
                </div>
                <div className="ts_content">
                    <h2>Generate,send and download reports</h2>
                    <p>Send and download custom reports with single tap.</p>
                </div>
                <div className="ts_img_block">
                    <img src="assets/images/ts-img-1.png" alt="TS" />
                </div>
                <div className="tutorial_action_block">
                    <button className="ts_btn" id="ts_btn_1_next">Next</button>
                </div>
            </div>
            {/* Second screen of the tutorial */}
            <div className="ts_screen_2">
                <div className="ts_header">
                    <div className="hstack justify-content-end gap-3">
                        <Link to='/dashboard' className="ts_btn skip" onClick={() => finishWelcome()}>Skip</Link>
                    </div>
                    <h2>Welcome To Savmor Mileage and Tax Tracker</h2>
                </div>
                <div className="ts_content">
                    <h2>Track What you spend and go</h2>
                    <p>Keep close tabs on expenses to ensure a smooth transactional exchange</p>
                </div>
                <div className="ts_img_block">
                    <img src="/assets/images/ts-img-2.png" alt="TS" />
                </div>
                <div className="tutorial_action_block">
                    <button className="ts_btn" id="ts_btn_2_back">Back</button>
                    <button className="ts_btn" id="ts_btn_2_next">Next</button>
                </div>
            </div>
            {/* Third screen of the tutorial */}
            <div className="ts_screen_3">
                <div className="ts_header">
                    <div className="hstack justify-content-end gap-3">
                        <Link to='/dashboard' className="ts_btn skip" onClick={() => finishWelcome()}>Skip</Link>
                    </div>
                    <h2>Welcome To Savmor Mileage and Tax Tracker</h2>
                </div>
                <div className="ts_content">
                    <h2>One Swipe to categorize your trips</h2>
                    <p>Effortlessly manage your trips for business or personal with a swipe</p>
                </div>
                <div className="ts_img_block">
                    <img src="/assets/images/ts-img-3.png" alt="TS" />
                </div>
                <div className="tutorial_action_block">
                    {/* Back button to go to the previous screen */}
                    <button className="ts_btn" id="ts_btn_3_back">Back</button>
                    {/* Finish button to complete the tutorial and navigate to the dashboard */}
                    <button className="ts_btn" id="ts_btn_3_next" onClick={() => finishWelcome()}>Finish</button>
                </div>
            </div>
        </div>

    )
}

export default WelcomeBanners