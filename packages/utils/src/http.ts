import axios, { type Axios } from 'axios';
import type { z, ZodSchema } from 'zod';
import { asyncFaillable } from './helpers';

type HttpClientConfig = {
  baseURL: string;
};

type RequestConfig<T extends ZodSchema> = {
  url: string;
  schema: T;
};

export class HttpClient {
  #http: Axios;

  constructor(config: HttpClientConfig) {
    this.#http = axios.create({ baseURL: config.baseURL });
  }

  async request<T extends ZodSchema>(config: RequestConfig<T>): Promise<z.infer<T>> {
    const call = await asyncFaillable(this.#http.get(config.url));
    if (call.failed) {
      throw new Error(`Request to ${config.url} failed`);
    }
    const data = config.schema.parse(call.result.data);
    return data;
  }
}
