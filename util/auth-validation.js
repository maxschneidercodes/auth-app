function isValidInput(
  enteredUserEmail,
  enteredUserComfirmEmail,
  enteredUserPassword
) {
  if (
    !enteredUserEmail ||
    !enteredUserComfirmEmail ||
    !enteredUserPassword ||
    enteredUserPassword.trim() < 2 ||
    enteredUserEmail !== enteredUserComfirmEmail ||
    !enteredUserEmail.includes("@")
  ) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  isValidInput: isValidInput,
};
