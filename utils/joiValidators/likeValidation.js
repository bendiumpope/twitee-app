import Joi from "joi";

// Validation Schema
const likeValidationSchema = Joi.object().keys({
  likeType: Joi.string().trim().required(),
});

export default likeValidationSchema;
