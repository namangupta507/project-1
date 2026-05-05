import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetLocationsApi } from '../redux/actions/location/GetLocationsAction';
import { AddLocationAPI } from '../redux/actions/location/AddLocationAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { addLocationStateReset } from '../redux/slices/location/AddLocationSlice';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { EditLocationAPI } from '../redux/actions/location/EditLocationAction';
import Swal from 'sweetalert2';
import { editLocationStateReset } from '../redux/slices/location/EditLocationSlice';
import { deleteLocationStateReset } from '../redux/slices/location/DeleteLocationSlice';
import { DeleteLocationAPI } from '../redux/actions/location/DeleteLocationAction';
import { se } from 'date-fns/locale';
import usePlaceAutocomplete from '../hooks/usePlaceAutocomplete';
import CountryCityDropdown from '../components/CountryCityDropdown';

const Location = () => {
    const dispatch = useDispatch();
    const { response, loading, error } = useSelector((state) => state.getLocations);
    const { response: addLocationResponse, loading: addLocationLoading, errorL: addLocationError } = useSelector((state) => state.addLocation);
    const { response: editLocationResponse, loading: editLocationLoading, errorL: editLocationError } = useSelector((state) => state.editLocation);
    const { response: deleteLocationResponse, loading: deleteLocationLoading, errorL: deleteLocationError } = useSelector((state) => state.deleteLocation);

    const [locationField, setLocationField] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [isUserTypingEdit, setIsUserTypingEdit] = useState(false);
    const [locationFieldForUi, setLocationFieldForUi] = useState(null);
    const [locationFieldEditForUi, setLocationFieldEditForUi] = useState(null);

    const [coordinates, setCoordinates] = useState({ longitude: '', latitude: '' })
    const [coordinatesEdit, setCoordinatesEdit] = useState({ longitude: '', latitude: '' })

    const [selectedLocation, setSelectedLocation] = useState('');

    const [locationId, setLocationId] = useState('');
    const [locationFieldEdit, setLocationFieldEdit] = useState('');
    const [addressEdit, setAddressEdit] = useState('');
    const [countryEdit, setCountryEdit] = useState('');
    const [cityEdit, setCityEdit] = useState('');
    const [postalCodeEdit, setPostalCodeEdit] = useState('');

    const { suggestions, fetchPlaceDetails, mapCenter, setMapCenter, clearSuggestions } = usePlaceAutocomplete(locationField, isUserTyping);
    const { suggestions: suggestionsEdit, fetchPlaceDetails: fetchPlaceDetailsEdit, mapCenter: mapCenterEdit, setMapCenter: setMapCenterEdit, clearSuggestions: clearSuggestionsEdit } = usePlaceAutocomplete(locationFieldEdit, isUserTypingEdit);

    function parseAddressComponents(components = []) {
        const get = (type) => {
            const comp = components.find(c => c.types.includes(type));
            return comp ? comp.long_name : "";
        };

        return {
            city: get("locality") || get("administrative_area_level_2"),
            country: get("country"),
            postcode: get("postal_code"),
        };
    }

    const validateForm = () => {
        const newErrors = {};

        if (!locationField) {
            newErrors.locationField = 'Location is required';
        }
        if (!address) {
            newErrors.address = 'Address is required';
        }
        if (!country) {
            newErrors.country = 'Country is required';
        }
        if (!city) {
            newErrors.city = 'City is required';
        }
        if (!postalCode) {
            newErrors.postalCode = 'Postal Code is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    console.log(locationFieldForUi, "location")

    const validateUpdateForm = () => {
        const newErrors = {};

        if (!locationFieldEdit) {
            newErrors.locationFieldEdit = 'Location is required';
        }
        if (!addressEdit) {
            newErrors.addressEdit = 'Address is required';
        }
        if (!countryEdit) {
            newErrors.countryEdit = 'Country is required';
        }
        if (!cityEdit) {
            newErrors.cityEdit = 'City is required';
        }
        if (!postalCodeEdit) {
            newErrors.postalCodeEdit = 'Postal Code is required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const resetForm = () => {
        setLocationField('');
        setAddress('');
        setCity('');
        setCountry('');
        setPostalCode('');
        setValidationErrors('');
    }

    const isLocationUpdated = () => {
        const original = selectedLocation || {};

        const isUpdated =
            locationFieldEdit !== (original.locationName || '') ||
            addressEdit !== (original.address || '') ||
            countryEdit !== (original.country || '') ||
            cityEdit !== (original.city || '') ||
            postalCodeEdit !== (original.postcode || '');

        return isUpdated;
    };

    const handleSubmit = async () => {

        if (!validateForm()) return;
        try {
            await dispatch(AddLocationAPI({ locationName: locationField, address: address, city: city, country: country, postcode: postalCode, coordinates: coordinates }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleEditSubmit = async () => {

        // if (!isLocationUpdated()) {
        //     showErrorToast('nothing has been changed');
        //     return;
        // }

        if (!validateUpdateForm()) return;
        const coordinates = { latitude: 40.712776, longitude: -74.005974 }
        try {
            await dispatch(EditLocationAPI({ id: locationId, locationName: locationFieldEdit, address: addressEdit, city: cityEdit, country: countryEdit, postcode: postalCodeEdit, coordinates: coordinatesEdit }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleDeleteLocation = useCallback(async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this location?`,
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
                    await dispatch(DeleteLocationAPI({ id: locationId }))

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }, [dispatch, locationId]);

    const fetchLocations = useCallback(() => {
        dispatch(GetLocationsApi());
    }, [dispatch])

    useEffect(() => {
        fetchLocations()
    }, [fetchLocations, addLocationResponse, editLocationResponse, deleteLocationResponse])

    useEffect(() => {
        if (addLocationResponse) {
            showSuccessToast(addLocationResponse?.message);
            resetForm();
            dispatch(addLocationStateReset());
            const offcanvasEl = document.getElementById('addLocationoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [addLocationResponse])

    useEffect(() => {
        if (addLocationError) {
            showErrorToast(addLocationError?.data);
            dispatch(addLocationStateReset());
        }
    }, [addLocationError])

    useEffect(() => {
        if (editLocationResponse) {
            showSuccessToast(editLocationResponse?.message);
            dispatch(editLocationStateReset());
            resetForm();
            const offcanvasEl = document.getElementById('locationDetailoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [editLocationResponse])

    useEffect(() => {
        if (editLocationError) {
            showErrorToast(editLocationError?.data);
            dispatch(editLocationStateReset());
        }
    }, [editLocationError])

    useEffect(() => {
        if (deleteLocationResponse) {
            showSuccessToast('Location deleted successfully');
            setSelectedLocation(null);
            dispatch(deleteLocationStateReset());
            const offcanvasEl = document.getElementById('locationDetailoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [deleteLocationResponse])

    useEffect(() => {
        if (deleteLocationError) {
            showErrorToast(deleteLocationError?.data);
            dispatch(deleteLocationStateReset())
        }
    }, [deleteLocationError])

    useEffect(() => {
        if (selectedLocation) {
            setLocationId(selectedLocation?._id || '')
            setLocationFieldEdit(selectedLocation?.locationName || '');
            setAddressEdit(selectedLocation?.address || '');
            setCountryEdit(selectedLocation?.country || '');
            setCityEdit(selectedLocation?.city || '');
            setPostalCodeEdit(selectedLocation?.postcode || '')
        }
    }, [selectedLocation]);

    console.log(selectedLocation, "selectedLocation")
    useEffect(() => {
        const offcanvas = document.getElementById('locationDetailoffcanvas');

        const handleShow = () => {
            if (selectedLocation) {
                setLocationId(selectedLocation?._id || '')
                setLocationFieldEdit(selectedLocation?.locationName || '');
                setAddressEdit(selectedLocation?.address || '');
                setCountryEdit(selectedLocation?.country || '');
                setCityEdit(selectedLocation?.city || '');
                setPostalCodeEdit(selectedLocation?.postcode || '')
            }
        }

        offcanvas?.addEventListener('shown.bs.offcanvas', handleShow);

        return () => {
            offcanvas?.removeEventListener('shown.bs.offcanvas', handleShow);
        };
    }, [selectedLocation])

    useEffect(() => {
        const offcanvas = document.getElementById('addLocationoffcanvas');

        const handleRemove = () => {
            resetForm();
        }

        offcanvas?.addEventListener('hidden.bs.offcanvas', handleRemove);

        return () => {
            offcanvas?.removeEventListener('hidden.bs.offcanvas', handleRemove);
        };
    }, [])

    useEffect(() => {
        if (locationFieldForUi) {
            setCoordinates({ longitude: locationFieldForUi?.coordinates?.longitude || '', latutide: locationFieldForUi?.coordinates?.latitude || '' })
            setAddress(locationFieldForUi?.address);
            setCity(locationFieldForUi?.city);
            setCountry(locationFieldForUi?.country);
            setPostalCode(locationFieldForUi?.postcode);
        }
    }, [locationFieldForUi])

    useEffect(() => {
        if (locationFieldEditForUi) {
            setCoordinatesEdit({ longitude: locationFieldEditForUi?.coordinates?.longitude || '', latutide: locationFieldEditForUi?.coordinates?.latitude || '' })
            setAddressEdit(locationFieldEditForUi?.address);
            setCityEdit(locationFieldEditForUi?.city);
            setCountryEdit(locationFieldEditForUi?.country);
            setPostalCodeEdit(locationFieldEditForUi?.postcode);
        }
    }, [locationFieldEditForUi])

    return (
        <>
            <section className="main-section spacer-y pt-2">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-xl-12">
                            <div className="common_main_heading_wrapper mb-4">
                                <h1>All Location</h1>
                                <div className="d-flex flex-end gap-3">
                                    <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addLocationoffcanvas" aria-controls="addLocationoffcanvas">+Add Location</button>
                                </div>
                            </div>
                            <div className="common_tab_content">
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
                                        {response?.data?.length > 0 ? response?.data?.map((r, index) => {
                                            return (
                                                <div className="col" key={index}>
                                                    <button className="location_card common-card w-100 border-0 bg-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#locationDetailoffcanvas" aria-controls="locationDetailoffcanvas" onClick={() => setSelectedLocation(r)}>
                                                        <span className="map_pin_img">
                                                            <img src="/assets/images/map-pin.svg" alt="location" />
                                                        </span>
                                                        <span className="location_info">
                                                            <span className="location_info_list">
                                                                <span className="location_info_title d-block">{r?.locationName || ''}</span>
                                                                <span className="location_info_detail d-block">{r?.address || ''}</span>
                                                            </span>
                                                        </span>
                                                    </button>
                                                </div>
                                            )
                                        }) :
                                            <div className='col'>
                                                <div className='d-flex align-items-center justify-content-start fs-5 fw-semibold' >
                                                    No data available
                                                </div>
                                            </div>
                                        }


                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add new Location offcanvas */}
            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="addLocationoffcanvas" aria-labelledby="addLocationoffcanvasLabel">
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Add Location</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" onClick={handleSubmit}>{addLocationLoading ? <PulseLoader size={14} color='#ffffff' /> : "Save"}</button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper outline_form_wrapper">
                        <div className="ofcvs_form_item">
                            <label>Location</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Alaska street 3452" value={locationField}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setLocationField(value);
                                        setIsUserTyping(true)
                                        if (validationErrors.locationField) {
                                            setValidationErrors(prev => ({ ...prev, locationField: false }));
                                        }
                                    }}
                                    autoComplete="off"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="autocomplete-suggestions">
                                        {suggestions.map((s) => (
                                            <li
                                                key={s.place_id}
                                                onClick={() => {
                                                    fetchPlaceDetails(s.place_id, (place) => {
                                                        setLocationField(place.formatted_address.locationName || place.name);
                                                        clearSuggestions();
                                                        setIsUserTyping(false);
                                                        if (place.geometry) {
                                                            const loc = {
                                                                lat: place.geometry.location.lat(),
                                                                lng: place.geometry.location.lng(),
                                                            };
                                                            const addressData = parseAddressComponents(place.address_components || []);

                                                            const locationFormat = {
                                                                coordinates: {
                                                                    latitude: loc.lat,
                                                                    longitude: loc.lng,
                                                                },
                                                                locationName: place.name || place.formatted_address,
                                                                address: place.formatted_address || "",
                                                                ...addressData,
                                                            };

                                                            setLocationFieldForUi(locationFormat);
                                                            setMapCenter(loc);    // Option
                                                        }
                                                    });
                                                }}
                                            >
                                                {s.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {validationErrors.locationField && <span className="error">{validationErrors.locationField}</span>}
                        </div>
                        <div className="ofcvs_form_item">
                            <label>Address</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="E 23fC" value={address}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setAddress(value);
                                        if (validationErrors.address) {
                                            setValidationErrors(prev => ({ ...prev, address: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.address &&
                                (
                                    <span className={`error ${validationErrors.address ? '' : 'd-none'}`}>{validationErrors.address}</span>
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
                                    <option value='india'>India</option>
                                    <option value='america'>America</option>
                                </select>
                            </div>
                            {validationErrors.country &&
                                (
                                    <span className={`error ${validationErrors.country ? '' : 'd-none'}`}>{validationErrors.country}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <label>City</label>
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setCity(e.target.value);
                                    if (validationErrors.city) {
                                        setValidationErrors(prev => ({ ...prev, city: false }));
                                    }
                                }} value={city}>
                                    <option value=''>Select City</option>
                                    <option value='chandigarh'>Chandigarh</option>
                                    <option value='panchkula'>Panchkula</option>
                                    <option value='shimla'>Shimla</option>
                                </select>
                            </div>
                            {validationErrors.city &&
                                (
                                    <span className={`error ${validationErrors.city ? '' : 'd-none'}`}>{validationErrors.city}</span>
                                )
                            }
                        </div> */}
                        <CountryCityDropdown city={city} country={country} setCity={setCity} setCountry={setCountry} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                        <div className="ofcvs_form_item">
                            <label>Postcode</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="156678C" value={postalCode}
                                    onKeyDown={(e) => {
                                        // Prevent non-numeric key presses
                                        const allowedKeys = [
                                            'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'
                                        ];

                                        // Block if not a digit or allowed key
                                        if (
                                            !/^[0-9]$/.test(e.key) &&
                                            !allowedKeys.includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Remove any non-digit characters (useful for paste)
                                        const numericValue = value.replace(/\D/g, '');

                                        setPostalCode(numericValue);

                                        if (validationErrors.postalCode) {
                                            setValidationErrors(prev => ({ ...prev, postalCode: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.postalCode &&
                                (
                                    <span className={`error ${validationErrors.postalCode ? '' : 'd-none'}`}>{validationErrors.postalCode}</span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div >

            {/* Location detail offcanvas */}
            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1
            } id="locationDetailoffcanvas" aria-labelledby="locationDetailoffcanvasLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Location Detail</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" onClick={handleEditSubmit}>{editLocationLoading ? <PulseLoader size={14} color='#ffffff' /> : 'Save'}</button>
                            <button className="delete_btn">{deleteLocationLoading ? <ClipLoader size={24} color='#ff001d' /> : <img src="/assets/images/trash-icon.svg" alt="Trash" onClick={() => { handleDeleteLocation() }} />}</button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper outline_form_wrapper">
                        <div className="ofcvs_form_item">
                            <label>Location</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Alaska street 3452" value={locationFieldEdit}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setLocationFieldEdit(value);
                                        setIsUserTypingEdit(true)
                                        if (validationErrors.locationFieldEdit) {
                                            setValidationErrors(prev => ({ ...prev, locationFieldEdit: false }));
                                        }
                                    }}
                                    autoComplete="off" />
                            </div>
                            {suggestionsEdit.length > 0 && (
                                <ul className="autocomplete-suggestions">
                                    {suggestionsEdit.map((s) => (
                                        <li
                                            key={s.place_id}
                                            onClick={() => {
                                                fetchPlaceDetailsEdit(s.place_id, (place) => {
                                                    setLocationFieldEdit(place.formatted_address.locationName || place.name);
                                                    clearSuggestionsEdit();
                                                    setIsUserTypingEdit(false);
                                                    if (place.geometry) {
                                                        const loc = {
                                                            lat: place.geometry.location.lat(),
                                                            lng: place.geometry.location.lng(),
                                                        };
                                                        const addressData = parseAddressComponents(place.address_components || []);

                                                        const locationFormat = {
                                                            coordinates: {
                                                                latitude: loc.lat,
                                                                longitude: loc.lng,
                                                            },
                                                            locationName: place.name || place.formatted_address,
                                                            address: place.formatted_address || "",
                                                            ...addressData,
                                                        };

                                                        setLocationFieldEditForUi(locationFormat);
                                                        setMapCenterEdit(loc);    // Option
                                                    }
                                                });
                                            }}
                                        >
                                            {s.description}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {validationErrors.locationFieldEdit &&
                                (
                                    <span className={`error ${validationErrors.locationFieldEdit ? '' : 'd-none'}`}>{validationErrors.locationFieldEdit}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <label>Address</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="E 23fC" value={addressEdit}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setAddressEdit(value);
                                        if (validationErrors.addressEdit) {
                                            setValidationErrors(prev => ({ ...prev, addressEdit: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.addressEdit &&
                                (
                                    <span className={`error ${validationErrors.addressEdit ? '' : 'd-none'}`}>{validationErrors.addressEdit}</span>
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
                                    <option value='America'>America</option>
                                </select>
                            </div>
                            {validationErrors.countryEdit &&
                                (
                                    <span className={`error ${validationErrors.countryEdit ? '' : 'd-none'}`}>{validationErrors.countryEdit}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <label>City</label>
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setCityEdit(e.target.value);
                                    if (validationErrors.cityEdit) {
                                        setValidationErrors(prev => ({ ...prev, cityEdit: false }));
                                    }
                                }} value={cityEdit}>
                                    <option value=''>Select City</option>
                                    <option value='Chandigarh'>Chandigarh</option>
                                    <option value='Panchkula'>Panchkula</option>
                                    <option value='Shimla'>Shimla</option>
                                </select>
                            </div>
                            {validationErrors.cityEdit &&
                                (
                                    <span className={`error ${validationErrors.cityEdit ? '' : 'd-none'}`}>{validationErrors.cityEdit}</span>
                                )
                            }
                        </div> */}

                        <CountryCityDropdown city={cityEdit} country={countryEdit} setCity={setCityEdit} setCountry={setCountryEdit} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                        <div className="ofcvs_form_item">
                            <label>Postcode</label>
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="156678C" value={postalCodeEdit}
                                    onKeyDown={(e) => {
                                        // Prevent non-numeric key presses
                                        const allowedKeys = [
                                            'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'
                                        ];

                                        // Block if not a digit or allowed key
                                        if (
                                            !/^[0-9]$/.test(e.key) &&
                                            !allowedKeys.includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Remove any non-digit characters (useful for paste)
                                        const numericValue = value.replace(/\D/g, '');

                                        setPostalCodeEdit(numericValue);

                                        if (validationErrors.postalCodeEdit) {
                                            setValidationErrors(prev => ({ ...prev, postalCodeEdit: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.postalCodeEdit &&
                                (
                                    <span className={`error ${validationErrors.postalCodeEdit ? '' : 'd-none'}`}>{validationErrors.postalCodeEdit}</span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

export default Location