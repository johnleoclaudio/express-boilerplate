import Joi from 'joi';

export default Joi.object().keys({
  filePath: Joi.string().required(),
  data: Joi.array().items(Joi.any()),
});
