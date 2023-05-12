const dateFormater = (dateString) => {
  const date = new Date(dateString);
  // padStart fill the length with 0
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, need to add 1
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};
export default dateFormater;
