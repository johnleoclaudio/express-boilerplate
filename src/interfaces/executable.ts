export default interface Executable<Params, Response> {
  execute(params: Params, opts?: any): Response;
}
