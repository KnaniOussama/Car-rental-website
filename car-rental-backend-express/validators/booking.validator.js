const Joi = require('joi');

const createBookingSchema = Joi.object({
  car: Joi.string().hex().length(24).required(), // MongoDB ObjectId validation
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  totalPrice: Joi.number().min(0).required(),
  options: Joi.object({
    driver: Joi.boolean().required(),
    fuel: Joi.boolean().required(),
    infantSeat: Joi.boolean().required(),
  }).required(),
  insurance: Joi.string().valid('full', 'basic', 'none').required(),
  userDetails: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow('').optional(),
    dateOfBirth: Joi.string().allow('').optional(),
    country: Joi.string().allow('').optional(),
  }).required(),
});

module.exports = {
  createBookingSchema,
};
