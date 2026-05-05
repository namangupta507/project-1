const formatDate = (datetimeStr) => {
    console.log(datetimeStr, "datetimeswd")
    const date = new Date(datetimeStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatTime12Hour = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${minute} ${suffix}`;
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',   // Jul
        day: '2-digit',   // 29
        hour: '2-digit',  // 01 PM
        minute: '2-digit',
        hour12: true,     // 12-hour format
        // Removed timeZoneName to avoid GMT part
    }).format(date);
};

export { formatDate, formatTime, formatTime12Hour, formatDateTime };