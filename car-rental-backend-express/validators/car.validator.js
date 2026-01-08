const Joi = require('joi');

const createCarSchema = Joi.object({
  brand: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number().required(),
  price: Joi.number().required(),
  specifications: Joi.array().items(Joi.string()),
  totalKilometers: Joi.number().required(),
  kilometersSinceLastMaintenance: Joi.number(),
  lastMaintenanceDate: Joi.date(),
  status: Joi.string().valid('AVAILABLE', 'RESERVED', 'MAINTENANCE'),
  image: Joi.string(),
  currentLocation: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }),
});

const updateCarSchema = Joi.object({
  brand: Joi.string(),
  model: Joi.string(),
  year: Joi.number(),
  price: Joi.number(),
  specifications: Joi.array().items(Joi.string()),
  totalKilometers: Joi.number(),
  kilometersSinceLastMaintenance: Joi.number(),
  lastMaintenanceDate: Joi.date(),
  status: Joi.string().valid('AVAILABLE', 'RESERVED', 'MAINTENANCE'),
  image: Joi.string(),
  currentLocation: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }),
});

const carStatusSchema = Joi.object({
  status: Joi.string().valid('AVAILABLE', 'RESERVED', 'MAINTENANCE').required(),
});

module.exports = {
  createCarSchema,
  updateCarSchema,
  carStatusSchema,
};
