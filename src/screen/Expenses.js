import React, { useCallback, useEffect, useState } from 'react'
import { GetExpensesApi } from '../redux/actions/expenses/GetExpensesAction';
import { useDispatch, useSelector } from 'react-redux';
import { ClipLoader, PulseLoader } from 'react-spinners';
import Table from '../components/Table';
import Pagination from '../components/Pagination';
import DatePickerComponent from '../components/DatePickerComponent';
import { AddExpenseAPI } from '../redux/actions/expenses/AddExpenseAction';
import { addExpenseStateReset } from '../redux/slices/expenses/AddExpenseSlice';
import { showErrorToast, showSuccessToast } from '../helpers/toast';
import SingleFieldTimePickerComponent from '../components/SingleFieldTimePickerComponent';
import { EditExpenseAPI } from '../redux/actions/expenses/EditExpenseAction';
import { editExpenseStateReset } from '../redux/slices/expenses/EditExpenseSlice';
import Swal from 'sweetalert2';
import { formatDateTime } from '../helpers/dateTime';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AddExpensesToReportAPI } from '../redux/actions/reports/AddExpensesAction';
import { addExpenseToReportsStateReset } from '../redux/slices/reports/AddExpensesSlice';
import MonthYearPickerComponent from '../components/MonthYearPickerComponent';

