const validateInput = (inputData) => {
  const email = inputData["email"];
  const username = inputData["username"];
  const firstname = inputData["firstname"];
  const lastname = inputData["lastname"];
  const password = inputData["password"];
  const confirmPassword = inputData["confirmPassword"];

  let errors = [];
  if (firstname !== undefined) {
    if (!firstname.length) errors.push("Please enter your firstname");
    else if (firstname.length > 100)
      errors.push("Firstname cannot be more than 100 characters");
  }
  if (lastname !== undefined) {
    if (!lastname.length) errors.push("Please enter your lastname");
    else if (lastname.length > 100)
      errors.push("Lastname cannot be more than 100 characters");
  }
  if (username !== undefined) {
    if (!username.length) errors.push("Please enter a username");
    else if (username.length > 40)
      errors.push("Username cannot be more than 40 characters");
  }
  if (email !== undefined) {
    const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const isEmail = emailPattern.test(email);
    if (!email.length) errors.push("Please enter your email");
    else if (!isEmail) errors.push("Please enter a valid email");
    else if (email.length > 255)
      errors.push("Email cannot be more than 255 characters");
  }
  if (password !== undefined) {
    if (!password.length) errors.push("Please enter your password");
    else if (password.length < 6)
      errors.push("Password must be at least 6 characters");
  }
  if (confirmPassword !== undefined) {
    if (confirmPassword !== password) {
      errors.push("Password entered is not matching");
    }
  }

  return errors;
};
export default validateInput;
