import Joi from "joi";

// Validation Schema
const commentValidationSchema = Joi.object().keys({
  comment: Joi.string().trim().required(),
});

export default commentValidationSchema;
