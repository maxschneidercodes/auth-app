function getSignUpSessionErrorData(req) {
  let inputData = req.session.inputData;
  if (!inputData) {
    inputData = {
      hasError: false,
      message: "",
      email: "",
      comfirmEmail: "",
      userPassword: "",
    };
  }

  req.session.inputData = null;
  return inputData;
}

function getLoginSessionErrorData(req) {
  let inputData = req.session.inputData;
  if (!inputData) {
    inputData = {
      hasError: false,
      message: "",
      email: "",
      userPassword: "",
    };
  }

  req.session.inputData = null;
  return inputData;
}

function flashErrorsToSessions(req, data, action) {
  req.session.inputData = {
    hasError: true,
    ...data,
  };
  req.session.save(action);
}

module.exports = {
  getSignUpSessionErrorData: getSignUpSessionErrorData,
  getLoginSessionErrorData: getLoginSessionErrorData,
  flashErrorsToSessions: flashErrorsToSessions,
};
