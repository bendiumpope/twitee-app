import Joi from "joi";

// Validation Schema
const userValidationSchema = Joi.object().keys({
  name: Joi.string().trim().required(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ minDomainSegments: 2 })
    .required(),
  password: Joi.string()
    .min(4)
    .max(40)
    .trim()
    .required()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

export default userValidationSchema;
