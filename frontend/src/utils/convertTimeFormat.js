const convertTimeFormat = (timeString) => {
  const hour = parseInt(timeString.slice(0, 2), 10);
  const minute = timeString.slice(2);
  const period = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 || 12; // If hour is 0, it should display as 12

  return `${hour12}:${minute} ${period}`;
};
export default convertTimeFormat;
