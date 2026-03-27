export interface ResponseData<T> {
  code: number | string;
  message: string;
  data: T;
}