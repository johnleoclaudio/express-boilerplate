import Joi from 'joi';

export default Joi.object().keys({
  adminId: Joi.number().required(),
  userId: Joi.string().required(),
  action: Joi.string()
    .required()
    .valid('approve', 'reject'),
  riskRating: Joi.string().allow(''),
  remarks: Joi.string().allow(''),
  role: Joi.string()
    .required()
    .valid('cs_maker', 'cs_checker'),
});
