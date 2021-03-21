import Joi from 'joi';

export default Joi.object().keys({
  message: Joi.string().required(),
  to: Joi.string().required(),
});
