import Joi from "joi";

export const createWaterSchema = Joi.object({
    date: Joi.string(),
    waterVolume: Joi.string(),

});

export const updateWaterSchema = Joi.object({
   date: Joi.string(),
    waterVolume: Joi.string(),
});

