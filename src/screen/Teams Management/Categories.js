import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GetCategoryListApi } from '../../redux/actions/teams/category/GetCategoryListAction';
import { PulseLoader } from 'react-spinners';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { AddCategoryAPI } from '../../redux/actions/teams/category/AddCategoryAction';
import { showErrorToast, showSuccessToast } from '../../helpers/toast';
import { addCategoryStateReset } from '../../redux/slices/teams/category/AddCategorySlice';
import { AuthContext } from '../../context/AuthContext';
import { UploadMultipleAPI } from '../../redux/actions/teams/category/UploadMultipleAction';
import { uploadMultipleStateReset } from '../../redux/slices/teams/category/UploadMultipleSlice';
import Papa from 'papaparse';

const Categories = () => {
    const columns = ['Name', 'Code']
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLImit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [search, setSearch] = useState('');
    const [categoriesList, setCategoriesList] = useState([]);
    const { parentTeamId } = useContext(AuthContext);
    const [category, setCategory] = useState('');
    const [code, setCode] = useState('');
    const [validationErrors, setValidationErrors] = useState('');
    const [csvPreviews, setCsvPreviews] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const { response, loading, error } = useSelector((state) => state.addCategory);
    const { response: categoriesListResponse, loading: categoriesListLoading, error: categoriesListError } = useSelector((state) => state.categoryList);
    const { response: uploadMulitpleResponse, loading: uploadMulitpleLoading, error: uploadMulitpleError } = useSelector((state) => state.categoriesUploadMultiple);

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleLimitChange = (newLimit) => {
        setLImit(newLimit);
        setCurrentPage(1);
    }

    const validateForm = () => {
        const newErrors = {};

        if (!category) {
            newErrors.category = 'Category is required';
        }
        setValidationErrors(newErrors);

        return Object.keys(newErrors).length === 0; // returns true if no errors
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            await dispatch(AddCategoryAPI({ name: category, code: code }, { id: parentTeamId }))
        } catch (error) {
            showErrorToast(error)
        }
    }

    const handleFilesUpload = (input) => {
        const files = input.target?.files || input;

        if (!files || files.length === 0) return;

        const file = files[0];
        setUploadedFile(file);  // Save the actual file here

        if (!file.name.toLowerCase().endsWith('.csv')) {
            showErrorToast(`File "${file.name}" is not a CSV file.`);
            setCsvPreviews([]);
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const headers = results.meta.fields;
                if (
                    headers.length !== 2 ||
                    !headers.includes('name') ||
                    !headers.includes('code')
                ) {
                    showErrorToast(
                        `File "${file.name}" must have exactly two columns: 'Name' and 'Code'.`
                    );
                    setCsvPreviews([]);
                } else {
                    setCsvPreviews([
                        {
                            fileName: file.name,
                            error: null,
                            data: results.data,
                        },
                    ]);
                }
            },
            error: (error) => {
                showErrorToast(`Parsing error in file "${file.name}": ${error.message}`);
                setCsvPreviews([]);
            },
        });

        if (input.target) input.target.value = null;
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

    const csvTemplateData = [
        { name: "Travel", code: "C-04" }
    ];

    const downloadCSVTemplate = () => {
        const headers = ["name", "code"];
        const rows = csvTemplateData.map(row =>
            headers.map(fieldName => `"${row[fieldName] || ""}"`).join(",")
        );
        const csvContent = [headers.join(","), ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        // Generate a code on mount, e.g., C-XX where XX is 2 digit random number
        const randomNum = Math.floor(Math.random() * 100);
        const formattedNum = randomNum.toString().padStart(2, '0');
        setCode(`C-${formattedNum}`);
    }, []);

    useEffect(() => {
        if (parentTeamId) {

            dispatch(GetCategoryListApi({ page: currentPage, limit: limit, search: search, id: parentTeamId }))
        }
    }, [response, currentPage, limit, parentTeamId, search, uploadMulitpleResponse])

    useEffect(() => {
        if (categoriesListResponse) {
            setCategoriesList(categoriesListResponse?.data);
            setCurrentPage(categoriesListResponse?.pagination?.page);
            setLImit(categoriesListResponse?.pagination?.limit);
            setTotalPages(categoriesListResponse?.pagination?.totalPages);
            setTotalItems(categoriesListResponse?.pagination?.total)
        }
    }, [categoriesListResponse])

    useEffect(() => {
        if (response) {
            showSuccessToast(response?.message)
            setCategory('')
            setValidationErrors('');
            dispatch(addCategoryStateReset());
            const modalEl = document.getElementById('createCategory');
            if (modalEl && window.bootstrap) {
                const bsOffmodal = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal.getInstance(modalEl);
                bsOffmodal.hide();
            }
            const randomNum = Math.floor(Math.random() * 100);
            const formattedNum = randomNum.toString().padStart(2, '0');
            setCode(`C-${formattedNum}`);
        }
    }, [response]);


    useEffect(() => {
        const modal = document.getElementById('createCategory');

        const handleRemove = () => {
            setCategory('')
            setValidationErrors('');
        }

        modal?.addEventListener('hidden.bs.modal', handleRemove);

        return () => {
            modal?.removeEventListener('hidden.bs.modal', handleRemove);
        };
    }, [])

    useEffect(() => {
        if (error) {
            showErrorToast(error?.data);
            dispatch(addCategoryStateReset());
        }
    }, [error])

    useEffect(() => {
        if (uploadMulitpleResponse) {
            showSuccessToast(uploadMulitpleResponse?.message);
            dispatch(uploadMultipleStateReset());
            const modalEl = document.getElementById('uploadMultiCategories');
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
                                            <li className="breadcrumb-item text-capitalize">Categories</li>
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
                                                            <input type="search" className="form-control" id="search" placeholder="Search"
                                                                value={search} onKeyDown={(e) => {

                                                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onChange={(e) => setSearch(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-end gap-3">
                                                <button className="primary-btn" type="button" data-bs-toggle="modal" data-bs-target="#createCategory" aria-controls="createCategory">Create Category</button>
                                                <button className="outline-btn" type="button" data-bs-toggle="modal" data-bs-target="#uploadMultiCategories" aria-controls="uploadMultiCategories">Upload Multiple</button>
                                            </div>
                                        </div>
                                        {
                                            categoriesListLoading
                                                ? (
                                                    // Show loading spinner while data is being fetched
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center' >
                                                        <PulseLoader size={25} color="#49a496" />
                                                    </div>
                                                ) : categoriesListError ? (
                                                    // Display error message if there is an issue fetching data
                                                    <div style={{ height: '40vh' }} className='d-flex align-items-center justify-content-center'>
                                                        <p className='text-danger'>Something went wrong</p>
                                                    </div>
                                                ) :
                                                    <>
                                                        <Table
                                                            tableData={categoriesList}
                                                            setDataList={setCategoriesList}
                                                            limit={limit}
                                                            columns={columns}
                                                            currentPage={currentPage}
                                                            handlePageChange={handlePageChange}
                                                            setLimit={handleLimitChange}
                                                        />
                                                        {categoriesList?.length > 0 &&
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

                    {/* create category Modal  */}
                    <div className="modal fade" id="createCategory" tabIndex={-1} aria-labelledby="createCategoryLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content border-0">
                                <div className="modal-header border-0">
                                    <h2 className="modal-title fs-5" id="createCategoryLabel">Create New Category</h2>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                                        setCategory('');
                                        setValidationErrors('');
                                    }} />
                                </div>
                                <div className="modal-body py-2">
                                    <div className="offcanvas_form_wrapper outline_form_wrapper mt-0">
                                        <div className="ofcvs_form_item">
                                            <label>Category Code</label>
                                            <div className="ofcvs_form_field">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={code}
                                                    readOnly
                                                    style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="ofcvs_form_item">
                                            <label>Name</label>
                                            <div className="ofcvs_form_field">
                                                <input type="text" className="form-control" placeholder="Enter category name" value={category} onKeyDown={(e) => {

                                                    if (e.key === ' ' && e.currentTarget.value.trim() === '') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setCategory(value);
                                                        if (validationErrors.category) {
                                                            setValidationErrors(prev => ({ ...prev, category: false }));
                                                        }
                                                    }} />
                                            </div>
                                        </div>
                                        {validationErrors.category &&
                                            (
                                                <span className={`error ${validationErrors.category ? '' : 'd-none'}`}>{validationErrors.category}</span>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="modal-footer p-3 border-0">
                                    <button type="button" className="primary-btn m-0" onClick={handleSubmit}>{loading ? <PulseLoader color='#ffffff' size={14} /> : 'Create Category'}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Multiple Categories Modal */}
                    <div className="modal fade" id="uploadMultiCategories" tabIndex={-1} aria-labelledby="uploadMultiCategoriesLabel" data-bs-backdrop="static" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content border-0">
                                <div className="modal-header border-0">
                                    <div>
                                        <h2 className="modal-title fs-5" id="uploadMultiCategoriesLabel">Upload Multiple Categories</h2>
                                        <p className="mb-0">Add multiple Categories at once by uploading a CSV file.</p>
                                    </div>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                                        setUploadedFile(null);
                                        setCsvPreviews([]);
                                    }} />
                                </div>
                                <div className="modal-body py-2">
                                    <div className="hstack justify-content-between flex-wrap align-items-start gap-3">
                                        <div className="multiple_category_blk">
                                            <div className="multiple_category_content">
                                                <p className="download_temp_content">Need Help?  <button className="border-0 p-0 bg-white text-decoration-underline" type='button' onClick={downloadCSVTemplate}>Download CSV Template</button></p>
                                            </div>
                                            <div className="modal_table mt-4 table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>name</th>
                                                            <th>code</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Travel</td>
                                                            <td>C-04</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="modal_upload_file">
                                            <input type="file" className="d-none" id="dragDropFile"
                                                // accept=".csv"
                                                onChange={(e) => handleFilesUpload(e)} />
                                            <label htmlFor="dragDropFile" onDragOver={(e) => handleDragOver(e)}
                                                onDragEnter={(e) => handleDragOver(e)}
                                                onDragLeave={(e) => handleDragLeave(e)}
                                                onDrop={(e) => handleDrop(e)}>
                                                <span className="vstack align-items-center gap-1">
                                                    <span><img src="/assets/images/document-upload.png" /></span>
                                                    <span>Drag or drop here </span>
                                                    <span>or</span>
                                                    <span className="text-primary"> Browse</span>
                                                </span>
                                                {/* Preview uploaded CSVs */}
                                                <div className="csv-preview mt-4">
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
                                                                                    <th>name</th>
                                                                                    <th>code</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {data.map((row, i) => (
                                                                                    <tr key={i}>
                                                                                        <td>{row.name}</td>
                                                                                        <td>{row.code}</td>
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
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
                    </div >

                </>
                :
                <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center' >
                    <PulseLoader size={25} color="#49a496" />
                </div>
            }
        </>
    )
}

export default Categories