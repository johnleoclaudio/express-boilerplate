import Joi from 'joi';

export default Joi.object().keys({
  folderName: Joi.string().required(),
  fileName: Joi.string(),
  nextPageToken: Joi.string(),
  pageSize: Joi.number(),
});
