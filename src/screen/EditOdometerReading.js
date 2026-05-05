import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { PulseLoader } from 'react-spinners';
import { UpdateReadingAPI } from '../redux/actions/odometer-reading/UpdateReadingAction';
import { useDispatch, useSelector } from 'react-redux';
import { updateReadingStateReset } from '../redux/slices/odometer-readings/UpdateReadingSlice';
import dayjs from 'dayjs';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { DeleteReadingAPI } from '../redux/actions/odometer-reading/DeleteReadingAction';
import { deleteReadingStateReset } from '../redux/slices/odometer-readings/DeleteReadingSlice';
import Swal from 'sweetalert2';

const EditOdometerReading = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const dataFromServer = location?.state?.data;
    console.log(dataFromServer, "dataFromServer")
    const { response: updateReadingResponse, loading: updateReadingLoading, error: updateReadingError } = useSelector((state) => state.updateReading)
    const { response: deleteReadingResponse, loading: deleteReadingLoading, error: deleteReadingError } = useSelector((state) => state.deleteReading)
    const { response: getVeiclesResponse, loading: getVehiclesLoading, error: getVehiclesError } = useSelector((state) => state.getVehicles);

    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const [input5, setInput5] = useState('');
    const [input6, setInput6] = useState('');
    const [input7, setInput7] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [validationErrors, setValidationErrors] = useState('');

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    const input5Ref = useRef(null);
    const input6Ref = useRef(null);
    const input7Ref = useRef(null);

    const validateForm = () => {
        const newErrors = {};

        if (!vehicle) {
            newErrors.vehicle = 'Vehicle is required';
        }
        // if (!dateTime) {
        //     newErrors.dateTime = 'Date time is required';
        // }
        if (
            !input1 || !input2 || !input3 ||
            !input4 || !input5 || !input6 || !input7
        ) {
            newErrors.inputs = 'All reading fields are required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    console.log(id, "id")

    const handleSubmit = async () => {
        if (!validateForm()) return;
        const reading = `${input1}${input2}${input3}${input4}${input5}${input6}${input7}`;
        const formattedDate = new Date(dateTime);
        try {
            // await dispatch(UpdateReadingAPI({ vehicleId: vehicle, reading: Number(reading), dateTime: formattedDate.toISOString() }, id))
            await dispatch(UpdateReadingAPI({ vehicleId: vehicle, reading: Number(reading) }, id))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleDeleteReading = useCallback(async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this odometer-reading?`,
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
                    await dispatch(DeleteReadingAPI({ id }))

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }, [dispatch]);

    useEffect(() => {
        if (dataFromServer) {
            setVehicle(dataFromServer?.vehicleId);
            const formattedDate = dayjs(dataFromServer?.dateTime).format('YYYY-MM-DDTHH:mm');
            setDateTime(formattedDate);

            // Set each digit of the reading (assuming reading is a 7-digit number)
            const readingInt = Math.floor(dataFromServer?.reading || 0); // remove decimals
            const readingStr = readingInt.toString().padStart(7, '0');
            setInput1(readingStr[0]);
            setInput2(readingStr[1]);
            setInput3(readingStr[2]);
            setInput4(readingStr[3]);
            setInput5(readingStr[4]);
            setInput6(readingStr[5]);
            setInput7(readingStr[6]);
        }
    }, [dataFromServer])

    useEffect(() => {
        if (updateReadingResponse) {
            const selectedVehicle = vehicle;
            showSuccessToast(updateReadingResponse?.message);
            setValidationErrors('');
            setDateTime('');
            setVehicle('');
            setInput1('')
            setInput2('')
            setInput3('')
            setInput4('')
            setInput5('')
            setInput6('')
            setInput7('')
            dispatch(updateReadingStateReset());
            navigate('/dashboard/odometer-reading', { state: { selectedVehicle: selectedVehicle } })
        }
    }, [updateReadingResponse])

    useEffect(() => {
        if (updateReadingError) {
            showErrorToast(updateReadingError?.data);
            dispatch(updateReadingStateReset());
        }
    }, [updateReadingError])

    useEffect(() => {
        if (deleteReadingResponse) {
            const selectedVehicle = vehicle;
            showSuccessToast(deleteReadingResponse?.message);
            dispatch(deleteReadingStateReset());
            navigate('/dashboard/odometer-reading', { state: { selectedVehicle: selectedVehicle } })
        }
    }, [deleteReadingResponse])

    useEffect(() => {
        if (deleteReadingError) {
            showErrorToast(deleteReadingError?.data);
            dispatch(deleteReadingStateReset());
        }
    }, [deleteReadingError])
    return (
        <>
            {
                dataFromServer && id ?
                    <section className="main-section spacer-y">
                        <div className="container">
                            <div className="row gy-4">
                                <div className="col-xl-12">
                                    <div className="common_main_heading_wrapper">
                                        <h1>Update-Delete Odometer Reading</h1>
                                    </div>
                                    <div className="common-card">
                                        <div className="min-height_blk">
                                            <div className="space_card">
                                                <h2 className="fs-14 fw-medium text-center my-4">Please fill the details below to continue </h2>
                                                {/* <div className="select_vehicle_blk select_date_time_blk mb-4">
                                                    <label htmlFor="dateTime">Date</label>
                                                    <div className="input-field">
                                                        <input type="datetime-local" className="form-control" id="dateTime" value={dateTime} onChange={(e) => {
                                                            setDateTime(e.target.value);
                                                            if (validationErrors.dateTime) {
                                                                setValidationErrors(prev => ({ ...prev, dateTime: false }));
                                                            }
                                                        }} />
                                                    </div>
                                                    {validationErrors.dateTime &&
                                                        (
                                                            <span className={`error ${validationErrors.dateTime ? '' : 'd-none'}`}>{validationErrors.dateTime}</span>
                                                        )
                                                    }
                                                </div> */}
                                                <div className="select_vehicle_blk">
                                                    <label htmlFor="selectVehicle">Select Vehicle</label>
                                                    <div className="input-field">
                                                        <select className="form-select" onChange={(e) => {
                                                            setVehicle(e.target.value);
                                                            if (validationErrors.vehicle) {
                                                                setValidationErrors(prev => ({ ...prev, vehicle: false }));
                                                            }
                                                        }} value={vehicle}>
                                                            {getVehiclesLoading ? (
                                                                <option disabled>Loading...</option>
                                                            ) : getVehiclesError ? (
                                                                <option disabled>Error loading vehicles</option>
                                                            ) : getVeiclesResponse?.data?.length === 0 ? (
                                                                <option value="">Vehicle</option>
                                                            ) : (
                                                                <>
                                                                    <option value="">Select Vehicle</option>
                                                                    {getVeiclesResponse?.data.map((vehicle) => (
                                                                        <option key={vehicle._id} value={vehicle._id}>
                                                                            {vehicle.name || ''}
                                                                        </option>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </select>
                                                    </div>
                                                    {validationErrors.vehicle &&
                                                        (
                                                            <span className={`error ${validationErrors.vehicle ? '' : 'd-none'}`}>{validationErrors.vehicle}</span>
                                                        )
                                                    }
                                                </div>
                                                {validationErrors.vehicle &&
                                                    (
                                                        <span className={`error ${validationErrors.vehicle ? '' : 'd-none'}`}>{validationErrors.vehicle}</span>
                                                    )
                                                }
                                                <div className="reading_input_blk hstack justify-content-between gap-3 mt-4 mt-md-5">
                                                    <input type="text"
                                                        inputMode="numeric" className="form-control" ref={input1Ref} id="reading_1" pattern="[0-9]*" min={0} maxLength={1} value={input1} onKeyDown={(e) => {
                                                            // Prevent minus, letters, symbols, spaces
                                                            if (
                                                                e.key === ' ' ||
                                                                e.key === '-' ||
                                                                e.key === 'e' ||
                                                                e.key === 'E' ||
                                                                e.key === '+' ||
                                                                e.key === '.' ||
                                                                isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight'
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }} onPaste={(e) => {
                                                            const paste = e.clipboardData.getData('text');
                                                            if (!/^\d$/.test(paste)) {
                                                                e.preventDefault();
                                                            }
                                                        }} onChange={(e) => {
                                                            setInput1(e.target.value);
                                                            if (e.target.value.length === 1) {
                                                                input2Ref.current?.focus();
                                                            }
                                                            if (validationErrors.inputs) {
                                                                setValidationErrors(prev => ({ ...prev, inputs: false }));
                                                            }
                                                        }} />
                                                    <input type="text"
                                                        inputMode="numeric" className="form-control" ref={input2Ref} id="reading_2" pattern="[0-9]*" min={0} maxLength={1} value={input2} onKeyDown={(e) => {
                                                            // Prevent minus, letters, symbols, spaces
                                                            if (
                                                                e.key === ' ' ||
                                                                e.key === '-' ||
                                                                e.key === 'e' ||
                                                                e.key === 'E' ||
                                                                e.key === '+' ||
                                                                e.key === '.' ||
                                                                isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight'
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }} onPaste={(e) => {
                                                            const paste = e.clipboardData.getData('text');
                                                            if (!/^\d$/.test(paste)) {
                                                                e.preventDefault();
                                                            }
                                                        }} onChange={(e) => {
                                                            setInput2(e.target.value);
                                                            if (e.target.value.length === 1) {
                                                                input3Ref.current?.focus();
                                                            }
                                                            if (validationErrors.inputs) {
                                                                setValidationErrors(prev => ({ ...prev, inputs: false }));
                                                            }
                                                        }} />
                                                    <input type="text"
                                                        inputMode="numeric" className="form-control" ref={input3Ref} id="reading_3" pattern="[0-9]*" min={0} maxLength={1} value={input3} onKeyDown={(e) => {
                                                            // Prevent minus, letters, symbols, spaces
                                                            if (
                                                                e.key === ' ' ||
                                                                e.key === '-' ||
                                                                e.key === 'e' ||
                                                                e.key === 'E' ||
                                                                e.key === '+' ||
                                                                e.key === '.' ||
                                                                isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight'
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }} onPaste={(e) => {
                                                            const paste = e.clipboardData.getData('text');
                                                            if (!/^\d$/.test(paste)) {
                                                                e.preventDefault();
                                                            }
                                                        }} onChange={(e) => {
                                                            setInput3(e.target.value);
                                                            if (e.target.value.length === 1) {
                                                                input4Ref.current?.focus();
                                                            }
                                                            if (validationErrors.inputs) {
                                                                setValidationErrors(prev => ({ ...prev, inputs: false }));
                                                            }
                                                        }} />
                                                    <input type="text"
                                                        inputMode="numeric" className="form-control" ref={input4Ref}
                                                        id="reading_4" pattern="[0-9]*" min={0} maxLength={1} value={input4} onKeyDown={(e) => {
                                                            // Prevent minus, letters, symbols, spaces
                                                            if (
                                                                e.key === ' ' ||
                                                                e.key === '-' ||
                                                                e.key === 'e' ||
                                                                e.key === 'E' ||
                                                                e.key === '+' ||
                                                                e.key === '.' ||
                                                                isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight'
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }} onPaste={(e) => {
                                                            const paste = e.clipboardData.getData('text');
                                                            if (!/^\d$/.test(paste)) {
                                                                e.preventDefault();
                                                            }
                                                        }} onChange={(e) => {
                                                            setInput4(e.target.value);
                                                            if (e.target.value.length === 1) {
                                                                input5Ref.current?.focus();
                                                            }
                                                            if (validationErrors.inputs) {
                                                                setValidationErrors(prev => ({ ...prev, inputs: false }));
                                                            }
                                                        }} />
                                                    <input type="text"
                                                        inputMode="numeric" className="form-control" ref={input5Ref} id="reading_5" pattern="[0-9]*" min={0} maxLength={1} value={input5} onKeyDown={(e) => {
                                                            // Prevent minus, letters, symbols, spaces
                                                            if (
                                                                e.key === ' ' ||
                                                                e.key === '-' ||
                                                                e.key === 'e' ||
                                                                e.key === 'E' ||
                                                                e.key === '+' ||
                                                                e.key === '.' ||
                                                                isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight'
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }} onPaste={(e) => {
                                                            const paste = e.clipboardData.getData('text');
                                                            if (!/^\d$/.test(paste)) {
                                                                e.preventDefault();
                                                            }
                                                        }} onChange={(e) => {
                                                            setInput5(e.target.value);
                                                            if (e.target.value.length === 1) {
                                                                input6Ref.current?.focus();
                                                            }
                                                            if (validationErrors.inputs) {
                                                                setValidationErrors(prev => ({ ...prev, inputs: false }));
                                                            }
                                                        }} />
                                                    <input type="text"
                                                        inputMode="numeric" className="form-control" ref={input6Ref} id="reading_6" pattern="[0-9]*" min={0} maxLength={1} value={input6} onKeyDown={(e) => {
                                                            // Prevent minus, letters, symbols, spaces
                                                            if (
                                                                e.key === ' ' ||
                                                                e.key === '-' ||
                                                                e.key === 'e' ||
                                                                e.key === 'E' ||
                                                                e.key === '+' ||
                                                                e.key === '.' ||
                                                                isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight'
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }} onPaste={(e) => {
                                                            const paste = e.clipboardData.getData('text');
                                                            if (!/^\d$/.test(paste)) {
                                                                e.preventDefault();
                                                            }
                                                        }} onChange={(e) => {
                                                            setInput6(e.target.value);
                                                            if (e.target.value.length === 1) {
                                                                input7Ref.current?.focus();
                                                            }
                                                            if (validationErrors.inputs) {
                                                                setValidationErrors(prev => ({ ...prev, inputs: false }));
                                                            }
                                                        }} />
                                                    <input type="text"
                                                        inputMode="numeric" className="form-control" ref={input7Ref} id="reading_7" pattern="[0-9]*" min={0} maxLength={1} value={input7} onKeyDown={(e) => {
                                                            // Prevent minus, letters, symbols, spaces
                                                            if (
                                                                e.key === ' ' ||
                                                                e.key === '-' ||
                                                                e.key === 'e' ||
                                                                e.key === 'E' ||
                                                                e.key === '+' ||
                                                                e.key === '.' ||
                                                                isNaN(Number(e.key)) && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight'
                                                            ) {
                                                                e.preventDefault();
                                                            }
                                                        }} onPaste={(e) => {
                                                            const paste = e.clipboardData.getData('text');
                                                            if (!/^\d$/.test(paste)) {
                                                                e.preventDefault();
                                                            }
                                                        }} onChange={(e) => {
                                                            setInput7(e.target.value);
                                                            if (validationErrors.inputs) {
                                                                setValidationErrors(prev => ({ ...prev, inputs: false }));
                                                            }
                                                        }} />
                                                </div>
                                                {validationErrors.inputs &&
                                                    (
                                                        <span className={`error ${validationErrors.inputs ? '' : 'd-none'}`}>{validationErrors.inputs}</span>
                                                    )
                                                }
                                                <div className="d-flex justify-content-center gap-3 mt-4 mt-md-5">
                                                    {/* <button className="primary-btn" type='button' onClick={handleDeleteReading}>{deleteReadingLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Delete Reading'}</button> */}
                                                    <button className="outline-btn" type='button' onClick={handleSubmit}>{updateReadingLoading ? <PulseLoader color='#000000' size={14} /> : 'Update'}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    :
                    <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center' >
                        <PulseLoader size={25} color="#49a496" />
                    </div>
            }
        </>


    )
}

export default EditOdometerReading