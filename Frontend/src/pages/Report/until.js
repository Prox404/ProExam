export function parseTimeString(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const hours = dateObj.getHours(); // Lấy giờ (0 - 23)
    const minutes = dateObj.getMinutes(); // Lấy phút (0 - 59)

    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");

    return `${hoursStr}:${minutesStr}`;
}
export function parseDateString(dateTimeString) {
    const dateObj = new Date(dateTimeString);
    const dayOfMonth = dateObj.getDate(); // Lấy ngày trong tháng (1 - 31)
    const month = dateObj.getMonth(); // Lấy tháng (0 - 11)
    const year = dateObj.getFullYear(); // Lấy năm (4 chữ số)

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const formattedDate = `${monthNames[month]} ${dayOfMonth}, ${year}`;

    return formattedDate;
}