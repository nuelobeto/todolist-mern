//Require necessary packages
const Validator = require("validator");

// import isEmpty function
const isEmpty = require("./isEmpty");

// validation function
const validateTodoInput = (data) => {
  let errors = {};

  // check content field
  if (isEmpty(data.content)) {
    errors.content = "Content field cannot be empty";
  } else if (!Validator.isLength(data.content, { min: 1, max: 300 })) {
    errors.content = "Content field must be between 1 and 300 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateTodoInput;