const Expenses = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { typeToSend, reportId, checkbox, categoryFromReports, vehicleFromReports, filtersDisable, openOffCanvas } = location?.state || {}
    const baseColumns = ['Date & Time', 'Expense Name', 'Merchant Name', 'Amount', 'Notes', 'Actions'];

    const columns = checkbox ? ['Checkbox', ...baseColumns] : baseColumns;

    // const fromReports = location?.state?.fromReports || false;
    const { response, loading, error } = useSelector((state) => state.getExpenses);
    const { response: getVeiclesResponse, loading: getVehiclesLoading, error: getVehiclesError } = useSelector((state) => state.getVehicles);
    const { response: addExpenseResponse, loading: addExpenseLoading, error: addExpenseError } = useSelector((state) => state.addExpense);
    const { response: editExpenseResponse, loading: editExpenseLoading, error: editExpenseError } = useSelector((state) => state.editExpense);
    const { response: expensesToReportResponse, loading: expensesToReportLoading, error: expensesToReportError } = useSelector((state) => state.expensesToReport);

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [dataList, setDataList] = useState([]);

    const [expenseName, setExpenseName] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [vehicle, setVehicle] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState(new Date(2023, 0, 1, 9, 0));
    const [type, setType] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [dateFilter, setDateFilter] = useState(new Date());

    const [images, setImages] = useState('');

    const [expenseNameView, setExpenseNameView] = useState('');
    const [merchantNameView, setMerchantNameView] = useState('');
    const [vehicleView, setVehicleView] = useState('');
    const [amountView, setAmountView] = useState('');
    const [noteView, setNoteView] = useState('');
    const [dateView, setDateView] = useState('');
    const [timeView, setTimeView] = useState('');
    const [typeView, setTypeView] = useState('');
    const [imagesFromBackend, setImagesFromBackend] = useState([]);

    const [expenseNameEdit, setExpenseNameEdit] = useState('');
    const [merchantNameEdit, setMerchantNameEdit] = useState('');
    const [vehicleEdit, setVehicleEdit] = useState('');
    const [amountEdit, setAmountEdit] = useState('');
    const [noteEdit, setNoteEdit] = useState('');
    const [dateEdit, setDateEdit] = useState('');
    const [timeEdit, setTimeEdit] = useState('');
    const [typeEdit, setTypeEdit] = useState('');
    const [imagesEdit, setImagesEdit] = useState('');
    const [removedImages, setRemovedImages] = useState([]);
    // const [filteredExpenses, setFilteredExpenses] = useState([]);

    const [deleted, setDeleted] = useState(false);

    const [typeFilter, setTypeFilter] = useState('');
    const [vehicleFilter, setVehicleFilter] = useState('');
    const [searchFilter, setSearchFilter] = useState('');

    const [report, setReport] = useState('');

    const totalAmount = dataList?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;

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

    const fetchExpenses = useCallback(async (vehicleFilter = '',
        searchFilter = '',
        typeFilter = '',
        month = new Date().getMonth(), year = new Date().getFullYear()) => {
        try {
            if (categoryFromReports && vehicleFromReports && checkbox) {
                await dispatch(GetExpensesApi({
                    page, limit, vehicle: vehicleFromReports,
                    category: categoryFromReports,
                    search: '',
                }))
            } else {
                await dispatch(GetExpensesApi({
                    page, limit, vehicle: vehicleFilter,
                    category: typeFilter,
                    search: searchFilter.trim(),
                    month, year
                }))
            }
        }
        catch (error) {
            console.error("Error fetching expenses:", error);
        }
    }, [page, limit, categoryFromReports, vehicleFromReports]);

    const handleExport = () => {

        const expensesToExport = dataList;
        if (!expensesToExport || expensesToExport.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No data to export',
                text: 'There are no expenses available to export at the moment.',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Define CSV headers — adjust columns as needed
        const headers = ['Expense Id', 'Date & Time', 'Expense Name', 'Merchnt Name', 'Amount', 'Notes'];
        // Build CSV rows
        const csvRows = [
            headers.join(','), // header row
            ...expensesToExport.map((expense, index) => [
                index + 1,
                expense.dateTime ? formatDateTime(expense.dateTime) : '',
                expense.name || '',
                expense.merchantName || '',
                expense.amount ? `$${expense.amount}` : '$0',
                expense.note || ''
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
        link.setAttribute('download', `expenses_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            icon: 'success',
            title: 'Export Successful',
            text: 'Your Expenses have been exported successfully!',
            timer: 4000,
            showConfirmButton: true,
        });
    };

    // Handle page changes in pagination
    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleEditRemoveImage = (indexToRemove) => {
        setImagesEdit((prev) => {
            const imageToRemove = prev[indexToRemove];

            // If it's a backend image (has filename or no file object), track it
            if (!imageToRemove.file && imageToRemove.filename) {
                setRemovedImages((prevRemoved) => [...prevRemoved, imageToRemove.filename]);
            }

            // Remove the image from fileName state
            return prev.filter((_, index) => index !== indexToRemove);
        });
    };

    // Handling file input change (for trip images)
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

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

        updateEditImages(files);

        if (validationErrors.imagesEdit) {
            setValidationErrors(prev => ({ ...prev, imagesEdit: false }));
        }
    };

    const updateEditImages = (files) => {
        const newPreviews = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            name: file.name
        }));

        setImagesEdit(prev => {
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
    // Form validation to ensure all required fields are filled
    const validateForm = () => {
        const newErrors = {};

        if (!expenseName.trim()) {
            newErrors.expenseName = 'Expense name is required';
        }

        if (!merchantName.trim()) {
            newErrors.merchantName = 'Merchant name is required';
        }
        if (!date) {
            newErrors.date = 'Date is required';
        }
        if (!type) {
            newErrors.type = 'Category is required';
        }

        if (!amount) {
            newErrors.amount = 'Amount is required';
        }

        if (!vehicle) {
            newErrors.vehicle = 'Vehicle is required';
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

        if (!expenseNameEdit.trim()) {
            newErrors.expenseNameEdit = 'Expense name is required';
        }

        if (!merchantNameEdit.trim()) {
            newErrors.merchantNameEdit = 'Merchant name is required';
        }
        if (!dateEdit) {
            newErrors.dateEdit = 'Date is required';
        }
        if (!typeEdit) {
            newErrors.typeEdit = 'Category is required';
        }
        if (!noteEdit) {
            newErrors.noteEdit = 'Notes are required';
        }

        if (!amountEdit) {
            newErrors.amountEdit = 'Amount is required';
        }

        if (!dateEdit) {
            newErrors.dateEdit = 'Date is required';
        }

        if (!timeEdit) {
            newErrors.timeEdit = 'Time is required';
        }

        if (!vehicleEdit) {
            newErrors.vehicleEdit = 'Vehicle is required';
        }

        if (!typeEdit) {
            newErrors.typeEdit = 'Category is required';
        }

        if (!imagesEdit || imagesEdit.length === 0) {
            newErrors.imagesEdit = "Please upload at least one image.";
        }

        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const handleFilterClick = () => {
        // Dispatch API call with all filters

        console.log(dateFilter, "date")
        const month = dateFilter?.getMonth() + 1;
        const year = dateFilter?.getFullYear();
        fetchExpenses(vehicleFilter, searchFilter, typeFilter, month, year)
    };

    const isExpenseUpdated = () => {
        const original = selectedExpense || {};

        const isSame =
            expenseNameEdit !== (original.name || '') ||
            merchantNameEdit !== (original.merchantName || '') ||
            noteEdit !== (original.note || '') ||
            vehicleEdit !== (original.vehicleId || '') ||
            typeEdit !== (original.categoryId || '') ||
            amountEdit !== (original.amount ? String(original.amount) : '')

        return isSame;
    };

    const handleEditExpenseSubmit = async (id) => {

        // if (!isExpenseUpdated()) {
        //     showErrorToast('nothing has been changed');
        //     return;
        // }

        if (!validateUpdateForm()) return;

        const formData = new FormData();

        try {
            if (imagesEdit) {
                imagesEdit.forEach((imgObj, index) => {
                    formData.append('receiptPhotos', imgObj.file);
                });
            }

            const [year, month, day] = dateEdit.split('-');

            const monthIndex = Number(month) - 1; // Subtract 1 here

            const finalDateTime = new Date(year, monthIndex, day, timeEdit.getHours(), timeEdit.getMinutes(), timeEdit.getSeconds());

            formData.append('name', expenseNameEdit);
            formData.append('merchantName', merchantNameEdit);
            formData.append('amount', amountEdit);
            formData.append('vehicleId', vehicleEdit);
            formData.append('categoryId', typeEdit);
            formData.append('note', noteEdit);
            formData.append('fileName', removedImages)
            formData.append('dateTime', finalDateTime);

            dispatch(EditExpenseAPI(id, formData));

        } catch (error) {
            console.log(error, "Error")
            showErrorToast(error)
        }
    }


    const handleExpensesToReportsSubmit = async () => {
        try {
            await dispatch(AddExpensesToReportAPI({ expenseIds: selectedRows }, { id: reportId }))
        } catch (error) {
            showErrorToast(error)
        }
    }


    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = new FormData();
        const [year, month, day] = date.split('-');

        const monthIndex = Number(month) - 1; // Subtract 1 here

        const finalDateTime = new Date(year, monthIndex, day, time.getHours(), time.getMinutes(), time.getSeconds());

        formData.append('name', expenseName);
        formData.append('merchantName', merchantName);
        formData.append('amount', amount);
        formData.append('vehicleId', vehicle);
        formData.append('categoryId', type);
        formData.append('note', note);
        formData.append('dateTime', finalDateTime);
        if (report) {
            formData.append('reportId', report);
        }
        if (images) {

            images.forEach((imgObj) => {
                formData.append('receiptPhotos', imgObj.file);
            });
        }
        try {
            await dispatch(AddExpenseAPI(formData));
        } catch (error) {
            showErrorToast(error?.data || 'Failed to add expense');
        }
    }

    useEffect(() => {
        const addOffcanvasEl = document.getElementById('addExpensesoffcanvas');

        function handleOffcanvasClose() {
            if (!filtersDisable) {
                setExpenseName('');
                setMerchantName('');
                setVehicle('');
                setAmount('');
                setNote('');
                setType('');
                setDate('');
                setTime(new Date(2023, 0, 1, 9, 0));
                setImages([]);
                setVehicleFilter('');
                setTypeFilter('');
                setSearchFilter('');
            }
            else {
                setExpenseName('');
                setMerchantName('');
                setAmount('');
                setNote('');
                setDate('');
                setTime(new Date(2023, 0, 1, 9, 0));
                setImages([]);
                setSearchFilter('');
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

    // useEffect(() => {
    //     if (fromReports) {
    //         const offcanvasElement = document.getElementById('addExpensesoffcanvas');
    //         if (offcanvasElement) {
    //             const bsOffcanvas = new window.bootstrap.Offcanvas(offcanvasElement);
    //             bsOffcanvas.show();
    //         }
    //     }
    // }, [fromReports])

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses, deleted, editExpenseResponse])

    useEffect(() => {
        if (response) {
            // setPage(response.data.pagination.page);
            // setLimit(response.data.pagination.limit);
            setTotalItems(response.data.pagination.totalCount);
            setTotalPages(Math.ceil(response.data.pagination.totalCount / limit));
            setDataList(response.data.expenses);
            setVehicleFilter('');
            setTypeFilter('');
            setSearchFilter('');
        }
    }, [response]);

    useEffect(() => {
        if (selectedExpense) {
            setExpenseNameView(selectedExpense.name || '');
            setExpenseNameEdit(selectedExpense.name || '');

            setMerchantNameView(selectedExpense.merchantName || '');
            setMerchantNameEdit(selectedExpense.merchantName || '');

            setNoteView(selectedExpense.note || '');
            setNoteEdit(selectedExpense.note || '');

            setAmountView(selectedExpense.amount || '');
            setAmountEdit(selectedExpense.amount || '');

            setVehicleView(selectedExpense.vehicleId || '');
            setVehicleEdit(selectedExpense.vehicleId || '');

            setTypeView(selectedExpense.categoryId || '');
            setTypeEdit(selectedExpense.categoryId || '');


            const dateObj = new Date(selectedExpense.dateTime);
            const dateObjEdit = new Date(selectedExpense.dateTime);

            // Get date in YYYY-MM-DD format
            const dateFromBackend = dateObj.toISOString().split('T')[0];
            const dateEditFromBackend = dateObjEdit.toISOString().split('T')[0];

            setDateView(dateFromBackend);
            setDateEdit(dateEditFromBackend)

            setTimeView(dateObj);
            setTimeEdit(dateObjEdit)

            const normalized = selectedExpense.receiptPhotos.map(img => ({
                ...img,
                name: img.filename,
                file: null
            }));
            setImagesFromBackend(normalized);
            setImagesEdit(normalized)
        }
    }, [selectedExpense]);

    useEffect(() => {
        const offcanvas = document.getElementById('editExpensesoffcanvas');

        const handleShow = () => {
            if (selectedExpense) {
                setExpenseNameEdit(selectedExpense.name || '');

                setMerchantNameEdit(selectedExpense.merchantName || '');

                setNoteEdit(selectedExpense.note || '');

                setAmountEdit(selectedExpense.amount || '');

                setVehicleEdit(selectedExpense.vehicleId || '');

                setTypeEdit(selectedExpense.categoryId || '');


                const dateObj = new Date(selectedExpense.dateTime);
                const dateObjEdit = new Date(selectedExpense.dateTime);

                // Get date in YYYY-MM-DD format
                const dateFromBackend = dateObj.toISOString().split('T')[0];
                const dateEditFromBackend = dateObjEdit.toISOString().split('T')[0];

                setDateEdit(dateEditFromBackend)

                setTimeEdit(dateObjEdit)

                const normalized = selectedExpense.receiptPhotos.map(img => ({
                    ...img,
                    name: img.filename,
                    file: null
                }));

                setImagesEdit(normalized)
            }
        }

        offcanvas?.addEventListener('shown.bs.offcanvas', handleShow);

        return () => {
            offcanvas?.removeEventListener('shown.bs.offcanvas', handleShow);
        };
    }, [selectedExpense])

    useEffect(() => {
        if (addExpenseResponse) {
            showSuccessToast(addExpenseResponse?.message || 'Expense added successfully');
            setExpenseName('');
            setMerchantName('');
            setVehicle('');
            setType('');
            setAmount('');
            setNote('');
            setDate('');
            setTime(new Date(2023, 0, 1, 9, 0));
            setImages([]);
            dispatch(addExpenseStateReset());
            fetchExpenses();

            const offcanvasEl = document.getElementById('addExpensesoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }

            if (response && reportId) {
                navigate(`/dashboard/reports/detail/${reportId}`, { state: { type: typeToSend } });
            }
        }
    }, [addExpenseResponse, fetchExpenses])

    useEffect(() => {
        if (addExpenseError) {
            showErrorToast(addExpenseError?.data || 'Failed to add expense');
            dispatch(addExpenseStateReset());
        }
    }, [addExpenseError])

    useEffect(() => {
        if (editExpenseResponse) {
            showSuccessToast('Expense updated successfully');
            setSelectedExpense(null);
            dispatch(editExpenseStateReset());
            const offcanvasEl = document.getElementById('editExpensesoffcanvas');
            if (offcanvasEl && window.bootstrap) {
                const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasEl) || new window.bootstrap.Offcanvas(offcanvasEl);
                bsOffcanvas.hide();
            }
        }
    }, [editExpenseResponse])

    useEffect(() => {
        if (editExpenseError) {
            showErrorToast(editExpenseError?.data);
            dispatch(editExpenseStateReset())
        }
    }, [error])

    useEffect(() => {
        if (expensesToReportResponse) {
            dispatch(addExpenseToReportsStateReset());
            navigate(`/dashboard/reports/detail/${reportId}`, { state: { type: typeToSend } });
        }
    }, [expensesToReportResponse])

    useEffect(() => {
        if (expensesToReportError) {
            showErrorToast(expensesToReportError?.message);
            dispatch(addExpenseToReportsStateReset());
        }
    }, [expensesToReportError])

    useEffect(() => {
        if (reportId) {
            setReport(reportId);
        }
        if (categoryFromReports) {
            setType(categoryFromReports)
            setTypeFilter(categoryFromReports)
        }
        if (vehicleFromReports) {
            setVehicle(vehicleFromReports)
            setVehicleFilter(vehicleFromReports)
        }
    }, [reportId, categoryFromReports, vehicleFromReports])

    useEffect(() => {
        const offcanvasEl = document.getElementById('addExpensesoffcanvas');
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
                                    <h1>Expenses</h1>
                                    {
                                        !filtersDisable &&
                                        <div className="d-flex flex-end gap-3">
                                            <button className="primary-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#addExpensesoffcanvas" aria-controls="addExpensesoffcanvas">+Add Expenses</button>
                                        </div>
                                    }
                                    {
                                        filtersDisable &&
                                        <div className="d-flex flex-end gap-3">
                                            <button className="primary-btn" data-bs-toggle="offcanvas" data-bs-target="#addExpensesoffcanvas" aria-controls="addExpensesoffcanvas">+Add New Expenses</button>
                                            <button className="primary-btn" type='button' onClick={handleExpensesToReportsSubmit} disabled={selectedRows?.length === 0} style={{
                                                cursor: selectedRows.length === 0 ? 'not-allowed' : 'pointer'
                                            }}>{expensesToReportLoading ? <PulseLoader color='#ffffff' size={16} /> : '+Add Expenses To Report'}</button>
                                        </div>
                                    }
                                </div>
                                <div className="cta-blk">
                                    <h2 className="fs-4 fw-medium text-black">20 free trips remaining.</h2>
                                    <p>Never miss a mile with unlimited automatic trip tracking</p>
                                    <a href="#!" className="primary-btn text-transform-uppercase d-inline-block" style={{ cursor: 'not-allowed' }} onClick={(e) => e.preventDefault()}>UPGRADE TO PREMIUM</a>
                                </div>
                                <div className="common-card">
                                    <div className="common_stats">
                                        <div className="common_stats_item">
                                            <span className="common_stats_value">{totalAmount <= 0 ? 0 : `$${totalAmount.toFixed(2)}`}</span>
                                            <h2>Expenses</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="common-table-filter-wrapper">
                                    <div className="common-left-blk">
                                        <div className="common-sort-blk">
                                            <select id className="form-select" value={typeFilter}
                                                onChange={(e) => setTypeFilter(e.target.value)} disabled={filtersDisable}>
                                                <option value=''>Category</option>
                                                <option value='67650053bd020f2a50f1c162'>Personal</option>
                                                <option value='6765006fbd020f2a50f1c169'>Business</option>
                                                <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                                <option value='67650085bd020f2a50f1c171'>Medical</option>
                                            </select>
                                            <select className="form-select"
                                                value={vehicleFilter} disabled={filtersDisable}
                                                onChange={(e) => setVehicleFilter(e.target.value)}
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
                                            {!filtersDisable &&
                                                <div className="common-search-blk">
                                                    <input type="search" className="form-control" id="search" value={searchFilter} placeholder="Search" onKeyDown={(e) => {

                                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                        onChange={(e) => setSearchFilter(e.target.value)} />
                                                </div>
                                            }
                                            {
                                                !filtersDisable &&
                                                <button className="filter_action_btn cal_btn">
                                                    <MonthYearPickerComponent date={dateFilter}
                                                        onChangeDate={(date) => setDateFilter(date)} />
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

                                            <button className="filter_action_btn export_btn" onClick={handleExport}>Export</button>
                                        </div>
                                    }
                                </div>
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
                                                <Table
                                                    tableData={dataList}
                                                    setDataList={setDataList}
                                                    limit={limit}
                                                    columns={columns}
                                                    currentPage={page}
                                                    handlePageChange={handlePageChange}
                                                    // setLimit={handleLimitChange}
                                                    targetViewId={'viewExpenseOffCanvas'}
                                                    targetEditId={'editExpensesoffcanvas'}
                                                    setSelectedExpense={setSelectedExpense}
                                                    setDeleted={setDeleted}
                                                    selectedRows={columns.includes('Checkbox') ? selectedRows : undefined}
                                                    setSelectedRows={columns.includes('Checkbox') ? setSelectedRows : undefined}
                                                    handleSelectAll={columns.includes('Checkbox') ? handleSelectAll : undefined}
                                                    handleRowCheckboxChange={columns.includes('Checkbox') ? handleRowCheckboxChange : undefined}
                                                />
                                                {dataList?.length > 0 &&
                                                    <Pagination
                                                        currentPage={page}
                                                        setCurrentPage={setPage}
                                                        totalPages={totalPages}
                                                        limit={limit}
                                                        totalItems={totalItems}
                                                        handlePageChange={handlePageChange}
                                                    // handleLimitChange={handleLimitChange}
                                                    />
                                                }
                                            </>
                                }
                            </div>
                        </div>
                    </div>
                </section >
            </div >

            {/* add expenses offcanvas */}

            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1} id="addExpensesoffcanvas" aria-labelledby="addExpensesoffcanvasLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { setValidationErrors('') }} />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Add Expenses</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" onClick={handleSubmit}>{addExpenseLoading ? <PulseLoader color="#ffffff" /> : 'Save'}</button>
                            {/* <button class="delete_btn"><img src="assets/images/trash-icon.svg" alt="Trash"></button> */}
                        </div>
                    </div>
                    {/* <div className="common-card mt-4">
                        <div className="common_stats">
                            <div className="common_stats_item">
                                <span className="common_stats_value">$5.00</span>
                                <h2>Amount</h2>
                            </div>
                        </div>
                    </div> */}
                    <div className="offcanvas_form_wrapper">
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/expenses-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Expense name" value={expenseName} onKeyDown={(e) => {

                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                        e.preventDefault();
                                    }
                                }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setExpenseName(value);
                                        if (validationErrors.expenseName) {
                                            setValidationErrors(prev => ({ ...prev, expenseName: false }));
                                        }
                                    }} />
                            </div>
                            {validationErrors.expenseName &&
                                (
                                    <span className={`error ${validationErrors.expenseName ? '' : 'd-none'}`}>{validationErrors.expenseName}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/briefcase-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Merchant name" value={merchantName} onKeyDown={(e) => {

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
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/dollar-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input
                                    type="number"
                                    step="any"
                                    min="0" className="form-control" placeholder="Amount" value={amount} onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                        if (e.key === '-' || e.key === 'Subtract') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                                            setAmount(value);
                                            if (validationErrors.amount) {
                                                setValidationErrors(prev => ({ ...prev, amount: false }));
                                            }
                                        }
                                    }
                                    } />
                            </div>
                            {validationErrors.amount &&
                                (
                                    <span className={`error ${validationErrors.amount ? '' : 'd-none'}`}>{validationErrors.amount}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/car-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setVehicle(e.target.value);
                                    if (validationErrors.vehicle) {
                                        setValidationErrors(prev => ({ ...prev, vehicle: false }));
                                    }
                                }} value={vehicle} disabled={!!vehicleFromReports}>
                                    {getVehiclesLoading ? <span><ClipLoader size={23} color='#000000' /></span>
                                        :
                                        getVehiclesError ? <span><ClipLoader size={23} color='#000000' /></span> :
                                            <>
                                                <option value=''>Vehicle</option>
                                                {getVeiclesResponse?.data?.length > 0 && getVeiclesResponse?.data?.map((vehcile, index) => {
                                                    return (
                                                        <option value={vehcile?._id}>{vehcile?.name || ''}</option>
                                                    )
                                                })}
                                            </>
                                    }
                                </select>
                            </div>
                            {validationErrors.vehicle &&
                                (
                                    <span className={`error ${validationErrors.vehicle ? '' : 'd-none'}`}>{validationErrors.vehicle}</span>
                                )
                            }
                        </div>
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
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/category.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setType(e.target.value);
                                    if (validationErrors.type) {
                                        setValidationErrors(prev => ({ ...prev, type: false }));
                                    }
                                }} value={type} disabled={!!categoryFromReports}>
                                    <option value=''>Select Category</option>
                                    <option value='67650053bd020f2a50f1c162'>Personal</option>
                                    <option value='6765006fbd020f2a50f1c169'>Business</option>
                                    <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                    <option value='67650085bd020f2a50f1c171'>Medical</option>
                                </select>
                            </div>
                            {validationErrors.type &&
                                (
                                    <span className={`error ${validationErrors.type ? '' : 'd-none'}`}>{validationErrors.type}</span>
                                )
                            }
                        </div>
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/notes-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Notes" value={note}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNote(value);
                                    }} />
                            </div>
                        </div>
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/cal-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <DatePickerComponent date={date} setDate={setDate} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                            </div>
                            {validationErrors.date &&
                                (
                                    <span className={`error ${validationErrors.date ? '' : 'd-none'}`}>{validationErrors.date}</span>
                                )
                            }
                        </div>

                        <SingleFieldTimePickerComponent time={time} setTime={setTime} />
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/attach-icon.svg)' }} />
                            <div className="ofcvs_form_field">

                                <input type="file" className='d-none' id="attachment2" multiple accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml" onChange={handleFileChange} />
                                <label htmlFor="attachment2">
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


            {/* view expenses offcanvas */}

            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1
            } id="viewExpenseOffCanvas" aria-labelledby="viewExpenseOffCanvasLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>View Expense</h2>
                    </div>
                    <div className="common-card mt-4">
                        <div className="common_stats">
                            <div className="common_stats_item">
                                <span className="common_stats_value">${amountView}</span>
                                <h2>Amount</h2>
                            </div>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper">
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/expenses-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Expense name" value={expenseNameView} readOnly />
                            </div>
                        </div>
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/briefcase-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Merchant name" value={merchantNameView} readOnly />
                            </div>
                        </div>
                        {/* <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/dollar-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input
                                    type="number"
                                    step="any"
                                    min="0" className="form-control" placeholder="Amount" value={amount} />
                            </div>
                        </div> */}
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/car-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" value={vehicleView} disabled>

                                    {getVehiclesLoading ? <span><ClipLoader size={23} color='#000000' /></span>
                                        :
                                        getVehiclesError ? <span><ClipLoader size={23} color='#000000' /></span> :
                                            <>
                                                <option value=''>Select Vehicle</option>
                                                {getVeiclesResponse?.data?.length > 0 && getVeiclesResponse?.data?.map((vehcile, index) => {
                                                    return (
                                                        <option value={vehcile?._id}>{vehcile?.name || ''}</option>)
                                                })}
                                            </>

                                    }
                                </select>
                            </div>
                        </div>
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/category.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" value={typeView} disabled>
                                    <option value=''>Select Category</option>
                                    <option value='67650053bd020f2a50f1c162'>Personal</option>
                                    <option value='6765006fbd020f2a50f1c169'>Business</option>
                                    <option value='6765007dbd020f2a50f1c16d'>Charity</option>
                                    <option value='67650085bd020f2a50f1c171'>Medical</option>
                                </select>
                            </div>
                        </div>
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/notes-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Notes" value={noteView} readOnly
                                />
                            </div>
                        </div>
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/cal-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <DatePickerComponent date={dateView} setDate={setDateView} readOnly />
                            </div>
                        </div>
                        <SingleFieldTimePickerComponent time={timeView} setTime={setTimeView} readOnly />
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/attach-icon.svg)' }} />
                            <div className="ofcvs_form_field">

                                <input type="file" className='d-none' id="attachment2" multiple accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml" disabled />
                                <label htmlFor="attachment2" onClick={(e) => {
                                    e.preventDefault();
                                }}
                                    style={{ cursor: 'not-allowed', opacity: 0.6 }} >
                                    {!(imagesFromBackend.length > 0) &&
                                        <span className="attach_file_placeholder">Upload here</span>
                                    }
                                    {Array.isArray(imagesFromBackend) && imagesFromBackend.length > 0 && (
                                        imagesFromBackend.map((file, index) => (
                                            <span key={index} className="attach_file_preview">{file.url}</span>
                                        ))
                                    )}
                                </label>
                            </div>
                        </div>
                        <div className='image-preview-list mt-3 d-flex flex-wrap gap-2'>
                            {Array.isArray(imagesFromBackend) && imagesFromBackend.length > 0 && (
                                imagesFromBackend.map((file, index) => {

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
                                                // onClick={() => handleRemoveImage(index)}
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
                                                    cursor: 'not-allowed',
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

            {/* edit expenses offcanvas */}

            < div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={- 1
            } id="editExpensesoffcanvas" aria-labelledby="editExpensesoffcanvasLabel" >
                <div className="offcanvas-header">
                    <button type="button" className="btn-close ms-0" data-bs-dismiss="offcanvas" aria-label="Close" onClick={() => { setValidationErrors('') }} />
                </div>
                <div className="offcanvas-body">
                    <div className="offcanvas_top_header">
                        <h2>Edit Expense</h2>
                        <div className="canvas_action_btn">
                            <button className="save_btn" onClick={() => handleEditExpenseSubmit(selectedExpense._id)}>{editExpenseLoading ? <PulseLoader color="#ffffff" /> : 'Save'}</button>
                        </div>
                    </div>
                    <div className="offcanvas_form_wrapper">
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/expenses-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Expense name" value={expenseNameEdit} onKeyDown={(e) => {

                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                        e.preventDefault();
                                    }
                                }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setExpenseNameEdit(value);
                                        if (validationErrors.expenseNameEdit) {
                                            setValidationErrors(prev => ({ ...prev, expenseNameEdit: false }));
                                        }
                                    }} />
                            </div>
                        </div>
                        {validationErrors.expenseNameEdit &&
                            (
                                <span className={`error ${validationErrors.expenseNameEdit ? '' : 'd-none'}`}>{validationErrors.expenseNameEdit}</span>
                            )
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/briefcase-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Merchant name" value={merchantNameEdit} onKeyDown={(e) => {

                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                        e.preventDefault();
                                    }
                                }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setMerchantNameEdit(value);
                                        if (validationErrors.merchantNameEdit) {
                                            setValidationErrors(prev => ({ ...prev, merchantNameEdit: false }));
                                        }
                                    }} />
                            </div>
                        </div>
                        {validationErrors.merchantNameEdit &&
                            (
                                <span className={`error ${validationErrors.merchantNameEdit ? '' : 'd-none'}`}>{validationErrors.merchantNameEdit}</span>
                            )
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/dollar-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input
                                    type="number"
                                    step="any"
                                    min="0" className="form-control" placeholder="Amount" value={amountEdit} onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                        if (e.key === '-' || e.key === 'Subtract') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                                            setAmountEdit(value);
                                            if (validationErrors.amountEdit) {
                                                setValidationErrors(prev => ({ ...prev, amountEdit: false }));
                                            }
                                        }
                                    }} />
                            </div>
                        </div>
                        {validationErrors.amountEdit &&
                            (
                                <span className={`error ${validationErrors.amountEdit ? '' : 'd-none'}`}>{validationErrors.amountEdit}</span>
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
                                    <option value=''>Vehicle</option>
                                    {getVehiclesLoading ? <span><ClipLoader size={23} color='#000000' /></span>
                                        :
                                        getVehiclesError ? <span><ClipLoader size={23} color='#000000' /></span> :
                                            <>
                                                <option value=''>Vehicle</option>
                                                {getVeiclesResponse?.data?.length > 0 && getVeiclesResponse?.data?.map((vehcile, index) => {
                                                    return (
                                                        <option value={vehcile?._id}>{vehcile?.name || ''}</option>
                                                    )
                                                })}
                                            </>
                                    }
                                </select>
                            </div>
                        </div>
                        {validationErrors.vehicleEdit &&
                            (
                                <span className={`error ${validationErrors.vehicleEdit ? '' : 'd-none'}`}>{validationErrors.vehicleEdit}</span>
                            )
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/category.svg)' }} />
                            <div className="ofcvs_form_field">
                                <select id className="form-select" onChange={(e) => {
                                    setTypeEdit(e.target.value);
                                    if (validationErrors.typeEdit) {
                                        setValidationErrors(prev => ({ ...prev, typeEdit: false }));
                                    }
                                }} value={typeEdit}>
                                    <option value=''>Select Category</option>
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
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/notes-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <input type="text" className="form-control" placeholder="Notes" value={noteEdit}
                                    onKeyDown={(e) => {

                                        if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNoteEdit(value);
                                        if (validationErrors.noteEdit) {
                                            setValidationErrors(prev => ({ ...prev, noteEdit: false }));
                                        }
                                    }} />
                            </div>
                        </div>
                        {validationErrors.noteEdit &&
                            (
                                <span className={`error ${validationErrors.noteEdit ? '' : 'd-none'}`}>{validationErrors.noteEdit}</span>
                            )
                        }
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/cal-black-icon.svg)' }} />
                            <div className="ofcvs_form_field">
                                <DatePickerComponent date={dateEdit} setDate={setDateEdit} validationErrors={validationErrors} setValidationErrors={setValidationErrors} />
                            </div>
                            {validationErrors.dateEdit &&
                                (
                                    <span className={`error ${validationErrors.dateEdit ? '' : 'd-none'}`}>{validationErrors.dateEdit}</span>
                                )
                            }
                        </div>
                        <SingleFieldTimePickerComponent time={timeEdit} setTime={setTimeEdit} />
                        <div className="ofcvs_form_item">
                            <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/attach-icon.svg)' }} />
                            <div className="ofcvs_form_field">

                                <input type="file" className='d-none' id="attachment3" multiple accept="image/jpeg, image/png, image/jpg, image/webp, image/svg+xml" onChange={handleEditFileChange} />
                                <label htmlFor="attachment3">
                                    {!(imagesEdit.length > 0) &&
                                        <span className="attach_file_placeholder">Upload here</span>
                                    }
                                    {Array.isArray(imagesEdit) && imagesEdit.length > 0 && (
                                        imagesEdit.map((file, index) => (
                                            <span key={index} className="attach_file_preview">{file.url}</span>
                                        ))
                                    )}
                                </label>
                            </div>
                        </div>
                        {validationErrors.imagesEdit &&
                            (
                                <span className={`error ${validationErrors.imagesEdit ? '' : 'd-none'}`}>{validationErrors.imagesEdit}</span>
                            )
                        }
                        <div className='image-preview-list mt-3 d-flex flex-wrap gap-2'>
                            {Array.isArray(imagesEdit) && imagesEdit.length > 0 && (
                                imagesEdit.map((file, index) => {

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
                                                onClick={() => handleEditRemoveImage(index)}
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

        </>
    )
}

export default Expenses