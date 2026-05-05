import React, { useContext, useEffect, useState } from 'react'
import usePlaceAutocomplete from '../../hooks/usePlaceAutocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { AddPlacesAPI } from '../../redux/actions/teams/places/AddPlacesAction';
import { showErrorToast, showSuccessToast } from '../../helpers/toast';
import { addPlacesStateReset } from '../../redux/slices/teams/places/AddPlacesSlice';
import { PulseLoader } from 'react-spinners';
import { GetPlacessApi } from '../../redux/actions/teams/places/GetPlacesAction';
import { useEventCallback } from '@mui/material';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { AuthContext } from '../../context/AuthContext';
import { UploadMultipleAPI } from '../../redux/actions/teams/places/UploadMultipleAction';
import Papa from 'papaparse';
import { uploadMultipleStateReset } from '../../redux/slices/teams/places/UploadMultipleSlice';
import GoogleMaps from '../../components/GoogleMaps';

const Places = () => {
    const columns = ['Place Name', 'Street Address', 'City']
    const dispatch = useDispatch();
    const [locationField, setLocationField] = useState('');
    const [isUserTyping, setIsUserTyping] = useState(false);
    const [locationFieldForUi, setLocationFieldForUi] = useState(null);
    const [validationErrors, setValidationErrors] = useState('');
    const [placeName, setPlaceName] = useState('');
    const [notes, setNotes] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLImit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [search, setSearch] = useState('');
    const [placesList, setPlacesList] = useState([]);
    const { parentTeamId } = useContext(AuthContext);
    const [csvPreviews, setCsvPreviews] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const { suggestions, fetchPlaceDetails, mapCenter, setMapCenter, clearSuggestions } = usePlaceAutocomplete(locationField, isUserTyping);
    const { response, loading, error } = useSelector((state) => state.addPlace);
    const { response: placesListResponse, loading: placesListLoading, error: placesListError } = useSelector((state) => state.placesList);
    const { response: uploadMulitpleResponse, loading: uploadMulitpleLoading, error: uploadMulitpleError } = useSelector((state) => state.placesUploadMultiple);

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

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleLimitChange = (newLimit) => {
        setLImit(newLimit);
        setCurrentPage(1);
    }

    const validateForm = () => {
        const newErrors = {};

        if (!locationField) {
            newErrors.locationField = 'Location is required';
        }
        if (!placeName) {
            newErrors.placeName = 'Place name is required';
        }
        if (!notes) {
            newErrors.notes = 'Notes are required';
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            await dispatch(AddPlacesAPI({ placeName: placeName, address: locationField, city: locationFieldForUi?.city || '', teamId: parentTeamId }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const REQUIRED_HEADERS = [
        "place_name",
        "street_address",
        "city",
        "state",
        "zip code"
    ];

    const handleFilesUpload = (input) => {
        const files = input.target?.files || input;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploadedFile(file); // Save the file

        if (!file.name.toLowerCase().endsWith(".csv")) {
            showErrorToast(`File "${file.name}" is not a CSV file.`);
            setCsvPreviews([]);
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const headers = results.meta.fields.map(h => h.trim().toLowerCase());

                const missingHeaders = REQUIRED_HEADERS.filter(
                    required => !headers.includes(required)
                );

                if (missingHeaders.length > 0) {
                    showErrorToast(
                        `File "${file.name}" is missing required columns: ${missingHeaders.join(", ")}.`
                    );
                    setCsvPreviews([]);
                    return;
                }

                setCsvPreviews([
                    {
                        fileName: file.name,
                        error: null,
                        data: results.data,
                    },
                ]);
            },
            error: (error) => {
                showErrorToast(`Parsing error in file "${file.name}": ${error.message}`);
                setCsvPreviews([]);
            },
        });

        if (input.target) input.target.value = '';
    };


    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesUpload(e.dataTransfer.files[0]); // Pass only the first file
            e.dataTransfer.clearData();
        }
    };

    const handlFileSubmit = async () => {
        if (!uploadedFile) {
            showErrorToast("Please upload a CSV file first.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", uploadedFile);
            await dispatch(UploadMultipleAPI(formData, parentTeamId))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const detailedCsvTemplateData = [
        {
            place_name: "Example Place",
            street_address: "123 Main St",
            city: "Sample City",
            state: "CA",
            "zip code": "90001"
        }
    ];


    const downloadDetailedCSVTemplate = () => {
        const headers = ["place_name", "street_address", "city", "state", "zip code"];

        const rows = detailedCsvTemplateData.map(row =>
            headers.map(field => `"${row[field] || ""}"`).join(",")
        );

        const csvContent = [headers.join(","), ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "detailed_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (parentTeamId) {
            dispatch(GetPlacessApi({ page: currentPage, limit: limit, search: search, id: parentTeamId }))
        }
    }, [response, currentPage, limit, search, uploadMulitpleResponse, parentTeamId])

    useEffect(() => {
        if (placesListResponse) {
            setPlacesList(placesListResponse?.data);
            setCurrentPage(placesListResponse?.pagination?.page);
            setLImit(placesListResponse?.pagination?.limit);
            setTotalPages(placesListResponse?.pagination?.totalPages);
            setTotalItems(placesListResponse?.pagination?.total)
        }
    }, [placesListResponse])


    useEffect(() => {
        if (locationFieldForUi) {
            setPlaceName(locationFieldForUi?.locationName);
        }
    }, [locationFieldForUi])

    useEffect(() => {
        const offcanvas = document.getElementById('addNewTeamPlace');

        const handleRemove = () => {
            setLocationField('');
            setPlaceName('');
            setNotes('');
            setValidationErrors('');
        }

        offcanvas?.addEventListener('hidden.bs.offcanvas', handleRemove);

        return () => {
            offcanvas?.removeEventListener('hidden.bs.offcanvas', handleRemove);
        };
    }, [])

    console.log(placesListResponse, "placesListResponse")
    useEffect(() => {
        if (response) {
            showSuccessToast(response?.message)
            setLocationField('');
            setPlaceName('');
            setNotes('');
            setValidationErrors('');
            dispatch(addPlacesStateReset());
            const offcanvasEl = document.getElementById('addNewTeamPlace');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [response]);

    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            dispatch(addPlacesStateReset());
        }
    }, [error])

    useEffect(() => {
        if (uploadMulitpleResponse) {
            showSuccessToast(uploadMulitpleResponse?.message);
            dispatch(uploadMultipleStateReset());
            const modalEl = document.getElementById('importPlaces');
            if (modalEl && window.bootstrap) {
                const bsOffmodal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal.getInstance(modalEl);
                bsOffmodal.hide();
            }
            setUploadedFile(null);
            setCsvPreviews([]);

            // Clear the file input value to reset the input
            const fileInput = document.getElementById('dragDropFile');
            if (fileInput) {
                fileInput.value = '';
            }
        }
    }, [uploadMulitpleResponse])

    useEffect(() => {
        if (uploadMulitpleError) {
            showErrorToast(uploadMulitpleError?.data);
            dispatch(uploadMultipleStateReset());
        }
    }, [uploadMulitpleError])

    console.log(parentTeamId, "parentTeamId")
    return (
        <>
            {parentTeamId ?
                <>
                    <div className="content-wrapper">
                        {/* <div className="breadcrumb_wrapper spacer-y pb-0">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-header">
                                    <nav className="breadcrumb_nav">
                                        <ul className="breadcrumb mb-0">
                                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                                            <li className="breadcrumb-item"><a href="/">Teams</a></li>
                                            <li className="breadcrumb-item"><a href="/">test</a></li>
                                            <li className="breadcrumb-item text-capitalize">Team Places</li>
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
                                    <div className="col-12">
                                        <div className="common_main_heading_wrapper">
                                            <div className="common-table-filter-wrapper mb-0">
                                                <div className="common-left-blk">
                                                    <div className="common-sort-blk">
                                                        <div className="common-search-blk">
                                                            <input type="search" className="form-control" id="search" placeholder="Search" value={search} onKeyDown={(e) => {

                                                                if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                                onChange={(e) => setSearch(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-end gap-3">
                                                <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addNewTeamPlace" aria-controls="addNewTeamPlace">Add New</button>
                                                <button className="outline-btn" type="button" data-bs-toggle="modal" data-bs-target="#importPlaces" aria-controls="importPlaces">Import Multiple</button>
                                            </div>
                                        </div>
                                        {
                                            placesListLoading
                                                ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : placesListError ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <>
                                                        <Table
                                                            tableData={placesList}
                                                            setDataList={setPlacesList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                        />
                                                        {placesList?.length > 0 &&
                                                            <Pagination
                                                                currentPage={currentPage}
                                                                totalPages={totalPages}
                                                                limit={limit}
                                                                totalItems={totalItems}
                                                                handlePageChange={handlePageChange}
                                                                handleLimitChange={handleLimitChange}
                                                            />
                                                        }

                                                    </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="addNewTeamPlace" aria-labelledby="addNewTeamPlaceLabel">
                        <div className="offcanvas-header">
                            <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => {
                                setLocationField('');
                                setLocationFieldForUi('');
                                setPlaceName('');
                                setNotes('');
                                setValidationErrors('');
                            }} />
                        </div>
                        <div className="offcanvas-body p-0">
                            <div className="offcanvas_top_header px-4 py-3 mb-0">
                                <h2>Create A New Team Place</h2>
                            </div>
                            <div className="canvas_nav_tab_content">
                                {/* <div className="canvas_map_blk">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193596.26002806186!2d-74.14431244705199!3d40.697284634899496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1751379863355!5m2!1sen!2sin" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        </div> */}
                                <GoogleMaps fromLocation={locationFieldForUi} // or whatever the place location is
                                    isSingleLocation={true} />
                                <div className="offcanvas_form_wrapper outline_form_wrapper mt-4">
                                    <div className="ofcvs_form_item">
                                        <label>Address*</label>
                                        <div className="ofcvs_form_field">
                                            <input type="text" className="form-control" placeholder="Search by a place or address" value={locationField}
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
                                                autoComplete="off" />
                                            {suggestions.length > 0 && (
                                                <ul className="autocomplete-suggestions">
                                                    {suggestions.map((s) => (
                                                        <li
                                                            key={s.place_id}
                                                            onClick={() => {
                                                                fetchPlaceDetails(s.place_id, (place) => {
                                                                    console.log(place, "place")
                                                                    setLocationField(place.formatted_address);
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
                                    </div>
                                    {validationErrors.locationField && <span className="error">{validationErrors.locationField}</span>}
                                    <div className="ofcvs_form_item">
                                        <label>Place Name</label>
                                        <div className="ofcvs_form_field">
                                            <input type="text" className="form-control" placeholder="Enter" value={placeName} onKeyDown={(e) => {

                                                if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                    e.preventDefault();
                                                }
                                            }}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setPlaceName(value);
                                                    if (validationErrors.placeName) {
                                                        setValidationErrors(prev => ({ ...prev, placeName: false }));
                                                    }
                                                }} />
                                        </div>
                                    </div>
                                    {validationErrors.placeName &&
                                        (
                                            <span className={`error ${validationErrors.placeName ? '' : 'd-none'}`}>{validationErrors.placeName}</span>
                                        )
                                    }
                                    <div className="ofcvs_form_item">
                                        <label>Notes</label>
                                        <div className="ofcvs_form_field">
                                            <textarea className="form-control" placeholder="Add a note for this place" value={notes} onKeyDown={(e) => {

                                                if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                    e.preventDefault();
                                                }
                                            }}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setNotes(value);
                                                    if (validationErrors.notes) {
                                                        setValidationErrors(prev => ({ ...prev, notes: false }));
                                                    }
                                                }} />
                                        </div>
                                    </div>
                                    {validationErrors.notes &&
                                        (
                                            <span className={`error ${validationErrors.notes ? '' : 'd-none'}`}>{validationErrors.notes}</span>
                                        )
                                    }
                                </div>
                                <div className="d-flex justify-content-end gap-3 mt-4 mt-md-4">
                                    <button className="primary-btn" onClick={handleSubmit}>{loading ? <PulseLoader color='#ffffff' size={14} /> : 'Save'}</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Import Favorite Places Modal */}
                    <div className="modal fade" id="importPlaces" tabIndex={-1} aria-labelledby="importPlacesLabel" data-bs-backdrop="static" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content border-0">
                                <div className="modal-header border-0">
                                    <div>
                                        <h2 className="modal-title fs-5" id="importPlacesLabel">Import Favorite Places</h2>
                                        <p className="mb-0">All coulmn names must be in lower case</p>
                                    </div>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                                        setUploadedFile(null);
                                        setCsvPreviews([]);
                                    }}
                                    />
                                </div>
                                <div className="modal-body py-2">
                                    <div className="hstack justify-content-between flex-wrap align-items-start gap-3">
                                        <div className="multiple_category_blk">
                                            <div className="multiple_category_content">
                                                <p className="text-black">The column names in your file should be exactly as follows:</p>
                                            </div>
                                            <div className="modal_table mt-4 table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>&nbsp;</th>
                                                            <th>A</th>
                                                            <th>B</th>
                                                            <th>C</th>
                                                            <th>D</th>
                                                            <th>E</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th>1</th>
                                                            <td>place_name</td>
                                                            <td>street_address</td>
                                                            <td>city</td>
                                                            <td>state</td>
                                                            <td>zip code</td>
                                                        </tr>
                                                        <tr>
                                                            <th>2</th>
                                                            <td />
                                                            <td />
                                                            <td />
                                                            <td />
                                                            <td />
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="multiple_category_content mt-4">
                                                <ul>
                                                    <li>place_name</li>
                                                    <li>street_address</li>
                                                    <li>city</li>
                                                    <li>state</li>
                                                    <li>zip code</li>
                                                </ul>
                                                <h3 className="fs-12 fw-medium">Optional Columns:</h3>
                                                <ul>
                                                    <li>country (USA, unless specified)</li>
                                                    <li>place_id</li>
                                                    <li>notes</li>
                                                    <li>zip code</li>
                                                </ul>
                                                <p className="download_temp_content">Need Help?  <button className="border-0 p-0 bg-white text-decoration-underline" type='button' onClick={downloadDetailedCSVTemplate}>Download CSV Template</button></p>
                                            </div>
                                        </div>
                                        <div className="modal_upload_file">
                                            <input type="file" className="d-none" id="dragDropFile"
                                                onChange={(e) => handleFilesUpload(e)}
                                            />
                                            <label htmlFor="dragDropFile"
                                                onDragOver={(e) => handleDragOver(e)}
                                                onDragEnter={(e) => handleDragOver(e)}
                                                onDragLeave={(e) => handleDragLeave(e)}
                                                onDrop={(e) => handleDrop(e)} >
                                                <span className="vstack align-items-center gap-1">
                                                    <span><img src="/assets/images/document-upload.png" /></span>
                                                    <span>Drag or drop here</span>
                                                    <span>or</span>
                                                    <span className="text-primary">Browse</span>
                                                </span>
                                                {/* Preview uploaded CSVs */}
                                                {/* <div className="csv-preview mt-4">
                                                        {csvPreviews.length > 0 &&
                                                            csvPreviews.map(({ fileName, data, error }, idx) => (
                                                                <div key={idx} className="mb-4">
                                                                    <h5>{fileName}</h5>
                                                                    {error ? (
                                                                        <p className="text-danger">{error}</p>
                                                                    ) : (
                                                                        <div className="table-responsive">
                                                                            <table className="table table-bordered">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th>place_name</th>
                                                                                        <th>street_address</th>
                                                                                        <th>city</th>
                                                                                        <th>state</th>
                                                                                        <th>zip code</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {data.map((row, i) => (
                                                                                        <tr key={i}>
                                                                                            <td>{row.place_name || ''}</td>
                                                                                            <td>{row.street_address || ''}</td>
                                                                                            <td>{row.city || ''}</td>
                                                                                            <td>{row.state || ''}</td>
                                                                                            <td>{row['zip code'] || ''}</td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                    </div> */}
                                                <div className="csv-preview mt-4">
                                                    {csvPreviews.length > 0 &&
                                                        csvPreviews.map(({ fileName, data, error }, idx) => {
                                                            const columns = data.length > 0 ? Object.keys(data[0]) : [];

                                                            return (
                                                                <div key={idx} className="mb-4">
                                                                    <h5>{fileName}</h5>
                                                                    {error ? (
                                                                        <p className="text-danger">{error}</p>
                                                                    ) : (
                                                                        <div className="table-responsive">
                                                                            <table className="table table-bordered">
                                                                                <thead>
                                                                                    <tr>
                                                                                        {columns.map((col, i) => (
                                                                                            <th key={i}>{col}</th>
                                                                                        ))}
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {data.map((row, rowIndex) => (
                                                                                        <tr key={rowIndex}>
                                                                                            {columns.map((col, colIndex) => (
                                                                                                <td key={colIndex}>{row[col] || ''}</td>
                                                                                            ))}
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                </div>

                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer p-3 border-0">
                                    <button type="button" className="primary-btn m-0" onClick={handlFileSubmit}>{uploadMulitpleLoading ? <PulseLoader size={14} color='#ffffff' /> : 'Upload File'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                :
                <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center' >
                    <PulseLoader size={25} color="#49a496" />
                </div>
            }
        </>
    )
}

export default Places