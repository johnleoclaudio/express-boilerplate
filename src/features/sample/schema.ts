import Joi from 'joi';

export default Joi.object().keys({
  sampleId: Joi.number().required(),
});
