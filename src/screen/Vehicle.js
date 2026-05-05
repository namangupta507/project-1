import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetVehiclesApi } from '../redux/actions/vehicle/GetVehiclesAction';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { AddVehicleAPI } from '../redux/actions/vehicle/AddVehicleAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { addVehicleStateReset } from '../redux/slices/vehicle/AddVehicleSlice';
import { EditVehicleAPI } from '../redux/actions/vehicle/EditVehicleAction';
import { editVehicleStateReset } from '../redux/slices/vehicle/EditVehicleSlice';
import { deleteVehicleStateReset } from '../redux/slices/vehicle/DeleteVehicleSlice';
import Swal from 'sweetalert2';
import { DeleteVehicleAPI } from '../redux/actions/vehicle/DeleteVehicleAction';
import CountryDropdown from '../components/CountryDropdown';

const Vehicle = () => {
    const dispatch = useDispatch();

    const { response, loading, error } = useSelector((state) => state.getVehicles);
    const { response: addVehicleResponse, loading: addVehicleLoading, error: addVehicleError } = useSelector((state) => state.addVehicle);
    const { response: editVehicleResponse, loading: editVehicleLoading, error: editVehicleError } = useSelector((state) => state.editVehicle);
    const { response: deleteVehicleResponse, loading: deleteVehicleLoading, error: deleteVehicleError } = useSelector((state) => state.deleteVehicle);

    const [activeTab, setActiveTab] = useState('activate');
    const [isActive, setIsActive] = useState(true);
    const [activeVehicles, setActiveVehicles] = useState([]);
    const [archievedVehicles, setArchievedVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [vehicleId, setVehicleId] = useState('');

    const [type, setType] = useState('');
    const [typeEdit, setTypeEdit] = useState('');

    const [name, setName] = useState('');
    const [nameEdit, setNameEdit] = useState('');

    const [merchantName, setMerchantName] = useState('');
    // const [merchantNameEdit, setMerchantNameEdit] = useState('');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const [input5, setInput5] = useState('');
    const [input6, setInput6] = useState('');
    const [input7, setInput7] = useState('');

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    const input5Ref = useRef(null);
    const input6Ref = useRef(null);
    const input7Ref = useRef(null);

    const [input1Edit, setInput1Edit] = useState('');
    const [input2Edit, setInput2Edit] = useState('');
    const [input3Edit, setInput3Edit] = useState('');
    const [input4Edit, setInput4Edit] = useState('');
    const [input5Edit, setInput5Edit] = useState('');
    const [input6Edit, setInput6Edit] = useState('');
    const [input7Edit, setInput7Edit] = useState('');

    const [plateNumber, setPlateNumber] = useState('');
    const [plateNumberEdit, setPlateNumberEdit] = useState('');

    const [country, setCountry] = useState('');
    const [countryEdit, setCountryEdit] = useState('');

    const [validationErrors, setValidationErrors] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'activate') {
            setIsActive(false);
        }
        setIsActive(true);
    }

    const fetchVehicles = useCallback(() => {
        dispatch(GetVehiclesApi({ isActive }))
    }, [dispatch, isActive]);

    const handleDeleteVehicle = useCallback(async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this vehicle?`,
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
                    await dispatch(DeleteVehicleAPI({ id: vehicleId }))

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }, [dispatch, vehicleId]);

    const validateForm = () => {
        const newErrors = {};

        if (!type) {
            newErrors.type = 'Vehicle Type is required';
        }
        if (!name) {
            newErrors.name = 'Vehicle Name is required';
        }
        if (!merchantName) {
            newErrors.merchantName = 'Merchant Name is required';
        }
        if (!plateNumber) {
            newErrors.plateNumber = 'Vehicle Plate Number is required';
        }
        if (!country) {
            newErrors.country = 'Country is required';
        }

        if (
            !input1 || !input2 || !input3 ||
            !input4 || !input5 || !input6 || !input7
        ) {
            newErrors.inputs = 'All reading fields are required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const validateUpdateForm = () => {
        const newErrors = {};

        if (!typeEdit) {
            newErrors.typeEdit = 'Vehicle Type is required';
        }
        if (!nameEdit) {
            newErrors.nameEdit = 'Vehicle Name is required';
        }
        if (!plateNumberEdit) {
            newErrors.plateNumberEdit = 'Vehicle Plate Number is required';
        }
        if (!countryEdit) {
            newErrors.countryEdit = 'Country is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const isVehicleUpdated = () => {
        const original = selectedVehicle || {};

        const isUpdated =
            typeEdit !== (original.type || '') ||
            nameEdit !== (original.name || '') ||
            countryEdit !== (original.country || '') ||
            plateNumberEdit !== (original.licensePlate || '')

        return isUpdated;
    };

    const resetForm = () => {
        setType('');
        setName('');
        setMerchantName('');
        setCountry('');
        setPlateNumber('');
        setInput1('')
        setInput2('')
        setInput3('')
        setInput4('')
        setInput5('')
        setInput6('')
        setInput7('')
    }

    const handleSubmit = async () => {
        if (!validateForm()) return;
        const reading = `${input1}${input2}${input3}${input4}${input5}${input6}${input7}`;
        try {
            await dispatch(AddVehicleAPI({ type, name, licensePlate: plateNumber, country, reading: Number(reading) }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleEditSubmit = async () => {
        if (!isVehicleUpdated()) {
            showErrorToast('nothing has been changed');
            return;
        }
        if (!validateUpdateForm()) return;

        try {
            await dispatch(EditVehicleAPI({ id: vehicleId, type: typeEdit, name: nameEdit, licensePlate: plateNumberEdit, country: countryEdit }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    useEffect(() => {
        fetchVehicles()
    }, [fetchVehicles, addVehicleResponse, editVehicleResponse, deleteVehicleResponse]);

    useEffect(() => {
        if (response) {
            const allVehicles = response?.data || [];

            const activeList = allVehicles.filter(vehicle => vehicle.isActive);
            const archivedList = allVehicles.filter(vehicle => !vehicle.isActive);

            setActiveVehicles(activeList);
            setArchievedVehicles(archivedList);
        }
    }, [response])

    useEffect(() => {
        if (addVehicleResponse) {
            showSuccessToast(addVehicleResponse?.message);
            dispatch(addVehicleStateReset());
            resetForm();
            const offcanvasEl = document.getElementById('addVehicleoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [addVehicleResponse])

    useEffect(() => {
        if (editVehicleResponse) {
            showSuccessToast(editVehicleResponse?.message);
            dispatch(editVehicleStateReset());
            resetForm();
            const offcanvasEl = document.getElementById('vehicleDetailoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [editVehicleResponse])

    useEffect(() => {
        if (addVehicleError) {
            showErrorToast(addVehicleError?.data);
            dispatch(addVehicleStateReset());
        }
    }, [addVehicleError])

    useEffect(() => {
        if (editVehicleError) {
            showErrorToast(editVehicleError?.data);
            dispatch(editVehicleStateReset());
        }
    }, [editVehicleError])

    useEffect(() => {
        if (deleteVehicleResponse) {
            showSuccessToast('Vehicle deleted successfully');
            setSelectedVehicle(null);
            dispatch(deleteVehicleStateReset());
            const offcanvasEl = document.getElementById('vehicleDetailoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [deleteVehicleResponse])

    useEffect(() => {
        if (deleteVehicleError) {
            showErrorToast(deleteVehicleError?.data);
            dispatch(deleteVehicleStateReset())
        }
    }, [deleteVehicleError])

    useEffect(() => {
        if (selectedVehicle) {
            setVehicleId(selectedVehicle._id || '')
            setTypeEdit(selectedVehicle.type || '');
            setNameEdit(selectedVehicle.name || '');
            setPlateNumberEdit(selectedVehicle.licensePlate || '');
            setCountryEdit(selectedVehicle.country || '');
            const readingInt = Math.floor(selectedVehicle?.odometer.reading || 0); // remove decimals
            const readingStr = readingInt.toString().padStart(7, '0');
            setInput1Edit(readingStr[0]);
            setInput2Edit(readingStr[1]);
            setInput3Edit(readingStr[2]);
            setInput4Edit(readingStr[3]);
            setInput5Edit(readingStr[4]);
            setInput6Edit(readingStr[5]);
            setInput7Edit(readingStr[6]);
        }
    }, [selectedVehicle]);

    useEffect(() => {
        const offcanvas = document.getElementById('vehicleDetailoffcanvas');

        const handleShow = () => {
            if (selectedVehicle) {
                setVehicleId(selectedVehicle._id || '')
                setTypeEdit(selectedVehicle.type || '');
                setNameEdit(selectedVehicle.name || '');
                setPlateNumberEdit(selectedVehicle.licensePlate || '');
                setCountryEdit(selectedVehicle.country || '');
            }
        }

        offcanvas?.addEventListener('shown.bs.offcanvas', handleShow);

        return () => {
            offcanvas?.removeEventListener('shown.bs.offcanvas', handleShow);
        };
    }, [selectedVehicle])

    console.log(activeVehicles,
        "active"
    )

    return (

        <>
            {
                activeVehicles.length === 0 && archievedVehicles.length === 0
                    ?

                    <div className="content-wrapper">
                        {/* <div className="breadcrumb_wrapper d-none">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-header">
                                            <nav className="breadcrumb_nav">
                                                <ul className="breadcrumb mb-0">
                                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                                    <li className="breadcrumb-item text-capitalize">analytics</li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <section className="main-section spacer-y">
                            <div className="container">
                                <div className="row gy-4">
                                    <div className="col-xl-12">
                                        <div className="common_main_heading_wrapper">
                                            <h1>Vehicle</h1>
                                        </div>
                                        <div className="common-card">
                                            <div className="min-height_blk">
                                                <div className="space_card">
                                                    <div className="vehicle_thumb_blk mb-5">
                                                        <img src="/assets/images/car-img.png" alt="car" />
                                                    </div>
                                                    <h2 className="fs-6 fw-medium text-center my-4">Please Add Vehicles to Add Trip!</h2>
                                                    <div className="d-flex justify-content-center gap-3 mt-4 mt-md-4">
                                                        <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addVehicleoffcanvas" aria-controls="addVehicleoffcanvas">+Add Vehicle</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                    :
                    <div className="content-wrapper">
                        {/* <div className="breadcrumb_wrapper d-none">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="page-header">
                                            <nav className="breadcrumb_nav">
                                                <ul className="breadcrumb mb-0">
                                                    <li className="breadcrumb-item"><a href="/">Home</a></li>
                                                    <li className="breadcrumb-item text-capitalize">analytics</li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <section className="main-section spacer-y">
                            <div className="container">
                                <div className="row gy-4">
                                    <div className="col-xl-12">
                                        <div className="common_main_heading_wrapper mb-4">
                                            <ul className="common_nav_tab nav nav-pills mb-0 gap-2" id="pills-tab" role="tablist">
                                                <li className="nav-item" role="presentation">
                                                    <button className={`nav-link ${activeTab === 'activate' ? 'active' : ''}`} onClick={() => handleTabChange('activate')} id="pills-1-tab" data-bs-toggle="pill" data-bs-target="#pills-1" type="button" role="tab" aria-controls="pills-1" aria-selected="true">Activate</button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button className={`nav-link ${activeTab === 'archieved' ? 'active' : ''}`} onClick={() => handleTabChange('archieved')} id="pills-2-tab" data-bs-toggle="pill" data-bs-target="#pills-2" type="button" role="tab" aria-controls="pills-2" aria-selected="false">Archived</button>
                                                </li>
                                            </ul>
                                            <div className="d-flex flex-end gap-3">
                                                <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addVehicleoffcanvas" aria-controls="addVehicleoffcanvas">+Add Vehicle</button>
                                            </div>
                                        </div>
                                        <div className="tab-content common_tab_content" id="pills-tabContent">
                                            <div className={`tab-pane fade ${activeTab === 'activate' ? 'show active' : ''}`} id="pills-1" role="tabpanel" aria-labelledby="pills-1-tab" tabIndex={0}>
                                                {loading ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '70vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : error ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '70vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <div className="row row-cols-sm-2 g-4">
                                                        {activeVehicles.length > 0 ? activeVehicles?.map((activeVehicle, index) => {
                                                            console.log(activeVehicle, "Actyive")
                                                            return (

                                                                <div className="col" key={index}>
                                                                    <button className="vehicle_card common-card w-100 border-0 bg-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#vehicleDetailoffcanvas" aria-controls="vehicleDetailoffcanvas" onClick={() => setSelectedVehicle(activeVehicle)}>
                                                                        <span className="vehicle_img">
                                                                            <img src={activeVehicle.type === 'car' ? '/assets/images/car11.svg' : '/assets/images/bike12.svg'} alt="Vehicle" />
                                                                        </span>
                                                                        <span className="vehicle_info">
                                                                            <span className="vehicle_info_list">
                                                                                <span className="vehicle_info_title">Name </span>
                                                                                <span className="vehicle_info_detail">{activeVehicle?.name || ''}</span>
                                                                            </span>
                                                                            <span className="vehicle_info_list">
                                                                                <span className="vehicle_info_title">Plate No </span>
                                                                                <span className="vehicle_info_detail">{activeVehicle?.licensePlate || ''}</span>
                                                                            </span>
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            )
                                                        }) : (
                                                            <div className='col'>
                                                                <div className='d-flex align-items-center justify-content-start fs-5 fw-semibold' >
                                                                    No data available
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                            </div>


                                            <div className={`tab-pane fade ${activeTab === 'archieved' ? 'show active' : ''}`} id="pills-2" role="tabpanel" aria-labelledby="pills-2-tab" tabIndex={0}>
                                                {loading ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '70vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : error ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '70vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <div className="row row-cols-sm-2 g-4">
                                                        {archievedVehicles.length > 0 ? archievedVehicles?.map((archievedVehicle, index) => {
                                                            return (

                                                                <div className="col" key={index}>
                                                                    <button className="vehicle_card common-card w-100 border-0 bg-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#vehicleDetailoffcanvas" aria-controls="vehicleDetailoffcanvas">
                                                                        <span className="vehicle_img">
                                                                            <img src={archievedVehicle.type === 'car' ? '/assets/images/car11.svg' : '/assets/images/bike12.svg'} alt="Vehicle" />
                                                                        </span>
                                                                        <span className="vehicle_info">
                                                                            <span className="vehicle_info_list">
                                                                                <span className="vehicle_info_title">Name</span>
                                                                                <span className="vehicle_info_detail">{archievedVehicle?.name || ''}</span>
                                                                            </span>
                                                                            <span className="vehicle_info_list">
                                                                                <span className="vehicle_info_title">Plate No</span>
                                                                                <span className="vehicle_info_detail">{archievedVehicle?.licensePlate || ''}</span>
                                                                            </span>
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            )
                                                        }) : (
                                                            <div className='col'>
                                                                <div className='d-flex align-items-center justify-content-start fs-5 fw-semibold' >
                                                                    No data available
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                            </div>



                                        </div>
                                    </div>
                                </div >
                            </div >
                        </section >
                    </div >
            }

            {/* add vehicle offcanvas */}
            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="addVehicleoffcanvas" aria-labelledby="addVehicleoffcanvasLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { setValidationErrors(''); resetForm() }} />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>New Vehicle</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" onClick={handleSubmit}>{addVehicleLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Save'}</button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper outline_form_wrapper">
                        <div className="ofcvs_form_item">
                            <label>Vehicle Type</label>
                            <div className="ofcvs_form_field w-50">
                                <select id className="form-select" onChange={(e) => {
                                    setType(e.target.value);
                                    if (validationErrors.type) {
                                        setValidationErrors(prev => ({ ...prev, type: false }));
                                    }
                                }} value={type}>
                                    <option value>Select Type</option>
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
                            <label>Vehicle name</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Vehicle Name" value={name}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setName(value);
                                        if (validationErrors.name) {
                                            setValidationErrors(prev => ({ ...prev, name: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.name &&
                                (
                                    <span className={`error ${validationErrors.name ? '' : 'd-none'}`}>{validationErrors.name}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <label>Merchant name</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Enter name" value={merchantName}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setMerchantName(value);
                                        if (validationErrors.merchantName) {
                                            setValidationErrors(prev => ({ ...prev, merchantName: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.merchantName &&
                                (
                                    <span className={`error ${validationErrors.merchantName ? '' : 'd-none'}`}>{validationErrors.merchantName}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <label>License plate no</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="CH-01-1993" value={plateNumber}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setPlateNumber(value);
                                        if (validationErrors.plateNumber) {
                                            setValidationErrors(prev => ({ ...prev, plateNumber: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.plateNumber &&
                                (
                                    <span className={`error ${validationErrors.plateNumber ? '' : 'd-none'}`}>{validationErrors.plateNumber}</span>
                                )
                            }
                        </div>
                        {/* <div className="ofcvs_form_item">
                            <label>Country</label>
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setCountry(e.target.value);
                                    if (validationErrors.country) {
                                        setValidationErrors(prev => ({ ...prev, country: false }));
                                    }
                                }} value={country}>
                                    <option value=''>Select Country</option>
                                    <option value='India'>India</option>
                                </select>
                            </div>
                            {validationErrors.country &&
                                (
                                    <span className={`error ${validationErrors.country ? '' : 'd-none'}`}>{validationErrors.country}</span>
                                )
                            }
                        </div> */}
                        <CountryDropdown country={country} setCountry={setCountry} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                        <div className="ofcvs_form_item">
                            <label>Add Odometer Reading</label>
                            <div className="reading_input_blk hstack justify-content-between gap-3 mt-2 md-5">
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
                        </div>
                    </div>
                </div>
            </div>

            {/* vehicle detail offcanvas */}
            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="vehicleDetailoffcanvas" aria-labelledby="vehicleDetailoffcanvasLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Vehicle Detail</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" onClick={handleEditSubmit}>{editVehicleLoading ? <PulseLoader color='#ffffff' size={14} /> : 'Save'}</button>
                            <button className="delete_btn">{deleteVehicleLoading ? <ClipLoader size={24} color='#ff001d' /> : <img src="/assets/images/trash-icon.svg" alt="Trash" onClick={() => handleDeleteVehicle()} />}</button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper outline_form_wrapper">
                        <div className="ofcvs_form_item">
                            <label>Vehicle Type</label>
                            <div className="ofcvs_form_field w-50">
                                <select id className="form-select" onChange={(e) => {
                                    setTypeEdit(e.target.value);
                                    if (validationErrors.typeEdit) {
                                        setValidationErrors(prev => ({ ...prev, typeEdit: false }));
                                    }
                                }} value={typeEdit}>
                                    <option value>Select Type</option>
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
                            <label>Vehicle name</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Vehicle Name" value={nameEdit}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNameEdit(value);
                                        if (validationErrors.nameEdit) {
                                            setValidationErrors(prev => ({ ...prev, nameEdit: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.nameEdit &&
                                (
                                    <span className={`error ${validationErrors.nameEdit ? '' : 'd-none'}`}>{validationErrors.nameEdit}</span>
                                )
                            }
                        </div>
                        {/* <div className="ofcvs_form_item">
                            <label>Merchant name</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Enter name" value={merchantName}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setMerchantName(value);
                                        if (validationErrors.merchantName) {
                                            setValidationErrors(prev => ({ ...prev, merchantName: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.merchantName &&
                                (
                                    <span className={`error ${validationErrors.merchantName ? '' : 'd-none'}`}>{validationErrors.merchantName}</span>
                                )
                            }
                        </div> */}
                        <div className="ofcvs_form_item">
                            <label>License plate no</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="CH-01-1993" value={plateNumberEdit}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setPlateNumberEdit(value);
                                        if (validationErrors.plateNumberEdit) {
                                            setValidationErrors(prev => ({ ...prev, plateNumberEdit: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.plateNumberEdit &&
                                (
                                    <span className={`error ${validationErrors.plateNumberEdit ? '' : 'd-none'}`}>{validationErrors.plateNumberEdit}</span>
                                )
                            }
                        </div>
                        {/* <div className="ofcvs_form_item">
                            <label>Country</label>
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setCountryEdit(e.target.value);
                                    if (validationErrors.countryEdit) {
                                        setValidationErrors(prev => ({ ...prev, countryEdit: false }));
                                    }
                                }} value={countryEdit}>
                                    <option value=''>Select Country</option>
                                    <option value='India'>India</option>
                                </select>
                            </div>
                            {validationErrors.countryEdit &&
                                (
                                    <span className={`error ${validationErrors.countryEdit ? '' : 'd-none'}`}>{validationErrors.countryEdit}</span>
                                )
                            }
                        </div> */}
                        <CountryDropdown country={countryEdit} setCountry={setCountryEdit} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                        <div className="ofcvs_form_item">
                            <label>Add Odometer Reading</label>
                            <div className="reading_input_blk hstack justify-content-between gap-3 mt-2 md-5">
                                <input type="text"
                                    inputMode="numeric" disabled className="form-control" id="reading_1" pattern="[0-9]*" min={0} maxLength={1} value={input1Edit} onKeyDown={(e) => {
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
                                    inputMode="numeric" disabled className="form-control" id="reading_2" pattern="[0-9]*" min={0} maxLength={1} value={input2Edit} onKeyDown={(e) => {
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
                                    inputMode="numeric" disabled className="form-control" id="reading_3" pattern="[0-9]*" min={0} maxLength={1} value={input3Edit} onKeyDown={(e) => {
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
                                    inputMode="numeric" disabled className="form-control" id="reading_4" pattern="[0-9]*" min={0} maxLength={1} value={input4Edit} onKeyDown={(e) => {
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
                                    inputMode="numeric" disabled className="form-control" id="reading_5" pattern="[0-9]*" min={0} maxLength={1} value={input5Edit} onKeyDown={(e) => {
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
                                    inputMode="numeric" disabled className="form-control" id="reading_6" pattern="[0-9]*" min={0} maxLength={1} value={input6Edit} onKeyDown={(e) => {
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
                                    inputMode="numeric" disabled className="form-control" id="reading_7" pattern="[0-9]*" min={0} maxLength={1} value={input7Edit} onKeyDown={(e) => {
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
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Vehicle