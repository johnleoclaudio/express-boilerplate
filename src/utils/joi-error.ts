import Joi, { ObjectSchema, ArraySchema } from 'joi';
import { paramsValidator } from './string-validator';

export default class Params<P> {
  constructor(private schema: ObjectSchema | ArraySchema, private params: P) {}

  getErrors() {
    paramsValidator(this.params);
    const res = Joi.validate(this.params, this.schema);
    return res.error
      ? res.error.details.map(detail => {
          return {
            message: detail.message,
            key: detail.context && detail.context.key,
          };
        })
      : [];
  }
}
