import Joi from 'joi';

export default Joi.object().keys({
  ownerId: Joi.number().required(),
  secureId: Joi.string().required(),
  email: Joi.string().required(),
});
