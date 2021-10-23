import Joi from "joi";

// Validation Schema
const postValidationSchema = Joi.object().keys({
    content: Joi.string().trim().required()
});

export default postValidationSchema;
