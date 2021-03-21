import Joi from 'joi';

export default Joi.object().keys({
  userType: Joi.string().required(), // bond user
  dataType: Joi.string().required(), // kyc
  category: Joi.string().required(), // proofOfIncome, proofOfResidence
  data: Joi.any().required(), // base64
  fileName: Joi.string().required(), // file, tin/file, passport/file, bill/file
  overwrite: Joi.boolean().required(),
  secureId: Joi.string().required(),
});
