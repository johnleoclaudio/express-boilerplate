interface IPayload {
  recipients: Array<string>;
  content: any;
}

export default interface IParams {
  type: string;
  payload: Array<IPayload>;
  template: string;
  defaultTemplateData: string;
}
