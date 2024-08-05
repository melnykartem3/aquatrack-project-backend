import joi from 'joi';

const waterSchema = joi.object({
  date: joi.string().required(),
  waterVolume: joi.string().required(),
});

export default waterSchema;
