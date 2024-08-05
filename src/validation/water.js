import Joi from 'joi';

export const createWaterSchema = Joi.object({
  date: Joi.string(),
  waterVolume: Joi.number(),
});

export const updateWaterSchema = Joi.object({
  date: Joi.string(),
  waterVolume: Joi.number(),
});
