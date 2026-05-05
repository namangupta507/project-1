import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { GetReadingsApi } from '../redux/actions/odometer-reading/GetReadingAction';
import { formatDateTime } from '../helpers/dateTime';
import { PulseLoader } from 'react-spinners';

const OdometerReading = () => {
    const [vehicle, setVehicle] = useState('');
    const dispatch = useDispatch();
    const location = useLocation();
    const { response, loading, error } = useSelector((state) => state.getReading)
    const { response: getVeiclesResponse, loading: getVehiclesLoading, error: getVehiclesError } = useSelector((state) => state.getVehicles);
    const INITIAL_VISIBLE_COUNT = 3;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const totalReadings = response?.data?.length || 0;
    const readingsToShow = response?.data?.slice(0, visibleCount);

    const showMoreHandler = () => {
        setVisibleCount((prevCount) => Math.min(prevCount + 5, totalReadings));
    };

    const showLessHandler = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };


    useEffect(() => {
        if (getVeiclesResponse?.data.length > 0 && !vehicle) {
            // Automatically set the first vehicle (or any logic you want)
            setVehicle(getVeiclesResponse.data[0]._id); // assuming each vehicle has an `id` field
        }
    }, [getVeiclesResponse, vehicle]);

    useEffect(() => {
        if (vehicle) {
            dispatch(GetReadingsApi({ vehicleId: vehicle }))
        }
    }, [vehicle])

    useEffect(() => {
        if (location?.state?.selectedVehicle) {
            setVehicle(location?.state?.selectedVehicle);
        }
    }, [location])

    return (
        <div className="content-wrapper">
            <section className="main-section spacer-y">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-xl-12">
                            <div className="common_main_heading_wrapper">
                                <h1>Odometer Reading</h1>
                                {/* <div className="d-flex flex-end gap-3">
                                    <Link to='/dashboard/add-odometer-reading' className="primary-btn">+Add Odometer</Link>
                                </div> */}
                            </div>
                            <div className="common-card">
                                <div className="min-height_blk">
                                    <div className="space_card">
                                        <div className="select_vehicle_blk">
                                            <label htmlFor="selectVehicle">Select Vehicle</label>
                                            <div className="input-field">
                                                <select className="form-select"
                                                    value={vehicle}
                                                    onChange={(e) => setVehicle(e.target.value)}
                                                >
                                                    {getVehiclesLoading ? (
                                                        <option disabled>Loading...</option>
                                                    ) : getVehiclesError ? (
                                                        <option disabled>Error loading vehicles</option>
                                                    ) : getVeiclesResponse?.data?.length === 0 ? (
                                                        <option value="">Select Vehicle</option>
                                                    ) : (
                                                        <>
                                                            {getVeiclesResponse?.data.map((vehicle) => (

                                                                <option key={vehicle._id} value={vehicle._id}>
                                                                    {vehicle.name || ''}
                                                                </option>
                                                            ))}
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="reading_available_blk">
                                            <h2>Readings</h2>
                                            {
                                                loading
                                                    ? (
                                                        // Show loading spinner while data is being fetched
                                                        <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                            <PulseLoader size={25} color="#49a496" />
                                                        </div >
                                                    ) : error ? (
                                                        // Display error message if there is an issue fetching data
                                                        <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                            <p className='text-danger'>Something went wrong</p>
                                                        </div>
                                                    ) :
                                                        <>
                                                            {readingsToShow?.length > 0 ? readingsToShow?.map((r, index) => {
                                                                return (
                                                                    <Link
                                                                        to={`/dashboard/update-delete-odometer-reading/${r._id}`}
                                                                        state={{ data: r }} className="reading_available_info mt-3" key={index}>
                                                                        <span>{r?.reading ? r.reading?.toFixed(2) : 0} Miles</span>
                                                                        <p>Last Updated At-{r?.updatedAt ? formatDateTime(r?.updatedAt) : ''}, {r?.vehicle?.name || ''}</p>
                                                                    </Link>

                                                                )
                                                            }) :
                                                                <p className="no_reading_available_title">No Readings Available</p>
                                                            }
                                                            <div className="d-flex justify-content-end gap-3 mt-4 mt-md-4">
                                                                {visibleCount < totalReadings ? (
                                                                    <button className="primary-text-btn" type="button" onClick={showMoreHandler}>
                                                                        Show More
                                                                    </button>
                                                                ) : (
                                                                    totalReadings > INITIAL_VISIBLE_COUNT && (
                                                                        <button className="primary-text-btn" type="button" onClick={showLessHandler}>
                                                                            Show Less
                                                                        </button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </>}

                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >


    )
}

export default OdometerReading