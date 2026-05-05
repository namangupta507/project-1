import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AddReadingAPI } from '../redux/actions/odometer-reading/AddReadingAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { addReadingStateReset } from '../redux/slices/odometer-readings/AddReadingSlice';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const AddOdometerReading = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { response: addReadingResponse, loading: addReadingLoading, error: addReadingError } = useSelector((state) => state.addReading)
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

    const handleSubmit = async () => {
        if (!validateForm()) return;
        const reading = `${input1}${input2}${input3}${input4}${input5}${input6}${input7}`;
        const formattedDate = new Date(dateTime);
        try {
            // await dispatch(AddReadingAPI({ vehicleId: vehicle, reading: Number(reading), dateTime: formattedDate.toISOString() }))
            await dispatch(AddReadingAPI({ vehicleId: vehicle, reading: Number(reading) }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    console.log(addReadingResponse, "addReadingResponse")

    useEffect(() => {
        if (addReadingResponse) {
            showSuccessToast(addReadingResponse?.message);
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
            dispatch(addReadingStateReset());
            navigate('/dashboard/odometer-reading')
        }
    }, [addReadingResponse])

    useEffect(() => {
        if (addReadingError) {
            showErrorToast(addReadingError?.data);
            dispatch(addReadingStateReset());
        }
    }, [addReadingError])
    return (

        <div className="content-wrapper">
            <section className="main-section spacer-y">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-xl-12">
                            <div className="common_main_heading_wrapper">
                                <h1>Add Odometer Reading</h1>
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
                                                inputMode="numeric" className="form-control" ref={input4Ref} id="reading_4" pattern="[0-9]*" min={0} maxLength={1} value={input4} onKeyDown={(e) => {
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
                                            <button className="primary-btn" onClick={handleSubmit}>{addReadingLoading ? <ClipLoader size={24} color='#ffffff' /> : 'Submit'}</button>
                                            <button className="outline-btn" onClick={
                                                () => {
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
                                                }
                                            }>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section ></div >


    )
}

export default AddOdometerReading