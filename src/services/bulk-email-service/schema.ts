import Joi from 'joi';

export default Joi.object().keys({
  type: Joi.string()
    .required()
    .valid(['bonds', 'pdax']),
  payload: Joi.array()
    .items(
      Joi.object().keys({
        recipients: Joi.array().items(Joi.string()),
        content: Joi.object(),
      }),
    )
    .required(),
  template: Joi.string().required(),
  defaultTemplateData: Joi.string().required(),
});
