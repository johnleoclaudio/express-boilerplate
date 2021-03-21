import Joi from 'joi';

export default Joi.object().keys({
  email: Joi.string().required(),
  subject: Joi.string().required(),
  content: Joi.string().required(),
  type: Joi.string().required(),
});
