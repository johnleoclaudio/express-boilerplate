import Joi from 'joi';

export default Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  deviceId: Joi.string().required(),
  headers: Joi.any(),
  otp: Joi.string(),
});
