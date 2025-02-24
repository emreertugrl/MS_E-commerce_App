const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
});

// abortEarly : ilk hatada durmasını sağlar, false yaparsak tüm hataları döner.
async function validateDto(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const messages = error.details.map((detail) => detail.message).join(",");
    throw new Error(messages);
  }
  return value;
}

module.exports = {
  validateDto,
  loginSchema,
  registerSchema,
};
