const DateFormat = (dateString) => {
    if(!dateString) return ''
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    const seconds = diffInSeconds;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) {
        return `${seconds} giây trước`;
    } else if (minutes < 60) {
        return `${minutes} phút trước`;
    } else if (hours < 24) {
        return `${hours} giờ trước`;
    } else if (days < 7) {
        return `${days} ngày trước`;
    } else if (days < 30) {
        return `${weeks} tuần trước`;
    } else {
        const formattedDate = postDate.toISOString().split('T')[0];
        const formattedTime = postDate.toTimeString().split(' ')[0].slice(0, 5);
        return `${formattedDate} ${formattedTime}`;
    }
};
export default DateFormat