import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Enhance SweetAlert2 for React support
const MySwal = withReactContent(Swal);

/**
 * Shows a success notification using SweetAlert2.
 * @param {string} message - The success message to display.
 * @returns {Promise<void>} A promise that resolves after the notification is hidden.
 */
export const showSuccessToast = (message) => {
    return MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2000, // Auto-close after 2 seconds
        timerProgressBar: true,
    });
};

/**
 * Shows an error notification using SweetAlert2.
 * @param {string} message - The error message to display.
 * @returns {Promise<void>} A promise that resolves after the notification is hidden.
 */
export const showErrorToast = (message) => {
    return MySwal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 2000, // Auto-close after 2 seconds
        timerProgressBar: true,
    });
};
