import Joi from 'joi';

export default Joi.object().keys({
  key: Joi.string().required(),
});
