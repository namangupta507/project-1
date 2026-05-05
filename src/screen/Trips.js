import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import GoogleMaps from '../components/GoogleMaps';
import { useDispatch, useSelector } from 'react-redux';
import { AddTripAPI } from '../redux/actions/trips/AddTripAction';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import { addTripStateReset } from '../redux/slices/trips/AddTripSlice';
import TimePickerComponent from '../components/TimePickerComponent';
import { ClipLoader, PulseLoader } from 'react-spinners';
import { GetTripsApi } from '../redux/actions/trips/GetTripsAction';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import { EditTripAPI } from '../redux/actions/trips/EditTripAction';
import { editTripStateReset } from '../redux/slices/trips/EditTripSlice';
import DatePickerComponent from '../components/DatePickerComponent';
import backend_url from '../services/endpoints';
import { DeleteTripAPI } from '../redux/actions/trips/DeleteTripAction';
import { deleteTripStateReset } from '../redux/slices/trips/DeleteTripSlice';
import Swal from 'sweetalert2';
import MonthYearPickerComponent from '../components/MonthYearPickerComponent';
import { FromInput, ToInput } from '../components/FormInputs';
import { clearSuggestions } from '../hooks/usePlaceAutocomplete';
import { calculateDistanceInMiles, getTravelTime } from '../helpers/utils';
import TagsInput from '../components/TagsInput';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AddTripsToReportAPI } from '../redux/actions/reports/AddTripsAction';
import { add } from 'date-fns';
import { addTripsToReportStateReset } from '../redux/slices/reports/AddTripsSlice';

