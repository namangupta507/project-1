import { differenceInSeconds } from 'date-fns';

function calculateDistanceInMiles(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3958.8; // Radius of Earth in miles

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance ? Number(distance.toFixed(2)) : 0; // ✅ returns number rounded to 2 decimals
}

function getTravelTime(from, to) {
    if (from instanceof Date && to instanceof Date) {
        const totalSeconds = differenceInSeconds(to, from);

        if (isNaN(totalSeconds)) return '';

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h ${minutes}m ${seconds}s`;
    }
    return '';
}

function getUserRole(role) {
    switch (role) {
        case 1:
            return 'Super Admin';
        case 2:
            return 'Owner';
        case 3:
            return 'Team Manager';
        case 4:
            return 'Manager Limited';
        case 5:
            return 'Member';
        default:
            return 'Owner';
    }
}

function categoryName(v) {
    switch (v) {
        case '67650053bd020f2a50f1c162':
            return 'Personal'
        case '6765006fbd020f2a50f1c169':
            return 'Business'
        case '6765007dbd020f2a50f1c16d':
            return 'Charity'
        case '67650085bd020f2a50f1c171':
            return 'Medical'
        default:
            return ''
    }
}

export { calculateDistanceInMiles, getTravelTime, getUserRole, categoryName };
