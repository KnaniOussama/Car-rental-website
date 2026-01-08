const Joi = require('joi');

const createReportSchema = Joi.object({
  description: Joi.string().required(),
  severity: Joi.string().valid('LOW', 'MEDIUM', 'HIGH'),
});

module.exports = {
  createReportSchema,
};
