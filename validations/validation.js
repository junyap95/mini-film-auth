const joi = require("joi");

const registerValidation = (data) => {
  const schemaValidation = joi.object({
    // control the validation using joi, so no need to reinvent the wheel
    username: joi.string().required().min(3).max(256),
    email: joi.string().required().min(6).max(256).email(),
    password: joi.string().required().min(6).max(1024),
  });

  return schemaValidation.validate(data);
};

const loginValidation = (data) => {
  const schemaValidation = joi.object({
    // control the validation using joi, so no need to reinvent the wheel
    email: joi.string().required().min(6).max(256).email(),
    password: joi.string().required().min(6).max(1024),
  });

  return schemaValidation.validate(data);
};

// can export specific functions because in this file for any user input i will need to validate
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
