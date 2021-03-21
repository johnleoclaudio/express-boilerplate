type Options = { [key: string]: any };

export default interface DataSource<T> {
  create(params: Partial<T>, opts?: Options): Promise<T>;
  update(values: Partial<T>, opts?: any): Promise<T>;
  find(opts?: any): Promise<T[]>;
  findOne(opts?: any): Promise<T>;
}
