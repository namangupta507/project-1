import React from 'react';

const Pagination = ({
    currentPage,
    totalPages,
    limit,
    totalItems,
    handlePageChange,
    handleLimitChange,
}) => {

    // Function to generate the page numbers dynamically based on the current page
    const generatePageNumbers = () => {
        const pages = [];
        // If the total number of pages is 5 or less, show all pages
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // If the current page is less than or equal to 3, show first few pages and last page
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            }
            // If the current page is near the end, show last few pages and first page
            else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
            // Otherwise, show the first page, surrounding pages, and the last page
            else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    // Handle click event for page navigation
    const handleClick = (page) => {
        // Only change page if the clicked page is not '...' and it's not the current page
        if (page !== '...' && page !== currentPage) {
            handlePageChange(page);
        }
    };

    // If there are no pages (i.e., totalPages is 0), return null to hide pagination
    if (totalPages === 0) return null; // no pagination if no pages

    return (
        <div className="table_footer">
            {/* Display the current range of items being shown */}
            <span className="showing-value">
                Showing {totalItems === 0 ? 0 : limit * (currentPage - 1) + 1}–
                {Math.min(limit * currentPage, totalItems)} out of {totalItems}
            </span>

            <div className="table_page_action">
                <div className="table-pagination">
                    <nav aria-label="Page navigation">
                        <ul className="pagination justify-content-end mb-0 gap-2">
                            {/* Previous page button */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    aria-disabled={currentPage === 1}
                                    aria-label="Previous page"
                                >
                                    Prev
                                </button>
                            </li>
                            {/* Dynamically generate page number buttons */}
                            {generatePageNumbers().map((page, idx) => (
                                <li
                                    key={idx}
                                    className={`page-item ${page === currentPage ? 'active' : ''
                                        } ${page === '...' ? 'disabled' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handleClick(page)}
                                        disabled={page === '...'}
                                        aria-current={page === currentPage ? 'page' : undefined}
                                        aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            {/* Next page button */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    aria-disabled={currentPage === totalPages}
                                    aria-label="Next page"
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                {/* Dropdown to select number of items per page (commented out) */}
                {/* <div className="select_per_loads">
                    <select
                        className="form-select"
                        value={limit}
                        onChange={(e) => handleLimitChange(Number(e.target.value))}
                        aria-label="Select items per page"
                    >
                        <option value={5}>5 per load</option>
                        <option value={10}>10 per load</option>
                        <option value={25}>25 per load</option>
                        <option value={50}>50 per load</option>
                    </select>
                </div> */}
            </div>
        </div>
    );
};

export default Pagination;
