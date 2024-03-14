export const ddMMyyyy = (date) => {
    if (!date) return null
    const [dateString, timeString] = date.split(' ')
    const [day, month, year] = dateString.split('/')
    const [hour, minute, second] = timeString.split(':')
    const newDate = new Date(+year, +month - 1, +day, +hour, +minute, +second)
    console.log(newDate);
    return newDate
}