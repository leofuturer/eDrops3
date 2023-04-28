interface Resource<T> {
  base: string;
  id?(id: string | number): {
    get(): T;
    put(data: T): T;
  };
  get?(): T[];
  post?(data: T): T;
  put?(id: string | number, data: T): T;
  delete?(id: string | number): T;
  patch?(id: string | number, data: T): T;
}