const Trips = () => {
    // Define columns for table
    const dispatch = useDispatch();// Hook to dispatch actions to Redux store
    const location = useLocation();
    const navigate = useNavigate();

    // Extracting necessary data from Redux store state
    const { response, loading, error } = useSelector((state) => state.addTrip);
    // const { response: odometerReadingResponse, loading: odometerReadigLoading, error: odometerReadingError } = useSelector((state) => state.getReading)
    const { response: getVeiclesResponse, loading: getVehiclesLoading, error: getVehiclesError } = useSelector((state) => state.getVehicles);
    const { response: tripsToReportsResponse, loading: tripsToReportsLoading, error: tripsToReportsError } = useSelector((state) => state.tripsToReport);
    const { response: tripsListingResponse, loading: tripsListingLoading, error: tripsListingError } = useSelector((state) => state.getTrips);
    const { response: updateTripResponse, loading: updateTripLoading, error: updateTripError } = useSelector((state) => state.editTrip);
    const { response: deleteTripResponse, loading: deleteTripLoading, error: deleteTripError } = useSelector((state) => state.deleteTrip);

    const { typeToSend, reportId, checkbox, categoryFromReports, vehicleFromReports, filtersDisable, openOffCanvas } = location?.state || {}
    // const columns = ['From', 'To', 'Distance', 'Date', 'Travel Time', 'Type', 'Potential', 'Map'];

    const baseColumns = ['From', 'To', 'Distance', 'Date', 'Travel Time', 'Type', 'Potential', 'Map'];

    const columns = checkbox ? ['Checkbox', ...baseColumns] : baseColumns;

    // Local state variables to manage form inputs
    const [isAddingTrip, setAddingTrip] = useState(false);
    const [removedImages, setRemovedImages] = useState([]);
    const [tripsToReports, setTripsToReports] = useState([]);

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [fromLocation, setFromLocation] = useState(null); // lat/lng for start
    const [toLocation, setToLocation] = useState(null);

    const [fromLocationEdit, setFromLocationEdit] = useState(null); // lat/lng for start
    const [toLocationEdit, setToLocationEdit] = useState(null);
    const [notes, setNotes] = useState('');
    const [report, setReport] = useState('');

    const [images, setImages] = useState('');

    const [timeFrom, setTimeFrom] = useState(new Date(2023, 0, 1, 9, 0)); // 9:00 AM
    const [timeTo, setTimeTo] = useState(new Date(2023, 0, 1, 17, 0));   // 5:00 PM
    const [errorTime, setErrorTime] = useState('');

    const [date, setDate] = useState('');

    // const [tags, setTags] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [type, setType] = useState('');
    const [vehicle, setVehicle] = useState('');

    const [distance, setDistance] = useState(0);
    const [travelTime, setTravelTime] = useState('');

    const [distanceEdit, setDistanceEdit] = useState(0);
    const [travelTimeEdit, setTravelTimeEdit] = useState('');

    const [selectedTrip, setSelectedTrip] = useState(null);

    // State variables for pagination, data, and filters
    // const [totalPages, setTotalPages] = useState(1);
    // const [limit, setLimit] = useState(5);
    // const [totalItems, setTotalItems] = useState(0);
    // const [currentPage, setCurrentPage] = useState(1);
    const [fromEdit, setFromEdit] = useState('');
    const [toEdit, setToEdit] = useState('');
    const [notesEdit, setNotesEdit] = useState('');
    const [typeEdit, setTypeEdit] = useState('');
    const [vehicleEdit, setVehicleEdit] = useState('');
    const [tagInputEdit, setTagInputEdit] = useState('');
    const [tagsEdit, setTagsEdit] = useState('');
    const [timeFromEdit, setTimeFromEdit] = useState(''); // 9:00 AM
    const [timeToEdit, setTimeToEdit] = useState('');   // 5:00 PM
    const [errorTimeEdit, setErrorTimeEdit] = useState('');
    const [dateEdit, setDateEdit] = useState('');

    const [selectedRows, setSelectedRows] = useState([]);


    const [fileName, setFileName] = useState([]);

    const [activeTab, setActiveTab] = useState('all');

    const [pagination, setPagination] = useState({
        all: { currentPage: 1, limit: 10, totalPages: 1, totalItems: 0 },
        logged: { currentPage: 1, limit: 10, totalPages: 1, totalItems: 0 },
        unlogged: { currentPage: 1, limit: 10, totalPages: 1, totalItems: 0 },
    });

    console.log(selectedTrip, "Selected")

    const [validationErrors, setValidationErrors] = useState('');

    // const [typeFilter, setTypeFilter] = useState('');
    // const [vehicleFilter, setVehicleFilter] = useState('6855303f875c5dba68c16b21');
    // const [searchFilter, setSearchFilter] = useState('');
    // const [dateFilter, setDateFilter] = useState(new Date());

    const [filters, setFilters] = useState({
        all: {
            typeFilter: '',
            vehicleFilter: '',
            searchFilter: '',
            dateFilter: new Date(),
        },
        logged: {
            typeFilter: '',
            vehicleFilter: '',
            searchFilter: '',
            dateFilter: new Date(),
        },
        unlogged: {
            typeFilter: '',
            vehicleFilter: '',
            searchFilter: '',
            dateFilter: new Date(),
        }
    });

    // State for holding trips data
    const [dataList, setDataList] = useState([]);

    // Count number of trips for a particular category (e.g., Personal, Business)
    const getCount = (n) => {
        return dataList?.filter(trip => trip?.categoryId === n).length;
    }

    // Calculate total potential earnings
    const totalPotential = dataList?.reduce((acc, trip) => acc + (Number(trip?.potentialEarnings) || 0), 0);

    // Format as dollar value
    const formattedPotential = totalPotential ? `$${totalPotential?.toFixed(2)}` : 0;

    const filteredTrips = useMemo(() => {
        if (!dataList) return [];

        return dataList.filter(trip => {
            if (activeTab === 'all') return true;
            if (activeTab === 'logged') return trip?.tripType === 'logged';
            if (activeTab === 'unlogged') return trip?.tripType === 'unlogged';
            return true;
        });
    }, [dataList, activeTab]);

    const handleRowCheckboxChange = (rowId) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(rowId)
                ? prevSelected.filter((id) => id !== rowId)
                : [...prevSelected, rowId]
        );
    };

    const handleSelectAll = (checked, tableData) => {
        if (checked) {
            const allIds = tableData.map(row => row._id);
            setSelectedRows(allIds);
        } else {
            setSelectedRows([]);
        }
    };

    const { currentPage, limit } = pagination[activeTab];

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTrips = filteredTrips?.slice(startIndex, endIndex);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [key]: value
            }
        }));
    };

    // Handle page changes in pagination
    // const handlePageChange = (page) => {
    //     setCurrentPage(page);
    // };

    // Paginate the data based on the current page and limit
    const paginatedData = dataList?.slice((currentPage - 1) * limit, currentPage * limit);

    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveBackendImage = (indexToRemove) => {
        setFileName((prev) => {
            const imageToRemove = prev[indexToRemove];

            // If it's a backend image (has filename or no file object), track it
            if (!imageToRemove.file && imageToRemove.name) {
                setRemovedImages((prevRemoved) => [...prevRemoved, imageToRemove.name]);
            }

            // Remove the image from fileName state
            return prev.filter((_, index) => index !== indexToRemove);
        });
    };

    // Handling file input change (for trip images)
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (images.length >= 5) {
            showErrorToast('You can only upload up to 5 images.');
            return;
        }

        updateImages(files);
        if (validationErrors.images) {
            setValidationErrors(prev => ({ ...prev, images: false }));
        }
    };

    const updateImages = (files) => {
        // const imageFiles = files.filter(file =>
        //     ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml', 'image/webp'].includes(file.type)
        // );

        const newPreviews = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages(prev => [...prev, ...newPreviews].slice(0, 10)); // Max 10 images
    };

    const handleEditFileChange = (e) => {
        const files = Array.from(e.target.files);


        if (fileName.length >= 5) {
            showErrorToast('You can only upload up to 5 images.');
            return;
        }

        updateEditImages(files);

        if (validationErrors.fileName) {
            setValidationErrors(prev => ({ ...prev, fileName: false }));
        }
    };

    const updateEditImages = (files) => {
        const newPreviews = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name
        }));

        setFileName(prev => {
            // Filter out duplicates based on name/filename
            const filteredPrev = prev.filter(
                existing =>
                    !newPreviews.some(
                        np => np.name === (existing.name || existing.filename)
                    )
            );

            // Combine old and new, slice max 10
            return [...filteredPrev, ...newPreviews].slice(0, 10);
        });
    };


    console.log(fileName, "file")
    // Handle page change for active tab
    const handlePageChange = (page) => {
        setPagination(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                currentPage: page,
            }
        }));
    };

    // Handle limit change (optional)
    const handleLimitChange = (newLimit) => {
        setPagination(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                limit: newLimit,
                currentPage: 1, // reset page when limit changes
            }
        }));
    };

    // On tab change
    const handleTabChange = (tab) => {

        setActiveTab(tab);
        // optionally reset page for the newly selected tab
        setPagination(prev => ({
            ...prev,
            [tab]: { ...prev[tab], currentPage: 1 }
        }));

        setFilters(prev => ({
            ...prev,
            [tab]: {
                typeFilter: '',
                vehicleFilter: '',
                searchFilter: '',
                dateFilter: new Date()
            }
        }));

    };

    // Form validation to ensure all required fields are filled
    const validateForm = () => {
        const newErrors = {};

        if (!from) {
            newErrors.from = 'From Location is required';
        }

        if (!to) {
            newErrors.to = 'To Location is required';
        }
        if (!vehicle) {
            newErrors.vehicle = 'Vehicle is required';
        }
        if (!type) {
            newErrors.type = 'Category is required';
        }

        if (!notes.trim()) {
            newErrors.notes = 'Notes are required';
        }

        if (!date) {
            newErrors.date = 'Date is required';
        }

        if (!timeFrom) {
            newErrors.timeFrom = 'Time from is required';
        }

        if (!timeTo) {
            newErrors.timeTo = 'Time to is required';
        }
        if (!images || images.length === 0) {
            newErrors.images = "Please upload at least one image.";
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };


    // Form validation to ensure all required fields are filled
    const validateUpdateForm = () => {
        const newErrors = {};

        if (!fromEdit) {
            newErrors.fromEdit = 'From Location is required';
        }

        if (!toEdit) {
            newErrors.toEdit = 'To Location is required';
        }

        if (!vehicleEdit) {
            newErrors.vehicleEdit = 'Vehicle is required';
        }
        if (!typeEdit) {
            newErrors.typeEdit = 'Category is required';
        }

        if (!notesEdit.trim()) {
            newErrors.notesEdit = 'Notes are required';
        }

        if (!dateEdit) {
            newErrors.dateEdit = 'Date is required';
        }

        if (!timeFromEdit) {
            newErrors.timeFromEdit = 'Time from is required';
        }

        if (!timeToEdit) {
            newErrors.timeToEdit = 'Time to is required';
        }

        if (!fileName || fileName.length === 0) {
            newErrors.fileName = "Please upload at least one image.";
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const isTripUpdated = () => {
        const original = selectedTrip || {};

        // Helper to convert Date to time string for comparison
        const formatTime = (date) =>
            date instanceof Date && !isNaN(date.getTime()) ? date.toTimeString().slice(0, 5) : '';

        const isSame =
            fromEdit !== (original.recent.startLocation?.locationName || '') ||
            toEdit !== (original.recent.destinationLocation?.locationName || '') ||
            notesEdit !== (original.recent.notes || '') ||
            typeEdit !== (original.recent.categoryId || '') ||
            vehicleEdit !== (original.recent.vehicleId || '') ||
            dateEdit !== (original.recent.createdAt ? new Date(original.recent.createdAt).toISOString().split('T')[0] : '') ||
            formatTime(timeFromEdit) !== formatTime(new Date(original.recent.startTime)) ||
            formatTime(timeToEdit) !== formatTime(new Date(original.recent.endTime)) ||
            (Array.isArray(tagsEdit)
                ? tagsEdit.join(',').trim()
                : tagsEdit.trim()) !==
            (Array.isArray(original.tags)
                ? original.tags.join(',').trim()
                : (original.tags || '').trim());

        return isSame;
    };

    const handleTripsToReportsSubmit = async () => {
        try {
            await dispatch(AddTripsToReportAPI({ tripIds: selectedRows }, { id: reportId }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleUpdateTrip = async (id) => {
        // if (isTripUpdated()) {
        //     showErrorToast('nothing has been changed');
        //     return;
        // }

        if (!validateUpdateForm()) return;

        const formData = new FormData();

        try {

            fileName.forEach((imgObj, index) => {
                formData.append('tripImages', imgObj.file);
            });
            // const startTime = new Date(`${date}T${timeFrom}`);
            // const endTime = new Date(`${date}T${timeTo}`);
            const parsedDate = new Date(dateEdit); // ✅ Works with "29 July 2025"

            const year = parsedDate.getFullYear();
            const month = parsedDate.getMonth(); // Already 0-indexed
            const day = parsedDate.getDate();

            const startTime = new Date(year, month, day, timeFromEdit.getHours(), timeFromEdit.getMinutes(), timeFromEdit.getSeconds());
            const endTime = new Date(year, month, day, timeToEdit.getHours(), timeToEdit.getMinutes(), timeToEdit.getSeconds());

            // formData.append('coordinates', JSON.stringify(coordinates));
            formData.append('startLocation', JSON.stringify(fromLocationEdit));
            formData.append('destinationLocation', JSON.stringify(toLocationEdit));
            formData.append('categoryId', typeEdit)
            formData.append('vehicleId', vehicleEdit)
            formData.append('notes', notesEdit)
            formData.append('fileName', removedImages)
            formData.append('startTime', startTime.toISOString());
            formData.append('endTime', endTime.toISOString());
            formData.append('distance', Number(distanceEdit));
            // formData.append('tripImages', image)
            formData.append('tags', tagsEdit)

            await dispatch(EditTripAPI(id, formData));

        } catch (error) {
            showErrorToast(error)
        }
    }

    // Function to handle trip addition logic
    const handleAddTrip = async () => {
        if (!validateForm()) return;
        const formData = new FormData();
        try {

            images.forEach((imgObj, index) => {
                formData.append('tripImages', imgObj.file);
            });

            // const startLocation = {
            //     coordinates: { latitude: fromLocation.lat, longitude: fromLocation.lng },
            //     locationName: from,
            //     address: "Start Address",
            //     country: "USA",
            //     city: "New York",
            //     postcode: "10007"
            // };

            // const destinationLocation = {
            //     coordinates: { latitude: toLocation.lat, longitude: toLocation.lng },
            //     locationName: to,
            //     address: "Destination Address",
            //     country: "USA",
            //     city: "Los Angeles",
            //     postcode: "90001"
            // };
            // const startTime = new Date(`${date}T${timeFrom}`);
            // const endTime = new Date(`${date}T${timeTo}`);

            const [year, month, day] = date.split('-');

            const monthIndex = Number(month) - 1; // Subtract 1 here

            const startTime = new Date(year, monthIndex, day, timeFrom.getHours(), timeFrom.getMinutes(), timeFrom.getSeconds());
            const endTime = new Date(year, monthIndex, day, timeTo.getHours(), timeTo.getMinutes(), timeTo.getSeconds());

            if (report) {
                formData.append('reportId', report)
            }

            // formData.append('coordinates', JSON.stringify(coordinates));
            formData.append('startLocation', JSON.stringify(fromLocation));
            formData.append('destinationLocation', JSON.stringify(toLocation));
            formData.append('categoryId', type)
            formData.append('vehicleId', vehicle)
            formData.append('notes', notes)
            formData.append('startTime', startTime.toISOString());
            formData.append('endTime', endTime.toISOString());
            formData.append('distance', Number(distance));
            // formData.append('tripImages', image)
            formData.append('tags', tags)

            await dispatch(AddTripAPI(formData));

        } catch (error) {
            showErrorToast(error)
        }
    }

    // Function to reset the form after successful trip addition
    const resetForm = () => {
        if (
            !from.trim() &&
            !to.trim() &&
            !notes.trim() &&
            !date
        ) {
            Swal.fire({
                icon: 'info',
                title: 'Nothing to reset',
                text: 'All fields are already empty.',
            });
            return; // Exit early
        }
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to reset the added data`,
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
                    setFrom('');
                    setTo('');
                    setNotes('');
                    setImages([]);
                    setTimeFrom(new Date(2023, 0, 1, 9, 0));
                    setTimeTo(new Date(2023, 0, 1, 17, 0));
                    setDate('');
                    setTags('');
                    setType('');
                    setVehicle('');
                    setValidationErrors('');

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }

    const handleDeleteTrip = useCallback(async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete this trip?`,
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
                    await dispatch(DeleteTripAPI({ id }))

                } catch (error) {
                    Swal.fire(error?.response?.message);
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled');
            }
        });
    }, [dispatch]);

    const handleFilterClick = () => {
        const { dateFilter, vehicleFilter, typeFilter, searchFilter } = filters[activeTab];
        const month = dateFilter?.getMonth() + 1;
        const year = dateFilter?.getFullYear();
        // Dispatch API call with all filters
        dispatch(GetTripsApi({
            month,
            year,
            vehicleFilter,
            category: typeFilter,
            search: searchFilter.trim(),
        }));
    };

    const handleExport = () => {
        // Use the current tab's trips data
        const tripsToExport = paginatedTrips; // or use full filtered data if available
        if (!tripsToExport || tripsToExport.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No data to export',
                text: 'There are no trips available to export at the moment.',
                confirmButtonText: 'OK'
            });
            return;
        }
        // Define CSV headers — adjust columns as needed
        const headers = ['Trip ID', 'From', 'To', 'Distance', 'Date', 'Travel Time', 'Type', 'Potential'];
        // Build CSV rows
        const csvRows = [
            headers.join(','), // header row
            ...tripsToExport.map(trip => [
                trip.tripId || '',
                trip.startLocation.address || '',
                trip.destinationLocation.address || '',
                trip.distance || '',
                trip.date || '',
                trip.travelTime || '',
                trip.tripType || '',
                trip.potential || 0
            ].map(cell => `"${cell}"`).join(',')) // quote each cell to handle commas
        ];

        // Combine rows into CSV string
        const csvString = csvRows.join('\n');

        // Create a Blob with CSV data
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // Create a link and trigger download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `trips_export_${activeTab}_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            icon: 'success',
            title: 'Export Successful',
            text: 'Your trips have been exported successfully!',
            timer: 4000,
            showConfirmButton: true,
        });
    };

    useEffect(() => {
        const { dateFilter, vehicleFilter } = filters[activeTab];
        const month = dateFilter?.getMonth() + 1;
        const year = dateFilter?.getFullYear();
        if (checkbox && categoryFromReports && vehicleFromReports) {
            dispatch(GetTripsApi({ category: categoryFromReports, vehicleFilter: vehicleFromReports }));
        } else {
            dispatch(GetTripsApi({ month: month, year: year, vehicleFilter: vehicleFilter }));
        }
    }, [response, updateTripResponse, dispatch, deleteTripResponse, activeTab, checkbox, categoryFromReports, vehicleFromReports])

    // Place inside a useEffect hook in your Trips component
    useEffect(() => {
        const offcanvasElement = document.getElementById('tripDetailoffcanvas');
        if (offcanvasElement) {
            const focusinHandler = (e) => {
                const dialogOpen = document.querySelector('[role="dialog"]');
                if (dialogOpen && !offcanvasElement.contains(e.target)) {
                    e.stopImmediatePropagation(); // prevent Bootstrap's handler from running
                }
            };

            document.addEventListener('focusin', focusinHandler, true);

            return () => {
                document.removeEventListener('focusin', focusinHandler, true);
            };
        }
    }, []);

    // useEffect(() => {
    //     const month = filters[activeTab].dateFilter.getMonth() + 1;
    //     const year = filters[activeTab].dateFilter.getFullYear();
    //     dispatch(GetTripsApi({ month: month, year: year, vehicleFilter: filters[activeTab].vehicleFilter }));
    // }, [response, updateTripResponse, dispatch, deleteTripResponse])

    // Effect to handle response after trip is successfully added
    useEffect(() => {
        if (response) {

            setFrom('');
            setTo('');
            setNotes('');
            setImages([]);
            setTimeFrom(new Date(2023, 0, 1, 9, 0));
            setTimeTo(new Date(2023, 0, 1, 17, 0));
            setDate('');
            setTags('');
            setType('');
            setVehicle('');
            setFilters(prev => ({
                ...prev,
                [activeTab]: {
                    typeFilter: '',
                    vehicleFilter: '',
                    searchFilter: '',
                    dateFilter: new Date()
                }
            }));
            setValidationErrors('');
            showSuccessToast('Trip added successfuly');
            dispatch(addTripStateReset());

            const offcanvasEl = document.getElementById('tripDetailoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
        if (response && reportId) {
            navigate(`/dashboard/reports/detail/${reportId}`, { state: { type: typeToSend } });
        }
    }, [response])

    useEffect(() => {
        if (tripsListingResponse) {
            // setTotalPages(Math.ceil(tripsListingResponse?.data[0]?.days.length / limit)); // Calculate total pages
            // setTotalItems(tripsListingResponse?.data[0]?.days?.length); // Set total number of items
            setDataList(tripsListingResponse?.data); // Set the trips data to state
        }
    }, [tripsListingResponse])

    useEffect(() => {
        const addOffcanvasEl = document.getElementById('tripDetailoffcanvas');

        function handleOffcanvasClose() {


            if (!filtersDisable) {
                setFrom('');
                setTo('');
                setNotes('');
                setImages([]);
                setTimeFrom(new Date(2023, 0, 1, 9, 0));
                setTimeTo(new Date(2023, 0, 1, 17, 0));
                setDate('');
                setTags('');
                setType('');
                setVehicle('');
                setValidationErrors('');
                setFilters(prev => ({
                    ...prev,
                    [activeTab]: {
                        typeFilter: '',
                        vehicleFilter: '',
                        searchFilter: '',
                        dateFilter: new Date()
                    }
                }));
            } else {
                setFrom('');
                setTo('');
                setNotes('');
                setImages([]);
                setTimeFrom(new Date(2023, 0, 1, 9, 0));
                setTimeTo(new Date(2023, 0, 1, 17, 0));
                setDate('');
                setTags('');
                setValidationErrors('');
            }
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
        const offcanvas = document.getElementById('tripDetailoffcanvasedit');

        const handleShow = () => {
            if (selectedTrip) {
                setFromEdit(selectedTrip?.startLocation?.locationName || '');
                // setFromLocationEdit(
                //     {
                //         lat: selectedTrip?.recent?.startLocation?.coordinates?.latitude || 0,
                //         lng: selectedTrip?.recent?.startLocation?.coordinates?.longitude || 0,
                //     } || {}
                // );
                setFromLocationEdit(selectedTrip?.startLocation)
                setToEdit(selectedTrip?.destinationLocation?.locationName || '');
                // setToLocationEdit({
                //     lat: selectedTrip?.recent?.destinationLocation?.coordinates?.latitude || 0,
                //     lng: selectedTrip?.recent?.destinationLocation?.coordinates?.longitude || 0,
                // } || {});
                setToLocationEdit(selectedTrip?.destinationLocation);
                setNotesEdit(selectedTrip?.notes || '');
                setTypeEdit(selectedTrip?.categoryId || '');
                setVehicleEdit(selectedTrip?.vehicleId || '');
                setTagsEdit(selectedTrip?.tags || []);

                const backendFromTime = new Date(selectedTrip?.startTime);
                const backendToTime = new Date(selectedTrip?.endTime);

                setTimeFromEdit(backendFromTime || new Date(2023, 0, 1, 9, 0));
                setTimeToEdit(backendToTime || new Date(2023, 0, 1, 9, 0));
                setDateEdit(selectedTrip?.startTime || '');
                const normalized = selectedTrip?.tripImages.map(img => ({
                    name: img,
                    file: null,
                    url: `${process.env.REACT_APP_API_URL || ''}/public/uploads/${img}`
                }));
                setFileName(normalized)
            }
        };

        offcanvas?.addEventListener('shown.bs.offcanvas', handleShow);

        return () => {
            offcanvas?.removeEventListener('shown.bs.offcanvas', handleShow);
        };
    }, [selectedTrip]);

    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            dispatch(addTripStateReset())

        }
    }, [error])

    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                totalItems: filteredTrips?.length,
                totalPages: Math.ceil(filteredTrips?.length / prev[activeTab].limit) || 1,
            }
        }));
    }, [filteredTrips, activeTab]);

    useEffect(() => {
        if (updateTripResponse) {
            showSuccessToast('Trip updated successfully');
            setSelectedTrip(null);
            dispatch(editTripStateReset());
            const offcanvasEl = document.getElementById('tripDetailoffcanvasedit');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [updateTripResponse])

    useEffect(() => {
        if (deleteTripResponse) {
            showSuccessToast('Trip deleted successfully');
            setSelectedTrip(null);
            dispatch(deleteTripStateReset());
            const offcanvasEl = document.getElementById('tripDetailoffcanvasedit');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [deleteTripResponse])


    console.log(selectedRows, "selectedrows")
    useEffect(() => {
        if (selectedRows?.length > 0) {
            setTripsToReports(selectedRows);
        }
    }, [selectedRows])

    useEffect(() => {
        if (updateTripError) {
            showErrorToast(updateTripError?.data);
            dispatch(editTripStateReset())
        }
    }, [error])

    useEffect(() => {
        if (deleteTripError) {
            showErrorToast(deleteTripError?.data);
            dispatch(deleteTripStateReset())
        }
    }, [deleteTripError])

    useEffect(() => {
        if (fromLocation && toLocation) {
            const distance = calculateDistanceInMiles(
                fromLocation.coordinates.latitude,
                fromLocation.coordinates.longitude,
                toLocation.coordinates.latitude,
                toLocation.coordinates.longitude
            );
            setDistance(distance); // You can store this in a useState
        }
    }, [fromLocation, toLocation]);

    useEffect(() => {
        if (timeFrom && timeTo) {
            const totalTime = getTravelTime(timeFrom, timeTo)
            setTravelTime(totalTime);
        }
    }, [timeFrom, timeTo]);

    useEffect(() => {
        if (fromLocationEdit && toLocationEdit) {
            const distance = calculateDistanceInMiles(
                fromLocationEdit.coordinates.latitude,
                fromLocationEdit.coordinates.longitude,
                toLocationEdit.coordinates.latitude,
                toLocationEdit.coordinates.longitude
            );
            setDistanceEdit(distance);
        }
    }, [fromLocationEdit, toLocationEdit]);

    useEffect(() => {
        if (timeFromEdit && timeToEdit) {
            const totalTime = getTravelTime(timeFromEdit, timeToEdit)
            setTravelTimeEdit(totalTime);
        }
    }, [timeFromEdit, timeToEdit]);

    useEffect(() => {
        if (tripsToReportsResponse) {
            // showSuccessToast(tripsToReportsResponse?.message);
            dispatch(addTripsToReportStateReset());
            navigate(`/dashboard/reports/detail/${reportId}`, { state: { type: typeToSend } });
        }
    }, [tripsToReportsResponse])

    useEffect(() => {
        if (tripsToReportsError) {
            showErrorToast(tripsToReportsError?.message);
            dispatch(addTripsToReportStateReset());
        }
    }, [tripsToReportsError])

    useEffect(() => {
        if (reportId) {
            setReport(reportId);
        }
        if (categoryFromReports) {
            setType(categoryFromReports)
            handleFilterChange('typeFilter', categoryFromReports)
        }
        if (vehicleFromReports) {
            setVehicle(vehicleFromReports)
            handleFilterChange('vehicleFilter', vehicleFromReports)
        }
    }, [reportId, categoryFromReports, vehicleFromReports])

    useEffect(() => {
        const offcanvasEl = document.getElementById('tripDetailoffcanvas');
        if (offcanvasEl && window.bootstrap && openOffCanvas) {
            const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
            bsOffcanvas.show();
        }
    }, [openOffCanvas]);

    return (

        <>
            <div className="content-wrapper">
                <div className={`breadcrumb_wrapper mt-2 ${!filtersDisable ? 'd-none' : ''}`}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-header">
                                    <nav className="breadcrumb_nav">
                                        <ul className="breadcrumb mb-0">
                                            <li className="breadcrumb-item"><Link to='/dashboard/reports'>Report</Link></li>
                                            <li className="breadcrumb-item">
                                                <Link
                                                    to={`/dashboard/reports/detail/${reportId}`}
                                                    state={{ type: typeToSend }}
                                                >
                                                    Report Detail</Link></li>
                                            <li className="breadcrumb-item text-capitalize">{reportId}</li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="main-section spacer-y">
                    <div className="container">
                        <div className="row gy-4">
                            <div className="col-xl-12">
                                <div className="common_main_heading_wrapper">
                                    <h1>Trips</h1>
                                    {
                                        !filtersDisable &&
                                        <div className="d-flex flex-end gap-3">
                                            <button className="primary-btn" data-bs-toggle="offcanvas" data-bs-target="#tripDetailoffcanvas" aria-controls="tripDetailoffcanvas">+Add Trips</button>
                                        </div>
                                    }
                                    {
                                        filtersDisable &&
                                        <div className="d-flex flex-end gap-3">
                                            <button className="primary-btn" data-bs-toggle="offcanvas" data-bs-target="#tripDetailoffcanvas" aria-controls="tripDetailoffcanvas">+Add New Trip</button>
                                            <button className="primary-btn" type='button' onClick={handleTripsToReportsSubmit} disabled={selectedRows?.length === 0} style={{
                                                cursor: selectedRows.length === 0 ? 'not-allowed' : 'pointer'
                                            }}>{tripsToReportsLoading ? <PulseLoader color='#ffffff' size={16} /> : '+Add Trips To Report'}</button>
                                        </div>
                                    }
                                </div>
                                <div className="cta-blk">
                                    <h2 className="fs-4 fw-medium text-black">20 free trips remaining.</h2>
                                    <p>Never miss a mile with unlimited automatic trip tracking</p>
                                    <a href="#" className="primary-btn text-transform-uppercase d-inline-block" style={{ cursor: 'not-allowed' }} onClick={(e) => e.preventDefault()}>UPGRADE TO PREMIUM</a>
                                </div>
                                <div className="common-card">
                                    <div className="common_stats">
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{getCount('67650053bd020f2a50f1c162') || 0}</span>
                                            <h2>Personal</h2>
                                        </div>
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{getCount('6765006fbd020f2a50f1c169') || 0}</span>
                                            <h2>Business</h2>
                                        </div>
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{getCount('6765007dbd020f2a50f1c16d') || 0}</span>
                                            <h2>Charity</h2>
                                        </div>
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{getCount('67650085bd020f2a50f1c171') || 0}</span>
                                            <h2>Medical</h2>
                                        </div>
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{formattedPotential || 0}</span>
                                            <h2>Potential</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="common_sub_heading_wrapper">
                                    <h2>Trips</h2>
                                </div>
                                <ul className="common_nav_tab nav nav-pills mb-3 gap-1" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} onClick={() => handleTabChange('all')} id="pills-1-tab" data-bs-toggle="pill" data-bs-target="#pills-1" type="button" role="tab" aria-controls="pills-1" aria-selected="true">All</button>
                                    </li>
                                    {!filtersDisable &&
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeTab === 'logged' ? 'active' : ''}`}
                                                onClick={() => handleTabChange('logged')} id="pills-2-tab" data-bs-toggle="pill" data-bs-target="#pills-2" type="button" role="tab" aria-controls="pills-2" aria-selected="false">Logged</button>
                                        </li>
                                    }
                                    {!filtersDisable &&
                                        <li className="nav-item" role="presentation">
                                            <button className={`nav-link ${activeTab === 'unlogged' ? 'active' : ''}`}
                                                onClick={() => handleTabChange('unlogged')} id="pills-3-tab" data-bs-toggle="pill" data-bs-target="#pills-3" type="button" role="tab" aria-controls="pills-3" aria-selected="false">Unlogged</button>
                                        </li>
                                    }
                                </ul>
                                <div className="tab-content common_tab_content" id="pills-tabContent">
                                    <div className={`tab-pane fade ${activeTab === 'all' ? 'show active' : ''}`} id="pills-1" role="tabpanel" aria-labelledby="pills-1-tab" tabindex="0">

                                        <div className="common-table-filter-wrapper">
                                            <div className="common-left-blk">
                                                <div className="common-sort-blk">

                                                    <select id className="form-select" value={filters[activeTab].typeFilter}
                                                        onChange={(e) => handleFilterChange('typeFilter', e.target.value)} disabled={filtersDisable}>
                                                        <option value=''>Select Category</option>
                                                        <option value='67650053bd020f2a50f1c162'>Personal</option>
                                                        <option value='6765006fbd020f2a50f1c169'>Business</option>
                                                        <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                                        <option value='67650085bd020f2a50f1c171'>Medical</option>
                                                    </select>

                                                    <select className="form-select"
                                                        value={filters[activeTab].vehicleFilter}
                                                        onChange={(e) => handleFilterChange('vehicleFilter', e.target.value)} disabled={filtersDisable}
                                                    >
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

                                                    {
                                                        !filtersDisable &&

                                                        <div className="common-search-blk">
                                                            <input type="search" className="form-control" id="search" value={filters[activeTab].searchFilter} placeholder="Search" onKeyDown={(e) => {

                                                                if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                                onChange={(e) => handleFilterChange('searchFilter', e.target.value)} />
                                                        </div>
                                                    } {
                                                        !filtersDisable &&
                                                        <button className="filter_action_btn cal_btn">
                                                            <MonthYearPickerComponent date={filters[activeTab].dateFilter}
                                                                onChangeDate={(date) => handleFilterChange('dateFilter', date)} />
                                                        </button>
                                                    }
                                                    {
                                                        !filtersDisable &&
                                                        <button className="primary-btn" onClick={handleFilterClick}>Apply</button>
                                                    }
                                                </div>
                                            </div>
                                            {!filtersDisable &&
                                                <div className="common-right-blk">
                                                    {/* <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button> */}

                                                    <button className="filter_action_btn export_btn" onClick={handleExport}>Export</button>
                                                </div>
                                            }
                                        </div>

                                        {
                                            tripsListingLoading
                                                ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : tripsListingError ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <>
                                                        <Table
                                                            tableData={paginatedTrips}
                                                            setDataList={setDataList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                            targetId={'tripDetailoffcanvasedit'}
                                                            setSelectedTrip={setSelectedTrip}
                                                            selectedRows={columns.includes('Checkbox') ? selectedRows : undefined}
                                                            setSelectedRows={columns.includes('Checkbox') ? setSelectedRows : undefined}
                                                            handleSelectAll={columns.includes('Checkbox') ? handleSelectAll : undefined}
                                                            handleRowCheckboxChange={columns.includes('Checkbox') ? handleRowCheckboxChange : undefined}
                                                        />
                                                        {dataList?.length > 0 &&
                                                            <Pagination
                                                                currentPage={pagination[activeTab].currentPage}
                                                                totalPages={pagination[activeTab].totalPages}
                                                                limit={pagination[activeTab].limit}
                                                                totalItems={pagination[activeTab].totalItems}
                                                                handlePageChange={handlePageChange}
                                                                handleLimitChange={handleLimitChange}
                                                            />
                                                        }

                                                    </>
                                        }
                                    </div>
                                    {/* <div className="tab-pane fade" id="pills-2" role="tabpanel" aria-labelledby="pills-2-tab" tabindex="0"> */}
                                    <div className={`tab-pane fade ${activeTab === 'logged' ? 'show active' : ''}`} id="pills-2" role="tabpanel" aria-labelledby="pills-2-tab" tabindex="0">
                                        <div className="common-table-filter-wrapper">
                                            <div className="common-left-blk">
                                                <div className="common-sort-blk">
                                                    <select id className="form-select" value={filters[activeTab].typeFilter}
                                                        onChange={(e) => handleFilterChange('typeFilter', e.target.value)}>
                                                        <option value=''>Select Category</option>
                                                        <option value='67650053bd020f2a50f1c162'>Personal</option>
                                                        <option value='6765006fbd020f2a50f1c169'>Business</option>
                                                        <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                                        <option value='67650085bd020f2a50f1c171'>Medical</option>
                                                    </select>
                                                    <select className="form-select"
                                                        value={filters[activeTab].vehicleFilter}
                                                        onChange={(e) => handleFilterChange('vehicleFilter', e.target.value)}
                                                    >
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
                                                    <div className="common-search-blk">
                                                        <input type="search" className="form-control" id="search" value={filters[activeTab].searchFilter} placeholder="Search" onKeyDown={(e) => {

                                                            if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                            onChange={(e) => handleFilterChange('searchFilter', e.target.value)} />
                                                    </div>
                                                    <button className="filter_action_btn cal_btn">
                                                        <MonthYearPickerComponent date={filters[activeTab].dateFilter}
                                                            onChangeDate={(date) => handleFilterChange('dateFilter', date)} />
                                                    </button>
                                                    <button className="primary-btn" onClick={handleFilterClick}>Apply</button>
                                                </div>
                                            </div>
                                            <div className="common-right-blk">
                                                {/* <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button> */}

                                                <button className="filter_action_btn export_btn" onClick={handleExport}>Export</button>
                                            </div>
                                        </div>

                                        {
                                            tripsListingLoading
                                                ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : tripsListingError ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <>
                                                        <Table
                                                            tableData={paginatedTrips}
                                                            setDataList={setDataList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                            targetId={'tripDetailoffcanvasedit'}
                                                            setSelectedTrip={setSelectedTrip}
                                                        />
                                                        {dataList?.length > 0 &&
                                                            <Pagination
                                                                currentPage={pagination[activeTab].currentPage}
                                                                totalPages={pagination[activeTab].totalPages}
                                                                limit={pagination[activeTab].limit}
                                                                totalItems={pagination[activeTab].totalItems}
                                                                handlePageChange={handlePageChange}
                                                                handleLimitChange={handleLimitChange}
                                                            />
                                                        }

                                                    </>
                                        }
                                    </div>
                                    {/* </div> */}
                                    {/* <div className="tab-pane fade" id="pills-3" role="tabpanel" aria-labelledby="pills-3-tab" tabindex="0"> */}
                                    <div className={`tab-pane fade ${activeTab === 'unlogged' ? 'show active' : ''}`} id="pills-3" role="tabpanel" aria-labelledby="pills-3-tab" tabindex="0">
                                        <div className="common-table-filter-wrapper">
                                            <div className="common-left-blk">
                                                <div className="common-sort-blk">
                                                    <select id className="form-select" value={filters[activeTab].typeFilter}
                                                        onChange={(e) => handleFilterChange('typeFilter', e.target.value)}>
                                                        <option value=''>Select Category</option>
                                                        <option value='67650053bd020f2a50f1c162'>Personal</option>
                                                        <option value='6765006fbd020f2a50f1c169'>Business</option>
                                                        <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                                        <option value='67650085bd020f2a50f1c171'>Medical</option>
                                                    </select>
                                                    <select className="form-select"
                                                        value={filters[activeTab].vehicleFilter}
                                                        onChange={(e) => handleFilterChange('vehicleFilter', e.target.value)}
                                                    >
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
                                                    <div className="common-search-blk">
                                                        <input type="search" className="form-control" id="search" value={filters[activeTab].searchFilter} placeholder="Search" onKeyDown={(e) => {

                                                            if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                            onChange={(e) => handleFilterChange('searchFilter', e.target.value)} />
                                                    </div>
                                                    <button className="filter_action_btn cal_btn">
                                                        <MonthYearPickerComponent date={filters[activeTab].dateFilter}
                                                            onChangeDate={(date) => handleFilterChange('dateFilter', date)} />
                                                    </button>
                                                    <button className="primary-btn" onClick={handleFilterClick}>Apply</button>
                                                </div>
                                            </div>
                                            <div className="common-right-blk">
                                                {/* <button className="filter_action_btn cal_btn">Jun 18, 2025 - Jun 23, 2025</button> */}

                                                <button className="filter_action_btn export_btn" onClick={handleExport}>Export</button>
                                            </div>
                                        </div>

                                        {
                                            tripsListingLoading
                                                ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div >
                                                ) : tripsListingError ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <>
                                                        <Table
                                                            tableData={paginatedTrips}
                                                            setDataList={setDataList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                            targetId={'tripDetailoffcanvasedit'}
                                                            setSelectedTrip={setSelectedTrip}

                                                        />
                                                        {dataList?.length > 0 &&
                                                            <Pagination
                                                                currentPage={pagination[activeTab].currentPage}
                                                                totalPages={pagination[activeTab].totalPages}
                                                                limit={pagination[activeTab].limit}
                                                                totalItems={pagination[activeTab].totalItems}
                                                                handlePageChange={handlePageChange}
                                                                handleLimitChange={handleLimitChange}
                                                            />
                                                        }

                                                    </>
                                        }
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
            </div >

            {/* add trip canvas */}
            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1} id="tripDetailoffcanvas" aria-labelledby="tripDetailoffcanvasLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => setValidationErrors('')} />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Add Trip</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" type='button' onClick={() => handleAddTrip()}>{loading ? <PulseLoader color="#ffffff" /> : "Save"}</button>
                            {/* <button className="delete_btn" type='button' onClick={() => resetForm()}><img src="/assets/images/trash-icon.svg" alt="Trash" /></button> */}
                        </div>
                    </div>
                    <div className="canvas_map_blk">
                        <GoogleMaps
                            fromLocation={fromLocation}
                            toLocation={toLocation}
                        />
                        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193596.26002806186!2d-74.14431244705199!3d40.697284634899496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1751379863355!5m2!1sen!2sin" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> */}

                    </div>
                    <div className="common-card mt-4">
                        <div className="common_stats">
                            <div className="common_stats_item">
                                <span className="common_stats_value">{distance}</span>
                                <h2>Miles</h2>
                            </div>
                            <div className="common_stats_item">
                                <span className="common_stats_value">$0.00</span>
                                <h2>Potential</h2>
                            </div>
                            <div className="common_stats_item">
                                <span className="common_stats_value">{travelTime}</span>
                                <h2>Travel Time</h2>
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper">
                        <FromInput from={from} setFrom={setFrom} validationErrors={validationErrors} setValidationErrors={setValidationErrors} setFromLocation={setFromLocation} />
                        <ToInput to={to} setTo={setTo} validationErrors={validationErrors} setValidationErrors={setValidationErrors} setToLocation={setToLocation} />

                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/briefcase-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setType(e.target.value);
                                    if (validationErrors.type) {
                                        setValidationErrors(prev => ({ ...prev, type: false }));
                                    }
                                }} value={type} disabled={!!categoryFromReports} >
                                    <option value=''>Select Type</option>
                                    <option value='67650053bd020f2a50f1c162'>Personal</option>
                                    <option value='6765006fbd020f2a50f1c169'>Business</option>
                                    <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                    <option value='67650085bd020f2a50f1c171'>Medical</option>
                                </select>
                            </div>
                        </div>
                        {validationErrors.type &&
                            (
                                <span className={`error ${validationErrors.type ? '' : 'd-none'}`}>{validationErrors.type}</span>
                            )
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/car-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select className="form-select" onChange={(e) => {
                                    setVehicle(e.target.value);
                                    if (validationErrors.vehicle) {
                                        setValidationErrors(prev => ({ ...prev, vehicle: false }));
                                    }
                                }} value={vehicle} disabled={!!vehicleFromReports} >
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
                        </div>
                        {validationErrors.vehicle &&
                            (
                                <span className={`error ${validationErrors.vehicle ? '' : 'd-none'}`}>{validationErrors.vehicle}</span>
                            )
                        }
                        {reportId &&
                            <div className="ofcvs_form_item">
                                <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/reports-icon.svg)' }} />
                                <div className="ofcvs_form_field">
                                    <input type="text" className="form-control" placeholder="Report" value={report}
                                        onKeyDown={(e) => {

                                            if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                e.preventDefault();
                                            }
                                        }} disabled={!!reportId}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setReport(value);
                                        }} />
                                </div>
                            </div>
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/notes-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Notes" value={notes}
                                    onKeyDown={(e) => {

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
                        {/* <div className="ofcvs_form_item">
                            <div className="hstack gap-2">
                                <div className="ofcvs_flex_item">
                                    <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/clock-icon.svg)' }} />
                                    <div className="ofcvs_form_field">
                                        <input type="text" className="form-control" id="timeFrom" placeholder="From" value={timeFrom}
                                        />
                                    </div>

                                </div>

                                <div className="ofcvs_flex_item">
                                    <span>To</span>
                                </div>
                                <div className="ofcvs_flex_item">
                                    <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/clock-icon.svg)' }} />
                                    <div className="ofcvs_form_field">
                                        <input type="text" className="form-control" id="timeTo" placeholder="To" value={timeTo}
                                        />
                                    </div>
                                </div>
                                <span id='toError'></span>
                            </div>
                        </div> */}
                        <TimePickerComponent setTimeFrom={setTimeFrom} timeFrom={timeFrom} timeTo={timeTo} setTimeTo={setTimeTo} errorTime={errorTime} setErrorTime={setErrorTime} />
                        {/* <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/cal-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Date" id='date' value={date}
                                />
                                
                            </div>

                        </div> */}

                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/cal-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <DatePickerComponent date={date} setDate={setDate} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                            </div>
                        </div>
                        {validationErrors.date &&
                            (
                                <span className={`error ${validationErrors.date ? '' : 'd-none'}`}>{validationErrors.date}</span>
                            )
                        }
                        {/* <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/tags-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Tags" value={tags} onKeyDown={(e) => {

                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                        e.preventDefault();
                                    }
                                }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setTags(value);
                                    }} />
                            </div>
                        </div> */}
                        <TagsInput tags={tags} tagInput={tagInput} setTags={setTags} setTagInput={setTagInput} />
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/attach-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="file" className="d-none" id="attachment" multiple accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml" onChange={handleFileChange} />
                                <label htmlFor="attachment">
                                    {/* <span><img src='/assets/images/upload-icon.svg' /></span>
                                    <span>Drag or drop here</span>
                                    <span>or</span>
                                    <span className='primary_text'>Browse</span> */}
                                    {!(images.length > 0) &&
                                        <span className="attach_file_placeholder">Upload here</span>
                                    }
                                    {Array.isArray(images) && images.length > 0 && (
                                        images.map((file, index) => (
                                            <span key={index} className="attach_file_preview">{file.url}</span>
                                        ))
                                    )}
                                </label>
                            </div>


                        </div>
                        {validationErrors.images &&
                            (
                                <span className={`error ${validationErrors.images ? '' : 'd-none'}`}>{validationErrors.images}</span>
                            )
                        }
                        <div className='image-preview-list mt-3 d-flex flex-wrap gap-2'>
                            {Array.isArray(images) && images.length > 0 && (
                                images.map((file, index) => {
                                    return (
                                        <div key={index} className='preview-img-box position-relative'>
                                            <img
                                                src={file.url}
                                                alt={`preview-${index}`}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd',
                                                }}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => handleRemoveImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-6px',
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )

                                }))}
                        </div>
                    </div>
                </div>
            </div >


            {/* view and edit canvas */}

            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1
            } id="tripDetailoffcanvasedit" aria-labelledby="tripDetailoffcanvasEditLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => setValidationErrors('')} />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Trip Details</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" type='button' onClick={() => handleUpdateTrip(selectedTrip._id)}>{updateTripLoading ? <PulseLoader color="#ffffff" /> : "Save"}</button>
                            <button className="delete_btn" type='button' onClick={() => handleDeleteTrip(selectedTrip._id)}>{deleteTripLoading ? <ClipLoader color="#ff132e" size={24} /> : <img src="/assets/images/trash-icon.svg" alt="Trash" />}</button>
                        </div>
                    </div>
                    <div className="canvas_map_blk">
                        <GoogleMaps
                            fromLocation={fromLocationEdit}
                            toLocation={toLocationEdit}
                        />
                        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193596.26002806186!2d-74.14431244705199!3d40.697284634899496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1751379863355!5m2!1sen!2sin" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> */}

                    </div>
                    <div className="common-card mt-4">
                        <div className="common_stats">
                            <div className="common_stats_item">
                                <span className="common_stats_value">{distanceEdit}</span>
                                <h2>Miles</h2>
                            </div>
                            <div className="common_stats_item">
                                <span className="common_stats_value">$0.00</span>
                                <h2>Potential</h2>
                            </div>
                            <div className="common_stats_item">
                                <span className="common_stats_value">{travelTimeEdit}</span>
                                <h2>Travel Time</h2>
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper">
                        <FromInput from={fromEdit} setFrom={setFromEdit} validationErrors={validationErrors} setValidationErrors={setValidationErrors} setFromLocation={setFromLocationEdit} />
                        <ToInput to={toEdit} setTo={setToEdit} validationErrors={validationErrors} setValidationErrors={setValidationErrors} setToLocation={setToLocationEdit} />
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/briefcase-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setTypeEdit(e.target.value);
                                    if (validationErrors.typeEdit) {
                                        setValidationErrors(prev => ({ ...prev, typeEdit: false }));
                                    }
                                }} value={typeEdit}>
                                    <option value=''>Select Type</option>
                                    <option value='67650053bd020f2a50f1c162'>Personal</option>
                                    <option value='6765006fbd020f2a50f1c169'>Business</option>
                                    <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                    <option value='67650085bd020f2a50f1c171'>Medical</option>
                                </select>
                            </div>
                        </div>
                        {validationErrors.typeEdit &&
                            (
                                <span className={`error ${validationErrors.typeEdit ? '' : 'd-none'}`}>{validationErrors.typeEdit}</span>
                            )
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/car-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setVehicleEdit(e.target.value);
                                    if (validationErrors.vehicleEdit) {
                                        setValidationErrors(prev => ({ ...prev, vehicleEdit: false }));
                                    }
                                }} value={vehicleEdit}>
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
                        </div>
                        {validationErrors.vehicleEdit &&
                            (
                                <span className={`error ${validationErrors.vehicleEdit ? '' : 'd-none'}`}>{validationErrors.vehicleEdit}</span>
                            )
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/notes-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Notes" value={notesEdit}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNotesEdit(value);
                                        if (validationErrors.notesEdit) {
                                            setValidationErrors(prev => ({ ...prev, notesEdit: false }));
                                        }
                                    }} />
                            </div>
                        </div>
                        {validationErrors.notesEdit &&
                            (
                                <span className={`error ${validationErrors.notesEdit ? '' : 'd-none'}`}>{validationErrors.notesEdit}</span>
                            )
                        }
                        <TimePickerComponent setTimeFrom={setTimeFromEdit} timeFrom={timeFromEdit} timeTo={timeToEdit} setTimeTo={setTimeToEdit} errorTime={errorTimeEdit} setErrorTime={setErrorTimeEdit} />
                        {/* <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/cal-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Date" id='editdate' value={dateEdit}
                                />
                            </div>

                        </div> */}
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/cal-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <DatePickerComponent date={dateEdit} setDate={setDateEdit} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                            </div>
                        </div>
                        {validationErrors.dateEdit &&
                            (
                                <span className={`error ${validationErrors.dateEdit ? '' : 'd-none'}`}>{validationErrors.dateEdit}</span>
                            )
                        }

                        {/* <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/tags-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Tags" value={Array.isArray(tagsEdit) ? tagsEdit.join(', ') : tagsEdit} onKeyDown={(e) => {

                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                        e.preventDefault();
                                    }
                                }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setTagsEdit(value);
                                    }} />
                            </div>
                        </div> */}
                        <TagsInput tags={tagsEdit} tagInput={tagInputEdit} setTags={setTagsEdit} setTagInput={setTagInputEdit} />
                        {/* <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/attach-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="file" className="form-control" accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml" onChange={handleFileChange} />
                                {fileName.length > 0 && (
                                    <div className="text-muted mt-1">
                                        Uploaded files:
                                        <ul className="mb-0 mt-1">
                                            {fileName.map((file, index) => (
                                                <li key={index}>
                                                    <strong>{file.name || file}</strong>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>)
                                }
                            </div>
                        </div> */}
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/attach-icon.svg)' }} />
                            <div className="ofcvs_form_field">

                                <input type="file" className='d-none' id="attachment1" multiple accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml" onChange={handleEditFileChange} />
                                <label htmlFor="attachment1">
                                    {!(fileName.length > 0) &&
                                        <span className="attach_file_placeholder">Upload here</span>
                                    }
                                    {Array.isArray(fileName) && fileName.length > 0 && (
                                        fileName.map((file, index) => (
                                            <span key={index} className="attach_file_preview">{file.url}</span>
                                        ))
                                    )}
                                </label>
                            </div>
                        </div>
                        {validationErrors.fileName &&
                            (
                                <span className={`error ${validationErrors.fileName ? '' : 'd-none'}`}>{validationErrors.fileName}</span>
                            )
                        }
                        <div className='image-preview-list mt-3 d-flex flex-wrap gap-2'>
                            {Array.isArray(fileName) && fileName.length > 0 && (
                                fileName.map((file, index) => {
                                    return (
                                        <div key={index} className='preview-img-box position-relative'>
                                            <img
                                                src={file.url.startsWith('blob:') || file.url.startsWith('http')
                                                    ? file.url
                                                    : `${backend_url}/${file.url}`}
                                                alt={`preview-${index}`}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd',
                                                }}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => handleRemoveBackendImage(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-6px',
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '12px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )

                                }))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Trips