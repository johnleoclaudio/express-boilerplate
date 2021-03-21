import Joi from 'joi';

export default Joi.object().keys({
  ownerId: Joi.number().required(),
  ownerType: Joi.string().required(),
  scope: Joi.string().required(),
});
