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
 export function convertDateFormat(dateString) {
    // Chuyển đổi chuỗi ngày tháng thành đối tượng Date
    var date = new Date(dateString);
    // Lấy các thành phần của ngày tháng
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = monthNames[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Format lại ngày tháng theo yêu cầu "Mon DD, YYYY, HH:MM"
    var formattedDate = month + " " + (day < 10 ? '0' : '') + day + ", " + year + ", " + (hours < 10 ? '0' : '') + hours + ":" + (minutes < 10 ? '0' : '') + minutes;
    console.log(formattedDate)
    return formattedDate;
}