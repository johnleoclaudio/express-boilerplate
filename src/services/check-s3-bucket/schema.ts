import Joi from 'joi';

export default Joi.object().keys({
  userType: Joi.string().required(), // bond user
  dataType: Joi.string().required(), // kyc
  category: Joi.string().required(), // proofOfIncome, proofOfResidence
  fileName: Joi.string().required(), // file, tin/file, passport/file, bill/file
  secureId: Joi.string().required(),
});
