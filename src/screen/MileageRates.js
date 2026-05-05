import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AddRateAPI } from '../redux/actions/mileage-rates/AddRateAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { addRateStateReset } from '../redux/slices/mileage-rates/AddRateSlice';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { GetCustomRatesApi } from '../redux/actions/mileage-rates/GetCustomRatesAction';
import { UpdateRateAPI } from '../redux/actions/mileage-rates/UpdateRateAction';
import { updateRateStateReset } from '../redux/slices/mileage-rates/UpdateRateSlice';

const MileageRates = () => {
    const dispatch = useDispatch();
    const { response, loading, error } = useSelector((state) => state.addRate);
    const { response: getCustomRatesResponse, loading: getCustomRatesLoading, error: getCustomRatesError } = useSelector((state) => state.customRates);
    const { response: updateRateResponse, loading: updateRateLoading, error: updateRateError } = useSelector((state) => state.updateRate);
    const [selectedRate, setSelectedRate] = useState('standard');
    const [rate, setRate] = useState('');
    const [type, setType] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [selectedCustomRate, setSelectedCustomRate] = useState('');
    const [selectedCustomRateData, setSelectedCustomRateData] = useState(null);
    const [typeEdit, setTypeEdit] = useState('');
    const [rateEdit, setRateEdit] = useState('');
    const [rateId, setRateId] = useState('');
    const INITIAL_VISIBLE_COUNT = 3;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const totalCustomRates = getCustomRatesResponse?.data?.length || 0;
    const customRatesToShow = getCustomRatesResponse?.data?.slice(0, visibleCount);

    const showMoreHandler = () => {
        setVisibleCount((prevCount) => Math.min(prevCount + 5, totalCustomRates));
    };

    const showLessHandler = () => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!type) {
            newErrors.type = 'Vehicle type is required';
        }
        if (!rate) {
            newErrors.rate = 'Rate is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const validateUpdateForm = () => {
        const newErrors = {};

        if (!typeEdit) {
            newErrors.typeEdit = 'Vehicle type is required';
        }
        if (!rateEdit) {
            newErrors.rate = 'Rate is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const handleUpdate = async () => {
        if (!validateUpdateForm()) return;

        try {
            await dispatch(UpdateRateAPI({ vehicleType: typeEdit, rate: Number(rateEdit), country: 'USA' }, rateId))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await dispatch(AddRateAPI({ vehicleType: type, rate: Number(rate), country: 'USA' }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    // Optional: initialize to 'standard'
    useEffect(() => {
        setSelectedRate('standard')
    }, [])

    useEffect(() => {
        if (selectedRate === 'standard') {
            setSelectedCustomRate('');
            setSelectedCustomRateData(null);
        }
    }, [selectedRate]);

    useEffect(() => {
        dispatch(GetCustomRatesApi())
    }, [updateRateResponse, response])

    useEffect(() => {
        if (selectedCustomRateData) {
            setRateId(selectedCustomRateData?._id);
            setRateEdit(selectedCustomRateData?.rate);
            setTypeEdit(selectedCustomRateData?.vehicleType ? selectedCustomRateData.vehicleType.toLowerCase() : '')
        }
    }, [selectedCustomRateData])

    useEffect(() => {
        if (response) {
            showSuccessToast(response?.message);
            dispatch(addRateStateReset());
            setRate('');
            setValidationErrors('');
            setType('');

            const offcanvasEl = document.getElementById('addCustomRates');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [response])

    useEffect(() => {
        if (updateRateResponse) {
            showSuccessToast(updateRateResponse?.message);
            dispatch(updateRateStateReset());
            setRateEdit('');
            setValidationErrors('');
            setTypeEdit('');

            const offcanvasEl = document.getElementById('editCustomRates');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [updateRateResponse])

    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            dispatch(addRateStateReset());
        }
    }, [error])

    useEffect(() => {
        if (updateRateError) {
            showErrorToast(updateRateError?.data);
            dispatch(updateRateStateReset());
        }
    }, [updateRateError])

    useEffect(() => {
        const addOffcanvasEl = document.getElementById('addCustomRates');

        function handleOffcanvasClose() {
            // Reset form fields on offcanvas close
            setType('');
            setRate('');
            setValidationErrors({});
        }

        if (addOffcanvasEl) {
            addOffcanvasEl.addEventListener('hidden.bs.offcanvas', handleOffcanvasClose);
        }

        return () => {
            if (addOffcanvasEl) {
                addOffcanvasEl.removeEventListener('hidden.bs.offcanvas', handleOffcanvasClose);
            }
        };
    }, []);

    useEffect(() => {
        const offcanvasEl = document.getElementById('editCustomRates');

        function handleShow() {
            if (selectedCustomRateData) {
                setTypeEdit(selectedCustomRateData.vehicleType.toLowerCase());
                setRateEdit(selectedCustomRateData.rate);
            }
        }

        if (offcanvasEl) {
            offcanvasEl.addEventListener('show.bs.offcanvas', handleShow);
        }

        return () => {
            if (offcanvasEl) {
                offcanvasEl.removeEventListener('show.bs.offcanvas', handleShow);
            }
        }
    }, [selectedCustomRateData]);

    return (
        <>
            <section className="main-section spacer-y pt-3">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-xl-12">
                            <div className="common_main_heading_wrapper">
                                <h1>Mileage Rates</h1>
                            </div>
                            <div className="common-card">
                                <div className="max_width_blk min-height_blk">
                                    <div className="space_card">
                                        <div className="outline_wrapper mb-4">
                                            <div className="top_content_blk">
                                                <h2 className="fs-6 fw-medium mb-1">Reimbursement</h2>
                                                <p className="fs-14 mb-0">Please note that the reimbursement for all your trips will  be recalculated <br />if you charge your reimbursement rate.</p>
                                            </div>
                                            <label className="radio_label" htmlFor="check_1">
                                                <div>
                                                    <h3 className="fs-6 fw-medium mb-1">Standard rates for the country</h3>
                                                    <p className="fs-14 mb-0">Use the standard tax-free mileage allowance rate for the country</p>
                                                </div>
                                                <input type="radio" name="radioCheck" className="d-none" id="check_1" checked={selectedRate === 'standard'}
                                                    onChange={() => setSelectedRate('standard')} />
                                                <span className="radio_dot" />
                                            </label>
                                            <label className="radio_label" htmlFor="check_2">
                                                <div>
                                                    <h3 className="fs-6 fw-medium mb-1">Custom Rates</h3>
                                                    <p className="fs-14 mb-0">Use the standard tax-free mileage allowance rate for the country</p>
                                                </div>
                                                <input type="radio" name="radioCheck" className="d-none" id="check_2" checked={selectedRate === 'custom'}
                                                    onChange={() => setSelectedRate('custom')} />
                                                <span className="radio_dot" />
                                            </label>
                                        </div>
                                        {selectedRate === 'standard' && <div className="checked_option_blk standard_rates mt-4">
                                            <h2 className="fs-6 fw-medium mb-2">Standard Rates</h2>
                                            <div className="outline_wrapper py-2 px-3">
                                                <div className="check_option_card_list hstack justify-content-between gap-3 flex-wrap">
                                                    <h3 className="fs-6 fw-medium mb-0">Personal</h3>
                                                    <p className="fs-6 fw-medium mb-0">$0.0</p>
                                                </div>
                                                <div className="check_option_card_list hstack justify-content-between gap-3 flex-wrap">
                                                    <h3 className="fs-6 fw-medium mb-0">Business</h3>
                                                    <p className="fs-6 fw-medium mb-0">$0.7</p>
                                                </div>
                                                <div className="check_option_card_list hstack justify-content-between gap-3 flex-wrap">
                                                    <h3 className="fs-6 fw-medium mb-0">Charity</h3>
                                                    <p className="fs-6 fw-medium mb-0">$0.14</p>
                                                </div>
                                                <div className="check_option_card_list hstack justify-content-between gap-3 flex-wrap">
                                                    <h3 className="fs-6 fw-medium mb-0">Medical</h3>
                                                    <p className="fs-6 fw-medium mb-0">$0.21</p>
                                                </div>
                                            </div>
                                        </div>}

                                        {selectedRate === 'custom' &&

                                            <div className="checked_option_blk custom_rates  mt-4">
                                                <h2 className="fs-6 fw-medium mb-2">Custom Rates</h2>
                                                {customRatesToShow?.length > 0 ? customRatesToShow?.map((rate, index) => {
                                                    return (
                                                        <div className="outline_wrapper py-2 mt-2" key="index">
                                                            <div className="custom_rates_list_blk">
                                                                <div className="custom_rates_detail" type="button" data-bs-toggle="offcanvas" data-bs-target="#editCustomRates" aria-controls="editCustomRates">
                                                                    <h3 className="fs-6 fw-medium mb-1">{rate?.vehicleType ? rate?.vehicleType?.toUpperCase() : ''}</h3>
                                                                    <p className="fs-14 mb-0">${rate?.rate || 0}/mile</p>
                                                                </div>
                                                                <label className="radio_label" htmlFor={`custom_check_${rate.id || index}`}>
                                                                    <input type="radio" name="customRadioCheck" className="d-none" id={`custom_check_${rate.id || index}`}
                                                                        checked={selectedCustomRate === (rate.id || rate.vehicleType)}
                                                                        onChange={() => {
                                                                            setSelectedCustomRate(rate.id || rate.vehicleType);
                                                                            setSelectedCustomRateData(rate);
                                                                            setSelectedRate('custom');
                                                                        }} />
                                                                    <span className="radio_dot" />
                                                                </label>
                                                            </div>
                                                        </div>)
                                                }) :
                                                    <></>
                                                }
                                                <div className="d-flex justify-content-start gap-3 mt-4 mt-md-4">
                                                    <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addCustomRates" aria-controls="addCustomRates">+Add Custom Rate</button>
                                                    {visibleCount < totalCustomRates ? (
                                                        <button className="primary-text-btn" type="button" onClick={showMoreHandler}>
                                                            Show More
                                                        </button>
                                                    ) : (
                                                        totalCustomRates > INITIAL_VISIBLE_COUNT && (
                                                            <button className="primary-text-btn" type="button" onClick={showLessHandler}>
                                                                Show Less
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                                <div className="d-flex justify-content-center gap-3 mt-4 mt-md-4">
                                                    <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#editCustomRates" aria-controls="editCustomRates">Update</button>
                                                    <button className="outline-btn">Cancel</button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* add custom rates */}
            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="addCustomRates" aria-labelledby="addCustomRatesLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Add Custom Rate</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" onClick={handleSubmit}>{loading ? <ClipLoader size={24} color='#ffffff' /> : 'Save'}</button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper outline_form_wrapper">
                        <div className="ofcvs_form_item">
                            <label>Vehicle Type</label>
                            <div className="ofcvs_form_field w-50">
                                <select id className="form-select" value={type} onChange={(e) => {
                                    setType(e.target.value);
                                    if (validationErrors.type) {
                                        setValidationErrors(prev => ({ ...prev, type: false }));
                                    }
                                }}>
                                    <option value=''>Select Type</option>
                                    <option value='car'>Car</option>
                                    <option value='motorcycle'>Motorcycle</option>
                                </select>
                            </div>
                            {validationErrors.type &&
                                (
                                    <span className={`error ${validationErrors.type ? '' : 'd-none'}`}>{validationErrors.type}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <label>Rate</label>
                            <div className="ofcvs_form_field miles_input">
                                <input type="number" className="form-control" placeholder="Rate" min="0" value={rate} onKeyDown={(e) => {
                                    // Prevent space if input is empty
                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                        e.preventDefault();
                                    }
                                    // Prevent minus or subtract keys
                                    if (e.key === '-' || e.key === 'Subtract') {
                                        e.preventDefault();
                                    }
                                    // Allow only digits, one dot, and control keys (Backspace, Tab, Arrows)
                                    if (
                                        !(
                                            e.key >= '0' && e.key <= '9' ||
                                            e.key === '.' ||
                                            ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
                                        )
                                    ) {
                                        e.preventDefault();
                                    }
                                    // Prevent more than one dot
                                    if (e.key === '.' && e.currentTarget.value.includes('.')) {
                                        e.preventDefault();
                                    }
                                }}
                                    onPaste={(e) => {
                                        const paste = e.clipboardData.getData('text');
                                        // Regex: matches positive number with up to 2 decimals, no minus
                                        if (!/^\d+(\.\d{0,2})?$/.test(paste)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        let val = e.target.value;

                                        // Allow empty input
                                        if (val === '') {
                                            setRate(val);
                                            if (validationErrors.rate) {
                                                setValidationErrors(prev => ({ ...prev, rate: false }));
                                            }
                                            return;
                                        }

                                        // Validate against positive number with up to 2 decimals
                                        if (/^\d+(\.\d{0,2})?$/.test(val)) {
                                            setRate(val);
                                            if (validationErrors.rate) {
                                                setValidationErrors(prev => ({ ...prev, rate: false }));
                                            }
                                        }
                                        // If invalid, do not update state (ignore input)
                                    }} />
                                <span className="miles_title">$/mile</span>
                            </div>
                            {validationErrors.rate &&
                                (
                                    <span className={`error ${validationErrors.rate ? '' : 'd-none'}`}>{validationErrors.rate}</span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div >


            {/* Edit custom rates */}
            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1
            } id="editCustomRates" aria-labelledby="editCustomRatesLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Edit Custom Rate</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" onClick={handleUpdate}>{updateRateLoading ? <ClipLoader size={24} color='#ffffff' /> : 'Save'}</button>
                            <button className="delete_btn"><img src="/assets/images/trash-icon.svg" alt="Trash" /></button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper outline_form_wrapper">
                        <div className="ofcvs_form_item">
                            <label>Vehicle Type</label>
                            <div className="ofcvs_form_field w-50">
                                <select id className="form-select" value={typeEdit} onChange={(e) => {
                                    setTypeEdit(e.target.value);
                                    if (validationErrors.type) {
                                        setValidationErrors(prev => ({ ...prev, type: false }));
                                    }
                                }}>
                                    <option value=''>Select Type</option>
                                    <option value='car'>Car</option>
                                    <option value='motorcycle'>Motorcycle</option>
                                </select>
                            </div>
                            {validationErrors.typeEdit &&
                                (
                                    <span className={`error ${validationErrors.typeEdit ? '' : 'd-none'}`}>{validationErrors.typeEdit}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <label>Rate</label>
                            <div className="ofcvs_form_field miles_input">
                                <input type="number" className="form-control" placeholder="Rate" min="0" value={rateEdit} onKeyDown={(e) => {
                                    // Prevent space if input is empty
                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                        e.preventDefault();
                                    }
                                    // Prevent minus or subtract keys
                                    if (e.key === '-' || e.key === 'Subtract') {
                                        e.preventDefault();
                                    }
                                    // Allow only digits, one dot, and control keys (Backspace, Tab, Arrows)
                                    if (
                                        !(
                                            e.key >= '0' && e.key <= '9' ||
                                            e.key === '.' ||
                                            ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)
                                        )
                                    ) {
                                        e.preventDefault();
                                    }
                                    // Prevent more than one dot
                                    if (e.key === '.' && e.currentTarget.value.includes('.')) {
                                        e.preventDefault();
                                    }
                                }}
                                    onPaste={(e) => {
                                        const paste = e.clipboardData.getData('text');
                                        // Regex: matches positive number with up to 2 decimals, no minus
                                        if (!/^\d+(\.\d{0,2})?$/.test(paste)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        let val = e.target.value;

                                        // Allow empty input
                                        if (val === '') {
                                            setRateEdit(val);
                                            if (validationErrors.rateEdit) {
                                                setValidationErrors(prev => ({ ...prev, rateEdit: false }));
                                            }
                                            return;
                                        }

                                        // Validate against positive number with up to 2 decimals
                                        if (/^\d+(\.\d{0,2})?$/.test(val)) {
                                            setRateEdit(val);
                                            if (validationErrors.rateEdit) {
                                                setValidationErrors(prev => ({ ...prev, rateEdit: false }));
                                            }
                                        }
                                        // If invalid, do not update state (ignore input)
                                    }} />
                                <span className="miles_title">$/mile</span>
                            </div>
                            {validationErrors.rateEdit &&
                                (
                                    <span className={`error ${validationErrors.rateEdit ? '' : 'd-none'}`}>{validationErrors.rateEdit}</span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

export default MileageRates